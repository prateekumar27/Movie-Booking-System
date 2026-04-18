import BannerSlider from "../pages/UI/BannerSlider";
import MovieFilter from "../components/Movies/MovieFilter.jsx";
import MovieList from "../components/Movies/MovieList.jsx";
import { getAllMovies } from "../api/index.js";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const Movies = () => {
  const { data: allMovies, isError } = useQuery({
    queryKey: ["allMovies"],
    queryFn: async () => {
      return await getAllMovies();
    },
    placeholderData: keepPreviousData,
  });

  if (isError) return <p>Error</p>;
  return (
    <div>
      <BannerSlider />

      <div className="flex flex-col md:flex-row bg-[#f0fdf4] min-h-screen px-4 sm:px-8 md:px-12 lg:px-[100px] pb-10 pt-6 md:pt-8 gap-4 md:gap-6">
        <MovieFilter />
        <MovieList allMovies={allMovies} />
      </div>
    </div>
  );
};

export default Movies;
