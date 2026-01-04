import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebaseAdmin';

export async function GET(request, { params }) {
  try {
    const { userId } = await params;

    const userRef = admin.firestore().collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    const googleCalendarData = userData.googleCalendar;

    return NextResponse.json({
      connected: !!googleCalendarData?.accessToken,
      email: googleCalendarData?.email || '',
    });
  } catch (error) {
    console.error('❌ Error checking calendar status:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
