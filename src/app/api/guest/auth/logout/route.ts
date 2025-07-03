import guestApiRequests from "@/apiRequests/guest";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: "Khong nhan duoc access token hoac refresh token",
      },
      {
        status: 200,
      }
    );
  }
  try {
    const result = await guestApiRequests.sLogout({
      accessToken,
      refreshToken,
    });

    return Response.json(result.payload);
  } catch (error) {
    return Response.json(
      { message: "Loi khi goi API den server backend" },
      { status: 200 }
    );
  }
}
