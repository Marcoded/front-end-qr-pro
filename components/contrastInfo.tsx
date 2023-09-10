import chroma from "chroma-js";
import { Check, XCircle } from "lucide-react";
import React from "react";
interface TContrastInfoProps {
  color: string;
}

export default function ContrastInfo(props: TContrastInfoProps) {
  const computeContrast = () => {
    if (!chroma.valid(props.color)) return;

    const contrastThreshold = 6;
    return contrastThreshold < chroma.contrast("white", props.color);
  };

  return (
    <div className="flex justify-center gap-3 w-full">

      {computeContrast() === true ? (
        <div className="flex gap-3">
          <p>Readable </p>
          <Check className="stroke-green-500" />
        </div>
      ) : (
        <div className="flex gap-3">
          <p>Hard to scan</p>
          <XCircle className="stroke-destructive" />
        </div>
      )}
    </div>
  );
}
