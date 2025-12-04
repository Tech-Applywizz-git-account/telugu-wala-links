import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const PAYPAL_API_BASE = Deno.env.get("PAYPAL_MODE") === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const PAYPAL_CLIENT_ID = Deno.env.get("PAYPAL_CLIENT_ID");
const PAYPAL_CLIENT_SECRET = Deno.env.get("PAYPAL_CLIENT_SECRET");

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
        const { amount = "30.00", currency = "USD" } = await req.json();

        // Get access token
        const accessToken = await getAccessToken();

        // Get app URL from environment or request origin
        const appUrl = Deno.env.get("APP_URL") || req.headers.get("origin") || "http://localhost:5174";

        console.log("Creating order with app URL:", appUrl);

        // Create order
        const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: currency,
                            value: amount,
                        },
                        description: "Telugu Wala Links - Monthly Subscription",
                    },
                ],
                application_context: {
                    brand_name: "Telugu Wala Links",
                    landing_page: "NO_PREFERENCE",
                    user_action: "PAY_NOW",
                    return_url: `${appUrl}/signup?success=true`,
                    cancel_url: `${appUrl}/signup?canceled=true`,
                },
            }),
        });

        console.log("PayPal response status:", orderResponse.status);
        const orderData = await orderResponse.json();
        console.log("Order data:", orderData);

        return new Response(JSON.stringify(orderData), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
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
