import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const HeroSection = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/jobs?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
            {/* Background overlay */}
            <div className="absolute inset-0 bg-black opacity-30"></div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                <div className="text-center">
                    {/* Headline */}
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Land Your Dream Job <br className="hidden md:block" />
                        in the <span className="text-primary-yellow">United States</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
                        500,000+ verified roles with H-1B, OPT, Green Card, and other visa sponsorships
                    </p>

                </div>
            </div>
        </div>
    );
};

export default HeroSection;
