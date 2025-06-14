"use client";

import {
  CheckAndRefreshToken,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function RefreshTokenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const redirectPathname = searchParams.get("redirect");

  useEffect(() => {
    if (
      refreshTokenFromUrl &&
      refreshTokenFromUrl === getRefreshTokenFromLocalStorage()
    ) {
      CheckAndRefreshToken({
        onSuccess: () => {
          router.push(redirectPathname || "/");
        },
      });
    }
  }, [router, refreshTokenFromUrl, redirectPathname]); // Add mutateAsync to the dependency array

  return <div>Refresh token...</div>;
}
