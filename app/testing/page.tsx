"use client"
import { QRCodeCanvas } from 'qrcode.react'

export default function page() {
  return (
    <QRCodeCanvas
    size={200}
    className="mx-auto h-64 rounded-xl shadow-xl"
    value="https://example.com/" // this should be targetUrl to generate QR code based on the inputted URL
    fgColor={"05f600"}
  />
  )
}
