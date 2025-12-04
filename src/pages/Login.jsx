// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Mail, Lock } from 'lucide-react';

// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const navigate = useNavigate();

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Here you would authenticate with backend
//         console.log('Login attempt:', { email, password });
//         // For now, redirect to dashboard
//         navigate('/dashboard');
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
//             <div className="absolute inset-0 bg-black opacity-30"></div>

//             <div className="relative card max-w-md w-full">
//                 {/* Logo */}
//                 <div className="text-center mb-8">
//                     <div className="inline-block">
//                         <Link to="/" className="flex items-center space-x-2">
//                             <div className="w-12 h-12 bg-primary-yellow rounded-lg flex items-center justify-center">
//                                 <span className="text-primary-dark font-bold text-2xl">TW</span>
//                             </div>
//                             <span className="font-bold text-xl text-primary-dark">Telugu Wala Links</span>
//                         </Link>
//                     </div>
//                 </div>

//                 <h1 className="text-2xl font-bold text-primary-dark mb-6 text-center">
//                     Login to Telugu Wala Links
//                 </h1>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Email Field */}
//                     <div>
//                         <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                             Email
//                         </label>
//                         <div className="relative">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                 <Mail className="h-5 w-5 text-gray-400" />
//                             </div>
//                             <input
//                                 id="email"
//                                 type="email"
//                                 placeholder="email@example.com"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 required
//                                 className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-yellow"
//                             />
//                         </div>
//                     </div>

//                     {/* Password Field */}
//                     <div>
//                         <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                             Password
//                         </label>
//                         <div className="relative">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                 <Lock className="h-5 w-5 text-gray-400" />
//                             </div>
//                             <input
//                                 id="password"
//                                 type="password"
//                                 placeholder="Enter your password"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 required
//                                 className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-yellow"
//                             />
//                         </div>
//                         <div className="mt-2 text-right">
//                             <Link to="/forgot-password" className="text-sm text-accent-blue hover:underline">
//                                 Forgot password?
//                             </Link>
//                         </div>
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-full btn-primary flex items-center justify-center space-x-2"
//                     >
//                         <span>Continue</span>
//                     </button>
//                 </form>

//                 <div className="mt-6 text-center">
//                     <p className="text-gray-600">
//                         Don't have an account?{' '}
//                         <Link to="/signup" className="text-accent-blue font-semibold hover:underline">
//                             Sign up
//                         </Link>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;



import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                throw error;
            }

            console.log("Login successful:", data);

            // Short delay to ensure auth state propagates
            setTimeout(() => {
                navigate('/dashboard');
            }, 500);

        } catch (err) {
            console.error("Login error:", err);
            setError(err.message || "Failed to login");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black opacity-30"></div>

            <div className="relative card max-w-md w-full">
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

                <h1 className="text-2xl font-bold text-primary-dark mb-6 text-center">
                    Login to Telugu Wala Links
                </h1>

                {error && (
                    <p className="text-red-500 text-center mb-4 font-medium">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
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
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                            />
                        </div>
                        <div className="mt-2 text-right">
                            <Link to="/forgot-password" className="text-sm text-accent-blue hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <span>Continue</span>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-accent-blue font-semibold hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
