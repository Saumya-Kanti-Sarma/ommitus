import DishTypes from "./Dish.types";

export default interface DishCartTypes {
  idx?: number,
  allDishes?: DishTypes[],
  redirectUrl?: string | undefined,
  dish?: DishTypes,
}