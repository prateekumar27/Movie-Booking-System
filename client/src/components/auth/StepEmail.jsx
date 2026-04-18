import React from "react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { BeatLoader } from "react-spinners";

const StepEmail = ({ onNext }) => {
  const [email, setEmail] = useState("");

  const { sendOtpRequest, otpLoader } = useAuth();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email) return;

    sendOtpRequest({ email, onNext });
  };
  return (
    <div className="flex flex-col gap-3 px-4 sm:px-8 md:px-10 py-4 sm:py-6">
      <h2 className="text-center text-base sm:text-lg font-semibold text-gray-800">
        Enter your email
      </h2>
      <p className="text-center text-xs sm:text-sm text-gray-500">
        If you don't have an account, we'll create one for you
      </p>

      <div className="flex items-center border rounded-xl border-[#bbf7d0] px-3 sm:px-4 py-2.5 sm:py-3 bg-[#f0fdf4] focus-within:ring-2 focus-within:ring-[#16a34a] focus-within:border-transparent transition-all">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-grow outline-none text-sm sm:text-base bg-transparent text-gray-700 placeholder-gray-400"
          required
        />
      </div>

      <button
        type="submit"
        onClick={handleSendOtp}
        className="w-full cursor-pointer text-white bg-[#16a34a] py-2 rounded-lg text-base sm:text-lg hover:bg-[#15803d] transition-colors shadow-sm"
      >
        {otpLoader ? <BeatLoader size={12} color="white" /> : "Continue"}
      </button>

      <p className="text-center m-auto text-[11px] sm:text-[12px] text-gray-500 leading-relaxed">
        By continuing, you agree to our{" "}
        <span className="text-[#16a34a] cursor-pointer hover:underline">
          Terms of Use
        </span>{" "}
        and acknowledge you have read our{" "}
        <span className="text-[#16a34a] cursor-pointer hover:underline">
          Privacy Policy
        </span>
      </p>
    </div>
  );
};

export default StepEmail;
