import React from "react";
import { useNavigate } from "react-router-dom";
import { useSeatContext } from "../../context/SeatContext";
import { socket } from "../../utils/socket";
import { useAuth } from "../../context/AuthContext";

const Footer = ({ selectedSeats, isSelected, showData, state }) => {
  const isFooterActive = false;

  const navigate = useNavigate();
  const { setShows } = useSeatContext();
  const { user } = useAuth();

  const handleNavigateToCheckout = () => {
    // send lock request to socket.io to server
    socket.emit("lock-seats", {
      showId: showData._id,
      seatIds: selectedSeats,
      userId: user._id,
    });

    setShows(showData);
    navigate(`/shows/${showData._id}/${state}/checkout`);
  };
  return (
    <>
      {isSelected ? (
        <div className="bg-white py-2 sm:py-3 px-3 sm:px-6 flex items-center justify-between z-10 border-t border-[#dcfce7]">
          <p className="text-[#15803d] font-medium text-sm sm:text-base">
            {selectedSeats.length} Seat{selectedSeats.length !== 1 ? "s" : ""}{" "}
            Selected
          </p>
          <button
            onClick={handleNavigateToCheckout}
            className="bg-[#16a34a] cursor-pointer text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#15803d] transition-colors shadow-sm"
          >
            Proceed
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center px-3 py-2">
          <p className="text-xs font-bold text-[#16a34a] tracking-wider">
            SCREEN THIS WAY
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs mt-2 sm:mt-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border border-[#bbf7d0] rounded"></div>
              <p className="text-gray-600">Available</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-50 border border-red-200 rounded flex items-center justify-center">
                <small className="mb-1 text-red-400">x</small>
              </div>
              <p className="text-gray-600">Occupied</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#16a34a] rounded"></div>
              <p className="text-gray-600">Selected</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
