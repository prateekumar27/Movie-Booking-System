import { useEffect, useState } from "react";
import { tabs } from "../utils/constants";
import { IoMdAdd } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import BookingHistory from "../components/Profile/BookingHistory";
import { useAuth } from "../context/AuthContext";
import { useParams, useSearchParams } from "react-router-dom";

const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams(); // ✅
  const activeTab = searchParams.get("tab") || "profile"; // ✅

  const { user, logoutUser } = useAuth();

  const handleLogout = () => logoutUser();

  const handleTabChange = (tab) => {
    setSearchParams({ tab }); // ✅ updates URL like /profile/:id?tab=booking
  };

  return (
    <>
      {/* Tabs */}
      <div className="bg-white border-b border-[#bbf7d0]">
        <div className="max-w-7xl mx-auto flex gap-4 md:gap-6 py-3 text-sm font-medium px-4 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`pb-1 cursor-pointer transition-colors duration-200 whitespace-nowrap ${
                activeTab === tab
                  ? "text-[#16a34a] border-b-2 border-[#16a34a]"
                  : "text-gray-500 hover:text-[#16a34a]"
              }`}
            >
              {tab.toLocaleUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-screen py-6 md:py-10 px-3 md:px-4 bg-[#f0fdf4]">
        <div className="max-w-6xl mx-auto">
          {activeTab === "profile" && (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-[#15803d] to-[#16a34a] rounded-t-xl px-4 md:px-6 py-6 md:py-8 flex items-center gap-4 md:gap-6 text-white shadow-sm">
                <div className="relative w-16 h-16 md:w-20 md:h-20 border-4 border-white bg-white text-[#16a34a] rounded-full flex items-center justify-center shadow shrink-0">
                  <IoMdAdd size={20} />
                </div>
                <div className="mt-1 md:mt-2">
                  <h2 className="text-xl md:text-2xl font-bold">
                    Hi, {user?.name}
                  </h2>
                  <small
                    onClick={handleLogout}
                    className="underline cursor-pointer opacity-90 hover:opacity-100 flex items-center gap-1 mt-1"
                  >
                    <IoIosLogOut size={16} className="inline mr-1" />
                    Logout
                  </small>
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-white px-4 md:px-6 py-5 md:py-6 rounded-b-xl shadow-sm border border-[#dcfce7]">
                <h3 className="text-lg font-semibold mb-4 text-[#15803d]">
                  Account Details
                </h3>

                {/* Email Row */}
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-[#f0fdf4] gap-2">
                  <p className="text-sm font-normal text-gray-500 shrink-0">
                    Email Address
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-gray-700 text-sm break-all">
                      {user?.email}
                    </span>
                    <span className="text-[#15803d] text-xs bg-[#dcfce7] rounded-full px-2 py-0.5">
                      Verified
                    </span>
                  </div>
                  <FiEdit className="text-[#16a34a] cursor-pointer hover:text-[#15803d] shrink-0" />
                </div>

                {/* Phone Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-2">
                  <p className="text-sm font-normal text-gray-500 shrink-0">
                    Mobile Number
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 text-sm">
                      +91-{user?.phone || "1234567890"}
                    </span>
                    <span className="text-[#15803d] text-xs bg-[#dcfce7] rounded-full px-2 py-0.5">
                      Verified
                    </span>
                  </div>
                  <FiEdit className="text-[#16a34a] cursor-pointer hover:text-[#15803d] shrink-0" />
                </div>
              </div>

              {/* Personal Details */}
              <div className="bg-white p-4 md:p-6 mt-4 rounded-xl shadow-sm border border-[#dcfce7]">
                <h3 className="text-lg font-semibold mb-4 text-[#15803d]">
                  Personal Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-normal text-gray-500">
                      Name
                    </label>
                    <input
                      type="text"
                      value={user?.name || "Prateek Kumar"}
                      readOnly
                      className="w-full mt-1 border border-[#bbf7d0] rounded-lg px-3 py-2 bg-[#f0fdf4] text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-normal text-gray-500">
                      Birthday (Optional)
                    </label>
                    <input
                      type="date"
                      className="w-full mt-1 border border-[#bbf7d0] rounded-lg px-3 py-2 bg-[#f0fdf4] text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-normal text-gray-500">
                      Identity (optional)
                    </label>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <button className="px-4 py-1.5 text-sm border border-[#bbf7d0] rounded-lg bg-white text-gray-600 hover:bg-[#dcfce7] hover:border-[#16a34a] hover:text-[#15803d] transition-colors">
                        Women
                      </button>
                      <button className="px-4 py-1.5 text-sm border border-[#bbf7d0] rounded-lg bg-white text-gray-600 hover:bg-[#dcfce7] hover:border-[#16a34a] hover:text-[#15803d] transition-colors">
                        Man
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-normal text-gray-500">
                      Married (optional)
                    </label>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <button className="px-4 py-1.5 text-sm border border-[#bbf7d0] rounded-lg bg-white text-gray-600 hover:bg-[#dcfce7] hover:border-[#16a34a] hover:text-[#15803d] transition-colors">
                        Yes
                      </button>
                      <button className="px-4 py-1.5 text-sm border border-[#bbf7d0] rounded-lg bg-white text-gray-600 hover:bg-[#dcfce7] hover:border-[#16a34a] hover:text-[#15803d] transition-colors">
                        No
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "booking" && <BookingHistory />}
        </div>
      </div>
    </>
  );
};

export default Profile;
