"use client"
// contexts/qrCodeContext.tsx

import React, { createContext, useState, useEffect } from 'react';
import CustomAxios from "@/lib/customAxios";

export type QrcodeServer = {
  clerk_user_id: string;
  title: string;
  target_url: string;
  qr_code_data: string;
  created_at: string;
  updated_at: string;
  id: string;
};

 export type Usage = {
  activeQr: number | null;
  limit: number |null
  canCreate: boolean |null
  QrLeft: number |null
}

type QrCodeProviderProps = {
  children: React.ReactNode;
};

export const QrCodeContext = createContext<{
  qrCodes: QrcodeServer[] | null;
  isLoading: boolean;
  fetchUserQrCodes: () => void;
  usage: Usage | null;
  fetchUsage: () => void;
}>({
  qrCodes: null,
  isLoading: false,
  fetchUserQrCodes: () => {},
  usage: null,
  fetchUsage: () => {},
});

export const QrCodeProvider: React.FC<QrCodeProviderProps> = ({ children }) => {
  const [qrCodes, setQrCodes] = useState<QrcodeServer[] | null>(null);
  const [usage, setUsage] = useState<Usage>({ activeQr: null, limit: null, canCreate:null, QrLeft:null });
  const [isLoading, setIsLoading] = useState(false);

  const axiosInstance = CustomAxios();

  const fetchUserQrCodes = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get('/api/v1/qr_codes/all_user_qr_codes');
      setQrCodes(res.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      // Handle error appropriately
    }
  };

  const fetchUsage = async () => {
    try {
      const response = await axiosInstance.get<Usage>("/api/v1/qr_usages/check_usage");
      setUsage(response.data);
    } catch (error) {
      console.error("Error occurred while fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchUserQrCodes();
    fetchUsage();
  }, []);

  return (
    <QrCodeContext.Provider value={{ qrCodes, isLoading, fetchUserQrCodes, usage, fetchUsage }}>
      {children}
    </QrCodeContext.Provider>
  );
};