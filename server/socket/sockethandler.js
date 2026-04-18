import { Socket, Server } from "socket.io";
import redis from "../config/redis.js";

export const registerSocketHandler = (socket, io) => {
  /** 
 * USER JOINS A SHOW ROOM
  -----------------------

 * When a user opens the seat layout page,
 * we sebd all currently locked seats to the user
  */

  socket.on("join-show", async ({ showId }) => {
    // Join the show room using the showId
    socket.join(showId);
    socket.data.showId = showId;

    console.log(`Socket ${socket.id} joined show ${showId}`);

    /**
     * Fetch all locked seats from the Redis
     * Example keys :
     * locked-seats:showId -> ["E1", "E2", "E3"]
     */

    const lockedSeats = await redis.smembers(`locked-seats:${showId}`);

    const activeLockedSeats = [];

    for (const seatId of lockedSeats) {
      const seatLockKey = `seat-lock:${showId}:${seatId}`;
      const existingLock = await redis.get(seatLockKey);

      if (existingLock) {
        activeLockedSeats.push(seatId);
      } else await redis.srem(`locked-seats:${showId}`, seatId);
    }

    socket.emit("locked-seats-initials", { seatIds: activeLockedSeats });
  });

  /**
   * LOCK SEATS
   * User clocks "Proceed"
   * we lock seats for 5 minutes
   */

  socket.on("lock-seats", async ({ seatIds, showId, userId }) => {
    if (!seatIds || !showId || !userId) return;

    const lockedSeats = `locked-seats:${showId}`;
    const unavailableSeats = [];

    /**
     * STEP 1: Check if seats are already locked (READ ONLY — no writes here)
     */
    for (const seatId of seatIds) {
      const seatLockKey = `seat-lock:${showId}:${seatId}`;
      const existingLock = await redis.get(seatLockKey);

      if (existingLock) {
        unavailableSeats.push(seatId);
      }
    }

    /**
     * If any seat is already locked, reject the entire request
     */
    if (unavailableSeats.length > 0) {
      socket.emit("lock-seats-failed", {
        showId,
        requested: seatIds,
        alreadyLocked: unavailableSeats,
      });
      return;
    }

    /**
     * STEP 2: Lock all seats (only reached if ALL seats are free)
     */
    for (const seatId of seatIds) {
      const seatLockKey = `seat-lock:${showId}:${seatId}`;
      await redis.set(seatLockKey, userId, "EX", 300);
      await redis.sadd(lockedSeats, seatId); // ✅ fixed: was `lockedSeatsKeys`
    }

    /**
     * STEP 3: Notify requester of success + broadcast to room
     */
    socket.emit("lock-seats-success", { showId, seatIds });

    // Broadcast newly locked seats to all OTHER users in the show room
    socket.to(showId).emit("seats-locked", { seatIds });
  });

  /**
   * UNLOCK SEATS
   * ----------------
   * Triggered when:
   * User leaves checkout
   * User cancels booking
   */

  socket.on("unlock-seats", async ({ seatIds, showId, userId }) => {
    if (!seatIds?.length || !showId) return;

    const lockedSeatsKeys = `locked-seats:${showId}`;

    for (const seatId of seatIds) {
      const seatLockKey = `seat-lock:${showId}:${seatId}`;

      //remove individual seat lock
      await redis.del(seatLockKey);

      //remove seat from locked seat list
      await redis.srem(lockedSeatsKeys, seatId);
    }

    io.to(showId).emit("seats-unlocked", { seatIds, showId, userId });
    console.log(`${userId} unlocked seats: ${seatIds}`);
  });

  /**
   * SOCKET DISCONNECT
   * ----------------
   * we dont't manually unlock seats here.
   * redis ttl will automatically release them after 5 minutes
   */

  socket.on("disconnect", () => {
    const showId = socket.data.showId;
    if (showId) {
      socket.leave(showId);
      console.log(`Socket ${socket.id} disconnected from show ${showId}`);
    }
  });
};
