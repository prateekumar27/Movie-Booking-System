import React, { use } from "react";
import { useState } from "react";
import { useCountdown } from "../../hooks/useCountdown.jsx";
import { IoClose } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext.jsx";
import { useRef } from "react";

const StepOTP = ({ onNext }) => {
  const [otpArray, setOtpArray] = useState(new Array(4).fill(""));
  const inputRef = useRef([]);
  const { verifyOtpRequest } = useAuth();

  const { displayTime, isExpired } = useCountdown({
    initialTimeInSeconds: 2 * 60,
  });

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otp = parseInt(otpArray.join(""), 10);

    console.log("OTP Array:", otpArray); // ✅ check each box value
    console.log("OTP joined:", otpArray.join("")); // ✅ check joined string
    console.log("OTP parsed:", otp); // ✅ check if NaN
    console.log("Calling verifyOtpRequest..."); // ✅ confirm it reaches here

    verifyOtpRequest({ otp, onNext });
  };

  const handleResendOtp = (e) => {
    e.preventDefault();
  };

  const handleOtpChange = ({ target }, index) => {
    const { value } = target;
    if (!isNaN(parseInt(value))) {
      setOtpArray([...otpArray.map((d, idx) => (idx === index ? value : d))]);

      if (value !== "" && index < otpArray.length - 1) {
        inputRef.current[index + 1].focus();
      }
    }
  };

  const handleClearOtp = () => {
    setOtpArray(new Array(4).fill(""));
    inputRef.current[0].focus();
  };

  return (
    <div className="flex flex-col gap-3 px-4 sm:px-8 md:px-10 py-4 sm:py-6">
      <h2 className="text-center text-base sm:text-lg font-semibold text-gray-800">
        Enter your OTP
      </h2>
      <p className="text-center text-xs sm:text-sm text-gray-500">
        If you don't have an account, we'll create one for you
      </p>

      {/* OTP Input */}
      <div className="flex items-center justify-center">
        {otpArray.map((digit, i) => (
          <input
            key={i}
            name="otp"
            ref={(el) => (inputRef.current[i] = el)}
            type="text"
            value={digit}
            onChange={(e) => handleOtpChange(e, i)}
            className="w-10 h-10 sm:w-12 sm:h-12 font-bold text-center rounded-lg mx-0.5 sm:mx-1 border border-[#bbf7d0] text-[#15803d] outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent bg-[#f0fdf4] transition-all text-sm sm:text-base"
            maxLength={1}
          />
        ))}

        <button
          onClick={handleClearOtp}
          type="button"
          className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer border border-[#bbf7d0] items-center text-[#16a34a] ml-1 rounded-lg font-bold hover:bg-[#dcfce7] transition-colors flex-shrink-0"
        >
          <IoClose size={20} className="inline" />
        </button>
      </div>

      {isExpired ? (
        <p className="text-center text-xs text-[#16a34a] cursor-pointer">
          OTP expired. Please{" "}
          <a
            href=""
            className="underline font-medium hover:text-[#15803d]"
            onClick={handleResendOtp}
          >
            resend OTP
          </a>
        </p>
      ) : (
        <p className="text-center text-xs sm:text-sm text-gray-500">
          OTP will expire in{" "}
          <span className="text-[#15803d] font-medium">{displayTime}</span>
        </p>
      )}

      <button
        onClick={handleVerifyOtp}
        className="w-full cursor-pointer text-white bg-[#16a34a] py-2 rounded-lg text-base sm:text-lg hover:bg-[#15803d] transition-colors shadow-sm"
      >
        Continue
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

export default StepOTP;
