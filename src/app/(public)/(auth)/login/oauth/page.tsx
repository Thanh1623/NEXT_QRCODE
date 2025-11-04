"use client";

import { useAppContext } from "@/components/app-provider";
import { toast } from "@/hooks/use-toast";
import { decodeToken, generateSocketInstance } from "@/lib/utils";
import { useSetTokenToCookieMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function OAuthPage() {
  const { setRole, setSocket } = useAppContext();
  const { mutateAsync } = useSetTokenToCookieMutation();
  const count = useRef(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = searchParams?.get("accessToken");
  const refreshToken = searchParams?.get("refreshToken");
  const message = searchParams?.get("message");
  useEffect(() => {
    if (accessToken && refreshToken) {
      if (count.current === 0) {
        const { role } = decodeToken(accessToken);

        mutateAsync({ accessToken, refreshToken })
          .then(() => {
            setRole(role);
            setSocket(generateSocketInstance(accessToken));
            router.push("/manage/dashboard");
          })
          .catch((e) => {
            toast({
              title: "Đăng nhập thất bại",
              description: e.message || "Vui lòng thử lại",
            });
          });
        count.current++;
      }
    } else {
      if (count.current === 0) {
        setTimeout(() => {
          toast({
            title: "Đăng nhập thất bại",
            description: message || "Vui lòng thử lại",
          });
        });
        count.current++;
      }
    }
  }, [
    accessToken,
    refreshToken,
    setRole,
    setSocket,
    router,
    message,
    mutateAsync,
  ]);
  return null;
}
