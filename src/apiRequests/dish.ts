import http from "@/lib/http";
import {
  CreateDishBodyType,
  DishListResType,
  DishResType,
} from "@/schemaValidations/dish.schema";

const dishApiRequest = {
  list: () => http.get<DishListResType>("dishes"),
  add: (body: CreateDishBodyType) => http.post<DishListResType>("dishes", body),
  getDish: (id: number) => http.get<DishResType>(`dishes/${id}`),
  updateDish: (id: number, body: CreateDishBodyType) =>
    http.put<DishListResType>(`dishes/${id}`, body),
  deleteDish: (id: number) => http.delete<DishResType>(`dishes/${id}`),
};

export default dishApiRequest;
