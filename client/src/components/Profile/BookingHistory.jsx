import React from "react";
import { MdChair } from "react-icons/md";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getUserBookings } from "../../api";

const BookingHistory = () => {
  const { data, isError } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      return await getUserBookings();
    },
    placeholderData: keepPreviousData,
  });

  console.log("raw data:", data);
  console.log("data.data:", data?.data);
  console.log("bookings:", data?.data?.bookings);
  if (isError) {
    return (
      <div className="px-6 rounded-md">
        <h3 className="text-xl font-semibold mb-4">Your Bookings</h3>
        <p className="text-gray-500">
          Failed to load bookings. Please try again later
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="px-3 sm:px-6 rounded-md">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
          Your Orders
        </h3>

        {data?.data?.bookings?.length > 0 ? (
          data?.data?.bookings
            ?.filter((booking) => booking.show !== null)
            .map((booking) => (
              <React.Fragment key={booking._id}>
                <div className="bg-white p-3 sm:p-5 rounded-md mb-2 overflow-hidden">
                  {/* Top section - poster + details */}
                  <div className="flex items-start gap-3 sm:gap-6">
                    <img
                      src={booking.show.movie.posterUrl}
                      alt=""
                      className="w-20 h-28 sm:w-24 sm:h-36 md:w-28 md:h-40 object-cover rounded flex-shrink-0"
                    />

                    {/* Dashed divider - hidden on mobile */}
                    <div className="hidden sm:block self-stretch border-2 border-gray-300 border-dashed"></div>

                    <div className="flex items-start justify-between w-full min-w-0">
                      <div className="flex-1 min-w-0">
                        <p className="font-normal text-base sm:text-lg truncate">
                          {booking.show.movie.title}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {booking.show.format} | {booking.show.audioType}
                        </p>
                        <p className="text-xs sm:text-sm font-semibold mt-1 sm:mt-2">
                          {booking.show.date} - {booking.show.startTime} |{" "}
                          {booking.show.theater?.name},{" "}
                          {booking.show.theater?.city}
                        </p>
                        <small className="text-gray-700 mt-1 block">
                          Quantity : {booking.seats.length}
                        </small>
                        <p className="text-sm font-semibold text-gray-700 mt-1 sm:mt-2 line-clamp-2">
                          <MdChair
                            className="inline items-center mr-1 sm:mr-2"
                            size={20}
                          />
                          {booking.seats.join(", ")}
                        </p>
                      </div>
                      <p className="text-xs sm:text-sm flex-shrink-0 ml-2 text-[#16a34a] font-medium">
                        M-Ticket
                      </p>
                    </div>
                  </div>

                  {/* Price summary */}
                  <div className="pt-3 sm:p-4 text-right border-t border-[#dcfce7] mt-3">
                    <p className="text-xs sm:text-sm text-gray-500">
                      Ticket: {booking.bookingFee.ticketPrice} + Convenience
                      Fees: {booking.bookingFee.convenience}
                    </p>
                    <p className="text-lg sm:text-xl font-bold">
                      Total: {booking.bookingFee.total}
                    </p>
                  </div>
                </div>

                {/* Booking meta info */}
                <div className="px-3 sm:p-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8">
                  <div>
                    <p className="font-semibold">Booking Date & Time</p>
                    <p>{booking.bookingDateTime}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Payment Method</p>
                    <p>{booking.paymentMethod.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Booking ID</p>
                    <p className="break-all">{booking.bookingReference}</p>
                  </div>
                </div>
              </React.Fragment>
            ))
        ) : (
          <p className="text-gray-500 text-sm">No bookings found.</p>
        )}
      </div>
    </>
  );
};

export default BookingHistory;
