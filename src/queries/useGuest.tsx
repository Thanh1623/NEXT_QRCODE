import guestApiRequests from "@/apiRequests/guest";
import { useMutation } from "@tanstack/react-query";

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
