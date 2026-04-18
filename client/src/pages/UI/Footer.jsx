import { FaYoutube } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import mainLogo from "../../assets/cinemax.png";

const Footer = () => {
  return (
    <div className="bg-[#052e16] text-gray-400 text-sm">
      <div className="border-t border-[#166534] w-full" />
      <div className="flex flex-col items-center mb-2 py-4 px-4">
        {/* LOGO */}
        <img
          src={mainLogo}
          alt="BookMyScreen"
          className="w-24 sm:w-28 mb-2 opacity-90"
        />

        {/* SOCIAL LINKS */}
        <div className="flex space-x-4 sm:space-x-6 mb-4 p-2">
          <FaFacebook className="w-7 h-7 sm:w-8 sm:h-8 p-2 rounded-full bg-[#14532d] text-[#4ade80] hover:bg-[#166534] cursor-pointer transition-colors" />
          <FaInstagram className="w-7 h-7 sm:w-8 sm:h-8 p-2 rounded-full bg-[#14532d] text-[#4ade80] hover:bg-[#166534] cursor-pointer transition-colors" />
          <FaTwitter className="w-7 h-7 sm:w-8 sm:h-8 p-2 rounded-full bg-[#14532d] text-[#4ade80] hover:bg-[#166534] cursor-pointer transition-colors" />
          <FaYoutube className="w-7 h-7 sm:w-8 sm:h-8 p-2 rounded-full bg-[#14532d] text-[#4ade80] hover:bg-[#166634] cursor-pointer transition-colors" />
        </div>

        {/* COPYRIGHT */}
        <p className="text-center text-xs px-4 max-w-4xl text-gray-400">
          &copy; 2026 Cinemaxx. All rights reserved.
        </p>
        <small className="text-gray-500 hover:text-[#4ade80] cursor-pointer transition-colors text-center px-4 mt-1 leading-relaxed">
          Terms and Conditions | Privacy Policy | Cookie Policy
        </small>
      </div>
    </div>
  );
};

export default Footer;
