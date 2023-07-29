import { useToast } from "@/components/ui/use-toast";
import CustomAxios from "@/lib/customAxios";
import { useContext } from "react";
import { QrCodeContext } from "@/app/context/qrCodeContext";

const DeleteQrCodeFromID = ({ qrCodeID }: { qrCodeID: string }) => {
  const { toast } = useToast();
  const { fetchUserQrCodes, fetchUsage } = useContext(QrCodeContext); // Refreshing QR code using our context fonction


  const axiosInstance = CustomAxios();

  const deleteQrCode = async (qr_id: string) => {
    try {
      await axiosInstance.delete(`api/v1/qr_codes/${qr_id}`);
      toast({
        title: "Qr Code Deleted",
      });
      fetchUserQrCodes(); // refetch all QR codes after delete
      fetchUsage(); // refetch usage after delete
    } catch (err) {
      console.error(err);
      toast({
        title: "Oops, something went wrong",
      });
    }
  };

  return (
    <div onClick={() => deleteQrCode(qrCodeID)}>
      Delete QrCode
    </div>
  );
};

export default DeleteQrCodeFromID;
