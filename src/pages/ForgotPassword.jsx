import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Password reset requested for:', email);

        // Show success message
        setShowSuccess(true);

        // Hide success message after 5 seconds
        setTimeout(() => {
            setShowSuccess(false);
        }, 5000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black opacity-30"></div>

            <div className="relative card max-w-md w-full">
                {/* Success Message Banner */}
                {showSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-sm font-medium">
                            ✓ Check your email for a reset link.
                        </p>
                    </div>
                )}

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-block">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-12 h-12 bg-primary-yellow rounded-lg flex items-center justify-center">
                                <span className="text-primary-dark font-bold text-2xl">TW</span>
                            </div>
                            <span className="font-bold text-xl text-primary-dark">Telugu Wala Links</span>
                        </Link>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-primary-dark mb-2 text-center">
                    Reset your password
                </h1>

                <p className="text-gray-600 mb-6 text-center">
                    Enter the email associated with your account.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full btn-primary flex items-center justify-center space-x-2"
                    >
                        <span>Send reset link</span>
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-sm text-accent-blue hover:underline">
                        ← Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
