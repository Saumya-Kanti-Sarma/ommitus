import DishTypes from "./Dish.types";

export default interface DishCartTypes {
  idx?: number,
  allDishes?: DishTypes[],
  restaurantId?: string | undefined,
  dish?: DishTypes,
}