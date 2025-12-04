import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Priya Sharma',
        role: 'Software Engineer',
        company: 'Google',
        content: 'Telugu Wala Links helped me find my dream job at Google! The verified contact information was a game-changer.',
        rating: 5,
    },
    {
        name: 'Rajesh Kumar',
        role: 'Data Scientist',
        company: 'Microsoft',
        content: 'I landed my H-1B sponsored role within 2 months. The platform made everything so easy!',
        rating: 5,
    },
    {
        name: 'Anitha Reddy',
        role: 'Product Manager',
        company: 'Amazon',
        content: 'The best investment I made in my career. Access to 500K+ jobs with salary info is invaluable.',
        rating: 5,
    },
];

const Testimonials = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
                        Success Stories
                    </h2>
                    <p className="text-xl text-gray-600">
                        Hear from Telugu professionals who landed their dream jobs
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="card hover:shadow-lg transition-shadow duration-200">
                            <div className="mb-4">
                                <Quote className="w-10 h-10 text-primary-yellow opacity-50" />
                            </div>

                            {/* Rating */}
                            <div className="flex mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-primary-yellow fill-current" />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>

                            {/* Author */}
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="ml-4">
                                    <div className="font-semibold text-primary-dark">{testimonial.name}</div>
                                    <div className="text-sm text-gray-600">
                                        {testimonial.role} at {testimonial.company}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
