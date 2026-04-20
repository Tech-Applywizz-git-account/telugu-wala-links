import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { Check, ShieldCheck, Zap, Globe, Clock, Award } from 'lucide-react';

import useAuth from '../hooks/useAuth';

const Pricing = () => {
    const { user } = useAuth();
    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    const features = [
        { icon: Globe, text: 'Access to 500,000+ Verified Jobs' },
        { icon: Award, text: 'Visa Sponsorship (H-1B, OPT, CPT, Green Card)' },
        { icon: Zap, text: 'Real-time Daily Job Updates' },
        { icon: ShieldCheck, text: 'Data Verified by U.S. Government' },
        { icon: Clock, text: '30 Days Full Premium Access' },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />

            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                            Unlock Your Dream Job in the USA
                        </h1>
                        <p className="text-xl text-gray-600">
                            Join thousands of professionals finding visa-sponsored roles today.
                        </p>
                    </div>

                    {/* Main Pricing Section */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 grid md:grid-cols-2">
                        
                        {/* Left Side: Features */}
                        <div className="p-8 md:p-12 bg-gray-900 text-white">
                            <h2 className="text-2xl font-bold mb-8">What You'll Get</h2>
                            <ul className="space-y-6">
                                {features.map((item, index) => (
                                    <li key={index} className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                                            <item.icon size={20} className="text-gray-900" />
                                        </div>
                                        <span className="text-lg font-medium">{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                            
                            <div className="mt-12 p-6 bg-gray-800 rounded-2xl border border-gray-700">
                                <p className="text-sm text-gray-400 italic">
                                    "The most reliable source for Telugu community Job Links in America."
                                </p>
                            </div>
                        </div>

                        {/* Right Side: Price & CTA */}
                        <div className="p-8 md:p-12 flex flex-col justify-center items-center text-center">
                            <div className="mb-6">
                                <span className="text-gray-500 text-lg line-through">$29.99</span>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-6xl font-black text-gray-900">$1</span>
                                    <span className="text-xl text-gray-500">/mo</span>
                                </div>
                                <p className="text-green-600 font-bold mt-2">Limited Time Offer</p>
                            </div>

                            <div className="w-full space-y-4">
                                <Link
                                    to={user ? "/payment" : "/signup"}
                                    className="block w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black text-xl rounded-2xl transition-all transform hover:scale-[1.02] shadow-lg"
                                >
                                    {user ? "Complete Payment →" : "Get Started Now →"}
                                </Link>
                                <p className="text-sm text-gray-500">
                                    Secure Payment via Razorpay
                                </p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100 w-full">
                                <div className="flex items-center justify-center gap-6">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-6 opacity-60" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Guarantee */}
                    <div className="mt-8 text-center text-gray-500">
                        <p className="flex items-center justify-center gap-2">
                            <ShieldCheck size={18} />
                            Safe & Secure Enrollment • Trusted by 10,000+ Professionals
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Pricing;
