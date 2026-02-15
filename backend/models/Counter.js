import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  seq: {
    type: Number,
    default: 39184330,
  },
});

export default mongoose.model("Counter", counterSchema);
