import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  dishName: {
    type: String,
    required: true,
    trim: true, // automatically reoves white space from start and end
  },
  image: {
    type: [String],
  },
  category: {
    type: String,
    trim: true,
    enum: ["starter", "main-course", "curry", "beverages", "special", "rice", "chinese", "roti", "salad", "momos", "noodles", "birayani", "tandoori", "drinks", "fries", "drinks", "soup", "stakes", "roast", "rolls", "cutlets"]
  },
  veg: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    trim: true,
  },
  fullPlate: {
    type: Number,
    trim: true,
  },
  halfPlate: {
    type: Number,
    trim: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId, // Referencing restaurant ID for efficient lookups
    ref: "Restaurant",  // referance to Restaurant collection of DB, it will help us to populate the restaurantId with specific restaurants to which the id belongs
    required: true,
  },
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
