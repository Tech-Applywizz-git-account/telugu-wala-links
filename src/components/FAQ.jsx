import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: 'Is Telugu Wala Links right for me?',
            answer: 'Telugu Wala Links is perfect for Telugu-speaking professionals seeking visa-sponsored employment in the United States. Whether you\'re looking for H-1B opportunities, OPT/CPT positions, or Green Card sponsorship, our platform gives you access to verified jobs with transparent salary information.'
        },
        {
            question: 'What visa types are supported?',
            answer: 'We support all major US work visas including H-1B, OPT/CPT, Green Card, TN, E-3, and J-1. You can filter jobs by your specific visa requirements to find opportunities that match your situation.'
        },
        {
            question: 'How often are jobs updated?',
            answer: 'Our database is updated daily with new job postings from top companies across the United States. You\'ll always have access to the latest opportunities.'
        },
        {
            question: 'Can I cancel my subscription anytime?',
            answer: 'Yes! You can cancel your subscription at any time from your account settings. When you cancel, you will not be charged for the next month. However, the current month\'s payment is non-refundable and your access continues until the end of the billing period.'
        }
    ];

    return (
        <section id="faq" className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-xl text-gray-600">
                        Everything you need to know about Telugu Wala Links
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="card">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex justify-between items-center text-left"
                            >
                                <h3 className="text-lg font-semibold text-primary-dark pr-8">
                                    {faq.question}
                                </h3>
                                {openIndex === index ? (
                                    <ChevronUp className="flex-shrink-0 text-gray-400" size={24} />
                                ) : (
                                    <ChevronDown className="flex-shrink-0 text-gray-400" size={24} />
                                )}
                            </button>
                            {openIndex === index && (
                                <p className="mt-4 text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
