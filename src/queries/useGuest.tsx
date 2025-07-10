import guestApiRequests from "@/apiRequests/guest";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestApiRequests.login,
  });
};
export const useGuestLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequests.logout,
  });
};

export const useGetOrderMutation = () => {
  return useMutation({
    mutationFn: guestApiRequests.order,
  });
};

export const useGuestOrderListQuery = () => {
  return useQuery({
    queryKey: ["guest-orders"],
    queryFn: guestApiRequests.getOrderList,
  });
};
