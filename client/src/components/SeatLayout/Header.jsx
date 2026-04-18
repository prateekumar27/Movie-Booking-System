import React from "react";
import mainLogo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAuth } from "../../context/AuthContext";
import { FaUser } from "react-icons/fa";

dayjs.extend(customParseFormat);
const Header = ({ showData, type }) => {
  const navigate = useNavigate();
  // console.log("full showData:", JSON.stringify(showData, null, 2))

  const { auth, user } = useAuth();
  return (
    <>
      <div className="border-b border-[#dcfce7] shadow-sm bg-white">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3 sm:py-4 px-3 sm:px-6 gap-2">
          {/* Logo */}
          <img
            onClick={() => navigate("/")}
            src={mainLogo}
            alt="logo"
            className="h-5 sm:h-6 md:h-8 object-contain cursor-pointer flex-shrink-0"
          />

          {type === "checkout" ? (
            <div className="flex-1 text-center">
              <h2 className="font-bold text-gray-900 text-sm sm:text-lg md:text-xl">
                Review your booking
              </h2>
            </div>
          ) : (
            <div className="text-center flex-1 min-w-0 px-2">
              <h2 className="font-bold text-sm sm:text-lg md:text-xl text-gray-800 truncate">
                {showData?.movie.title}
              </h2>
              <p className="text-xs text-[#16a34a] font-semibold line-clamp-2 sm:line-clamp-1">
                {dayjs(showData?.startTime, "hh:mm A").format(
                  "ddd, MMM DD, h:mm A",
                )}
                {" at "}
                {showData?.theater?.name +
                  ", " +
                  showData?.theater?.city +
                  ", " +
                  showData?.theater?.state}
              </p>
            </div>
          )}

          {auth ? (
            <div className="flex items-center flex-shrink-0">
              <span className="cursor-pointer text-sm font-medium border border-[#bbf7d0] rounded-full bg-[#f0fdf4] p-2 hover:bg-[#dcfce7] transition-colors">
                <FaUser className="text-[#16a34a]" />
              </span>
              <span
                onClick={() => navigate(`/profile/${user?._id}/profile`)}
                className="text-sm ml-2 sm:ml-3 font-normal cursor-pointer text-gray-700 hover:text-[#16a34a] transition-colors hidden sm:inline"
              >
                Hi, {user?.name ?? "User"}
              </span>
            </div>
          ) : (
            <button
              onClick={() => toggleModal()}
              className="bg-[#16a34a] flex-shrink-0 cursor-pointer text-white px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm hover:bg-[#15803d] transition-colors"
            >
              Sign in
            </button>
          )}
        </div>
      </div>

      {/* Show Timing */}
      {type !== "checkout" && (
        <>
          <div className="bg-white pt-3 sm:pt-4">
            <div className="mx-auto px-3 sm:px-6 flex items-center gap-3 sm:gap-4 max-w-7xl">
              <div className="text-sm">
                <p className="text-xs sm:text-sm text-[#16a34a] font-medium">
                  {dayjs(showData?.date, "DD-MM-YYYY").format("ddd")}
                </p>
                <p className="text-xs sm:text-sm text-gray-700 font-medium">
                  {dayjs(showData?.date, "DD-MM-YYYY").format("DD MMMM")}
                </p>
              </div>

              <button className="border cursor-pointer rounded-[14px] px-4 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm border-[#16a34a] font-medium bg-[#f0fdf4] text-[#15803d] hover:bg-[#dcfce7] transition-colors">
                {showData?.startTime}
              </button>
            </div>
          </div>
          <hr className="my-2 border-[#dcfce7] max-w-7xl mx-auto" />
        </>
      )}
    </>
  );
};

export default Header;
