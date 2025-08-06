import mongoose from "mongoose";

const ratingsSchema = new mongoose.Schema({
  dishID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
    required: true,
  },
  restaurantID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
    required: true,
  },
  review: {
    type: String,
    trim: true,
  },
  customerName: {
    type: String,
    trim: true,
  },
  stars: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  date: {
    type: String,
    default: Date()
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
  gender: {
    type: Boolean,
    default: true, // true == male
  }
});

export const ratingsData = mongoose.model("Ratings", ratingsSchema);