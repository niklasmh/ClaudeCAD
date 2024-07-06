import { Check, Eraser, Trash } from "lucide-react";
import { ForwardedRef, forwardRef, useEffect, useState } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

type Props = {
  className?: string;
  transparent?: boolean;
  width?: number;
  height?: number;
  onClear?: () => void;
  toggleEraser?: (enable: boolean) => void;
  canvasProps?: React.ComponentProps<typeof ReactSketchCanvas>;
};

export const SketchInput = forwardRef(
  (
    { className = "", transparent, width = 256, height = 256, onClear, toggleEraser, canvasProps }: Props,
    drawingCanvasRef: ForwardedRef<ReactSketchCanvasRef>
  ) => {
    const [strokeColor, setStrokeColor] = useState("#000000");
    const [eraser, setEraser] = useState(false);

    const handleToggleEraser = () => {
      setEraser((e) => !e);
    };

    useEffect(() => {
      if (transparent) toggleEraser?.(eraser);
    }, [eraser]);

    return (
      <div className={"flex flex-col gap-2 " + className}>
        <ReactSketchCanvas
          ref={drawingCanvasRef}
          width={width + "px"}
          height={height + "px"}
          strokeColor={eraser ? "#ffffff" : strokeColor}
          strokeWidth={eraser ? 16 : 4}
          canvasColor={transparent ? "transparent" : "#ffffff"}
          className="rounded-lg overflow-hidden !border-none"
          {...canvasProps}
        />

        <div className="flex flex-row gap-2">
          <button
            onClick={() => {
              setStrokeColor("#000000");
              setEraser(false);
            }}
            className={`btn btn-sm aspect-square bg-black hover:bg-gray-900 text-white p-0`}
          >
            {strokeColor === "#000000" ? <Check /> : ""}
          </button>
          <button
            onClick={() => {
              setStrokeColor("#ff0000");
              setEraser(false);
            }}
            className={`btn btn-sm aspect-square bg-red-300 hover:bg-red-300/80 text-black p-0`}
          >
            {strokeColor === "#ff0000" ? <Check /> : ""}
          </button>
          <button
            onClick={() => {
              setStrokeColor("#00ff00");
              setEraser(false);
            }}
            className={`btn btn-sm aspect-square bg-green-300 hover:bg-green-300/80 text-black p-0`}
          >
            {strokeColor === "#00ff00" ? <Check /> : ""}
          </button>
          <button
            onClick={() => {
              setStrokeColor("#0000ff");
              setEraser(false);
            }}
            className={`btn btn-sm aspect-square bg-blue-300 hover:bg-blue-300/80 text-black p-0`}
          >
            {strokeColor === "#0000ff" ? <Check /> : ""}
          </button>
          <button
            onClick={handleToggleEraser}
            className={`btn btn-primary btn-sm aspect-square p-0 ${eraser ? "" : "btn-ghost"}`}
          >
            <Eraser size={20} />
          </button>
          <button
            onClick={() => {
              onClear?.();
              setEraser(false);
            }}
            className="btn btn-sm aspect-square p-0 btn-ghost"
          >
            <Trash size={20} />
          </button>
        </div>
      </div>
    );
  }
);
