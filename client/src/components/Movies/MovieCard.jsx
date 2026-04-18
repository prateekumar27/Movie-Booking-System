import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  console.log("movie:", movie);

  const navigate = useNavigate();
  const { location } = useLocation();
  const handleNavigate = (movie) => {
    const sanitizedTitle = movie.title
      .replace(/\s+/g, "-") // spaces → dashes
      .replace(/:/g, ""); // remove colons

    navigate(`/movies/${location}/${sanitizedTitle}/${movie._id}/ticket`, {
      state: { movie, location },
    });
  };

  return (
    <div
      onClick={() => handleNavigate(movie)}
      className="w-full cursor-pointer group"
    >
      <div className="relative overflow-hidden rounded-xl border border-[#dcfce7] shadow-sm group-hover:shadow-md group-hover:border-[#16a34a] transition-all duration-200">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="rounded-xl w-full h-[180px] sm:h-[220px] md:h-[260px] object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-[#052e16]/70 px-2 py-1 flex items-center justify-between text-xs">
          <span className="text-[#4ade80]">⭐ {movie.rating}</span>
          <span className="text-gray-300 hidden sm:inline">{movie.votes}</span>
        </div>
      </div>

      <p className="font-semibold mt-2 text-xs sm:text-sm text-gray-800 line-clamp-1">
        {movie.title}
      </p>
      <p className="text-xs text-[#16a34a] font-medium mt-0.5">{movie.age}</p>
      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
        {movie.languages.join(" | ")}
      </p>
    </div>
  );
};

export default MovieCard;
