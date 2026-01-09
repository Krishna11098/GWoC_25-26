import { NextResponse } from 'next/server';
import { getAuthorizationUrl } from '@/lib/googleCalendarService';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Missing userId' },
        { status: 400 }
      );
    }

    // Generate the Google OAuth2 authorization URL

    const authUrl = getAuthorizationUrl(userId);

    return NextResponse.json({
      success: true,
      authUrl,
    });
  } catch (error) {
    console.error('❌ Error generating auth URL:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
