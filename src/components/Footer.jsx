import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Linkedin, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary-dark text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-primary-yellow rounded-lg flex items-center justify-center">
                                <span className="text-primary-dark font-bold text-xl">TW</span>
                            </div>
                            <span className="font-bold text-lg">Telugu Wala Links</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Connecting Telugu professionals with US visa-sponsored opportunities.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>
                                <a href="#how-it-works" className="hover:text-primary-yellow transition">
                                    How it works
                                </a>
                            </li>
                            <li>
                                <Link to="/pricing" className="hover:text-primary-yellow transition">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link to="/jobs" className="hover:text-primary-yellow transition">
                                    Browse Jobs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>
                                <a href="#" className="hover:text-primary-yellow transition">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary-yellow transition">
                                    Contact
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary-yellow transition">
                                    Blog
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>
                                <a href="#" className="hover:text-primary-yellow transition">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary-yellow transition">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary-yellow transition">
                                    Refund Policy
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        © 2025 Telugu Wala Links. All rights reserved.
                    </p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a href="#" className="text-gray-400 hover:text-primary-yellow transition">
                            <Twitter size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-primary-yellow transition">
                            <Linkedin size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-primary-yellow transition">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-primary-yellow transition">
                            <Mail size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
