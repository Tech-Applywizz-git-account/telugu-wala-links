# 🚀 Quick Start - Testing PayPal Functions

## Step 1️⃣: Deploy Functions

```bash
# Login and link
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Set secrets (use your actual values)
supabase secrets set PAYPAL_CLIENT_ID=AaefgWjYfloz4uumcUTB2iiDcb3tp_0ope-DPegqEmt86o3S-mSsZ-y_0ieAbfCec0s6uM1awIihtUzZ
supabase secrets set PAYPAL_CLIENT_SECRET=ENewD9DCs9P52sQG2HcRoAuM-Fe1YY_vrFSvHnx0aWqKei5kyTzwZltMjPK3qjlbVzqi1vyEadknjMku
supabase secrets set PAYPAL_MODE=sandbox
supabase secrets set SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

# Deploy
supabase functions deploy
```

---

## Step 2️⃣: Test in Postman

### **Option A: Import Collection**
1. Open Postman
2. File → Import
3. Select: `PayPal_API_Tests.postman_collection.json`
4. Edit collection variables:
   - `supabase_url`: `https://YOUR_PROJECT_REF.supabase.co`
   - `anon_key`: Your anon key from Supabase

### **Option B: Manual Setup**

#### **Test 1: Create Order**
```
POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-paypal-order

Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_ANON_KEY

Body:
{
  "amount": "30.00",
  "currency": "USD"
}
```

**Response: Copy the `id` field!**

#### **Test 2: Approve Payment**
1. From response, copy the `approve` link
2. Open in browser
3. Login with PayPal sandbox test account
4. Approve the payment

#### **Test 3: Capture Order**
```
POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/capture-paypal-order

Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_ANON_KEY

Body:
{
  "orderId": "PASTE_ORDER_ID_HERE",
  "email": "test@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "mobileNumber": "1234567890",
  "countryCode": "+1",
  "promoCode": "TEST123"
}
```

---

## Step 3️⃣: Verify

Check Supabase Dashboard → Table Editor:
- ✅ `profiles` table has new row
- ✅ `payment_details` table has transaction

---

## 🔧 Find Your Values

### **Project Ref:**
- Supabase Dashboard URL: `https://app.supabase.com/project/YOUR_PROJECT_REF`

### **Anon Key:**
- Settings → API → Project API keys → `anon` `public`

### **Service Role Key:**
- Settings → API → Project API keys → `service_role` (⚠️ Keep secret!)

---

## 📁 Files Created

- 📘 **TESTING_GUIDE.md** - Full detailed guide
- 📦 **PayPal_API_Tests.postman_collection.json** - Import to Postman
- 📝 **QUICK_START.md** - This file

---

**Need help?** See TESTING_GUIDE.md for detailed instructions!
