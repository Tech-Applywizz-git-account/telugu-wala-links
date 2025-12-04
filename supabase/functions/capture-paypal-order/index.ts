import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const PAYPAL_API_BASE = Deno.env.get("PAYPAL_MODE") === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const PAYPAL_CLIENT_ID = Deno.env.get("PAYPAL_CLIENT_ID");
const PAYPAL_CLIENT_SECRET = Deno.env.get("PAYPAL_CLIENT_SECRET");

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjb3VkY3RvYWl6am1yY3ZnanZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDgxNzA3OCwiZXhwIjoyMDgwMzkzMDc4fQ.59n1dclA6JdMnhZ7IwT8vRJoKc1tYmGJM1dQuRX2Pu8";

// Get PayPal access token
async function getAccessToken() {
    const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);

    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
    });

    const data = await response.json();
    return data.access_token;
}

serve(async (req) => {
    // Handle CORS
    if (req.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    }

    try {
        const { orderId, email, firstName, lastName, mobileNumber, countryCode, promoCode } = await req.json();

        if (!orderId || !email) {
            throw new Error("Order ID and email are required");
        }

        // Get access token
        const accessToken = await getAccessToken();

        // Capture the order
        const captureResponse = await fetch(
            `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            }
        );

        const captureData = await captureResponse.json();

        if (captureData.status !== "COMPLETED") {
            throw new Error("Payment capture failed");
        }

        // Initialize Supabase client
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Extract payment details
        const capture = captureData.purchase_units[0].payments.captures[0];
        const transactionId = capture.id;
        const timeOfPayment = capture.create_time;
        const amount = capture.amount.value;
        const currency = capture.amount.currency_code;

        const metadata = {
            payer: captureData.payer,
            payee: captureData.purchase_units[0].payee,
            orderId: captureData.id,
        };

        // 1. Insert into payment_details table
        const { data: paymentData, error: paymentError } = await supabase
            .from("payment_details")
            .insert({
                email: email,
                transaction_id: transactionId,
                order_id: orderId,
                time_of_payment: timeOfPayment,
                amount: amount,
                currency: currency,
                status: captureData.status,
                metadata: metadata,
            })
            .select()
            .single();

        if (paymentError) {
            throw new Error(`Payment details insert failed: ${paymentError.message}`);
        }

        // 2. Update or insert into profiles table
        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .upsert({
                email: email,
                first_name: firstName,
                last_name: lastName,
                mobile_number: mobileNumber,
                country_code: countryCode,
                promo_code: promoCode,
                transaction_id: transactionId,
                order_id: orderId,
                time_of_payment: timeOfPayment,
                metadata: metadata,
                payment_status: "completed",
            }, {
                onConflict: "email"
            })
            .select()
            .single();

        if (profileError) {
            throw new Error(`Profile upsert failed: ${profileError.message}`);
        }

        // 3. Create user in auth.users table
        const password = `${firstName}@123`;
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true,
            user_metadata: {
                first_name: firstName,
                last_name: lastName,
                full_name: `${firstName} ${lastName}`,
            },
        });

        if (authError) {
            throw new Error(`Auth user creation failed: ${authError.message}`);
        }

        // 4. Trigger email sending function
        const emailResponse = await fetch(
            `${supabaseUrl}/functions/v1/send-email`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${supabaseServiceKey}`,
                },
                body: JSON.stringify({
                    to: email,
                    firstName: firstName,
                    lastName: lastName,
                    transactionId: transactionId,
                    orderId: orderId,
                    timeOfPayment: timeOfPayment,
                    amount: amount,
                    currency: currency,
                    password: password,
                }),
            }
        );

        const emailResult = await emailResponse.json();

        return new Response(
            JSON.stringify({
                success: true,
                message: "Payment captured successfully",
                transactionId: transactionId,
                orderId: orderId,
                timeOfPayment: timeOfPayment,
                amount: amount,
                currency: currency,
                email: email,
                emailSent: emailResult.success || false,
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message
            }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
    }
});
