"use client";
import { getTableLink } from "@/lib/utils";
import QRCode from "qrcode";
import { useEffect, useRef } from "react";

export default function QrCodeTable({
  token,
  tableNumber,
  width = 200,
}: {
  token: string;
  tableNumber: number;
  width?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    QRCode.toCanvas(
      canvas,
      getTableLink({ token, tableNumber }),
      function (error) {
        if (error) console.error(error);
        console.log("QR code generated!");
      }
    );
  }, [token, tableNumber]);

  return <canvas ref={canvasRef} />;
}
