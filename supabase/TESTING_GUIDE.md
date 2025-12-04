# Testing PayPal Edge Functions with Postman/Reqbin

## 📋 **Overview**
This guide will help you deploy and test the `create-paypal-order` and `capture-paypal-order` edge functions.

---

## 🚀 **STEP 1: Deploy Edge Functions to Supabase**

### **1.1 Install Supabase CLI** (if not installed)
```bash
npm install -g supabase
```

### **1.2 Login to Supabase**
```bash
supabase login
```
This will open a browser for authentication.

### **1.3 Link Your Project**
```bash
cd "c:\Users\G.Ganesh\OneDrive\Desktop\Telugu Wala Links\Telugu-Wala-Links\frontend"
supabase link --project-ref YOUR_PROJECT_REF
```

**To find your PROJECT_REF:**
- Go to Supabase Dashboard
- Look at your URL: `https://app.supabase.com/project/YOUR_PROJECT_REF`
- Or go to Settings → General → Reference ID

### **1.4 Set Environment Secrets**
```bash
# PayPal Credentials
supabase secrets set PAYPAL_CLIENT_ID=AaefgWjYfloz4uumcUTB2iiDcb3tp_0ope-DPegqEmt86o3S-mSsZ-y_0ieAbfCec0s6uM1awIihtUzZ

supabase secrets set PAYPAL_CLIENT_SECRET=ENewD9DCs9P52sQG2HcRoAuM-Fe1YY_vrFSvHnx0aWqKei5kyTzwZltMjPK3qjlbVzqi1vyEadknjMku

supabase secrets set PAYPAL_MODE=sandbox

# Get these from your Supabase Dashboard → Settings → API
supabase secrets set SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co

# Service Role Key (from Settings → API → service_role key)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

# Email Configuration (for Resend - you can set these later)
supabase secrets set RESEND_API_KEY=YOUR_RESEND_KEY
supabase secrets set FROM_EMAIL=noreply@yourdomain.com
supabase secrets set APP_URL=http://localhost:5174
```

### **1.5 Deploy the Functions**
```bash
# Deploy both functions
supabase functions deploy create-paypal-order
supabase functions deploy capture-paypal-order
supabase functions deploy send-email
```

You should see:
```
✓ Deployed Function create-paypal-order
✓ Deployed Function capture-paypal-order
✓ Deployed Function send-email
```

---

## 🧪 **STEP 2: Test with Postman**

### **2.1 Download Postman**
- Download from: https://www.postman.com/downloads/
- Or use the web version: https://web.postman.com/

### **2.2 Get Your Function URLs**

Your functions will be available at:
```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-paypal-order
https://YOUR_PROJECT_REF.supabase.co/functions/v1/capture-paypal-order
```

Replace `YOUR_PROJECT_REF` with your actual project reference ID.

---

## 📬 **TEST 1: Create PayPal Order**

### **In Postman:**

1. **Method:** `POST`
2. **URL:** `https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-paypal-order`
3. **Headers:**
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer YOUR_ANON_KEY` (from Supabase Settings → API)
4. **Body** (raw JSON):
   ```json
   {
     "amount": "30.00",
     "currency": "USD"
   }
   ```
5. **Click:** `Send`

### **Expected Response:**
```json
{
  "id": "7XB12345ABCD67890",
  "status": "CREATED",
  "links": [
    {
      "href": "https://www.sandbox.paypal.com/checkoutnow?token=7XB12345ABCD67890",
      "rel": "approve",
      "method": "GET"
    },
    {
      "href": "https://api.sandbox.paypal.com/v2/checkout/orders/7XB12345ABCD67890",
      "rel": "self",
      "method": "GET"
    }
  ]
}
```

**Save the `id` field** - you'll need it for the capture test!

---

## 📬 **TEST 2: Capture PayPal Order**

**⚠️ IMPORTANT:** Before testing capture, you need to approve the payment first!

### **2.1 Approve the Payment (in Browser)**

1. From the previous response, find the `approve` link
2. Copy the URL: `https://www.sandbox.paypal.com/checkoutnow?token=...`
3. Open it in your browser
4. Login with PayPal Sandbox test account:
   - Go to https://developer.paypal.com/dashboard/
   - Accounts → Sandbox → Accounts
   - Use the buyer test account credentials
5. Complete the payment approval

### **2.2 Capture the Payment (in Postman)**

1. **Method:** `POST`
2. **URL:** `https://YOUR_PROJECT_REF.supabase.co/functions/v1/capture-paypal-order`
3. **Headers:**
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer YOUR_ANON_KEY`
4. **Body** (raw JSON):
   ```json
   {
     "orderId": "7XB12345ABCD67890",
     "email": "test@example.com",
     "firstName": "John",
     "lastName": "Doe",
     "mobileNumber": "1234567890",
     "countryCode": "+1",
     "promoCode": "TEST123"
   }
   ```
   Replace `orderId` with the actual order ID from Test 1.

5. **Click:** `Send`

### **Expected Response:**
```json
{
  "success": true,
  "message": "Payment captured successfully",
  "transactionId": "2AB12345CD67890EF",
  "orderId": "7XB12345ABCD67890",
  "timeOfPayment": "2024-12-04T06:52:00Z",
  "amount": "30.00",
  "currency": "USD",
  "email": "test@example.com",
  "emailSent": true
}
```

---

## 🌐 **STEP 3: Test with Reqbin**

### **TEST 1: Create Order**

1. Go to: https://reqbin.com/
2. Select: `POST`
3. Enter URL: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-paypal-order`
4. Click **Headers** tab:
   ```
   Content-Type: application/json
   Authorization: Bearer YOUR_ANON_KEY
   ```
5. Click **Body** tab (select JSON):
   ```json
   {
     "amount": "30.00",
     "currency": "USD"
   }
   ```
6. Click **Send**

### **TEST 2: Capture Order** (after approval)

1. Go to: https://reqbin.com/
2. Select: `POST`
3. Enter URL: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/capture-paypal-order`
4. Click **Headers** tab:
   ```
   Content-Type: application/json
   Authorization: Bearer YOUR_ANON_KEY
   ```
5. Click **Body** tab (select JSON):
   ```json
   {
     "orderId": "YOUR_ORDER_ID_FROM_STEP_1",
     "email": "test@example.com",
     "firstName": "John",
     "lastName": "Doe",
     "mobileNumber": "1234567890",
     "countryCode": "+1",
     "promoCode": "TEST123"
   }
   ```
6. Click **Send**

---

## 🐛 **Troubleshooting**

### **Error: "Authorization header required"**
- Add header: `Authorization: Bearer YOUR_ANON_KEY`

### **Error: "Failed to create order"**
- Check your PayPal credentials are set correctly
- Verify `PAYPAL_MODE=sandbox`
- Check function logs: `supabase functions logs create-paypal-order`

### **Error: "Payment capture failed"**
- Make sure you approved the payment in PayPal sandbox first
- Check the order ID is correct
- Verify order status is "APPROVED" before capturing

### **Error: "CORS"**
- This is normal in browser testing
- Use Postman/Reqbin instead
- Or the frontend app will handle CORS automatically

### **Check Function Logs**
```bash
# View logs for debugging
supabase functions logs create-paypal-order --tail
supabase functions logs capture-paypal-order --tail
```

---

## 📊 **Verify in Supabase Database**

After successful capture, check your data:

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Check `profiles` table - should have the user data
4. Check `payment_details` table - should have the transaction

---

## 🎯 **Quick Reference**

### **Your Edge Function URLs:**
```
Create Order:  https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-paypal-order
Capture Order: https://YOUR_PROJECT_REF.supabase.co/functions/v1/capture-paypal-order
Send Email:    https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-email
```

### **Required Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_ANON_KEY
```

### **Create Order Body:**
```json
{
  "amount": "30.00",
  "currency": "USD"
}
```

### **Capture Order Body:**
```json
{
  "orderId": "ORDER_ID_FROM_CREATE",
  "email": "user@example.com",
  "firstName": "FirstName",
  "lastName": "LastName",
  "mobileNumber": "1234567890",
  "countryCode": "+1",
  "promoCode": "OPTIONAL"
}
```

---

## ✅ **Success Checklist**

- [ ] Supabase CLI installed
- [ ] Logged into Supabase
- [ ] Project linked
- [ ] All secrets set
- [ ] Functions deployed
- [ ] Database tables created (run 002_create_tables_no_rls.sql)
- [ ] Create order test successful
- [ ] Payment approved in sandbox
- [ ] Capture order test successful
- [ ] Data visible in Supabase tables

---

**Need help?** Check the function logs or let me know what error you're seeing!
