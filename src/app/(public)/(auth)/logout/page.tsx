"use client";

import { useAppContext } from "@/components/app-provider";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

const Logout = () => {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const { setRole } = useAppContext();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const accessTokenFromUrl = searchParams.get("accessToken");

  const ref = useRef<any>(null); // Ref to store the mutateAsync function
  useEffect(() => {
    if (
      // neu ref.current chua duoc set va refreshTokenFromUrl va accessTokenFromUrl khac null
      // va refreshTokenFromUrl va accessTokenFromUrl bang refreshToken va accessToken tu localStorage
      // thi goi logout
      !ref.current &&
      ((refreshTokenFromUrl &&
        refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) ||
        (accessTokenFromUrl &&
          accessTokenFromUrl === getAccessTokenFromLocalStorage()))
    ) {
      ref.current = mutateAsync; // Set the ref to the mutateAsync function

      mutateAsync().then(() => {
        // If the logout is successful
        setTimeout(() => {
          // Clear the ref after 1 second
          ref.current = null; // Reset the ref to null
        }, 1000);
        setRole();
        router.push("/login");
      });
    } else {
      router.push("/");
    }
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl, setRole]); // Add mutateAsync to the dependency array

  return <div>Log out...</div>;
};

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Logout />
    </Suspense>
  );
}
