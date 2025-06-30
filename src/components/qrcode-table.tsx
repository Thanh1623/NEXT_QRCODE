"use client";
import { getTableLink } from "@/lib/utils";
import QRCode from "qrcode";
import { useEffect, useRef } from "react";

export default function QrCodeTable({
  token,
  tableNumber,
  width = 250,
}: {
  token: string;
  tableNumber: number;
  width?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Hien tai.: thu vien QRCode no se ve~ len canvas
    // Bay gio: Tao. 1 the canvas ao? de thu vien QRCode ve QR len tren do'
    // va ta se~ edit the canvas that
    // Cuoi cung: dua the canvas ao? chua' QR code o tren vao the canvas that.
    const canvas = canvasRef.current!;

    canvas.height = width + 70;
    canvas.width = width;

    const canvasContext = canvas.getContext("2d")!;
    canvasContext.fillStyle = "#fff";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.font = "20px Arial";
    canvasContext.fillStyle = "#000";
    canvasContext.textAlign = "center";
    canvasContext.fillText(
      `Bàn số ${tableNumber}`,
      canvas.width / 2,
      canvas.width + 20
    );
    canvasContext.fillText(
      `Quét mâ QR để gọi món`,
      canvas.width / 2,
      canvas.width + 50
    );
    const virtalCanvas = document.createElement("canvas");
    QRCode.toCanvas(
      virtalCanvas,
      getTableLink({ token, tableNumber }),
      {
        margin: 4,
      },
      function (error) {
        if (error) console.error(error);
        canvasContext.drawImage(virtalCanvas, 0, 0, width, width);
      }
    );
  }, [token, tableNumber, width]);

  return <canvas ref={canvasRef} />;
}
