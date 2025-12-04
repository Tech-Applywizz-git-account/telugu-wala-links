# Supabase Edge Functions Setup Guide

## Overview
This guide explains how to set up and deploy the three edge functions for PayPal payment processing and email notifications.

## Edge Functions Created

1. **create-paypal-order** - Creates a PayPal order
2. **capture-paypal-order** - Captures payment, stores data, creates auth user, and triggers email
3. **send-email** - Sends welcome email with login credentials and transaction details

## Prerequisites

1. **Supabase CLI** installed
   ```bash
   npm install -g supabase
   ```

2. **Supabase Project** set up
3. **PayPal Developer Account** and credentials
4. **Resend Account** for email sending (or alternative email service)

## Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### Supabase Edge Functions
Set these secrets using Supabase CLI:

```bash
# PayPal Configuration
supabase secrets set PAYPAL_CLIENT_ID=your_paypal_client_id
supabase secrets set PAYPAL_CLIENT_SECRET=your_paypal_client_secret
supabase secrets set PAYPAL_MODE=sandbox  # or "live" for production

# Supabase Configuration (these are usually auto-set)
supabase secrets set SUPABASE_URL=your_supabase_url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Configuration (Resend)
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set FROM_EMAIL=noreply@yourdomain.com
supabase secrets set APP_URL=https://yourdomain.com
```

## Database Schema

### profiles table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  country_code TEXT NOT NULL,
  promo_code TEXT,
  transaction_id TEXT,
  order_id TEXT,
  time_of_payment TIMESTAMPTZ,
  metadata JSONB,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email
CREATE INDEX idx_profiles_email ON profiles(email);
```

### payment_details table
```sql
CREATE TABLE payment_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  time_of_payment TIMESTAMPTZ NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_payment_details_email ON payment_details(email);
CREATE INDEX idx_payment_details_transaction_id ON payment_details(transaction_id);
```

## Deployment Steps

### 1. Initialize Supabase in your project (if not already done)
```bash
cd "c:\Users\G.Ganesh\OneDrive\Desktop\Telugu Wala Links\Telugu-Wala-Links\frontend"
supabase init
```

### 2. Link to your Supabase project
```bash
supabase link --project-ref your-project-ref
```

### 3. Deploy the edge functions
```bash
# Deploy all functions at once
supabase functions deploy create-paypal-order
supabase functions deploy capture-paypal-order
supabase functions deploy send-email

# Or deploy all at once
supabase functions deploy
```

### 4. Set environment secrets (as shown above)

### 5. Create the database tables
Run the SQL commands in your Supabase SQL editor or use migrations.

## Testing

### Test create-paypal-order function
```bash
curl -X POST https://your-project-ref.supabase.co/functions/v1/create-paypal-order \
  -H "Content-Type: application/json" \
  -d '{"amount": "30.00", "currency": "USD"}'
```

### Test locally (optional)
```bash
# Start local Supabase
supabase start

# Serve function locally
supabase functions serve create-paypal-order --env-file .env.local

# Test locally
curl -X POST http://localhost:54321/functions/v1/create-paypal-order \
  -H "Content-Type: application/json" \
  -d '{"amount": "30.00", "currency": "USD"}'
```

## PayPal Setup

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Create a new app
3. Get your Client ID and Secret
4. For testing, use Sandbox credentials
5. For production, switch to Live credentials and set `PAYPAL_MODE=live`

## Resend Setup (Email Service)

1. Sign up at [Resend](https://resend.com)
2. Verify your domain (or use their test domain for development)
3. Get your API key
4. Set the environment variables

## Alternative Email Services

If you prefer to use a different email service, modify the `send-email` function:

- **SendGrid**: Replace Resend API calls with SendGrid
- **AWS SES**: Use AWS SES API
- **Nodemailer**: Can be adapted for Deno

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure your frontend origin is allowed
2. **PayPal sandbox issues**: Verify you're using sandbox credentials with sandbox mode
3. **Email not sending**: Check Resend API key and domain verification
4. **Database errors**: Verify table schemas match exactly

### View Logs
```bash
# View function logs
supabase functions logs create-paypal-order
supabase functions logs capture-paypal-order
supabase functions logs send-email
```

## Security Notes

1. Never expose `PAYPAL_CLIENT_SECRET` or `SUPABASE_SERVICE_ROLE_KEY` to the frontend
2. All sensitive operations are handled server-side in edge functions
3. Use environment variables for all credentials
4. Enable RLS (Row Level Security) on your Supabase tables

## Next Steps

1. Set up the database tables
2. Configure environment variables
3. Deploy the edge functions
4. Test the complete flow
5. Switch to production PayPal credentials when ready
6. Set up proper email domain and templates

## Support

For issues:
- Supabase: [docs.supabase.com](https://docs.supabase.com)
- PayPal: [developer.paypal.com](https://developer.paypal.com)
- Resend: [resend.com/docs](https://resend.com/docs)
