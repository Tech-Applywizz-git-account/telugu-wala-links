// import React, { useState } from 'react';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import { Briefcase, Heart, User, Settings, CreditCard, Search, Shield } from 'lucide-react';
// import AdminControls from '../components/AdminControls';
// import useAuth from "../hooks/useAuth";

// const Dashboard = () => {
//     const [activeTab, setActiveTab] = useState('search');
//     const { role } = useAuth();

//     // Mock role for now (remove when Supabase auth is linked)
//     const isAdmin = role === "admin"; 

//     const tabs = [
//         { id: 'search', label: 'Search Jobs', icon: Search },
//         { id: 'saved', label: 'Saved Jobs', icon: Heart },
//         { id: 'applied', label: 'Applied Jobs', icon: Briefcase },
//         { id: 'profile', label: 'Profile', icon: User },
//         { id: 'settings', label: 'Settings', icon: Settings },
//         { id: 'billing', label: 'Billing', icon: CreditCard },
//         ...(isAdmin ? [{ id: 'admin', label: 'Admin Controls', icon: Shield }] : [])
//     ];

//     return (
//         <div>
//             <Navbar />

//             <div className="min-h-screen bg-gray-50">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                     <div className="grid md:grid-cols-4 gap-8">

//                         {/* Sidebar */}
//                         <div className="md:col-span-1">
//                             <div className="card">
//                                 <nav className="space-y-2">
//                                     {tabs.map((tab) => (
//                                         <button
//                                             key={tab.id}
//                                             onClick={() => setActiveTab(tab.id)}
//                                             className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition ${
//                                                 activeTab === tab.id
//                                                     ? 'bg-primary-yellow text-primary-dark font-semibold'
//                                                     : 'text-gray-700 hover:bg-gray-100'
//                                             }`}
//                                         >
//                                             <tab.icon size={20} />
//                                             <span>{tab.label}</span>
//                                         </button>
//                                     ))}
//                                 </nav>
//                             </div>
//                         </div>

//                         {/* Main Content */}
//                         <div className="md:col-span-3">

//                             {/* Search Tab */}
//                             {activeTab === 'search' && (
//                                 <div>
//                                     <h2 className="text-2xl font-bold text-primary-dark mb-6">Search Jobs</h2>
//                                     <div className="card">
//                                         <p className="text-gray-600 mb-4">
//                                             Use the search bar at the top to find your next opportunity!
//                                         </p>
//                                         <a href="/jobs" className="inline-block btn-primary">
//                                             Start Job Search
//                                         </a>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Saved Tab */}
//                             {activeTab === 'saved' && (
//                                 <div>
//                                     <h2 className="text-2xl font-bold text-primary-dark mb-6">Saved Jobs</h2>
//                                     <div className="card">
//                                         <div className="text-center py-12">
//                                             <Heart size={48} className="mx-auto text-gray-300 mb-4" />
//                                             <p className="text-gray-600">No saved jobs yet</p>
//                                             <p className="text-sm text-gray-500 mt-2">
//                                                 Start browsing and save jobs you're interested in
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Applied Tab */}
//                             {activeTab === 'applied' && (
//                                 <div>
//                                     <h2 className="text-2xl font-bold text-primary-dark mb-6">Applied Jobs</h2>
//                                     <div className="card">
//                                         <div className="text-center py-12">
//                                             <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
//                                             <p className="text-gray-600">No applications yet</p>
//                                             <p className="text-sm text-gray-500 mt-2">
//                                                 Your job applications will appear here
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Profile Tab */}
//                             {activeTab === 'profile' && (
//                                 <div>
//                                     <h2 className="text-2xl font-bold text-primary-dark mb-6">Profile</h2>
//                                     <div className="card">
//                                         <form className="space-y-6">
//                                             <div className="grid md:grid-cols-2 gap-4">
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                         First Name
//                                                     </label>
//                                                     <input
//                                                         type="text"
//                                                         placeholder="John"
//                                                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
//                                                     />
//                                                 </div>
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                         Last Name
//                                                     </label>
//                                                     <input
//                                                         type="text"
//                                                         placeholder="Doe"
//                                                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow"
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </form>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Settings Tab */}
//                             {activeTab === 'settings' && (
//                                 <div>
//                                     <h2 className="text-2xl font-bold text-primary-dark mb-6">Settings</h2>
//                                     <div className="card">
//                                         <p className="text-gray-600">Settings will go here</p>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Billing Tab */}
//                             {activeTab === 'billing' && (
//                                 <div>
//                                     <h2 className="text-2xl font-bold text-primary-dark mb-6">Billing</h2>
//                                     <div className="card">
//                                         <p className="text-gray-600">Billing info will appear soon</p>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* 🛡️ Admin Controls Tab */}
//                             {activeTab === "admin" && isAdmin && (
//                                 <div>
//                                     <h2 className="text-2xl font-bold text-primary-dark mb-6">Admin Controls</h2>
//                                     <AdminControls />
//                                 </div>
//                             )}

//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <Footer />
//         </div>
//     );
// };

// export default Dashboard;



import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Briefcase,
  Heart,
  User,
  Settings,
  CreditCard,
  Search,
  Shield,
} from "lucide-react";
import AdminControls from "../components/AdminControls";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { role, loading } = useAuth();

  const isAdmin = role === "admin";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark"></div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Search },
    { id: "saved", label: "Saved Jobs", icon: Heart },
    { id: "applied", label: "Applied Jobs", icon: Briefcase },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "billing", label: "Billing", icon: CreditCard },
    ...(isAdmin ? [{ id: "admin", label: "Admin Controls", icon: Shield }] : []),
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* ------- Full Page Layout -------- */}
      <div className="flex flex-1">

        {/* ------- Sidebar ------- */}
        <aside className="w-64 fixed top-[80px] left-0 h-[calc(100vh-80px)] bg-white border-r border-gray-200 p-6 overflow-y-auto shadow-sm">

          <h2 className="text-lg font-semibold text-gray-700 mb-8">
            Telugu Wala Links
          </h2>

          <nav className="space-y-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all 
                    ${isActive
                      ? "bg-yellow-300 text-gray-900 font-semibold shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ------- Main Content Area ------- */}
        <main className="flex-1 ml-64 p-10 overflow-y-auto">

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Overview</h1>
              <p className="text-gray-600">Your job search stats will appear here.</p>
            </>
          )}

          {/* SAVED JOBS */}
          {activeTab === "saved" && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Saved Jobs</h1>
              <div className="bg-white p-10 rounded-lg shadow-md border text-center">
                <Heart size={45} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">No saved jobs yet.</p>
              </div>
            </>
          )}

          {/* APPLIED JOBS */}
          {activeTab === "applied" && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Applied Jobs</h1>
              <div className="bg-white p-10 rounded-lg shadow-md border text-center">
                <Briefcase size={45} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">No applications yet.</p>
              </div>
            </>
          )}

          {/* PROFILE */}
          {activeTab === "profile" && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <p className="text-gray-600">Profile form coming soon...</p>
              </div>
            </>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <p className="text-gray-600">Notification settings and account configuration.</p>
              </div>
            </>
          )}

          {/* BILLING */}
          {activeTab === "billing" && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Billing</h1>
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <p className="text-gray-600">Subscription and invoice history.</p>
              </div>
            </>
          )}

          {/* ADMIN TAB */}
          {activeTab === "admin" && isAdmin && (
            <>
              {/* <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Admin Controls
              </h1> */}
              <AdminControls />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
