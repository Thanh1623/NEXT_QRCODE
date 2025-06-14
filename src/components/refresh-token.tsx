"use client";

import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import authApiRequests from "@/apiRequests/auth";

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
    const CheckAndRefreshToken = async () => {
      // khong nen dua logic lay access token va refresh token ra khoi function `checkAndRefreshToken`
      // vi vi thoi diem checkAndRefreshToken() duoc goi thi chung ta se co mot access token va refresh token moi
      // tranh hien tuong bug no lay access token va refresh token tu lan dau roi goi cho cac lan tiep theo
      const accessToken = getAccessTokenFromLocalStorage();
      const refreshToken = getRefreshTokenFromLocalStorage();

      // chua dang nhap thi cung khong cho chay.
      if (!accessToken || !refreshToken) return;

      const decodedAccessToken = jwt.decode(accessToken) as {
        exp: number;
        iat: number;
      };
      const decodedRefreshToken = jwt.decode(refreshToken) as {
        exp: number;
        iat: number;
      };
      // thoi diem het han cua token tinh theo epoch time (s)
      // con khi dung new Date().getTime() thoi diem het han cua token tinh theo epoch time (ms)
      const now = Math.round(new Date().getTime() / 1000); // epoch time (s)
      // truong hop refresh token het han thi khong xu ly nua
      if (decodedRefreshToken.exp <= now) return;
      // vi du. access token cua chung ta co thoi gian het han la 10s
      // thi` minh se kiem tra con 1/3 thoi gian (3s) thi minh se cho refresh token lai
      // Thoi gian con` lai. se dua tren cong thuc: decodedAccessToken.exp - now
      // exp la thoi gian het han cua access token
      // thoi gian het han cua access token dua tren cong thuc: decodedAccessToken.exp - decodedAccessToken.iat
      if (
        decodedAccessToken.exp - now <
        (decodedAccessToken.exp - decodedAccessToken.iat) / 3
      ) {
        // goi api refresh token
        try {
          const res = await authApiRequests.refreshToken();
          setAccessTokenToLocalStorage(res.payload.data.accessToken);
          setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
        } catch (error) {
          clearInterval(interval);
        }
      }
    };
    // phai goi lan dau tien, vi interval se chay sau thoi gian timeout
    CheckAndRefreshToken();
    // timeout interval phai? be hon thoi gian het han cua access token
    // vi du. access token cua chung ta co thoi gian het han la 10s thi` 1s minh se cho check 1 lan
    const TIMEOUT = 1000;
    interval = setInterval(CheckAndRefreshToken, TIMEOUT);

    return () => clearInterval(interval);
  }, [pathname]);
  return null;
}
