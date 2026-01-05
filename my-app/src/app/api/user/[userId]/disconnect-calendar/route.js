import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebaseAdmin';

export async function POST(request, { params }) {
  try {
    const { userId } = await params;

    const userRef = admin.firestore().collection('users').doc(userId);

    // Delete Google Calendar data
    await userRef.update({
      googleCalendar: admin.firestore.FieldValue.delete(),
    });

    console.log('✅ Google Calendar disconnected for user:', userId);

    return NextResponse.json({
      success: true,
      message: 'Google Calendar disconnected',
    });
  } catch (error) {
    console.error('❌ Error disconnecting calendar:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
