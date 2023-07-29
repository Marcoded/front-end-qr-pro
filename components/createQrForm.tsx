"use client";
import * as React from "react";
import { useToast } from "@/components/ui/use-toast";
import fileDownload from "js-file-download";
import { useRouter } from 'next/navigation'


import { HexColorPicker, HexColorInput } from "react-colorful";
import { useState, ChangeEvent } from "react";
import urlValidator from "@/lib/urlValidator";
import CustomAxios from "@/lib/customAxios";
import { QRCodeCanvas } from "qrcode.react";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface QrCodeFormState {
  title: string;
  targetUrl: string;
  mainColor: string;
  autoDownload: boolean;
  id?: string;
}

interface CreateQrFormProps {
  mode: "create" | "edit";
  initialState?: Partial<QrCodeFormState>;
}

export function CreateQrForm({ mode, initialState }: CreateQrFormProps) {
  const axiosInstance = CustomAxios();

  const [QrCodeData, setQrCodeData] = useState<QrCodeFormState>({
    title: initialState?.title || "",
    targetUrl: initialState?.targetUrl || "",
    mainColor: initialState?.mainColor || "#000000",
    autoDownload: initialState?.autoDownload || true,
    id: initialState?.id,
  });

  const [qrCodeSvgData, setQrCodeSvgData] = useState<string>("");

  const { toast } = useToast();
  const router = useRouter()

  const CreateQrCode = async () => {
    try {
      const response = await axiosInstance.post("/api/v1/qr_codes", {
        title: QrCodeData.title,
        target_url: QrCodeData.targetUrl,
        main_color: QrCodeData.mainColor,
      });

      setQrCodeSvgData(response.data);
     

      // If autoDownload is true, download the QR code
      if (QrCodeData.autoDownload) {
        fileDownload(response.data, "qrcode.svg");
      }

      // Notify the user about the success
      toast({
        title: "Success",
        description: "QR Code has been successfully created.",
      });
    } catch (err) {
      console.error(err);

      // Notify the user about the error
      toast({
        title: "Error",
        description: "An error occurred while creating the QR Code.",
      });
    }
  };

  const EditQrCode = async () => {

    alert(QrCodeData.mainColor)

    try {
      const response = await axiosInstance.patch(`/api/v1/qr_codes/${QrCodeData.id}`, {
        title: QrCodeData.title,
        target_url: QrCodeData.targetUrl,
        main_color: QrCodeData.mainColor,
        id: QrCodeData.id,
      });
  
      setQrCodeSvgData(response.data);
    
      // If autoDownload is true, download the QR code
      if (QrCodeData.autoDownload) {
        fileDownload(response.data, "qrcode.svg");
      }

      // Notify the user about the success
      toast({
        title: "Success",
        description: "QR Code has been successfully created.",
      });
    } catch (err) {
      console.error(err);

      // Notify the user about the error
      toast({
        title: "Error",
        description: "An error occurred while creating the QR Code.",
      });
    }
  };

  const generateSvgUrl = (svg_data: string) => {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg_data)}`;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQrCodeData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    console.log(QrCodeData);
  };

  const handleColorChange = (newColor: string) => {
    setQrCodeData((prevState) => ({
      ...prevState,
      mainColor: newColor,
    }));
    console.log(QrCodeData);
  };

  const handleSwitchChange = () => {
    setQrCodeData((prevState) => ({
      ...prevState,
      autoDownload: !prevState.autoDownload,
    }));
  };

  const handleSubmit = (e: any) => {
    console.log("submiting Qr");
    e.preventDefault();
    if (!urlValidator(QrCodeData.targetUrl)) {
      return alert("Invalid URL");
    }
     if (mode === "create") CreateQrCode();
     if (mode === "edit") EditQrCode()
    router.push('/dashboard')
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        { mode === "create" && <CardTitle>Create a new QR Code</CardTitle>}
        { mode === "edit" && <CardTitle>Edit a QR Code</CardTitle>}
        <CardDescription>
          Fill the form bellow to create a new QR Code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid grid-cols-1 items-center gap-5 ">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="title"
                  value={QrCodeData.title}
                  onChange={handleTextChange}
                  placeholder="Restaurant menu V1"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  name="targetUrl"
                  value={QrCodeData.targetUrl}
                  onChange={handleTextChange}
                  placeholder="http://example.com"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="mainColor">Main color</Label>
                <Popover>
                  <PopoverTrigger>
                    <Input
                      id="mainColor"
                      style={{ backgroundColor: QrCodeData.mainColor }}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="flex flex-col">
                    <HexColorPicker
                      className="w-full "
                      color={QrCodeData.mainColor}
                      onChange={handleColorChange}
                    />
                    <HexColorInput
                      className="w-full"
                      color={QrCodeData.mainColor}
                      onChange={handleColorChange}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-download"
                  checked={QrCodeData.autoDownload}
                  onClick={handleSwitchChange}
                />
                <Label htmlFor="auto-download">Auto Download</Label>
              </div>
            </div>

            <QRCodeCanvas
              fgColor={QrCodeData.mainColor}
              size={200}
              className=" mx-auto h-64 rounded-xl  shadow-xl"
              value="https://example.com/"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSubmit}>Create QR code</Button>
      </CardFooter>
    </Card>
  );
}
