"use client";

import socket from "@/lib/socket";
import { CheckAndRefreshToken } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const UNAUTHENTICATED_PATH = [
  "/login",
  "/register",
  "/logout",
  "/refresh-token",
];

export default function RefreshToken() {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;
    // phai goi lan dau tien, vi interval se chay sau thoi gian timeout
    const onRefreshToken = (force?: boolean) =>
      CheckAndRefreshToken({
        onError: () => {
          clearInterval(interval);
          router.push("/login");
        },
        force,
      });
    onRefreshToken();
    // timeout interval phai? be hon thoi gian het han cua access token
    // vi du. access token cua chung ta co thoi gian het han la 10s thi` 1s minh se cho check 1 lan
    const TIMEOUT = 1000;
    interval = setInterval(() => onRefreshToken, TIMEOUT);
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(socket?.id);
    }

    function onDisconnect() {
      console.log("disconnect");
    }

    function onRefreshTokenSocket() {
      onRefreshToken(true); // force refresh token
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("refresh-token", onRefreshTokenSocket);
    return () => {
      clearInterval(interval);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("refresh-token", onRefreshTokenSocket);
    };
  }, [pathname, router]);
  return null;
}
