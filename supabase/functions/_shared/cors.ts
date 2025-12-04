// Common CORS headers for all edge functions
export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle CORS preflight requests
export function handleCors(req: Request): Response | null {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }
    return null;
}

// Create success response
export function successResponse(data: any, status: number = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
        },
    });
}

// Create error response
export function errorResponse(message: string, status: number = 400): Response {
    return new Response(
        JSON.stringify({
            success: false,
            error: message,
        }),
        {
            status,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
            },
        }
    );
}
