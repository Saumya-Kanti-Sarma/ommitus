import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  dishName: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: [String],
  },
  category: {
    type: String,
    trim: true,
  },
  veg: {
    type: Boolean,
    default: false, // not veg by def
  },
  description: {
    type: String,
    trim: true,
  },
  fullPlate: {
    type: Number,
    trim: true,
    required: true,
  },
  halfPlate: {
    type: Number,
    trim: true,
    default: 0,
  },
  available: {
    type: Boolean,
    default: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  createdAt: {
    type: Number,
    default: Date.now()
  }
});

menuSchema.index(
  {
    restaurantId: 1,
    dishName: 1
  },
  {
    unique: true
  }
);

export const menuData = mongoose.model("Menu", menuSchema);