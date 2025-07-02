import http from "@/lib/http";
import {
  CreateDishBodyType,
  DishListResType,
  DishResType,
} from "@/schemaValidations/dish.schema";

const dishApiRequest = {
   // Nextjs 15 thi`mac dinh fetch se la { cache: 'no-store' } (dynamic rendering page)
   // Nextjs 14 mac dinh fetch se la { cache: 'force-cache' } (static rendering page)
  list: () => http.get<DishListResType>("dishes"),
  add: (body: CreateDishBodyType) => http.post<DishListResType>("dishes", body),
  getDish: (id: number) => http.get<DishResType>(`dishes/${id}`),
  updateDish: (id: number, body: CreateDishBodyType) =>
    http.put<DishListResType>(`dishes/${id}`, body),
  deleteDish: (id: number) => http.delete<DishResType>(`dishes/${id}`),
};

export default dishApiRequest;
