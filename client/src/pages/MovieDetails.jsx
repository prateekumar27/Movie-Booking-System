// import m4 from "../assets/m4.avif";
import TheaterTiming from "../components/Movies/TheaterTiming";
import { useQuery } from "@tanstack/react-query";
import { getMovieById } from "../api/index";
import { useParams } from "react-router-dom";

// const movie = {
//   id: 4,
//   title: "F1: The Movie",
//   genre: ["Action", "Drama", "Sports"],
//   rating: 9.5,
//   votes: "6.8K",
//   img: m4,
//   languages: ["Hindi", "English", "English 7D", "Bengali", "Malayalam"],
//   certification: "UA16+",
//   format: ["2D", "3D", "4D", "IMAX"],
//   duration: "2h 30m",
//   releaseDate: "10 Apr 2023",
//   description:
//     "The ultimate motorsport experience comes to the big screen. When a former Formula 1 driver is pulled out of retirement to mentor a rookie teammate, they must push the limits of speed, skill, and sacrifice to take on the world's greatest racing teams. Filmed live at actual F1 races across the globe, this is the most authentic racing film ever made.",
// };

const MovieDetails = () => {
  const { id } = useParams();
  console.log("id from params:", id);
  const {
    data: movie,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieById(id),
  });

  if (isLoading || !movie) return <p>Loading...</p>;

  // console.log("movie:", movie);
  // console.log("error:", error);
  // console.log("isLoading:", isLoading);

  return (
    <>
      {/* Movie Details Section */}
      <div
        className="relative text-white font-sans px-4 sm:px-8 md:px-16 lg:px-30 py-8 md:py-10"
        style={{
          backgroundImage: `url(${movie.posterUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#052e16] opacity-75"></div>

        {/* Share Button */}
        <div className="absolute top-3 right-3 md:top-4 md:right-4 z-20 cursor-pointer">
          <button className="cursor-pointer bg-[#14532d] border border-[#16a34a] px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm flex items-center gap-2 hover:bg-[#166534] transition-colors">
            Share
          </button>
        </div>

        {/* Actual Content */}
        <div className="relative z-10 max-w-screen-xl mx-auto flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Movie Poster — hidden on small, shown md+ */}
          <div className="flex justify-center md:justify-start shrink-0">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-32 sm:w-40 md:w-52 shadow-2xl rounded-xl border-2 border-[#4ade80]"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-start flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className="bg-[#14532d] px-3 md:px-4 py-2 rounded-md flex items-center gap-2 text-xs md:text-sm border border-[#16a34a]">
                <span className="text-[#4ade80] font-bold">{movie.rating}</span>
                <span className="text-gray-300">{movie.votes}</span>
                <button className="cursor-pointer bg-[#166534] ml-3 md:ml-6 px-3 md:px-4 py-1.5 md:py-2 rounded-md hover:bg-[#15803d] transition-colors text-xs md:text-sm">
                  Rate now
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm mb-3 md:mb-4">
              <span className="px-3 py-1 bg-[#14532d] border border-[#16a34a] rounded-lg">
                {movie.format.join(" | ")}
              </span>
              <span className="px-3 py-1 bg-[#14532d] border border-[#16a34a] rounded-lg">
                {movie.languages.join(" | ")}
              </span>
            </div>

            <p className="text-xs md:text-sm text-gray-300 mb-3 md:mb-4 leading-relaxed">
              {movie?.duration}
              <span className="mx-2 text-[#4ade80]">•</span>
              {movie.genre.join(", ")}
              <span className="mx-2 text-[#4ade80]">•</span>
              {movie.certification}
              <span className="mx-2 text-[#4ade80]">•</span>
              {movie.releaseDate}
            </p>

            <div>
              <h2 className="text-lg md:text-xl font-bold mb-2 text-[#4ade80]">
                About the movie
              </h2>
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed mb-4 line-clamp-4 md:line-clamp-none">
                {movie.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Format Filter */}
      <div className="bg-white border-b border-[#dcfce7] flex flex-col items-center">
        <div className="flex flex-wrap gap-2 px-4 md:px-6 py-4 justify-center md:justify-start w-full max-w-screen-xl mx-auto">
          {[
            "2D",
            "3D",
            "Wheelchair Friendly",
            "Premium Seats",
            "Recliners",
            "IMAX",
            "PVR PXL",
            "4DX",
            "Laser",
            "Dolby Atmos",
          ].map((format, i) => (
            <button
              key={i}
              className="px-3 md:px-4 rounded-xl py-1 md:py-1.5 text-xs md:text-sm border border-[#bbf7d0] text-[#15803d] hover:bg-[#dcfce7] hover:border-[#16a34a] cursor-pointer bg-white transition-colors"
            >
              {format}
            </button>
          ))}
        </div>

        <div className="border-t pb-2 border-[#dcfce7] w-full max-w-screen-xl px-4"></div>

        {/* Availability Legend */}
        <div className="w-full max-w-screen-xl flex flex-wrap gap-3 md:gap-6 px-4 md:px-6 py-2 bg-[#f0fdf4] text-xs md:text-sm text-gray-600 border border-[#dcfce7] mx-4 rounded-lg mb-2">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] inline-block"></span>
            Available
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block"></span>
            Filling fast
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
            Almost full
          </span>
        </div>

        {/* Theater and Showtimes */}
        <TheaterTiming movieId={id} />
      </div>
    </>
  );
};

export default MovieDetails;
