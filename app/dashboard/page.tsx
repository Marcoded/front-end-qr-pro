"use client";

import { Qrcode, columns } from "./columns";


import { Loader } from "lucide-react";
import { useContext, useEffect } from "react";
import { QrCodeContext } from "../context/qrCodeContext";
import { DataTable } from "./data-table";
import CustomAxios from "@/lib/customAxios";

interface Usage {
  activeQr: number;
  limit: number;
}

export default function DashBoard() {
  const { qrCodes, isLoading, fetchUserQrCodes } = useContext(QrCodeContext);
  const { usage, fetchUsage } = useContext(QrCodeContext);


  const colorUsage = () => {
    if (!usage || usage.QrLeft == null || usage.limit == null) return "";

    const usageRatio = usage.QrLeft / usage.limit;
    
    if (usageRatio >= 0.5) return "text-green-600";
    if (usageRatio >= 0.4) return "text-orange-300";
    if (usageRatio >= 0.3) return "text-orange-400";
    if (usageRatio >= 0.1) return "text-orange-500";
    
    return "text-red-300";
  };


  useEffect(() => {
    fetchUserQrCodes();
    fetchUsage();
  }, []);

  return (
    <div className="container mx-auto py-10">
      {usage && usage.QrLeft != null && usage.limit != null ? (
        <h1 >
          <span className={colorUsage()}>{usage.QrLeft}</span> QR left in your free plan
        </h1>
      ) : (
        <div className="flex justify-start">
          <h1>Loading usage data...</h1>
        </div>
      )}
  
      {!qrCodes && <Loader className="container mx-auto animate-spin" />}
      {qrCodes && <DataTable columns={columns} data={qrCodes} />}
    </div>
  );
      }
