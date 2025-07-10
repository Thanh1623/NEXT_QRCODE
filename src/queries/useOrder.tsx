import orderApiRequest from "@/apiRequests/order";
import { UpdateOrderBodyType } from "@/schemaValidations/order.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUpdateOrderMutation = () => {
  return useMutation({
    // mutationFn: (payload: UpdateOrderBodyType & { orderId: number }) =>
    //   orderApiRequest.updateOrder(payload.orderId, payload), // dung'
    mutationFn: ({
      orderId,
      ...body
    }: UpdateOrderBodyType & { orderId: number }) =>
      orderApiRequest.updateOrder(orderId, body),
  });
};

export const useGetOrderListQuery = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: orderApiRequest.getOrderList,
  });
};
