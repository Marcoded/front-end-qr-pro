
import React from "react";
import { Button } from "@/components/ui/button";

interface qrCodeDownloaderProps {
  qrCodeSvgData: string;
}

export default function QrCodeDownloader(props: qrCodeDownloaderProps) {
  const generateSvgUrl = (qrCodeSvgData: string) => {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrCodeSvgData)}`;

  };

  return <a href={generateSvgUrl(props.qrCodeSvgData)} download="image.svg"><Button >Download SVG</Button></a>;
}
