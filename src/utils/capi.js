// Meta Conversions API Utility Functions
// Simple test implementation for form step 1

/**
 * Send events to Meta Conversions API via serverless function
 * @param {Array} events - Array of event objects
 * @param {string} pixelId - Facebook Pixel ID
 * @returns {Promise<Object>} Response from serverless function
 */
export async function sendCAPIEvents(events, pixelId = '480750607959393') {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.warn('CAPI events are skipped on localhost.');
    return { success: true, message: 'CAPI skipped on localhost' };
  }

  try {
    const response = await fetch('/api/capi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ events, pixelId })
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('CAPI Serverless Request Error:', responseData);
      return { success: false, error: responseData };
    }

    console.log('CAPI Success:', responseData);
    return { success: true, data: responseData };

  } catch (error) {
    console.error('CAPI Request Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Hashes a string using SHA-256.
 * @param {string} data - The string to hash.
 * @returns {Promise<string>} The SHA-256 hash in hexadecimal format.
 */
export async function hashPII(data) {
  if (!data) return null;
  const textEncoder = new TextEncoder();
  const dataBuffer = textEncoder.encode(data.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hexHash;
}

/**
 * Creates a simple test event for form step 1
 * @param {string} eventName - The name of the event
 * @param {Object} formData - Form data from first 3 questions
 * @returns {Object} The formatted CAPI event
 */
export function createTestEvent(eventName, formData = {}) {
  const event = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: window.location.href,
    user_data: {
      client_ip_address: formData.ip || undefined,
      client_user_agent: navigator.userAgent,
      fbc: getCookie('_fbc') || undefined,
      fbp: getCookie('_fbp') || undefined,
    },
    custom_data: {
      form_step: 1,
      form_type: 'book_a_call',
      test_event: true
    }
  };
  return event;
}

/**
 * Test function to send a simple form step 1 event
 * @param {Object} formData - Form data from first 3 questions
 */
export async function testFormStep1Event(formData = {}) {
  const event = createTestEvent('FormStep1Started', formData);
  
  console.log('Sending test CAPI event:', event);
  
  const result = await sendCAPIEvents([event]);
  
  if (result.success) {
    console.log('✅ Test CAPI event sent successfully!');
  } else {
    console.error('❌ Test CAPI event failed:', result.error);
  }
  
  return result;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}