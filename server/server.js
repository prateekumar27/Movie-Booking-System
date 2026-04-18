import express from "express";
import dotenv from "dotenv";
import dbConnect from "./database/dbConnect.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import movieRouter from "./modules/movies/movie.route.js";
import theaterRouter from "./modules/theater/theater.route.js";
import showRouter from "./modules/show/show.route.js";
import userRouter from "./modules/users/user.route.js";
import authRouter from "./modules/auth/auth.route.js";
import "./config/redis.js";
import http from "http";
import { Server } from "socket.io";
import { registerSocketHandler } from "./socket/sockethandler.js";
import paymentRouter from "./modules/payment/payment.route.js";
import bookingRoutes from "./modules/booking/booking.route.js";

dotenv.config();

const server = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:5173",
  "https://movie-booking-frontend-seven-fawn.vercel.app",
];

server.use(cookieParser());
server.use(express.json());

server.get("/health", (req, res) => res.json({ status: "ok" }));

server.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

server.use(express.json());
server.use("/api/movies", movieRouter);
server.use("/api/theater", theaterRouter);
server.use("/api/shows", showRouter);
server.use("/api/users", userRouter);
server.use("/api/auth", authRouter);
server.use("/api/payment", paymentRouter);
server.use("/api/bookings", bookingRoutes);

//custom error middelware// global error handler middleware

server.use((err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ error: err.message || "Internal Server Error" });
});

//create http server
const httpServer = http.createServer(server);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  registerSocketHandler(socket, io);
  socket.on("disconnect", (reason) => {
    console.log("User disconnected:", socket.id, "Reason:", reason);
  });
});

(async () => {
  //immediately invoked async function
  try {
    await dbConnect();
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
})();
