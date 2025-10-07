// Vercel Serverless Function for Meta Conversions API
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { events, pixelId } = req.body;

    // Validate required data
    if (!events || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'Events array is required' });
    }

    if (!pixelId) {
      return res.status(400).json({ error: 'Pixel ID is required' });
    }

    // Get environment variables
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({ error: 'Facebook Access Token not configured' });
    }

    const facebookGraphApiUrl = `https://graph.facebook.com/v19.0/${pixelId}/events`;

    const payload = {
      data: events,
      test_event_code: process.env.FACEBOOK_TEST_EVENT_CODE || undefined // Optional test code
    };

    const response = await fetch(facebookGraphApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Facebook API Error:', responseData);
      return res.status(response.status).json({ error: responseData });
    }

    return res.status(200).json({ 
      success: true, 
      events_received: responseData.events_received, 
      fbtrace_id: responseData.fbtrace_id 
    });

  } catch (error) {
    console.error('CAPI Serverless Function Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
