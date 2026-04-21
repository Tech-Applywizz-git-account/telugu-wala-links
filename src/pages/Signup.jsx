import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, User, Mail, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

const Signup = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Form, 4: Success
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        countryCode: '1', // Default to 1 (US)
        experience: '',
        // domain: '',
    });
    const [otp, setOtp] = useState('');
    const [otpToken, setOtpToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                throw new Error('Please enter a valid email address.');
            }

            const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-otp-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({ email: formData.email, mode: 'signup' }),
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Failed to send OTP');

            setOtpToken(data.token);
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-otp-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({
                    email: formData.email,
                    otp,
                    token: otpToken,
                }),
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'OTP verification failed');

            setStep(3);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!formData.firstName || !formData.lastName || !formData.mobileNumber || !formData.experience) {
                throw new Error('Please fill in all required fields.');
            }

            // Set password as requested: firstname@123
            const generatedPassword = `${formData.firstName.toLowerCase()}@123`;

            // Step 1: Create Supabase Auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: generatedPassword,
                options: {
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                    }
                }
            });

            if (authError) throw authError;

            // Step 2: Insert profile
            if (!authData?.user) {
                console.error('No user object returned from signUp');
                throw new Error('User creation failed. This email might already be registered.');
            }

            console.log('Attempting to create profile for:', authData.user.id);

            const profileData = {
                id: authData.user.id,
                email: formData.email,
                first_name: formData.firstName,
                last_name: formData.lastName,
                mobile_number: formData.mobileNumber,
                country_code: formData.countryCode, // Now provided
                experience: formData.experience,
                domain: formData.domain,
                payment_status: 'pending',
                role: 'user',
                updated_at: new Date().toISOString(),
            };

            const { error: profileError } = await supabase
                .from('profiles')
                .upsert(profileData, { onConflict: 'id' });

            if (profileError) {
                console.error('❌ Profile Insert Failed:', profileError);
                // RETRY: Minimal insert MUST include NOT NULL fields (first_name, last_name, mobile_number, country_code)
                console.log('Retrying with required profile data...');
                const { error: retryError } = await supabase
                    .from('profiles')
                    .insert({
                        id: authData.user.id,
                        email: formData.email,
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        mobile_number: formData.mobileNumber,
                        country_code: formData.countryCode,
                        payment_status: 'pending'
                    });

                if (retryError && retryError.code !== '23505') {
                    throw new Error(`Profile creation failed: ${retryError.message}`);
                }
            }

            console.log('✅ Profile step completed');

            // Step 3: Send Welcome Email
            try {
                await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-welcome-email`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        firstName: formData.firstName,
                        password: generatedPassword
                    }),
                });
            } catch (emailErr) {
                console.warn('Welcome email failed, but account is ready:', emailErr);
            }

            setStep(4);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black opacity-30"></div>
            {/* DEBUG VERSION: 1.1 */}
            <div className="hidden">Signup Version 1.1 - Added Experience/Domain</div>

            <div className="relative card max-w-lg w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <div className="w-12 h-12 bg-primary-yellow rounded-lg flex items-center justify-center">
                            <span className="text-primary-dark font-bold text-2xl">TW</span>
                        </div>
                        <span className="font-bold text-xl text-primary-dark">Telugu Wala Links</span>
                    </Link>
                </div>

                {/* ─── STEP 1: Email Input ─── */}
                {step === 1 && (
                    <div>
                        <h1 className="text-3xl font-bold text-primary-dark mb-2 text-center">
                            Get Access
                        </h1>
                        <p className="text-gray-500 text-center mb-8">
                            Verify your email to start your registration
                        </p>

                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                                        placeholder="john.doe@example.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full btn-primary text-lg flex items-center justify-center gap-2 py-3"
                                disabled={loading}
                            >
                                {loading ? (
                                    <><Loader2 className="animate-spin w-5 h-5" /> Sending OTP...</>
                                ) : (
                                    <><span>Send OTP</span><ArrowRight className="w-5 h-5" /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="text-accent-blue font-semibold hover:underline">
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </div>
                )}

                {/* ─── STEP 2: OTP Verification ─── */}
                {step === 2 && (
                    <div>
                        <h1 className="text-3xl font-bold text-primary-dark mb-2 text-center">
                            Verify OTP
                        </h1>
                        <p className="text-gray-500 text-center mb-8">
                            Enter the 6-digit code sent to <strong>{formData.email}</strong>
                        </p>

                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleVerifyOTP} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 text-center">6-Digit Code</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    className="w-full px-4 py-4 text-center text-3xl font-bold tracking-widest rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                                    placeholder="000000"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full btn-primary text-lg flex items-center justify-center gap-2 py-3"
                                disabled={loading}
                            >
                                {loading ? (
                                    <><Loader2 className="animate-spin w-5 h-5" /> Verifying...</>
                                ) : (
                                    <><span>Verify Code</span><ArrowRight className="w-5 h-5" /></>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium py-2"
                            >
                                Change Email
                            </button>
                        </form>
                    </div>
                )}

                {/* ─── STEP 3: Registration Form ─── */}
                {step === 3 && (
                    <div>
                        <h1 className="text-3xl font-bold text-primary-dark mb-2 text-center">
                            Complete Your Profile
                        </h1>
                        <p className="text-gray-500 text-center mb-8">
                            Verified Email: <strong>{formData.email}</strong>
                        </p>

                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                                            placeholder="John"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                                <div className="phone-input-container">
                                    <PhoneInput
                                        defaultCountry="us"
                                        forceDialCode={true}
                                        value={formData.mobileNumber}
                                        onChange={(phone, meta) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                mobileNumber: phone,
                                                countryCode: meta.country.dialCode
                                            }))
                                        }}
                                        inputClassName="w-full !pl-14 !py-3 !h-[48px] !rounded-lg !border-gray-300 focus:!ring-2 focus:!ring-primary-yellow focus:!border-transparent"
                                        className="w-full"
                                        countrySelectorStyleProps={{
                                            buttonClassName: "!h-[48px] !bg-white !border-gray-300 !rounded-l-lg hover:!bg-gray-50",
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience *</label>
                                    <select
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-yellow bg-white"
                                    >
                                        <option value="">Select Level</option>
                                        <option value="Fresher">Fresher (0 years)</option>
                                        <option value="Junior">Junior (1-3 years)</option>
                                        <option value="Middle">Middle (4-7 years)</option>
                                        <option value="Senior">Senior (8+ years)</option>
                                    </select>
                                </div>
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Domain *</label>
                                    <input
                                        type="text"
                                        name="domain"
                                        value={formData.domain}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                                        placeholder="e.g. IT, Healthcare"
                                    />
                                </div> */}
                            </div>

                            <button
                                type="submit"
                                className="w-full btn-primary text-lg flex items-center justify-center gap-2 py-3"
                                disabled={loading}
                            >
                                {loading ? (
                                    <><Loader2 className="animate-spin w-5 h-5" /> Creating Account...</>
                                ) : (
                                    <><span>Complete Registration</span><ArrowRight className="w-5 h-5" /></>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* ─── STEP 4: Success ─── */}
                {step === 4 && (
                    <div className="text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-green-600 mb-3">
                            Check Your Email! 📧
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Welcome, <strong>{formData.firstName}</strong>! Your account has been created successfully.<br />
                            We've sent your <strong>login password</strong> to your email.
                        </p>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                            <p className="text-sm font-semibold text-yellow-800 mb-2">🔓 What happens next?</p>
                            <ul className="text-sm text-yellow-700 space-y-1">
                                <li>• Check your inbox (and spam) for your password</li>
                                <li>• Log in to explore the teaser dashboard</li>
                                <li>• Unlock <strong>full access</strong> via the payment page</li>
                            </ul>
                        </div>

                        <button
                            onClick={() => navigate('/login')}
                            className="w-full btn-primary text-lg flex items-center justify-center gap-2 py-3"
                        >
                            <span>Log In with Password</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Signup;
