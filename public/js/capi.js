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
 * Creates a comprehensive CAPI event for form tracking
 * @param {string} eventName - The name of the event
 * @param {Object} formData - Form data and user information
 * @param {Object} stepData - Step-specific data
 * @returns {Object} The formatted CAPI event
 */
export function createFormEvent(eventName, formData = {}, stepData = {}) {
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
      // Add hashed PII if available
      em: formData.hashedEmail || undefined,
      ph: formData.hashedPhone || undefined,
    },
    custom_data: {
      form_type: 'book_a_call',
      form_step: stepData.step || 1,
      step_name: stepData.stepName || 'step_1',
      time_spent: stepData.timeSpent || 0,
      form_progress: stepData.progress || 0,
      ...stepData.customData
    }
  };
  return event;
}

/**
 * Track form step started
 * @param {number} step - Step number (1, 2, 3)
 * @param {Object} formData - Form data and user information
 * @param {Object} stepData - Step-specific data
 */
export async function trackFormStepStarted(step, formData = {}, stepData = {}) {
  const stepNames = {
    1: 'step_1',
    2: 'step_2', 
    3: 'step_3'
  };
  
  const event = createFormEvent('FormStepStarted', formData, {
    step,
    stepName: stepNames[step],
    progress: (step / 3) * 100,
    ...stepData
  });
  
  console.log(`📝 Form Step ${step} Started:`, event);
  
  const result = await sendCAPIEvents([event]);
  
  if (result.success) {
    console.log(`✅ Form Step ${step} Started event sent successfully!`);
  } else {
    console.error(`❌ Form Step ${step} Started event failed:`, result.error);
  }
  
  return result;
}

/**
 * Track form step completed
 * @param {number} step - Step number (1, 2, 3)
 * @param {Object} formData - Form data and user information
 * @param {Object} stepData - Step-specific data
 */
export async function trackFormStepCompleted(step, formData = {}, stepData = {}) {
  const stepNames = {
    1: 'step_1',
    2: 'step_2',
    3: 'step_3'
  };
  
  const event = createFormEvent('FormStepCompleted', formData, {
    step,
    stepName: stepNames[step],
    progress: (step / 3) * 100,
    ...stepData
  });
  
  console.log(`✅ Form Step ${step} Completed:`, event);
  
  const result = await sendCAPIEvents([event]);
  
  if (result.success) {
    console.log(`✅ Form Step ${step} Completed event sent successfully!`);
  } else {
    console.error(`❌ Form Step ${step} Completed event failed:`, result.error);
  }
  
  return result;
}

/**
 * Track form abandonment
 * @param {number} lastStep - Last step user was on
 * @param {Object} formData - Form data and user information
 * @param {Object} abandonmentData - Abandonment-specific data
 */
export async function trackFormAbandoned(lastStep, formData = {}, abandonmentData = {}) {
  const event = createFormEvent('FormAbandoned', formData, {
    step: lastStep,
    stepName: `step_${lastStep}`,
    progress: (lastStep / 3) * 100,
    abandonment_reason: abandonmentData.reason || 'user_left',
    time_on_form: abandonmentData.timeOnForm || 0,
    ...abandonmentData
  });
  
  console.log(`❌ Form Abandoned at Step ${lastStep}:`, event);
  
  const result = await sendCAPIEvents([event]);
  
  if (result.success) {
    console.log(`✅ Form Abandoned event sent successfully!`);
  } else {
    console.error(`❌ Form Abandoned event failed:`, result.error);
  }
  
  return result;
}

/**
 * Track form submission
 * @param {Object} formData - Complete form data
 * @param {Object} submissionData - Submission-specific data
 */
export async function trackFormSubmitted(formData = {}, submissionData = {}) {
  const event = createFormEvent('FormSubmitted', formData, {
    step: 3,
    stepName: 'step_3',
    progress: 100,
    submission_successful: true,
    ...submissionData
  });
  
  console.log(`🎉 Form Submitted:`, event);
  
  const result = await sendCAPIEvents([event]);
  
  if (result.success) {
    console.log(`✅ Form Submitted event sent successfully!`);
  } else {
    console.error(`❌ Form Submitted event failed:`, result.error);
  }
  
  return result;
}

/**
 * Track form start (first step)
 * @param {Object} formData - Form data and user information
 * @param {Object} stepData - Step-specific data
 */
export async function trackFormStart(formData = {}, stepData = {}) {
  const event = createFormEvent('FormStart', formData, {
    step: 1,
    stepName: 'step_1',
    progress: 33,
    form_entry_point: 'landing_page',
    ...stepData
  });
  
  console.log('🚀 Form Start:', event);
  
  const result = await sendCAPIEvents([event]);
  
  if (result.success) {
    console.log('✅ Form Start event sent successfully!');
  } else {
    console.error('❌ Form Start event failed:', result.error);
  }
  
  return result;
}

/**
 * Track form completion (last step)
 * @param {Object} formData - Complete form data
 * @param {Object} completionData - Completion-specific data
 */
export async function trackFormComplete(formData = {}, completionData = {}) {
  const event = createFormEvent('FormComplete', formData, {
    step: 3,
    stepName: 'step_3',
    progress: 100,
    form_completion_time: completionData.completionTime || 0,
    form_success: true,
    ...completionData
  });
  
  console.log('🎉 Form Complete:', event);
  
  const result = await sendCAPIEvents([event]);
  
  if (result.success) {
    console.log('✅ Form Complete event sent successfully!');
  } else {
    console.error('❌ Form Complete event failed:', result.error);
  }
  
  return result;
}

/**
 * Test function to send a simple form step 1 event
 * @param {Object} formData - Form data from first 3 questions
 */
export async function testFormStep1Event(formData = {}) {
  return await trackFormStart(formData);
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}