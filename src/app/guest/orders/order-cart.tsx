"use client";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestOrderListQuery } from "@/queries/useGuest";
import Image from "next/image";
import { useEffect, useMemo } from "react";

export default function OrdersCart() {
  const { data } = useGuestOrderListQuery();
  const orders = useMemo(() => data?.payload.data ?? [], [data]);
  const totalPrice = useMemo(() => {
    return orders.reduce(
      (total, order) => total + order.quantity * order.dishSnapshot.price,
      0
    );
  }, [orders]);
  return (
    <>
      {orders.map((order, index) => (
        <div key={order.id} className="flex gap-4">
          <div className="flex items-center justify-center">{index + 1}</div>
          <div className="flex-shrink-0 relative">
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[80px] h-[80px] rounded-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm">{order.dishSnapshot.name}</h3>
            <div className="text-xs font-semibold">
              {formatCurrency(order.dishSnapshot.price)} x{" "}
              <Badge className="px-1">{order.quantity}</Badge>
            </div>
          </div>
          <div className="flex-shrink-0 ml-auto flex items-center justify-center">
            <Badge variant={"outline"}>
              {getVietnameseOrderStatus(order.status)}
            </Badge>
          </div>
        </div>
      ))}
      <div className="sticky bottom-0">
        <div className="w-full justify-between">
          <span className="font-semibold mr-2">
            Tổng đơn hàng: {orders.length} món
          </span>
          <span>
            Tổng tiền:{" "}
            <span className="font-semibold">{formatCurrency(totalPrice)}</span>
          </span>
        </div>
      </div>
    </>
  );
}
