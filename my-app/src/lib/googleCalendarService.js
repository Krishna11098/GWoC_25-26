import { google } from 'googleapis';

/**
 * Initialize Google OAuth2 client
 */
function getAuthClient() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const redirectUrl = process.env.GOOGLE_OAUTH_REDIRECT_URL;

  if (!clientId || !clientSecret || !redirectUrl) {
    console.error('Missing OAuth credentials:', { clientId: !!clientId, clientSecret: !!clientSecret, redirectUrl: !!redirectUrl });
    throw new Error('Missing Google OAuth credentials in environment variables');
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
}

/**
 * Get authorization URL for user to connect Google Calendar
 */
export function getAuthorizationUrl(userId) {
  const oauth2Client = getAuthClient();
  
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ],
    state: userId, // Pass userId as state for callback
  });

  return authUrl;
}

/**
 * Exchange authorization code for tokens
 */
export async function getTokensFromCode(code) {
  try {
    const oauth2Client = getAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    
    console.log('✅ Got tokens from authorization code');
    return tokens;
  } catch (error) {
    console.error('❌ Error getting tokens:', error);
    throw error;
  }
}

/**
 * Add event to user's Google Calendar
 */
export async function addEventToGoogleCalendar(accessToken, eventDetails) {
  try {
    const oauth2Client = getAuthClient();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: eventDetails.title,
      description: eventDetails.description || '',
      location: eventDetails.location || '',
      start: {
        dateTime: new Date(eventDetails.startTime).toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: new Date(eventDetails.endTime).toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      attendees: [
        { email: eventDetails.userEmail },
        ...(eventDetails.organizerEmail ? [{ email: eventDetails.organizerEmail }] : []),
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 },       // 30 mins before
        ],
      },
      conferenceData: {
        createRequest: {
          requestId: `${eventDetails.eventId}-${Date.now()}`,
          conferenceSolutionKey: {
            key: 'hangoutsMeet',
          },
        },
      },
    };

    const result = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
      sendNotifications: true,
    });

    console.log('✅ Event added to Google Calendar:', result.data.id);

    return {
      success: true,
      calendarEventId: result.data.id,
      calendarLink: result.data.htmlLink,
      meetLink: result.data.conferenceData?.entryPoints?.[0]?.uri || null,
    };
  } catch (error) {
    console.error('❌ Error adding event to Google Calendar:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Check user availability on Google Calendar
 */
export async function checkUserAvailability(accessToken, startTime, endTime) {
  try {
    const oauth2Client = getAuthClient();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const result = await calendar.freebusy.query({
      resource: {
        timeMin: new Date(startTime).toISOString(),
        timeMax: new Date(endTime).toISOString(),
        items: [{ id: 'primary' }],
      },
    });

    const busy = result.data.calendars.primary.busy || [];
    const isAvailable = busy.length === 0;

    return {
      available: isAvailable,
      busySlots: busy,
    };
  } catch (error) {
    console.error('❌ Error checking availability:', error);
    return { available: true }; // Fail open
  }
}

/**
 * Get user's upcoming calendar events
 */
export async function getUserCalendarEvents(accessToken, maxResults = 10) {
  try {
    const oauth2Client = getAuthClient();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const result = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return {
      success: true,
      events: result.data.items || [],
    };
  } catch (error) {
    console.error('❌ Error getting calendar events:', error);
    return { success: false, events: [] };
  }
}

/**
 * Remove event from Google Calendar
 */
export async function removeEventFromGoogleCalendar(accessToken, calendarEventId) {
  try {
    const oauth2Client = getAuthClient();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: calendarEventId,
    });

    console.log('✅ Event removed from Google Calendar');
    return { success: true };
  } catch (error) {
    console.error('❌ Error removing event from Google Calendar:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update event on Google Calendar
 */
export async function updateEventOnGoogleCalendar(accessToken, calendarEventId, updates) {
  try {
    const oauth2Client = getAuthClient();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const result = await calendar.events.update({
      calendarId: 'primary',
      eventId: calendarEventId,
      resource: updates,
    });

    console.log('✅ Event updated on Google Calendar');
    return { success: true, data: result.data };
  } catch (error) {
    console.error('❌ Error updating event on Google Calendar:', error);
    return { success: false, error: error.message };
  }
}
