import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebaseAdmin';
import { getTokensFromCode } from '@/lib/googleCalendarService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // userId
  const error = searchParams.get('error');

  if (error) {
    console.error('❌ OAuth error:', error);
    return NextResponse.redirect(
      new URL(
        `/profile?calendar_error=${encodeURIComponent(error)}`,
        request.url
      )
    );
  }

  if (!code || !state) {
    console.error('❌ Missing code or state parameter');
    return NextResponse.redirect(
      new URL('/profile?calendar_error=Invalid_Request', request.url)
    );
  }

  try {
    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);

    if (!tokens.access_token) {
      throw new Error('No access token received');
    }

    // Save tokens to user document in Firestore
    const userRef = admin.firestore().collection('users').doc(state);
    
    // Calculate refresh token expiry (if provided)
    const expiresAt = tokens.expiry_date 
      ? new Date(tokens.expiry_date)
      : new Date(Date.now() + 3600 * 1000); // 1 hour default

    await userRef.update({
      googleCalendar: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || null,
        expiresAt: expiresAt,
        connectedAt: new Date(),
      },
    });

    console.log('✅ Google Calendar connected for user:', state);

    // Redirect back to profile with success message
    return NextResponse.redirect(
      new URL('/profile?calendar_connected=true', request.url)
    );
  } catch (error) {
    console.error('❌ Error in Google OAuth callback:', error);
    return NextResponse.redirect(
      new URL(
        `/profile?calendar_error=${encodeURIComponent(error.message)}`,
        request.url
      )
    );
  }
}
