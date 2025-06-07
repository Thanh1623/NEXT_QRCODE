"use client";

import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  {
    title: "Món ăn",
    href: "/menu", // authRequired = undifined => ma mac dinh la true dang nhap hay chua deu se hien thi
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    authRequired: true,
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false, // Khi false nghia~ la chua dang nhap thi se hien thi
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true, // Khi true nghia~ la da dang nhap thi se hien thi
  },
];

// server: tra ve mon an, dang nhap. Do server khong biet trang thai dang nhap cua user
// client: dau tien client se hien thi mon an va dang nhap nhung ngay sau do client render ra mon an don hang quan li do check duoc dang nhap
// => client se hien thi mon an va dang nhap. Do client biet trang thai dang nhap cua user

export default function NavItems({ className }: { className?: string }) {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(Boolean(getAccessTokenFromLocalStorage()));
  }, []);
  return menuItems.map((item) => {
    if (
      (item.authRequired === false && isAuth) ||
      (item.authRequired === true && !isAuth)
    )
      return null;
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
