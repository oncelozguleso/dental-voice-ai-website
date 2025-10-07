# Vercel Environment Variables Setup for Meta Conversions API

## Required Environment Variables

Add these to your Vercel project:

### 1. FACEBOOK_ACCESS_TOKEN
```
EAAJ6VJ2Iv8MBPkA0QDrsPIz7B59JYD1QnqC8hTlyOQlm0TlQA8dReZA2XF3sZCbR3mNjxsTC59eLyWw5RIX3JaZArmKpzJJetjWhx7ZBXJK4PVZAjRzz0XFJtn3KneUmIZBWwhukh8YZBw31zMTERvj5Gkm8tMir6ftYXy7vYZBU2vYWjTyvUOtHljqAsH11XOeHdgZDZD
```

### 2. FACEBOOK_TEST_EVENT_CODE (Optional)
```
TEST12345
```

## How to Add in Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add the variables above
5. **Redeploy** your project

## Testing:

After adding the environment variables and redeploying, you can test the CAPI events using the browser console:

```javascript
// Test the CAPI function
import { testFormStep1Event } from '/src/utils/capi.js';
testFormStep1Event({ ip: '192.168.1.1' });
```
