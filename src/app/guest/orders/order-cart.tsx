"use client";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/constants/type";
import { toast } from "@/hooks/use-toast";
import socket from "@/lib/socket";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestOrderListQuery } from "@/queries/useGuest";
import {
  PayGuestOrdersResType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import Image from "next/image";
import { useEffect, useMemo } from "react";

export default function OrdersCart() {
  const { data, refetch } = useGuestOrderListQuery();
  const orders = useMemo(() => data?.payload.data ?? [], [data]);

  const { waitingForPaying, paid } = useMemo(() => {
    return orders.reduce(
      (result, order) => {
        if (
          order.status === OrderStatus.Delivered ||
          order.status === OrderStatus.Pending ||
          order.status === OrderStatus.Processing
        ) {
          return {
            ...result,
            waitingForPaying: {
              price:
                result.waitingForPaying.price +
                order.dishSnapshot.price * order.quantity,
              quantity: result.waitingForPaying.quantity + order.quantity,
            },
          };
        }
        if (order.status === OrderStatus.Paid) {
          return {
            ...result,
            paid: {
              price:
                result.paid.price + order.dishSnapshot.price * order.quantity,
              quantity: result.paid.quantity + order.quantity,
            },
          };
        }
        return result;
      },
      {
        waitingForPaying: {
          price: 0,
          quantity: 0,
        },
        paid: {
          price: 0,
          quantity: 0,
        },
      }
    );
  }, [orders]);
  useEffect(() => {
    refetch();
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(socket?.id);
    }

    function onDisconnect() {
      console.log("disconnect");
    }

    function onUpdateOrder(data: UpdateOrderResType["data"]) {
      toast({
        description: `Món ${data.dishSnapshot.name} (SL: ${
          data.quantity
        }) vừa được cập nhật sang trạng thái "${getVietnameseOrderStatus(
          data.status
        )}"`,
      });
      refetch();
    }

    function onPayment(data: PayGuestOrdersResType["data"]) {
      const { guest } = data[0];
      toast({
        description: `${guest?.name} tại bàn ${guest?.tableNumber} vừa thanh toán thành công ${data.length} đơn`,
      });
      refetch();
    }

    socket.on("update-order", onUpdateOrder);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("payment", onPayment);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update-order", onUpdateOrder);
      socket.off("payment", onPayment);
    };
  }, [refetch]);
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
            Đơn chưa thanh toán: {waitingForPaying.quantity} món -{" "}
          </span>
          <span className="font-semibold">
            {formatCurrency(waitingForPaying.price)}
          </span>
        </div>
      </div>
      {paid.price !== 0 && (
        <div className="sticky bottom-0">
          <div className="w-full justify-between">
            <span className="font-semibold mr-2">
              Đơn đã thanh toán: {paid.quantity} món -{" "}
            </span>
            <span className="font-semibold">{formatCurrency(paid.price)}</span>
          </div>
        </div>
      )}
    </>
  );
}
