

  import { useToast } from "@/components/ui/use-toast";



const CopyUrlToClipboard = ({ text }: { text: string }) => {
    const { toast } = useToast()
  
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(text);
        toast({
          title: "Copied to clipboard",
     
        });
      } catch (err) {
        console.error(err);
        toast({
          title: "Oops, something went wrong",
    
        });
      }
    };
  
    return (
      <div onClick={copyToClipboard}>
        Copy Url
      </div>
    );
  };


  export default CopyUrlToClipboard