import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  restaurantName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    trim: true,
  },
  since: {
    type: String,
  },
  address: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },

  token: {
    type: String // this will keep them logged in
  },
  created: {
    type: String,
    default: Date(),
  },
  categories: {
    type: [String],
    trim: true,
  },
});

export const restaurantData = mongoose.model("Restaurant", restaurantSchema);
