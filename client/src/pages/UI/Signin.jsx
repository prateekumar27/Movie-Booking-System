import React from "react";
import { IoClose } from "react-icons/io5";
import cinemax from "../../assets/cine.png";
import { useAuth } from "../../context/AuthContext";
import StepOTP from "../../components/auth/StepOTP";
import StepAccountCreate from "../../components/auth/StepAccountCreate";
import StepEmail from "../../components/auth/StepEmail";

const steps = {
  1: StepEmail,
  2: StepOTP,
  3: StepAccountCreate,
};

const Signin = () => {
  const { step, setStep, showModel, toggleModel } = useAuth();

  const Step = steps[step];
  const onNext = () => {
    setStep(step + 1);
  };
  if (!showModel) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-xs px-4">
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-xl animate-fadeIn overflow-hidden border border-[#dcfce7]
                      h-auto sm:h-[580px] md:h-[620px]"
      >
        {/* Top Header Section */}
        <div
          className="bg-gradient-to-br from-[#15803d] to-[#16a34a] text-white px-4 sm:px-6 py-6 sm:py-8 
                        h-[220px] sm:h-[260px] md:h-[300px] relative items-center flex flex-col justify-center"
        >
          <IoClose
            onClick={toggleModel}
            className="absolute right-3 sm:right-4 top-6 sm:top-8 text-3xl sm:text-4xl cursor-pointer hover:text-[#bbf7d0] transition-colors"
          />
          <img
            src={cinemax}
            alt=""
            className="mx-auto h-28 w-56 sm:h-36 sm:w-72 md:h-40 md:w-80 drop-shadow-lg object-contain"
          />
        </div>

        <div>
          <Step onNext={onNext} />
        </div>
      </div>
    </div>
  );
};

export default Signin;
