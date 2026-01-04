'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Calendar, CheckCircle2, LogOut } from 'lucide-react';

export default function GoogleCalendarConnect({ userId }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [connectedEmail, setConnectedEmail] = useState('');

  useEffect(() => {
    // Check connection status on mount
    checkConnectionStatus();

    // Check for connection status in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('calendar_connected') === 'true') {
      setSuccess('✅ Google Calendar connected successfully!');
      setIsConnected(true);
      setTimeout(() => setSuccess(''), 5000);
    }
    if (params.get('calendar_error')) {
      setError(`❌ ${params.get('calendar_error')}`);
      setTimeout(() => setError(''), 5000);
    }
  }, []);

  async function checkConnectionStatus() {
    try {
      const response = await fetch(`/api/user/${userId}/calendar-status`);
      if (response.ok) {
        const data = await response.json();
        setIsConnected(data.connected);
        setConnectedEmail(data.email || '');
      }
    } catch (error) {
      console.error('Error checking calendar status:', error);
    }
  }

  async function handleConnect() {
    setIsLoading(true);
    setError('');

    try {
      // Get authorization URL from backend
      const response = await fetch('/api/auth/google/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.authUrl) {
        // Redirect to Google OAuth
        window.location.href = data.authUrl;
      } else {
        setError('Failed to get authorization URL');
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDisconnect() {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/user/${userId}/disconnect-calendar`, {
        method: 'POST',
      });

      if (response.ok) {
        setIsConnected(false);
        setConnectedEmail('');
        setSuccess('✅ Google Calendar disconnected');
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError('Failed to disconnect calendar');
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full border border-foreground/20 rounded-lg p-6 bg-background">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5" />
        <div>
          <h3 className="font-bold text-font">Google Calendar Integration</h3>
          <p className="text-sm text-font-2">
            Automatically sync booked events to your calendar
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        {isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Connected</p>
                <p className="text-sm text-green-700">{connectedEmail}</p>
              </div>
            </div>

            <p className="text-sm text-font-2">
              📅 When you book an event, it will be automatically added to your Google Calendar with:
              <ul className="list-disc list-inside mt-2 space-y-1 text-font-2">
                <li>Google Meet link for online events</li>
                <li>Email reminders (1 day and 30 minutes before)</li>
                <li>All event details synced</li>
              </ul>
            </p>

            <button
              onClick={handleDisconnect}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-foreground/20 rounded-lg hover:bg-foreground/5 disabled:opacity-50 text-font font-medium transition"
            >
              <LogOut className="w-4 h-4" />
              {isLoading ? 'Disconnecting...' : 'Disconnect Google Calendar'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-font-2">
              Connect your Google Calendar to automatically add booked events with video call links and reminders.
            </p>

            <button
              onClick={handleConnect}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
            >
              {isLoading ? 'Connecting...' : 'Connect Google Calendar'}
            </button>

            <p className="text-xs text-font-2">
              We only request permission to add/manage calendar events. Your calendar data remains private.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
