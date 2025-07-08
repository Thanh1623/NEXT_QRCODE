"use client";

import { useAppContext } from "@/components/app-provider";
import { Role } from "@/constants/type";
import { cn, handleErrorApi } from "@/lib/utils";
import { useGuestLogoutMutation } from "@/queries/useGuest";
import { RoleType } from "@/types/jwt.types";
import Link from "next/link";
import { useRouter } from "next/navigation";

const menuItems: {
  title: string;
  href: string;
  role?: RoleType[];
  hideWhenLogin?: boolean;
}[] = [
  {
    title: "Trang chủ",
    href: "/", // authRequired = undifined => ma mac dinh la true dang nhap hay chua deu se hien thi
  },
  {
    title: "Menu",
    href: "/guest/menu",
    role: [Role.Guest],
  },
  {
    title: "Đăng nhập",
    href: "/login",
    hideWhenLogin: true,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    role: [Role.Owner, Role.Employee],
  },
];

// server: tra ve mon an, dang nhap. Do server khong biet trang thai dang nhap cua user
// client: dau tien client se hien thi mon an va dang nhap nhung ngay sau do client render ra mon an don hang quan li do check duoc dang nhap
// => client se hien thi mon an va dang nhap. Do client biet trang thai dang nhap cua user

export default function NavItems({ className }: { className?: string }) {
  const { role, setRole } = useAppContext();
  const logoutMutation = useGuestLogoutMutation();
  const router = useRouter();
  const handleLogout = async () => {
    if (logoutMutation.isPending) return;
    try {
      await logoutMutation.mutateAsync();
      setRole();
      router.push("/");
    } catch (error) {
      handleErrorApi({
        error,
      });
    }
  };
  return (
    <>
      {menuItems.map((item) => {
        // Truong hop dang nhap thi chi hien thi menu dang nhap
        const isAuth = item.role && role && item.role.includes(role);
        // Truong hop menu item co the hien thi du cho dang dang nhap hay chua
        const canShow =
          (item.role === undefined && !item.hideWhenLogin) ||
          (!role && item.hideWhenLogin);
        if (isAuth || canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          );
        }
        return null;
      })}
      {role && (
        <div className={cn(className, "cursor-pointer")} onClick={handleLogout}>
          Đăng xuất
        </div>
      )}
    </>
  );
}
