import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Lock, 
    Briefcase, 
    ChevronRight, 
    CheckCircle, 
    ExternalLink, 
    Search,
    Loader2
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import JobCard from './JobCard';

const TeaserDashboard = () => {
    const navigate = useNavigate();
    const [teaserJobs, setTeaserJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeaserJobs = async () => {
            setLoading(true);
            try {
                console.log("📡 Attempting to fetch teaser jobs...");
                
                // Try to find the correct sorting column
                const { data, error } = await supabase
                    .from('job_jobrole_all')
                    .select('*')
                    .limit(1);

                if (error) throw error;

                // Determine best column for sorting based on what's available
                const availableColumns = data && data.length > 0 ? Object.keys(data[0]) : [];
                const sortColumn = availableColumns.includes('upload_date') ? 'upload_date' : 
                                  availableColumns.includes('created_at') ? 'created_at' : 
                                  availableColumns.includes('date_posted') ? 'date_posted' : null;

                console.log("📍 Recommended sort column:", sortColumn);

                let query = supabase.from('job_jobrole_all').select('*').limit(4);
                
                if (sortColumn) {
                    query = query.order(sortColumn, { ascending: false });
                }

                const { data: finalData, error: finalError } = await query;

                if (finalError) throw finalError;

                console.log("✅ Final teaser jobs fetched:", finalData?.length);
                setTeaserJobs(finalData || []);
            } catch (err) {
                console.error('❌ Error in teaser fetch:', err);
                
                // Final fallback: try just ANY data from the table
                try {
                    const { data } = await supabase.from('job_jobrole_all').select('*').limit(4);
                    if (data && data.length > 0) setTeaserJobs(data);
                } catch (innerErr) {
                    console.error('💥 Complete failure:', innerErr);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTeaserJobs();
    }, []);

    const features = [
        "500,000+ Verified Open Roles",
        "Direct HR & Recruiter Application Links",
        "Visa Sponsorship Filter (H-1B, OPT, CPT)",
        "Daily Job Updates & Alerts",
        "Detailed Salary Insights"
    ];

    // Skeleton card shown inline — no full-page blocking spinner
    const SkeletonCard = () => (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
            </div>
        </div>
    );

    return (
        <div className="space-y-12 animate-fadeIn">
            {/* 1. Dashboard Preview Section (Now at the top) */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <Search className="w-6 h-6 text-indigo-600" />
                            Recent Opportunities Preview
                        </h3>
                        <p className="text-gray-500 mt-1">Here's a sample of what's waiting for you.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {loading ? (
                        // Show 4 skeleton placeholders while jobs load
                        [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)
                    ) : teaserJobs.length > 0 ? (
                        teaserJobs.map((job) => (
                            <div key={job.id} className="relative group transition-all duration-300">
                                {/* Clicking on the job card itself also takes them to the payment in the teaser */}
                                <JobCard 
                                    job={job} 
                                    onSaveToggle={() => navigate('/payment')}
                                    onApplyToggle={() => navigate('/payment')}
                                />
                            </div>
                        ))
                    ) : (
                        // Fallback message if no jobs are found in the database
                        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium font-outfit">No jobs available at the moment. Please check back later.</p>
                        </div>
                    )}
                </div>

                {/* Bottom CTA moved below the jobs but above the banner */}
                <div className="bg-gray-50 rounded-3xl p-6 sm:p-10 text-center border-2 border-dashed border-gray-300 hover:border-indigo-300 transition-colors group">
                    <div className="max-w-md mx-auto">
                        <div className="bg-white w-20 h-20 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <Briefcase className="w-10 h-10 text-indigo-500" />
                        </div>
                        <h4 className="text-2xl font-extrabold text-gray-900 mb-2">Want to see more?</h4>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            We have thousands of jobs in Data Science, Software Engineering, Nursing, and more from Top US Companies.
                        </p>
                        <button
                            onClick={() => navigate('/payment')}
                            className="w-full bg-white border-2 border-indigo-600 text-indigo-600 font-bold py-4 px-8 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                        >
                            Get Access to All Full Jobs
                            <ExternalLink className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Promo Banner (Now in the middle) */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-2xl text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm mb-4">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                            LIMITED PREVIEW ACTIVE
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-outfit leading-tight">
                            Unlock Full Access to All <br/>
                            <span className="text-yellow-400">Visa Sponsored Jobs</span>
                        </h2>
                        <p className="text-indigo-100 text-lg mb-6 leading-relaxed">
                            You are currently viewing a limited preview. To access all 500k+ jobs and direct apply links, complete your membership setup.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                            {features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm font-medium text-indigo-50">
                                    <CheckCircle className="w-4 h-4 text-yellow-400" />
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate('/payment')}
                            className="bg-yellow-400 text-indigo-950 font-black px-10 py-4 rounded-2xl hover:bg-white transition-all shadow-lg hover:shadow-yellow-400/20 active:scale-95 flex items-center justify-center gap-3 text-lg"
                        >
                            Unlock Full Access Now
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <div className="hidden lg:block">
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-inner">
                            <Lock className="w-32 h-32 text-yellow-400 drop-shadow-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeaserDashboard;
