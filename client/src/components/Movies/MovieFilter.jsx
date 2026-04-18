import React from "react";
import { languages } from "../../utils/constants.js";

const MovieFilter = () => {
  return (
    <div className="w-full md:w-1/4 p-3 sm:p-4 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between md:block">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Filters
        </h2>
        {/* Mobile: collapsible hint */}
        <span className="text-xs text-[#16a34a] md:hidden font-medium">
          Tap to expand
        </span>
      </div>

      <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#dcfce7] shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-sm sm:text-base text-gray-700">
            Language
          </span>
          <button className="text-[#16a34a] text-xs sm:text-sm hover:text-[#15803d] transition-colors">
            Clear
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {languages.map((lang, i) => (
            <span
              key={i}
              className="border border-[#bbf7d0] text-[#15803d] px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg hover:bg-[#dcfce7] hover:border-[#16a34a] cursor-pointer transition-colors"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#dcfce7] shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-sm sm:text-base text-gray-700">
            Genres
          </span>
          <button className="text-[#16a34a] text-xs sm:text-sm hover:text-[#15803d] transition-colors">
            Clear
          </button>
        </div>
      </div>

      <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#dcfce7] shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-sm sm:text-base text-gray-700">
            Format
          </span>
          <button className="text-[#16a34a] text-xs sm:text-sm hover:text-[#15803d] transition-colors">
            Clear
          </button>
        </div>
      </div>

      <button className="w-full border cursor-pointer border-[#16a34a] text-[#16a34a] py-2 rounded-xl hover:bg-[#16a34a] hover:text-white transition-colors font-medium shadow-sm text-sm sm:text-base">
        Browse by Cinemas
      </button>
    </div>
  );
};

export default MovieFilter;
