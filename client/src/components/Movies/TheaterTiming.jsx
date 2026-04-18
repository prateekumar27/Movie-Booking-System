import dayjs from "dayjs";
import { useState } from "react";
// import { theatres } from "../../utils/constants";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getShowsByMovieAndLocation } from "../../api/index.js";
import { useLocation } from "../../context/LocationContext.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const TheaterTiming = ({ movieId }) => {
  const navigate = useNavigate();
  const { location } = useLocation();
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today);
  const { auth, toggleModel } = useAuth();

  const formattedDate = selectedDate.format("DD-MM-YYYY");

  const next7days = Array.from({ length: 7 }, (_, i) => today.add(i, "day"));

  const {
    data: showData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["show", movieId, location, formattedDate],
    queryFn: () => getShowsByMovieAndLocation(movieId, location, formattedDate),
    placeholderData: keepPreviousData,
    enabled: !!movieId && !!location, // 👈 wait for location
  });

  console.log(showData);

  // Use API data instead of hardcoded constants
  const shows = showData?.data || [];

  if (isLoading) return <p>Loading shows...</p>;
  if (isError) return <p>Error loading shows</p>;

  return (
    <div>
      <div className="border mt-2 border-[#dcfce7] w-full"></div>

      {/* Date Selector */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4 overflow-x-auto py-3 sm:py-4 px-2 scrollbar-hide">
        {next7days.map((date, i) => {
          const isSelected =
            selectedDate.format("YYYY-MM-DD") === date.format("YYYY-MM-DD");
          return (
            <button
              key={i}
              onClick={() => setSelectedDate(date)}
              className={`flex cursor-pointer flex-col border items-center px-2 sm:px-3 py-2 rounded-lg min-w-[44px] sm:min-w-[50px] flex-shrink-0 transition-colors ${
                isSelected
                  ? "bg-[#16a34a] text-white font-semibold border-[#15803d] shadow-sm"
                  : "border-[#bbf7d0] hover:bg-[#f0fdf4] text-gray-700 hover:border-[#16a34a]"
              }`}
            >
              <span className="text-sm font-black">{date.format("D")}</span>
              <span className="text-xs">{date.format("ddd")}</span>
              <span className="text-[10px]">
                {date.format("MMM").toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Theater Shows */}
      <div className="space-y-6 sm:space-y-8 px-2 sm:px-4 mb-8 sm:mb-10">
        {shows.length === 0 ? (
          <p className="text-[#15803d] text-sm px-4 py-4 bg-[#f0fdf4] rounded-lg border border-[#dcfce7]">
            No shows available for this date.
          </p>
        ) : (
          shows.map((group, i) => (
            <div key={i} className="border-b border-[#dcfce7] pb-4 sm:pb-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                {group.theater?.theaterDetails?.logo && (
                  <img
                    src={group.theater.theaterDetails.logo}
                    alt="logo"
                    className="w-7 h-7 sm:w-8 sm:h-8 object-contain flex-shrink-0"
                  />
                )}
                <div>
                  <p className="font-semibold text-xs sm:text-sm text-gray-800">
                    {group.theater?.theaterDetails?.name}
                  </p>
                  <p className="text-xs text-[#16a34a] font-medium">
                    ✓ Allows Cancellation
                  </p>
                </div>
              </div>

              {/* Show timings */}
              <div className="flex flex-wrap gap-2 sm:gap-3 ml-0 sm:ml-11">
                {group.theater?.shows?.map((show, j) => {
                  const movieId = group.movie?._id;
                  const movieName = group.movie?.title;
                  const theaterId = group.theater?.theaterDetails?._id;

                  return (
                    <button
                      key={j}
                      onClick={() => {
                        if (!auth) {
                          toggleModel();
                          return;
                        }
                        navigate(
                          `/movies/${movieId}/${movieName}/${location}/theater/${theaterId}/show/${show._id}/seat-layout`,
                        );
                      }}
                      className="border border-[#bbf7d0] px-6 sm:px-10 md:px-12 py-2 text-sm rounded-[16px] flex flex-col items-center justify-center hover:bg-[#f0fdf4] hover:border-[#16a34a] cursor-pointer transition-colors bg-white shadow-sm"
                    >
                      <span className="leading-tight font-semibold text-[#15803d] text-xs sm:text-sm">
                        {show.startTime}
                      </span>
                      <span className="text-[10px] text-[#16a34a] font-black">
                        {show.format}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TheaterTiming;
