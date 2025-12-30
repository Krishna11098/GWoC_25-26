/**
 * Cloudinary Configuration
 * Backend-only module - handles secure image uploads to Cloudinary
 * DO NOT import this in frontend code
 */

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Use HTTPS for all URLs
});

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} fileBuffer - Image file buffer
 * @param {string} folder - Cloudinary folder path (e.g., "blogs")
 * @param {string} fileName - Optional custom filename
 * @returns {Promise<{url: string, publicId: string}>} - Cloudinary secure URL and public ID
 */
export async function uploadToCloudinary(fileBuffer, folder = 'blogs', fileName = null) {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: folder,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }, // Automatic optimization
        { max_width: 2000, max_height: 2000, crop: 'limit' }, // Limit max dimensions
      ],
    };

    if (fileName) {
      uploadOptions.public_id = fileName;
    }

    // Upload using upload_stream (works with buffers)
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    // Write buffer to stream
    uploadStream.end(fileBuffer);
  });
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<object>} - Deletion result
 */
export async function deleteFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
}

export default cloudinary;
