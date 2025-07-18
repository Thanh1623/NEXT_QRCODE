import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import guestApiRequests from "@/apiRequests/guest";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!refreshToken) {
    return Response.json(
      { message: "Khong tim thay refreshToken" },
      { status: 401 }
    );
  }
  try {
    const { payload } = await guestApiRequests.sRefreshToken({ refreshToken });

    const decodedAccessToken = jwt.decode(payload.data.accessToken) as {
      exp: number;
    };
    const decodedRefreshToken = jwt.decode(payload.data.refreshToken) as {
      exp: number;
    };
    cookieStore.set("accessToken", payload.data.accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    });
    cookieStore.set("refreshToken", payload.data.refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    });

    return Response.json(payload);
  } catch (error: any) {
    return Response.json(
      { message: error.message ?? "Loi khi goi API den server backend" },
      { status: 401 }
    );
  }
}
