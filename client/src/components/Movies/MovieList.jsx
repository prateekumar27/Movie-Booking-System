import React from "react";
import { languages } from "../../utils/constants";
import MovieCard from "./MovieCard";

const MovieList = ({ allMovies }) => {
  return (
    <div className="w-full md:w-3/4">
      {/* Language filters */}
      <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
        {languages.map((lang, i) => (
          <span
            key={i}
            className="border bg-white border-[#bbf7d0] text-[#15803d] px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md hover:bg-[#dcfce7] hover:border-[#16a34a] cursor-pointer transition-colors"
          >
            {lang}
          </span>
        ))}
      </div>

      {/* Coming Soon banner */}
      <div className="flex justify-between items-center bg-white px-3 sm:px-6 py-4 sm:py-6 rounded-xl mb-4 sm:mb-6 border border-[#dcfce7] shadow-sm gap-2">
        <h3 className="font-semibold text-base sm:text-xl text-gray-800 whitespace-nowrap">
          Coming Soon
        </h3>

        <a
          href="#"
          className="text-[#16a34a] text-xs sm:text-sm font-medium flex items-center hover:text-[#15803d] hover:underline transition-colors text-right"
        >
          Explore Upcoming Movies
        </a>
      </div>

      {/* Movie Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 sm:gap-6">
        {allMovies?.map((movie, i) => (
          <MovieCard key={i} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieList;
