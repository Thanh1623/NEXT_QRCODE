"use client";

import {
  CheckAndRefreshToken,
} from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const UNAUTHENTICATED_PATH = [
  "/login",
  "/register",
  "/logout",
  "/refresh-token",
];

export default function RefreshToken() {
  const pathname = usePathname();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;
    // phai goi lan dau tien, vi interval se chay sau thoi gian timeout
    CheckAndRefreshToken({
      onError: () => {
        clearInterval(interval);
      },
    });
    // timeout interval phai? be hon thoi gian het han cua access token
    // vi du. access token cua chung ta co thoi gian het han la 10s thi` 1s minh se cho check 1 lan
    const TIMEOUT = 1000;
    interval = setInterval(CheckAndRefreshToken, TIMEOUT);

    return () => clearInterval(interval);
  }, [pathname]);
  return null;
}
