"use client";

import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { QrCodeContext } from "@/app/context/qrCodeContext";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import * as React from "react";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import fileDownload from "js-file-download";
import { useRouter } from "next/navigation";

import { HexColorPicker, HexColorInput } from "react-colorful";
import urlValidator from "@/lib/urlValidator";
import CustomAxios from "@/lib/customAxios";
import { QRCodeCanvas } from "qrcode.react";

import { Switch } from "@/components/ui/switch";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Usage } from "@/app/context/qrCodeContext";

// TO DELETE, WHEN CREATING A QR CODE WE MIGHT NOT NEED TO RETURN ALL ITS ATTRIBUTE TO THE SERVER, ONLY SVGDATA
interface QrCodeFromServer {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  target_url: string;
  random_server_url: string;
  qr_code_data: string;
  clerk_user_id: string;
  main_color: string;
}

interface QrFormProps {
  mode: "create" | "edit";
  styling: "none" | "dropdownElement";
  facadeText: string;
  qrCodeIdFromProps?: string;
}

interface QrCodeState {
  qrCodeIdState: string;
  title: string;
  targetUrl: string;
  qr_code_data: string;
  mainColor: string;
  autoDownload: boolean;
  validUrl: boolean;
}

export const QrForm: React.FC<QrFormProps> = ({
  mode,
  facadeText,
  qrCodeIdFromProps,
  styling,
}) => {
  const axiosInstance = CustomAxios();
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { fetchUserQrCodes, fetchUsage, usage } = useContext(QrCodeContext); // Refreshing QR code using our context fonction

  const [qrCodeState, setQrCodeState] = React.useState<QrCodeState>({
    qrCodeIdState: "",
    title: "",
    targetUrl: "",
    qr_code_data: "",
    mainColor: "black",
    autoDownload: true,
    validUrl: false,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setQrCodeState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSwitchChange = () => {
    setQrCodeState((prevState) => ({
      ...prevState,
      autoDownload: !prevState.autoDownload,
    }));
  };

  const CreateQrCode = async () => {
    try {
      const response = await axiosInstance.post("/api/v1/qr_codes", {
        title: qrCodeState.title,
        target_url: qrCodeState.targetUrl,
        main_color: qrCodeState.mainColor,
      });

      const data = await response.data;

      setQrCodeState((prevState) => ({
        ...prevState,
        qr_code_data: data.qr_code_data,
      }));

      if (qrCodeState.autoDownload) {
        fileDownload(data.qr_code_data, qrCodeState.title + ".svg");
      }

      fetchUserQrCodes();
      fetchUsage()

      toast({
        title: "Success",
        description: "QR Code has been successfully created.",
      });

      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the QR Code.",
      });
    }
  };

  const EditQrCode = async () => {
    try {
      const response = await axiosInstance.patch(
        `/api/v1/qr_codes/${qrCodeState.qrCodeIdState}`,
        {
          title: qrCodeState.title,
          target_url: qrCodeState.targetUrl,
          main_color: qrCodeState.mainColor,
        }
      );
      const data = await response.data;
      setQrCodeState((prevState) => ({
        ...prevState,
        qr_code_data: data.qr_code_data,
      }));

      if (qrCodeState.autoDownload) {
        fileDownload(data.qr_code_data, qrCodeState.title + ".svg");
      }

      fetchUserQrCodes();

      toast({
        title: "Success",
        description: "QR Code has been successfully edited.",
      });

      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the QR Code.",
      });
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (qrCodeState.validUrl === false) {
      toast({
        title: "Url",
        description: "Please enter a valid url.",
      });
      return;
    }

    if (mode === "create") CreateQrCode();
    if (mode === "edit") EditQrCode();

    setOpen(false);
  };

  const fetchInitialData = async () => {
    if (mode === "create" || !qrCodeIdFromProps) return;

    try {
      const response = await axiosInstance.get(
        `/api/v1/qr_codes/${qrCodeIdFromProps}`
      );
      console.log("Data from initial qr fetch")
      console.table(response.data);
      const data: QrCodeFromServer = response.data;
      const { id, title, target_url, qr_code_data, main_color } = data;

      setQrCodeState((prevState) => ({
        ...prevState,
        qrCodeIdState: id,
        title,
        targetUrl: target_url,
        qr_code_data,
        mainColor: main_color ,
      }));
    } catch {
      toast({
        title: "Error",
        description:
          "An error occurred while fetching the QR Code, make sure you are logged in",
      });
    }
  };

  const handleColorChange = (color: string) => {
    setQrCodeState((prevState) => ({
      ...prevState,
      mainColor: color,
    }));
  };

  const toastLimitReached = () => {
    return toast({
      title: "Qr code limit reached",
      description:
        "You have reached the limit of your QR codes, please delete some to create a new one or consider upgrading to a pro plan",
    });
  };

  const renderTriggerContent = () => {
    if (!usage?.canCreate && mode === "create") {
      return (
        <Button
          className="bg-slate-600 hover:bg-slate-500"
          onClick={toastLimitReached}
        >
          {" "}
          {facadeText}
        </Button>
      );
    }

    if (styling === "none") {
      return (
        <DialogTrigger>
          {/* Can create new qr as usage is not full */}
          <Button>{facadeText}</Button>
        </DialogTrigger>
      );
    }

    return (
      <DialogTrigger className="w-full hover:text-white relative flex cursor-default select-none items-center rounded px-2 py-1.5 text-sm outline-none hover:bg-accent ease-in-out">
        {facadeText} 
      </DialogTrigger>
    );
  };

  useEffect(() => {
    fetchInitialData();
    fetchUsage();
  }, []);

  useEffect(() => {
    const isValidUrl = urlValidator(qrCodeState.targetUrl);
    setQrCodeState((prevState) => ({
      ...prevState,
      validUrl: isValidUrl,
    }));
  }, [qrCodeState.targetUrl]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {renderTriggerContent()}

      <DialogContent className="">
        <CardHeader>
          {mode === "create" && (
            <CardTitle>new form - Create a new QR Code</CardTitle>
          )}
          {mode === "edit" && <CardTitle> new form - Edit a QR Code</CardTitle>}

          {mode === "create" && (
            <CardDescription>
              Fill the form bellow to create a new QR code
            </CardDescription>
          )}
          {mode === "edit" && (
            <CardDescription>
              Fill the form bellow to edit your QR code
            </CardDescription>
          )}
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
                    placeholder="Restaurant menu V1"
                    value={qrCodeState.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    name="targetUrl"
                    placeholder="http://example.com"
                    value={qrCodeState.targetUrl}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="mainColor">Main color</Label>
                  <Popover>
                    <PopoverTrigger>
                      <Input
                        id="mainColor"
                        style={{ backgroundColor: qrCodeState.mainColor }}
                      />
                    </PopoverTrigger>
                    <PopoverContent className="flex flex-col">
                      <HexColorPicker
                        className="w-full "
                        color={qrCodeState.mainColor}
                        onChange={handleColorChange}
                      />
                      <HexColorInput className="w-full" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-download"
                    checked={qrCodeState.autoDownload}
                    onClick={handleSwitchChange}
                  />
                  <Label htmlFor="auto-download">Auto Download</Label>
                </div>
              </div>

              <QRCodeCanvas
                size={200}
                className="mx-auto h-64 rounded-xl shadow-xl"
                value="https://example.com/" // this should be targetUrl to generate QR code based on the inputted URL
                fgColor={qrCodeState.mainColor}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>

          {mode === "create" && (
            <Button onClick={handleSubmit}>Create QR code</Button>
          )}
          {mode === "edit" && (
            <Button onClick={handleSubmit}>Save changes</Button>
          )}
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
};
