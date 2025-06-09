"use client";

import { getRefreshTokenFromLocalStorage } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LogoutPage() {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const ref = useRef<any>(null);
  useEffect(() => {
    if (
      ref.current ||
      refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()
    )
      return; // If the ref is already set, do nothing
    ref.current = mutateAsync; // Set the ref

    mutateAsync().then(() => {
      // If the logout is successful
      setTimeout(() => {
        // Clear the ref after 1 second
        ref.current = null; // Reset the ref
      }, 1000);
      router.push("/login");
    });
  }, [mutateAsync, router, refreshTokenFromUrl]); // Add mutateAsync to the dependency array

  return <div>Log out...</div>;
}
