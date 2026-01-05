import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebaseAdmin';
import { addEventToGoogleCalendar } from '@/lib/googleCalendarService';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, eventId, eventData, bookingId } = body;

    if (!userId || !eventId || !eventData) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user document to check if Google Calendar is connected
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

    // If Google Calendar is not connected, return success but don't sync
    if (!googleCalendarData?.accessToken) {
      console.log('📅 Google Calendar not connected for user:', userId);
      return NextResponse.json({
        success: true,
        synced: false,
        message: 'Google Calendar not connected',
      });
    }

    // Check if token is expired
    const expiresAt = googleCalendarData.expiresAt?.toDate?.() || new Date(googleCalendarData.expiresAt);
    
    if (new Date() > expiresAt && googleCalendarData.refreshToken) {
      // Token expired, would need to refresh - for now skip
      console.log('⚠️  Google Calendar token expired for user:', userId);
      return NextResponse.json({
        success: true,
        synced: false,
        message: 'Google Calendar token expired',
      });
    }

    // Prepare event details for Google Calendar
    const calendarEventDetails = {
      title: eventData.title,
      description: `Event ID: ${eventId}\n${eventData.description || ''}`,
      location: eventData.location || 'Online',
      startTime: eventData.startTime || eventData.dateTime,
      endTime: eventData.endTime || new Date(new Date(eventData.dateTime).getTime() + 60 * 60 * 1000), // 1 hour duration default
      userEmail: userData.email,
      organizerEmail: eventData.organizerEmail,
      eventId: eventId,
    };

    // Add event to Google Calendar
    const calendarResult = await addEventToGoogleCalendar(
      googleCalendarData.accessToken,
      calendarEventDetails
    );

    if (!calendarResult.success) {
      console.error('❌ Failed to sync to Google Calendar:', calendarResult.error);
      return NextResponse.json({
        success: true, // Don't fail the booking, just log the calendar sync failure
        synced: false,
        error: calendarResult.error,
      });
    }

    // Update booking document with calendar event ID and meet link
    if (bookingId) {
      const bookingRef = admin
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('userEvents')
        .doc(bookingId);

      await bookingRef.update({
        googleCalendarEventId: calendarResult.calendarEventId,
        googleCalendarLink: calendarResult.calendarLink,
        googleMeetLink: calendarResult.meetLink,
        syncedToCalendar: true,
        syncedAt: new Date(),
      });

      console.log('✅ Booking synced to Google Calendar:', bookingId);
    }

    return NextResponse.json({
      success: true,
      synced: true,
      calendarEventId: calendarResult.calendarEventId,
      calendarLink: calendarResult.calendarLink,
      meetLink: calendarResult.meetLink,
    });
  } catch (error) {
    console.error('❌ Error in calendar sync endpoint:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
