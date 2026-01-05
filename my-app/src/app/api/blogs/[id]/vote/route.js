import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { getUserFromRequest } from '@/lib/authMiddleware';

/**
 * POST /api/blogs/[id]/vote
 * Handle upvote/downvote for a blog post
 */
export async function POST(req, { params }) {
  try {
    // Get authenticated user
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();
    const { voteType } = body; // 'upvote' or 'downvote'

    if (!['upvote', 'downvote'].includes(voteType)) {
      return NextResponse.json({ error: 'Invalid vote type' }, { status: 400 });
    }

    // Get blog document
    const blogRef = db.collection('blogs').doc(id);
    const blogDoc = await blogRef.get();

    if (!blogDoc.exists) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Get user's existing vote
    const voteRef = db.collection('blogs').doc(id).collection('votes').doc(user.uid);
    const voteDoc = await voteRef.get();
    const existingVote = voteDoc.exists ? voteDoc.data().voteType : null;

    const blogData = blogDoc.data();
    let upvotes = blogData.upvotes || 0;
    let downvotes = blogData.downvotes || 0;

    // Handle vote logic
    if (existingVote === voteType) {
      // User clicked the same vote - remove it
      if (voteType === 'upvote') {
        upvotes = Math.max(0, upvotes - 1);
      } else {
        downvotes = Math.max(0, downvotes - 1);
      }
      await voteRef.delete();
    } else {
      // User is changing vote or voting for the first time
      if (existingVote) {
        // Remove old vote
        if (existingVote === 'upvote') {
          upvotes = Math.max(0, upvotes - 1);
        } else {
          downvotes = Math.max(0, downvotes - 1);
        }
      }
      
      // Add new vote
      if (voteType === 'upvote') {
        upvotes++;
      } else {
        downvotes++;
      }
      
      await voteRef.set({
        voteType,
        votedAt: new Date(),
      });
    }

    // Update blog document
    await blogRef.update({
      upvotes,
      downvotes,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      upvotes,
      downvotes,
      userVote: existingVote === voteType ? null : voteType,
    });
  } catch (error) {
    console.error('Error handling vote:', error);
    return NextResponse.json(
      { error: 'Failed to process vote', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/blogs/[id]/vote
 * Get user's vote status for this blog
 */
export async function GET(req, { params }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ userVote: null });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const voteRef = db.collection('blogs').doc(id).collection('votes').doc(user.uid);
    const voteDoc = await voteRef.get();

    return NextResponse.json({
      userVote: voteDoc.exists ? voteDoc.data().voteType : null,
    });
  } catch (error) {
    console.error('Error fetching vote:', error);
    return NextResponse.json({ userVote: null });
  }
}
