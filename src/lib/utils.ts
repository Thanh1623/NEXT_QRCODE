import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "@/hooks/use-toast";
import jwt from "jsonwebtoken";
import authApiRequests from "@/apiRequests/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast({
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};

const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("accessToken") : null;
};

export const getRefreshTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("refreshToken") : null;
};

export const setAccessTokenToLocalStorage = (value: string) => {
  if (isBrowser) {
    localStorage.setItem("accessToken", value);
  }
};

export const setRefreshTokenToLocalStorage = (value: string) => {
  if (isBrowser) {
    localStorage.setItem("refreshToken", value);
  }
};

export const removeTokensFromLocalStorage = () => {
  if (isBrowser) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};

export const CheckAndRefreshToken = async (params?: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
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
  const now = new Date().getTime() / 1000 - 1; // epoch time (s)
  // truong hop refresh token het han thi cho logout
  if (decodedRefreshToken.exp <= now) {
    removeTokensFromLocalStorage();
    return params?.onError && params?.onError();
  }
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
      params?.onSuccess && params?.onSuccess();
    } catch (error) {
      params?.onError && params?.onError();
    }
  }
};
