import { useState, useEffect } from "react";
import Header from "../components/SeatLayout/Header";
import Footer from "../components/SeatLayout/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getShowById } from "../api/index.js";

import screenImg from "../assets/screen.png";
import { useSeatContext } from "../context/SeatContext";
import { useLocation } from "../context/LocationContext";
import { socket } from "../utils/socket";
import toast from "react-hot-toast";

const Seat = ({ seat, row, lockedSeats, onClick, selectedSeats }) => {
  const seatId = `${row}${seat.number}`;
  const isSelected = selectedSeats.includes(seatId);
  const isLocked = lockedSeats.includes(seatId);
  const isBooked = seat.status === "BOOKED";

  return (
    <button
      className={`w-7 h-7 md:w-9 md:h-9 mx-[1px] md:mx-[2px] rounded-md md:rounded-lg border text-[10px] md:text-sm transition-colors duration-150
       ${
         isBooked
           ? "bg-red-50 border-red-200 text-red-400 cursor-not-allowed"
           : isLocked
             ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
             : isSelected
               ? "bg-[#16a34a] text-white border-[#15803d] border-2 cursor-pointer shadow-sm"
               : "bg-white hover:bg-[#dcfce7] border-[#bbf7d0] hover:border-[#16a34a] cursor-pointer"
       }`}
      disabled={isBooked || isLocked}
      onClick={onClick}
    >
      {isBooked || isLocked ? "X" : seat.number}
    </button>
  );
};

const SeatLayout = () => {
  const [lockedSeats, setLockedSeats] = useState([]);
  const { selectedSeats, setSelectedSeats } = useSeatContext();
  const { location } = useLocation();
  const navigate = useNavigate();

  const handleSelectSeat = (row, seat) => {
    const seatId = `${row}${seat.number}`;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((existingId) => existingId !== seatId)
        : [...prev, seatId],
    );
  };
  // This runs on every render and boots you out if context is briefly empty
  // useEffect(() => {
  //   if (!showData || selectedSeats.length === 0) {
  //     navigate("/")
  //   }
  // }, [])

  console.log("selectedSeats:", selectedSeats);

  const { showId } = useParams();

  const {
    data: showData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["show", showId],
    queryFn: async () => await getShowById(showId),

    // 🔥 ADD THESE 2 LINES
    staleTime: 0,
    refetchOnMount: "always",

    enabled: !!showId,
    select: (res) => res.data,
  });

  const isSelectedSeats = selectedSeats.length > 0;

  useEffect(() => {
    setSelectedSeats([]);

    refetch();

    socket.emit("join-show", { showId });

    socket.on("locked-seats-initials", ({ seatIds }) => {
      setLockedSeats(seatIds);
    });

    socket.on("seats-locked", ({ seatIds }) => {
      setLockedSeats((prev) => [...new Set([...prev, ...seatIds])]);
    });

    socket.on("seats-unlocked", ({ seatIds }) => {
      setLockedSeats((prev) => prev.filter((id) => !seatIds.includes(id)));
    });

    socket.on("lock-seats-failed", ({ alreadyLocked }) => {
      toast.error(`Seats already locked: ${alreadyLocked.join(", ")}`);
    });

    return () => {
      socket.off("locked-seats-initials");
      socket.off("seats-locked");

      socket.off("seats-unlocked");
      socket.off("lock-seats-failed");
    };
  }, [showId]);
  console.log("Locked Seats:", lockedSeats);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading show</p>;

  console.log("FRONTEND DATA:", showData?.seatLayout);

  return (
    <>
      <div className="h-screen overflow-y-hidden">
        <div className="fixed top-0 left-0 w-full z-10">
          <Header showData={showData} />
        </div>

        {/* Seat Area — mt adjusts for header height on different screens */}
        <div className="max-w-7xl mx-auto mt-[200px] sm:mt-[210px] px-2 sm:px-4 md:px-6 pb-4 bg-[#f0fdf4] h-[calc(100vh-300px)] sm:h-[calc(100vh-320px)] overflow-y-scroll scrollbar-hide">
          <div className="flex flex-col items-center justify-center">
            {showData?.seatLayout && (
              <div className="flex flex-col items-center justify-center w-full">
                {Object.entries(
                  showData.seatLayout.reduce((acc, curr) => {
                    if (!acc[curr.type])
                      acc[curr.type] = { price: curr.price, rows: [] };
                    acc[curr.type].rows.push(curr);
                    return acc;
                  }, {}),
                ).map(([type, { price, rows }]) => (
                  <div
                    key={type}
                    className="mb-8 md:mb-12 w-full flex flex-col items-center justify-center"
                  >
                    <h2 className="text-center font-semibold mb-3 md:mb-4 text-[#15803d] tracking-wide uppercase text-xs sm:text-sm">
                      {type} : ₹{price}
                    </h2>
                    <div className="space-y-1.5 md:space-y-2">
                      {rows.map((rowObj) => (
                        <div key={rowObj.row} className="flex items-center">
                          <div className="w-5 md:w-6 text-right mr-1 md:mr-2 text-xs md:text-sm text-[#16a34a] font-medium shrink-0">
                            {rowObj.row}
                          </div>
                          <div className="flex flex-wrap gap-0.5 md:gap-1">
                            {rowObj.seats.map((seat, i) => (
                              <Seat
                                key={i}
                                seat={seat}
                                row={rowObj.row}
                                selectedSeats={selectedSeats}
                                lockedSeats={lockedSeats}
                                onClick={() =>
                                  handleSelectSeat(rowObj.row, seat)
                                }
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center mt-4 md:mt-5">
              <img
                src={screenImg}
                alt="Screen"
                className="w-[200px] sm:w-[280px] md:w-[400px] object-contain opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 w-full h-[80px] md:h-[100px] bg-white border-t border-[#dcfce7] py-3 md:py-4 px-3 md:px-4 z-10 shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">
          <Footer
            isSelected={isSelectedSeats}
            selectedSeats={selectedSeats}
            showData={showData}
            state={location}
          />
        </div>
      </div>

      {/* Also update Seat component size for mobile */}
    </>
  );
};

export default SeatLayout;
