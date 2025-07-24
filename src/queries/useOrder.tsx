import orderApiRequest from "@/apiRequests/order";
import {
  GetOrdersQueryParamsType,
  PayGuestOrdersBodyType,
  UpdateOrderBodyType,
} from "@/schemaValidations/order.schema";
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

export const useGetOrderListQuery = (queryParams: GetOrdersQueryParamsType) => {
  return useQuery({
    queryKey: ["orders", queryParams],
    queryFn: () => orderApiRequest.getOrderList(queryParams),
  });
};

export const useGetOrderDetailQuery = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryFn: () => orderApiRequest.getOrderDetail(id),
    queryKey: ["orders", id],
    enabled,
  });
};

export const usePayForGuestMutation = () => {
  return useMutation({
    mutationFn: (body: PayGuestOrdersBodyType) => orderApiRequest.pay(body),
  });
};

export const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: orderApiRequest.createOrders,
  });
};
