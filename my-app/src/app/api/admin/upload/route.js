/**
 * API Route: POST /api/admin/upload
 * Backend-controlled image upload to Cloudinary
 * Handles multipart form data with image files
 * Returns Cloudinary URLs (NOT base64)
 */

import { NextResponse } from 'next/server';
import formidable from 'formidable';
import { Readable } from 'stream';
import { promises as fs } from 'fs';
import { getUserFromRequest } from '@/lib/authMiddleware';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { db } from '@/lib/firebaseAdmin';

/**
 * Convert Web API Request to Node.js IncomingMessage for formidable
 */
async function convertRequestToNodeRequest(request) {
  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const readable = new Readable();
  readable._read = () => {};

  const reader = request.body.getReader();
  
  async function push() {
    const { done, value } = await reader.read();
    if (done) {
      readable.push(null);
      return;
    }
    readable.push(Buffer.from(value));
    await push();
  }
  
  push().catch(err => readable.destroy(err));

  readable.headers = headers;
  readable.method = request.method;
  readable.url = request.url;

  return readable;
}

/**
 * Parse multipart form data using formidable
 */
async function parseForm(request) {
  const nodeRequest = await convertRequestToNodeRequest(request);
  
  const form = formidable({
    maxFiles: 10,
    maxFileSize: 10 * 1024 * 1024, // 10MB per file
    keepExtensions: true,
    filter: function ({ mimetype }) {
      // Only allow images
      return mimetype && mimetype.startsWith('image/');
    },
  });

  return new Promise((resolve, reject) => {
    form.parse(nodeRequest, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

/**
 * POST handler - Upload images to Cloudinary
 */
export async function POST(req) {
  try {
    // 1. Authenticate user
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Verify admin role
    const userDoc = await db.collection('users').doc(user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 3. Parse multipart form data
    const { fields, files } = await parseForm(req);

    // 4. Extract image files
    const imageFiles = files.images || files.image || [];
    const fileArray = Array.isArray(imageFiles) ? imageFiles : [imageFiles];

    if (fileArray.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    // 5. Upload each image to Cloudinary
    const uploadedImages = [];
    
    for (const file of fileArray) {
      try {
        // Read file buffer
        const fileBuffer = await fs.readFile(file.filepath);

        // Upload to Cloudinary (folder: "blogs")
        const result = await uploadToCloudinary(
          fileBuffer,
          'blogs',
          null // Let Cloudinary generate unique filename
        );

        uploadedImages.push({
          url: result.url,
          publicId: result.publicId,
          originalName: file.originalFilename,
        });

        // Delete temp file from local disk
        await fs.unlink(file.filepath).catch(() => {});
      } catch (uploadError) {
        console.error('Failed to upload image:', uploadError);
        // Continue with other images
      }
    }

    if (uploadedImages.length === 0) {
      return NextResponse.json(
        { error: 'All image uploads failed' },
        { status: 500 }
      );
    }

    // 6. Return Cloudinary URLs
    return NextResponse.json({
      success: true,
      images: uploadedImages,
      message: `Successfully uploaded ${uploadedImages.length} image(s)`,
    });
  } catch (error) {
    console.error('Upload API error:', error);
    console.error('Error stack:', error.stack);
    console.error('Cloudinary config check:', {
      hasCloudName: !!process.env.CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
    });
    return NextResponse.json(
      { error: 'Failed to upload images', details: error.message },
      { status: 500 }
    );
  }
}
