# ⚠️ IMPORTANT: Environment Variables Required

Before running the application, you need to create a `.env` file in the frontend directory.

## Quick Setup:

1. **Create `.env` file** in the `frontend` folder
2. **Copy the content from `.env.example`**
3. **Replace the placeholder values** with your actual credentials:

```env
# Get these from your Supabase project settings
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Get this from PayPal Developer Dashboard
VITE_PAYPAL_CLIENT_ID=AYourPayPalClientIdHere
```

## Where to get these values:

### Supabase Credentials:
1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### PayPal Client ID:
1. Go to [developer.paypal.com](https://developer.paypal.com/dashboard/)
2. Create a new app (or use existing)
3. Copy the **Client ID** from the Sandbox credentials
4. Paste it as `VITE_PAYPAL_CLIENT_ID`

## For Development/Testing:

If you just want to see the UI without backend functionality, you can use these placeholder values:

```env
VITE_SUPABASE_URL=https://placeholder.supabase.co
VITE_SUPABASE_ANON_KEY=placeholder_key
VITE_PAYPAL_CLIENT_ID=placeholder_client_id
```

**Note:** The app will load but payment and database features won't work until you add real credentials.

---

## After creating `.env`:

Run the development server:
```bash
npm run dev
```

The signup form will now load without errors!
