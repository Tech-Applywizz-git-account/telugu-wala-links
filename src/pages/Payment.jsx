// src/pages/Payment.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Lock, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';

const AMOUNT = 299; // Standard test amount (₹299)
const CURRENCY = 'INR';

const Payment = () => {
    const { role, user, isPendingPayment, isAdmin, refresh, profile, loading } = useAuth();
    const navigate = useNavigate();
    const [payStep, setPayStep] = useState('ready'); // 'ready' | 'processing' | 'success' | 'error'
    const [errorMsg, setErrorMsg] = useState('');
    const [transactionId, setTransactionId] = useState('');

    // Redirect if not logged in or already paid
    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
        if (!loading && user && !isPendingPayment && !isAdmin) {
            // Already paid — go to dashboard
            navigate('/dashboard');
        }
    }, [loading, user, isPendingPayment, isAdmin, navigate]);


    const handlePayment = async () => {
        setPayStep('processing');
        setErrorMsg('');

        try {
            // 1. Check if Razorpay is loaded from index.html
            if (!window.Razorpay) {
                throw new Error('Razorpay SDK not found. Please refresh the page.');
            }

            // 2. Create order via Supabase Edge Function
            const createRes = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-razorpay-order`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                    },
                    body: JSON.stringify({ amount: AMOUNT.toString(), currency: CURRENCY }),
                }
            );
            const orderData = await createRes.json();

            if (orderData.error || !orderData.id) {
                throw new Error(orderData.error || 'Failed to create payment order.');
            }

            // 3. Open Razorpay checkout
            const options = {
                key: 'rzp_test_SeSnxEHldck9cw', 
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Telugu Wala Links',
                description: 'Subscription Payment',
                order_id: orderData.id,
                prefill: {
                    email: user?.email || '',
                    contact: profile?.mobile_number || '9999999999',
                    name: profile?.first_name 
                        ? `${profile.first_name} ${profile.last_name || ''}`
                        : user?.user_metadata?.first_name || 'Valued Customer'
                },
                readonly: {
                    contact: true,
                    email: true
                },
                send_sms_hash: true,
                theme: { color: '#F5C518' },
                remember_customer: false, // STOPS THE 500 ERROR ON LOCALHOST 100%
                modal: {
                    ondismiss: () => {
                        console.log('Checkout closed by user');
                        if (payStep === 'processing') setPayStep('ready');
                    },
                    backdropclose: false
                },
                handler: async (response) => {
                    try {
                        console.log('Payment success response received');
                        const captureRes = await fetch(
                            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/capture-razorpay-order`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                                },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    amount: AMOUNT,
                                    currency: CURRENCY,
                                    email: user?.email || '',
                                    firstName: user?.user_metadata?.first_name || '',
                                    lastName: user?.user_metadata?.last_name || '',
                                }),
                            }
                        );
                        const captureData = await captureRes.json();
                        if (!captureData.success) throw new Error(captureData.error || 'Verification failed');

                        setTransactionId(response.razorpay_payment_id);
                        setPayStep('success');
                        await refresh();
                        setTimeout(() => navigate('/dashboard'), 2000);
                    } catch (captureErr) {
                        console.error('Capture error:', captureErr);
                        setErrorMsg(captureErr.message || 'Payment capture failed.');
                        setPayStep('error');
                    }
                }
            };

            console.log('Final Razorpay Options:', options);
            const rzp = new window.Razorpay(options);
            
            rzp.on('payment.failed', (resp) => {
                console.error('Payment failed:', resp.error);
                setErrorMsg(`Payment failed: ${resp.error?.description || 'Unknown error'}`);
                setPayStep('error');
            });

            // OPEN INSTANTLY (No delay) to bypass popup blockers
            rzp.open();

        } catch (err) {
            console.error('Payment error:', err);
            setErrorMsg(err.message || 'Something went wrong. Please try again.');
            setPayStep('error');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
            <div className="absolute inset-0 bg-black opacity-30 pointer-events-none"></div>
            <Navbar />

            <div className="relative max-w-lg mx-auto px-4 py-16">
                {/* ─── SUCCESS STATE ─── */}
                {payStep === 'success' && (
                    <div className="bg-white rounded-2xl shadow-2xl p-10 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-green-600 mb-3">Payment Successful! 🎉</h1>
                        <p className="text-gray-600 mb-4">
                            You now have full access to 500,000+ visa-sponsored jobs!
                        </p>
                        {transactionId && (
                            <p className="text-xs text-gray-400 mb-6">Transaction ID: {transactionId}</p>
                        )}
                        <div className="animate-pulse text-sm text-gray-500">Redirecting to your dashboard...</div>
                    </div>
                )}

                {/* ─── PAYMENT CARD ─── */}
                {payStep !== 'success' && (
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-8 py-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Lock className="w-5 h-5 text-gray-800" />
                                <span className="font-bold text-gray-800 text-lg">Unlock Full Access</span>
                            </div>
                            <div className="text-5xl font-black text-gray-900">$30</div>
                            <div className="text-gray-700 font-medium">per month • cancel anytime</div>
                        </div>

                        <div className="p-8">
                            {/* Logo */}
                            <div className="flex items-center justify-center gap-2 mb-6">
                                <div className="w-10 h-10 bg-primary-yellow rounded-lg flex items-center justify-center">
                                    <span className="text-primary-dark font-bold text-xl">TW</span>
                                </div>
                                <span className="font-bold text-xl text-primary-dark">Telugu Wala Links</span>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {[
                                    '500,000+ verified visa-sponsored jobs',
                                    'H-1B, OPT/CPT, TN, E-3, J-1 & Green Cards',
                                    'Daily job updates with company contacts',
                                    'Advanced search, save & track applications',
                                    'Cancel anytime — no contracts',
                                ].map((f, i) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            {/* Error State */}
                            {payStep === 'error' && errorMsg && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    ⚠️ {errorMsg}
                                </div>
                            )}

                            {/* Pay Button */}
                            <button
                                onClick={handlePayment}
                                disabled={payStep === 'processing'}
                                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-black text-lg rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {payStep === 'processing' ? (
                                    <><Loader2 className="animate-spin w-5 h-5" /> Opening Payment...</>
                                ) : payStep === 'error' ? (
                                    'Try Again'
                                ) : (
                                    <><ShieldCheck className="w-5 h-5" /> Pay $30 with Razorpay</>
                                )}
                            </button>

                            <p className="text-center text-xs text-gray-400 mt-3">
                                🔒 Secured by Razorpay — UPI, Cards, Net Banking accepted
                            </p>

                            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                                <Link
                                    to="/dashboard"
                                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back to dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payment;
