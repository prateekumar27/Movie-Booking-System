// import { movies } from "../../utils/constants";
import { useQuery } from "@tanstack/react-query";
import { getRecommendedMovies } from "../../api/index.js";
import { useNavigate } from "react-router-dom";
import { useLocation } from "../../context/LocationContext.jsx";

const Recommended = () => {
  const navigate = useNavigate();
  const { location } = useLocation();

  // ✅ Clean and simple
  const handleNavigate = (movie) => {
    const sanitizedTitle = movie.title
      .replace(/\s+/g, "-") // spaces → dashes
      .replace(/:/g, ""); // remove colons

    navigate(`/movies/${location}/${sanitizedTitle}/${movie._id}/ticket`, {
      state: { movie, location },
    });
  };

  const {
    data: movies,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recommendedMovies"],
    queryFn: getRecommendedMovies,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  console.log(movies);

  return (
    <div className="w-full py-4 sm:py-6 bg-[#f0fdf4]">
      <div className="max-w-screen-xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
            Recommended Movies
          </h2>
          <span
            onClick={() => navigate("/movies")}
            className="text-xs sm:text-sm text-[#16a34a] cursor-pointer hover:underline font-medium hover:text-[#15803d] transition-colors"
          >
            See All
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {movies?.map((movie, i) => (
            <div
              key={i}
              onClick={() => handleNavigate(movie)}
              className="rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 bg-white border border-[#dcfce7] hover:border-[#16a34a] hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-[180px] sm:h-[220px] md:h-[250px] lg:h-[280px] object-cover"
                />
                {/* Rating overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#052e16]/75 text-white text-xs px-2 py-1.5 flex items-center justify-between">
                  <span className="text-[#4ade80]">⭐ {movie.rating}/10</span>
                  <span className="text-gray-300 hidden sm:inline">
                    {movie.votes} Votes
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="px-2 py-2 sm:py-3">
                <h3 className="font-semibold text-xs sm:text-sm leading-tight line-clamp-2 text-gray-800">
                  {movie.title}
                </h3>
                <p className="text-xs text-[#16a34a] mt-1 font-medium line-clamp-1">
                  {movie.genre.join(" | ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommended;
