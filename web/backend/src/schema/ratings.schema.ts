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
  gender: {
    type: Boolean,
    default: true, // true == male
  }
});
ratingsSchema.index(
  {
    customerID: 1,
    dishID: 1
  },
  {
    unique: true
  }
);

export const ratingsData = mongoose.model("Ratings", ratingsSchema);