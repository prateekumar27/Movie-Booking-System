import mongose from "mongoose";

const showSchema = new mongose.Schema(
  {
    movie: {
      type: mongose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    theater: {
      type: mongose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      enum: ["2D", "3D", "4D", "IMAX", "PVR PXL"],
      required: true,
    },
    audioType: {
      type: String,
      default: "Dolby Atmos",
    },
    startTime: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    priceMap: {
      type: Map,
      of: Number,
      required: true,
      default: {},
    },
    seatLayout: [],
  },
  {
    timestamps: true,
  },
);

const Show = mongose.model("Show", showSchema);
export default Show;
