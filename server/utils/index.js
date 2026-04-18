import { customAlphabet } from "nanoid";
import { Types } from "mongoose";
// type GroupedShow = {
//   movie: Types.ObjectId | IMovie;
//   theater: {
//     theaterDetails: Types.ObjectId | ITheatre;
//     shows: Array<{
//       _id: string;
//       date: string;
//       startTime: string;
//       format: string;
//       audioType: string;
//     }>;
//   };
// };

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateSeatLayout = () => {
  return [
    {
      row: "E",
      type: "PREMIUM",
      price: 510,
      seats: Array.from({ length: 10 }, (_, i) => ({
        number: i + 1,
        status: "AVAILABLE",
      })),
    },
    {
      row: "D",
      type: "EXECUTIVE",
      price: 290,
      seats: Array.from({ length: 20 }, (_, i) => ({
        number: i + 1,
        status: "AVAILABLE",
      })),
    },
    {
      row: "C",
      type: "EXECUTIVE",
      price: 290,
      seats: Array.from({ length: 20 }, (_, i) => ({
        number: i + 1,
        status: "AVAILABLE",
      })),
    },
    {
      row: "B",
      type: "EXECUTIVE",
      price: 290,
      seats: Array.from({ length: 20 }, (_, i) => ({
        number: i + 1,
        status: "AVAILABLE",
      })),
    },
    {
      row: "A",
      type: "NORMAL",
      price: 180,
      seats: Array.from({ length: 20 }, (_, i) => ({
        number: i + 1,
        status: "AVAILABLE",
      })),
    },
  ];
};

// Grouping function
export const groupShowsByTheatreAndMovie = (shows) => {
  const grouped = {};

  shows.forEach((show) => {
    const movieId = show.movie._id;
    const theatreId = show.theatre._id;
    const key = `${movieId}_${theatreId}`;

    if (!grouped[key]) {
      grouped[key] = {
        movie: show.movie,
        theater: {
          theaterDetails: show.theatre,
          shows: [],
        },
      };
    }

    grouped[key].theater.shows.push({
      _id: show._id ?? "",
      date: show.date ?? "",
      startTime: show.startTime ?? "",
      format: show.format ?? "",
      audioType: show.audioType ?? "",
    });
  });

  return Object.values(grouped);
};

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);
export const generateBookingReference = () => nanoid();

