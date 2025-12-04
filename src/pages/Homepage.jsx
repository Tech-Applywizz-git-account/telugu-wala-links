import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import SearchFilters from '../components/SearchFilters';
import { Link } from 'react-router-dom';
import JobDetailsPanel from "../components/JobDetailsPanel";


const homepageJobs = [
    {
        id: 1,
        company: 'HDR',
        title: 'Electrical EIT/Designer',
        location: 'Charlotte, North Carolina',
        categories: ['Electrical Engineering', 'Specialized Engineering'],
        tags: ['On-Site', "Bachelor's", 'Full Time'],
        visas: ['Green Card', 'TN', 'OPT', 'CPT'],
    },
    {
        id: 2,
        company: 'ADT',
        title: 'Installation Technician',
        location: 'Miami, Florida',
        categories: ['Electrical Technician', 'HVAC Technician'],
        tags: ['On-Site', 'Associate', 'Full Time'],
        visas: ['Green Card', 'OPT'],
    },
    {
        id: 3,
        company: 'Google',
        title: 'Product Manager',
        location: 'Mountain View, CA',
        categories: ['Product', 'Strategy'],
        tags: ['Hybrid', "Bachelor's", 'Full Time'],
        visas: ['H-1B', 'TN', 'Green Card'],
    },
];

const Homepage = () => {
    const [searchInput, setSearchInput] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);

    return (
        <div>
            <Navbar />
            <HeroSection />

            {/* Search + Filters + Centered Jobs */}
            <section className="bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center mb-6">
                        <h3 className="text-3xl font-semibold text-gray-900">Search for your perfect role.</h3>
                        <p className="text-gray-500 mt-2">Data verified by the U.S. Government.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-100 overflow-hidden max-w-4xl mx-auto mb-6">
                        <div className="px-4 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search for jobs, companies, or titles..."
                            className="flex-1 px-2 py-4 text-gray-900 text-base focus:outline-none"
                        />
                        <button className="px-6 py-3 bg-primary-yellow text-primary-dark font-semibold hover:bg-yellow-500 transition">
                            Search
                        </button>
                    </div>

                    <SearchFilters />

                    {/* Job cards centered */}
                   <div className="mt-6 grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-4 relative">
  {/* Left: Job list */}
  <div className="flex flex-col items-center space-y-4">
    {homepageJobs.map((job) => (
      <div
        key={job.id}
        onClick={() => setSelectedJob(job)}
        className="cursor-pointer w-full max-w-3xl p-4 shadow-lg rounded-lg hover:shadow-xl transition border border-gray-100"
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{job.title}</h4>
            <p className="text-sm text-gray-600">
              {job.company} • {job.location}
            </p>
          </div>
          <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">
            New
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {job.categories.map((cat, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
            >
              {cat}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-700">
          {job.tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {job.visas.map((visa, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-medium"
            >
              {visa}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>

  {/* Right: Job details panel */}
  {selectedJob && (
    <JobDetailsPanel job={selectedJob} onClose={() => setSelectedJob(null)} />
  )}
</div>

                </div>
            </section>

            <FeaturesSection />
            <HowItWorks />
            <Testimonials />
            <FAQ />

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Find Your Dream Job?
                    </h2>
                    <p className="text-xl mb-8 text-gray-100">
                        Join thousands of Telugu professionals who've found their perfect role
                    </p>
                    <Link
                        to="/signup"
                        className="inline-block bg-primary-yellow text-primary-dark font-bold px-10 py-4 rounded-lg text-lg hover:bg-yellow-500 transition shadow-lg"
                    >
                        Get Access
                    </Link>
                    <p className="mt-4 text-sm text-gray-200">
                        Instant access • Cancel anytime
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Homepage;
