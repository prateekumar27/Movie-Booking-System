import Header from "../components/SeatLayout/Header";
import dayjs from "dayjs";
// import { calculateTotalPrice } from "../utils/calculateTotalPrice";
import { calculateTotalPrice, groupSeatsByType } from "../utils/index";
import { FaInfoCircle } from "react-icons/fa"; // ✅ curly braces + correct path
import { BiSolidOffer } from "react-icons/bi"; // ✅ curly braces + correct path
import { CiCircleQuestion, CiUser } from "react-icons/ci";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "../context/LocationContext";
import { useSeatContext } from "../context/SeatContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { socket } from "../utils/socket";
import toast from "react-hot-toast";
import { razorPayScript } from "../utils/constants";
import { useMutation } from "@tanstack/react-query";
import {
  bookShow,
  CreateOrderRazorpay,
  verifyOrderRazorpay,
} from "../api/index";
import { useQueryClient } from "@tanstack/react-query";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const CheckOut = () => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 min = 300 seconds

  // const show = {
  //   _id: "show123",
  //   date: "2023-09-15",
  //   startTime: "10:00 AM",
  //   movie: {
  //     title: "The Avengers",
  //     certification: "UA13+",
  //     languages: ["English", "Hindi"],
  //     format: ["2D", "3D"],
  //     posterUrl: "https://example.com/poster.jpg",
  //   },
  //   theatre: {
  //     name: "Cineplex Cinemas",
  //     city: "New York",
  //     state: "NY",
  //   },
  // };

  // const selectedSeats = [
  //   { type: "PREMIUM", seatNumber: "B5", price: 250 },
  //   { type: "PREMIUM", seatNumber: "C4", price: 250 },
  // ];

  // const user = {
  //   name: "John Doe",
  //   phone: "1234567890",
  //   email: "8oV8H@example.com",
  //   state: "NY",
  // };

  // const { base, tax, total } = calculateTotalPrice(selectedSeats);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          socket.emit("unlock-seats", {
            showId: showData._id,
            userId: user._id,
          });
          toast.error("Time limit exceeded.");
          navigate("/");
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // clean up
  }, []);

  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { location } = useLocation();
  const { selectedSeats, shows: showData } = useSeatContext();
  const { base, tax, total } = calculateTotalPrice(selectedSeats);

  useEffect(() => {
    if (!showData || selectedSeats.length === 0) {
      navigate("/");
    }
    console.log("showData:", showData);
    console.log("selectedSeats:", selectedSeats);
  }, []);

  /**
   * PAYMENT GATEWAY INTERGRATION START
   */

  const createOrderMutation = useMutation({
    mutationFn: (reqData) => CreateOrderRazorpay(reqData),
    onSuccess: (data) => {
      const order = data?.order;

      // STEP 2: Open Razorpay modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: showData?.movie?.title,
        description: `Seats: ${selectedSeats.join(", ")}`,
        order_id: order.id,

        handler: async (response) => {
          // STEP 3: Verify payment on backend
          // verifyMutation.mutate({
          //   razorpay_order_id: response.razorpay_order_id,
          //   razorpay_payment_id: response.razorpay_payment_id,
          //   razorpay_signature: response.razorpay_signature,
          //   showId: showData._id,
          //   seatIds: selectedSeats,
          // });

          console.log("response:", response);
          verifyPaymentMutation.mutate({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            showId: showData._id,
            seatIds: selectedSeats,
          });
          // bookTicketMutation.mutate({
          //   showId: showData._id,
          //   seats: selectedSeats,
          //   userId: user._id,
          //   paymentId: response.razorpay_payment_id,
          //   bookingFee: {
          //     ticketPrice: base, // ✅ was: base
          //     convenience: tax,
          //     total,
          //   },
          // });
        },

        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        theme: { color: "#6e52fa" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: (reqData) => verifyOrderRazorpay(reqData),
    onSuccess: (data, variables) => {
      toast.success("Payment verified");
      socket.emit("unlock-seats", {
        showId: showData._id,
        userId: user._id,
      });
      bookTicketMutation.mutate({
        showId: showData._id,
        seats: selectedSeats,
        userId: user._id,
        paymentId: variables.razorpay_payment_id,
        bookingFee: { ticketPrice: base, convenience: tax, total },
      });
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Payment verification failed",
      );
    },
  });

  const bookTicketMutation = useMutation({
    mutationFn: (reqData) => bookShow(reqData),
    onSuccess: (data) => {
      console.log("bookTicket res:", data);
      toast.success(data?.data?.message);

      // 🔥 ADD THIS LINE (VERY IMPORTANT)
      queryClient.invalidateQueries(["show", showData._id]);

      socket.emit("unlock-seats", {
        showId: showData._id,
        userId: user._id,
        seatIds: selectedSeats,
      });

      navigate(`/profile/${user._id}?tab=booking`);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });

  // ✅ Option A: Use only the mutation (recommended)
  const handleBookSeats = async () => {
    const res = await loadScript(razorPayScript);
    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    // Let the mutation handle the API call
    createOrderMutation.mutate({
      amount: total,
      showId: showData._id,
      seatIds: selectedSeats,
    });
  };

  /**
   * PAYMENT GATEWAY INTERGRATION ENDS
   */

  return (
    <div className="min-h-screen w-full bg-[#f0fdf4]">
      <Header type="checkout" />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 md:py-6">
        {/* Timer */}
        <p className="text-[#15803d] text-center mb-3 text-base md:text-lg border border-dashed border-[#16a34a] rounded-2xl py-2 font-semibold bg-white">
          Time left: {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
          {String(timeLeft % 60).padStart(2, "0")}
        </p>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Left Section */}
          <div className="flex-1 space-y-3 md:space-y-4">
            {/* Movie Details */}
            <div className="flex gap-3 md:gap-4 bg-white rounded-2xl px-4 md:px-6 py-4 md:py-5 border border-[#dcfce7] shadow-sm">
              <img
                src={showData?.movie.posterUrl}
                alt={showData?.movie.title}
                className="w-[50px] h-[75px] md:w-[60px] md:h-[90px] rounded-lg object-cover shadow shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-semibold text-base md:text-lg text-gray-800 truncate">
                  {showData?.movie.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                  {showData?.movie.certification} |{" "}
                  {showData?.movie.languages.join(", ")} |{" "}
                  {showData?.movie.format.join(", ")}
                </p>
                <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                  {showData?.theater?.name} - {showData?.theater?.city},{" "}
                  {showData?.theater?.state}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {showData?.date}, {showData?.startTime}
                </p>
              </div>
            </div>

            {/* Show Details */}
            <div className="border border-[#dcfce7] rounded-2xl px-4 md:px-6 py-4 md:py-5 bg-white shadow-sm">
              <p className="text-sm md:text-md font-medium border-b pb-4 md:pb-5 border-[#dcfce7] text-gray-700">
                {dayjs(showData.date, "DD-MM-YYYY")
                  .format("D MMM YYYY")
                  .split(" ")
                  .slice(0, 2)
                  .join(" ")}{" "}
                &nbsp; -{" "}
                <span className="font-semibold text-[#15803d]">
                  {showData.startTime}
                </span>
              </p>
              <div className="flex items-start justify-between mt-4 mb-4 gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-md font-semibold text-gray-800">
                    {selectedSeats.length} ticket
                  </p>
                  <div className="text-xs md:text-sm text-gray-500 mt-1">
                    {groupSeatsByType(selectedSeats).map(({ type, seats }) => (
                      <p key={type} className="font-medium text-[#15803d]">
                        {type} - {seats.join(", ")}
                      </p>
                    ))}
                  </div>
                </div>
                <p className="text-sm md:text-md font-semibold text-gray-800 shrink-0">
                  <span className="text-[#16a34a]">₹</span>
                  {base}
                </p>
              </div>
            </div>

            {/* Cancellation Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs md:text-sm px-4 md:px-6 py-4 md:py-5 tracking-wide">
              <span className="font-medium flex items-start gap-2">
                <FaInfoCircle size={18} className="shrink-0 mt-0.5" />
                No Cancellation or refund available after the payment
              </span>
            </div>

            {/* Offer */}
            <div className="flex items-center justify-between border border-[#dcfce7] rounded-2xl bg-white px-4 md:px-6 py-4 md:py-5 shadow-sm">
              <p className="font-medium text-xs md:text-sm flex items-center gap-2 text-gray-700">
                <BiSolidOffer size={18} className="text-[#16a34a] shrink-0" />
                Available Offer
              </p>
              <p className="text-xs md:text-sm text-[#16a34a] font-semibold cursor-pointer hover:text-[#15803d] whitespace-nowrap">
                View all offers
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-[300px] space-y-3 md:space-y-4">
            <h4 className="font-medium text-gray-900 text-base md:text-lg">
              Payment Summary
            </h4>

            {/* Price Breakdown */}
            <div className="border border-[#dcfce7] rounded-2xl px-4 md:px-6 py-5 md:py-7 space-y-2 bg-white shadow-sm">
              <div className="flex justify-between">
                <span className="text-xs md:text-sm text-gray-500">
                  Order amount
                </span>
                <span className="text-sm text-gray-800">₹{base}</span>
              </div>
              <div className="flex justify-between pb-4">
                <span className="text-xs md:text-sm text-gray-500">
                  Taxes & fees (5%)
                </span>
                <span className="text-sm text-gray-800">₹{tax}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-[#dcfce7] pt-4">
                <span className="text-sm text-gray-800">To be paid</span>
                <span className="text-sm text-[#15803d]">₹{total}</span>
              </div>
            </div>

            {/* User Details */}
            <h4 className="text-base md:text-lg font-medium text-gray-900">
              Your details
            </h4>
            <div className="border border-[#dcfce7] flex items-start gap-3 rounded-2xl px-4 md:px-6 py-5 md:py-7 bg-white shadow-sm">
              <CiUser size={22} className="text-[#16a34a] shrink-0" />
              <div className="mt-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs md:text-sm text-gray-500">
                  {user?.phone}
                </p>
                <p className="text-xs md:text-sm text-gray-500 break-all">
                  {user?.email}
                </p>
                <p className="text-xs md:text-sm text-gray-500">{location}</p>
              </div>
            </div>

            {/* Terms */}
            <div className="border border-[#dcfce7] rounded-2xl px-4 md:px-6 py-4 md:py-5 bg-white shadow-sm">
              <p className="text-sm font-medium cursor-pointer flex items-center gap-2 text-gray-500 hover:text-[#16a34a]">
                <CiCircleQuestion size={22} />
              </p>
            </div>

            {/* Pay Button */}
            <div
              onClick={handleBookSeats}
              className="flex justify-between items-center bg-[#16a34a] hover:bg-[#15803d] transition-colors rounded-2xl px-4 md:px-6 py-3 md:py-4 cursor-pointer shadow-md"
            >
              <p className="text-white font-bold text-sm md:text-base">
                ₹{total}{" "}
                <span className="text-xs font-medium opacity-80">TOTAL</span>
              </p>
              <p className="text-white font-medium text-sm md:text-base">
                Proceed To Pay →
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
