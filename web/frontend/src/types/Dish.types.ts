export default interface DishTypes {
  createdAt?: number; // Date.now()
  _id?: string;
  dishName?: string;
  category?: string;
  veg?: boolean;
  fullPlate?: number | null;
  halfPlate?: number | null;
  available?: boolean;
  image?: string[];
}
