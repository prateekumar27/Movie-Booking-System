import mongoose from "mongoose";
import Show from "../modules/show/show.model.js";
import Movie from "../modules/movies/movie.model.js";
import Theater from "../modules/theater/theater.model.js";
import { generateSeatLayout } from "../utils/showUtils.js";
import env from "dotenv";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);
env.config();

const generatePriceMap = () =>
  new Map([
    ["PREMIUM", 510],
    ["EXECUTIVE", 290],
    ["NORMAL", 270],
  ]);

const formats = ["2D", "3D", "IMAX", "PVR PXL"];

// 🎞️ Realistic time slots
const fixedTimeSlots = [
  { start: "09:00 AM", end: "11:30 AM" },
  { start: "12:30 PM", end: "03:00 PM" },
  { start: "04:00 PM", end: "06:30 PM" },
  { start: "07:30 PM", end: "10:00 PM" },
  { start: "10:30 PM", end: "01:00 AM" },
];

const toDateWithTime = (baseDate, timeStr) => {
  const time = dayjs(timeStr, "hh:mm A");

  if (!time.isValid()) {
    throw new Error("Invalid time format. Use hh:mm AM/PM");
  }

  return dayjs(baseDate)
    .hour(time.hour())
    .minute(time.minute())
    .second(0)
    .millisecond(0)
    .toDate();
};

export const seedShow = async () => {
  // const movieIds = ["69d7addb7c2dfcadb5ed2a57", "69d7addb7c2dfcadb5ed2a5b"];
  // const movies = await Movie.find({ _id: { $in: movieIds } });
  const movies = await Movie.find({
    title: { $in: ["F1: The Movie", "Jurassic Park: Rebirth"] },
  });
  const theatres = await Theater.find({ state: "Uttarakhand" });

  if (!movies.length || !theatres.length) {
    console.error(
      "Movies or theatres not found. Please check IDs or state name.",
    );
    return;
  }

  const today = dayjs().startOf("day");

  for (const movie of movies) {
    for (const theatre of theatres) {
      for (let d = 0; d < 2; d++) {
        // ✅ today and tomorrow
        const showDate = today.add(d, "day");
        const formattedDate = showDate.format("DD-MM-YYYY");
        const numShows = Math.floor(Math.random() * 3) + 2; // 2–4 shows
        const selectedSlots = fixedTimeSlots.slice(0, numShows);

        for (const slot of selectedSlots) {
          const startTime = toDateWithTime(showDate.toDate(), slot.start);
          const endTime = toDateWithTime(showDate.toDate(), slot.end);

          const newShow = new Show({
            movie: movie._id,
            theater: theatre._id,
            location: theatre.state,
            format: formats[Math.floor(Math.random() * formats.length)],
            audioType: "Dolby 7.1",
            startTime: slot.start,
            date: formattedDate, // ✅ "DD-MM-YYYY"
            priceMap: generatePriceMap(),
            seatLayout: generateSeatLayout(),
          });

          await newShow.save();
          console.log(
            `🎬 Show created for ${movie.title} at ${theatre.name} on ${formattedDate} (${slot.start} - ${slot.end})`,
          );
        }
      }
    }
  }

  console.log("✅ Show seeding completed for selected movies in Uttrakhand.");
};

mongoose
  .connect(process.env.MONGO_REPLICA_STRING)
  .then(async () => {
    console.log("DB connected");
    await Show.deleteMany({});
    console.log("🧹 Existing shows deleted.");
    await seedShow();
    mongoose.disconnect();
  })
  .catch((err) => console.log(err));
