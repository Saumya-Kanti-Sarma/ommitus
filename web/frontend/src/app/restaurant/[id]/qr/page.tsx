"use client";
import React, { useRef } from "react";
import QRCode from "react-qr-code";
import Cookies from "js-cookie";
import { toPng } from "html-to-image";
import Link from "next/link";

const Page = () => {
  const restaurantName = Cookies.get("restaurantName") || "Restaurant";
  const restaurantId = Cookies.get("restaurantId");
  const qrRef = useRef<HTMLDivElement>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL

  const handleDownload = async () => {
    if (qrRef.current) {
      try {
        const dataUrl = await toPng(qrRef.current);
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${restaurantName} menu.png`;
        link.click();
      } catch (err) {
        console.error("Failed to download image", err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <div
        ref={qrRef}
        className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full"
      >
        <h1 className="text-2xl font-bold text-[#03557E] mb-6">
          Welcome to <span className="text-[#1191D0]">{restaurantName}</span>
        </h1>

        <div className="flex justify-center bg-[#f5f5f5] p-4 rounded-xl mb-6">
          <QRCode value={`${BASE_URL}/customer/${restaurantName.replace(/\s+/g, "")}/${restaurantId}/menu`} />
        </div>

        <p className="text-[#5a5a5a] mb-6">
          Scan the QR code to access our menu
        </p>
      </div>

      <button
        onClick={handleDownload}
        className="w-[90%] max-w-[480px] py-3 rounded-xl font-semibold text-white bg-[#43AF8E] hover:bg-[#1191D0] transition-colors duration-300 shadow-md mt-10 max-md:hidden"
      >
        Download this
      </button>
      <Link href={`/customer/${restaurantName}/${restaurantId}/menu`} target="blank" className="text-blue-500 mt-5 hover:underline">Click here to visit</Link>
    </div>
  );
};

export default Page;
