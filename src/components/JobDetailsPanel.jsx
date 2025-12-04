
import React, { useState, useEffect } from "react";
import { X, Bookmark, BookmarkCheck, MapPin, Briefcase, GraduationCap } from "lucide-react";

const JobDetailsPanel = ({ job, onClose }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  // Restore saved/applied state per job
  useEffect(() => {
    if (!job) return;
    setIsSaved(localStorage.getItem(`saved-${job.id}`) === "true");
    setIsApplied(localStorage.getItem(`applied-${job.id}`) === "true");
  }, [job]);

  const handleSave = () => {
    const newState = !isSaved;
    setIsSaved(newState);
    localStorage.setItem(`saved-${job.id}`, newState);
  };

  const handleApply = () => {
    setIsApplied(true);
    localStorage.setItem(`applied-${job.id}`, true);

    // placeholder link - later replace with real URL from backend
    window.open("https://www.indeed.com", "_blank");
  };

  if (!job) return null;

  return (
    <div className="fixed md:static top-0 right-0 w-full md:w-[430px] h-full bg-white shadow-2xl border-l border-gray-200 z-50 animate-slide-in flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b bg-white">
        <h2 className="font-semibold text-gray-900 text-lg">{job.title}</h2>
        <button onClick={onClose}>
          <X className="text-gray-500 hover:text-black" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="p-5 overflow-y-auto flex-1 space-y-6">

        {/* Company + Location */}
        <div>
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900 text-lg">{job.company}</h4>
            <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">
              New
            </span>
          </div>

          <p className="flex items-center text-gray-500 text-sm mt-1">
            <MapPin size={16} className="mr-1" /> {job.location}
          </p>
        </div>

        {/* Tags */}
        <div>
          <h5 className="text-sm font-semibold text-gray-800 mb-2">Role Type</h5>
          <div className="flex flex-wrap gap-2">
            {job.tags?.map((tag, i) => (
              <span key={i} className="border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs bg-gray-50">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h5 className="text-sm font-semibold text-gray-800 mb-2">Categories</h5>
          <div className="flex flex-wrap gap-2">
            {job.categories?.map((cat, i) => (
              <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Visa Support */}
        <div>
          <h5 className="text-sm font-semibold text-gray-800 mb-2">Visa Support</h5>
          <div className="flex flex-wrap gap-2">
            {job.visas?.map((v, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-medium"
              >
                {v}
              </span>
            ))}
          </div>
        </div>

        {/* About the job */}
        <div>
          <h5 className="text-sm font-semibold mb-2">About This Role</h5>
          <p className="text-gray-600 text-sm leading-relaxed">
            This is a placeholder job description text. Later, this will be replaced with real job
            details fetched from your backend or API. The layout here is designed to match Migratemate’s
            UI — clean, scrollable, and structured for readability.
          </p>
        </div>

      </div>

      {/* Footer Buttons */}
      <div className="border-t px-5 py-3 bg-white flex gap-3">

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg border text-sm font-medium transition ${isSaved
              ? "bg-purple-600 text-white border-purple-600"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
        >
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          {isSaved ? "Saved" : "Save Job"}
        </button>

        {/* Apply Button */}
        <button
          onClick={handleApply}
          className={`flex-1 py-2 rounded-lg text-white text-sm font-semibold transition ${isApplied ? "bg-green-600" : "bg-purple-600 hover:bg-purple-700"
            }`}
        >
          {isApplied ? "Applied ✓" : "Apply Now"}
        </button>
      </div>
    </div>
  );
};

export default JobDetailsPanel;
