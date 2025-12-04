# 🔍 Payment Failure Debugging Guide

## ✅ Improved Error Logging

I've updated the `Signup.jsx` with detailed console logging. Now when you test the payment:

### **What You'll See in Console:**

1. **When creating order:**
   - Creating PayPal order...
   - Supabase URL: [your URL]
   - PayPal Client ID: [your client ID]
   - Response status: [HTTP status]
   - Response data: [full response]
   - Order created successfully: [order ID]

2. **When capturing payment:**
   - Payment approved, capturing order: [order ID]
   - Capture response status: [HTTP status]
   - Capture result: [full response]
   - Payment captured successfully!

3. **If error occurs:**
   - Detailed error message with actual cause

---

## 🐛 Common Causes of "Payment Failed"

### **1. Missing Environment Variables**

**Check your `.env` file has:**
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_PAYPAL_CLIENT_ID=AaefgWjYfloz4uumcUTB2iiDcb3tp_0ope-DPegqEmt86o3S-mSsZ-y_0ieAbfCec0s6uM1awIihtUzZ
```

**⚠️ If any show "undefined" in console:**
- Your `.env` file is missing or incomplete
- Restart the dev server: `npm run dev`

---

### **2. Edge Functions Not Deployed**

The functions need to be deployed to Supabase first!

```bash
# Deploy functions
supabase functions deploy create-paypal-order
supabase functions deploy capture-paypal-order
```

**Test if deployed:**
- Go to Supabase Dashboard → Edge Functions
- You should see both functions listed

---

### **3. PayPal Secrets Not Set**

```bash
supabase secrets set PAYPAL_CLIENT_ID=AaefgWjYfloz4uumcUTB2iiDcb3tp_0ope-DPegqEmt86o3S-mSsZ-y_0ieAbfCec0s6uM1awIihtUzZ
supabase secrets set PAYPAL_CLIENT_SECRET=ENewD9DCs9P52sQG2HcRoAuM-Fe1YY_vrFSvHnx0aWqKei5kyTzwZltMjPK3qjlbVzqi1vyEadknjMku
supabase secrets set PAYPAL_MODE=sandbox
```

---

### **4. Database Tables Not Created**

Run the SQL from `supabase/migrations/002_create_tables_no_rls.sql` in Supabase SQL Editor.

---

### **5. CORS Issues**

If you see CORS errors in console:
- This is normal for localhost development
- Edge functions should have proper CORS headers
- Make sure you're using the correct Supabase URL

---

## 📊 Debugging Steps

### **Step 1: Open Browser Console**
1. Press `F12` or `Ctrl+Shift+I`
2. Click **Console** tab
3. Try the payment again
4. Look for the console logs

### **Step 2: Check What's Failing**

#### **A. Error during "Creating PayPal order"**
**Console shows:** `Failed to create payment order: [error]`

**Possible causes:**
- ❌ `VITE_SUPABASE_URL` is undefined → Check `.env` file
- ❌ Edge function not deployed → Deploy with `supabase functions deploy`
- ❌ PayPal credentials wrong → Check Supabase secrets
- ❌ Network error → Check Supabase is accessible

**Check the response data:**
```javascript
// If you see this in console:
Response data: { error: "some error message" }
```
That's your actual error!

#### **B. Error during "Capturing payment"**
**Console shows:** `Payment processing failed: [error]`

**Possible causes:**
- ❌ Database tables don't exist → Run SQL migration
- ❌ `capture-paypal-order` function not deployed
- ❌ Missing Supabase service role key in secrets
- ❌ Profile data issue → Check formData is complete

#### **C. PayPal SDK Error**
**Console shows:** `Payment failed: [error]`

**Possible causes:**
- ❌ Invalid PayPal Client ID
- ❌ Sandbox account issue
- ❌ PayPal connection problem

---

## 🧪 Testing Checklist

Before testing payment, verify:

- [ ] `.env` file exists with all 3 variables
- [ ] Dev server restarted after creating `.env`
- [ ] Supabase project created and active
- [ ] Database tables created (run SQL migration)
- [ ] Edge functions deployed to Supabase
- [ ] PayPal secrets set in Supabase
- [ ] Browser console is open (F12)

---

## 🚀 Quick Fix Flow

If payment fails:

1. **Check console** - What's the actual error message?
2. **Check environment** - Are all 3 variables showing in console logs?
3. **Restart dev server** - `npm run dev` (if you just added .env)
4. **Try again** - Look for detailed error in console

---

## 📝 What to Look For in Console

### ✅ **Success Flow:**
```
Creating PayPal order...
Supabase URL: https://xxxxx.supabase.co
PayPal Client ID: Aaef...
Response status: 200
Response data: { id: "7XB12345...", status: "CREATED", ... }
Order created successfully: 7XB12345...
Payment approved, capturing order: 7XB12345...
Capture response status: 200
Capture result: { success: true, transactionId: "...", ... }
Payment captured successfully!
```

### ❌ **Failure Examples:**

**Missing .env:**
```
Supabase URL: undefined
PayPal Client ID: undefined
```
**Fix:** Create `.env` file and restart server

**Function not deployed:**
```
Response status: 404
```
**Fix:** Deploy edge functions

**PayPal credential error:**
```
Response data: { error: "Authentication failed" }
```
**Fix:** Check PayPal secrets in Supabase

**Database error:**
```
Capture result: { success: false, error: "relation 'profiles' does not exist" }
```
**Fix:** Run database migration SQL

---

## 🛠️ Need More Help?

**Copy this info and share it:**

1. What error message appears in the red box?
2. What do the console logs show?
3. Have you:
   - Created `.env` file?
   - Deployed edge functions?
   - Created database tables?

**To check if edge functions are deployed:**
```bash
supabase functions list
```

**To view function logs:**
```bash
supabase functions logs create-paypal-order --tail
```

This will show real-time logs from your edge function!

---

## 💡 Pro Tip

The most common issue is **missing .env file**. Make sure:
1. File is named exactly `.env` (not `.env.txt`)
2. It's in the `frontend` folder
3. Dev server was restarted after creating it
4. All three variables are filled in

---

**Now try the payment again and check the console!** 🎯
