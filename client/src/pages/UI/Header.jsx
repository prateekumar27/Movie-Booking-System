import React from "react";
import mainLogo from "../../assets/logo.png";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "../../context/LocationContext.jsx";
import map from "../../assets/pin.gif";
import { useNavigate } from "react-router-dom";
import Signin from "../UI/Signin.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { FaUser } from "react-icons/fa";

const Header = () => {
  const { location, loading, error } = useLocation();
  const { toggleModel, auth, user } = useAuth();
  const Navigate = useNavigate();
  console.log("current user:", user);

  return (
    <div className="w-full text-sm bg-white shadow-sm">
      {/* TOP NAVBAR */}
      <div className="px-3 md:px-6 lg:px-8 border-b border-[#dcfce7]">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto py-3 gap-2">
          {/* LEFT NAVBAR */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
            <img
              onClick={() => Navigate("/")}
              src={mainLogo}
              alt="logo"
              className="h-7 md:h-9 object-contain cursor-pointer shrink-0"
            />

            {/* Search — hidden on mobile, visible md+ */}
            <div className="relative flex-1 min-w-0 hidden md:block">
              <input
                type="text"
                placeholder="Search for Movies, Events, Plays, Sports and Activities"
                className="border border-[#bbf7d0] rounded-lg px-4 py-1.5 w-full text-sm outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent bg-[#f0fdf4] placeholder-gray-400"
              />
              <FaSearch className="absolute right-2 top-2.5 text-[#16a34a]" />
            </div>
          </div>

          {/* RIGHT NAVBAR */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Search icon on mobile only */}
            <FaSearch className="text-[#16a34a] md:hidden cursor-pointer text-base" />

            {/* Location */}
            <div className="text-sm cursor-pointer flex items-center text-gray-600">
              {location && (
                <img
                  src={map}
                  alt="location"
                  className="w-6 h-6 md:w-7 md:h-7"
                />
              )}
              {location && (
                <p className="hidden lg:block text-xs md:text-sm">
                  {location} &nbsp;
                </p>
              )}
            </div>

            {auth ? (
              <>
                <span
                  onClick={() => Navigate(`/profile/${user?._id}`)}
                  className="cursor-pointer text-sm font-medium border border-[#bbf7d0] rounded-full bg-[#f0fdf4] p-2 hover:bg-[#dcfce7] transition-colors"
                >
                  <FaUser className="text-[#16a34a]" />
                </span>
                <span
                  onClick={() => Navigate(`/profile/${user?._id}`)}
                  className="hidden sm:block text-sm font-normal cursor-pointer text-gray-700 hover:text-[#16a34a] transition-colors"
                >
                  Hi, {user?.name ?? "User"}
                </span>
              </>
            ) : (
              <button
                onClick={toggleModel}
                className="bg-[#16a34a] cursor-pointer text-white px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm hover:bg-[#15803d] transition-colors shadow-sm whitespace-nowrap"
              >
                Sign in
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search movies, events..."
              className="border border-[#bbf7d0] rounded-lg px-4 py-1.5 w-full text-sm outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent bg-[#f0fdf4] placeholder-gray-400"
            />
            <FaSearch className="absolute right-2 top-2.5 text-[#16a34a]" />
          </div>
        </div>
      </div>

      {/* BOTTOM NAVBAR */}
      <div className="bg-[#f0fdf4] px-3 md:px-6 lg:px-8 overflow-x-auto border-b border-[#dcfce7] scrollbar-hide">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center py-2 text-gray-600">
          {/* Nav links - scrollable on mobile */}
          <div className="flex items-center space-x-4 md:space-x-6 font-medium text-xs md:text-sm overflow-x-auto scrollbar-hide">
            <div
              onClick={() => Navigate("/movies")}
              className="cursor-pointer hover:text-[#16a34a] whitespace-nowrap transition-colors"
            >
              Movies
            </div>
            <div className="cursor-pointer hover:text-[#16a34a] whitespace-nowrap transition-colors">
              Stream
            </div>
            <div className="cursor-pointer hover:text-[#16a34a] whitespace-nowrap transition-colors">
              Events
            </div>
            <div className="cursor-pointer hover:text-[#16a34a] whitespace-nowrap transition-colors">
              Plays
            </div>
            <div className="cursor-pointer hover:text-[#16a34a] whitespace-nowrap transition-colors">
              Sports
            </div>
            <div className="cursor-pointer hover:text-[#16a34a] whitespace-nowrap transition-colors">
              Activities
            </div>
          </div>

          {/* Right links - hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-6 text-sm text-gray-500 shrink-0">
            <span className="cursor-pointer hover:text-[#16a34a] hover:underline transition-colors whitespace-nowrap">
              List Your Show
            </span>
            <span className="cursor-pointer hover:text-[#16a34a] hover:underline transition-colors">
              Corporate
            </span>
            <span className="cursor-pointer hover:text-[#16a34a] hover:underline transition-colors">
              Offers
            </span>
            <span className="cursor-pointer hover:text-[#16a34a] hover:underline transition-colors">
              Gifts
            </span>
          </div>
        </div>
      </div>

      <Signin />
    </div>
  );
};

export default Header;
