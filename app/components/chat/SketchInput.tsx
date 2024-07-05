import { Check } from "lucide-react";
import { ForwardedRef, forwardRef, useRef, useState } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

type Props = {
  width?: number;
  height?: number;
  onClear?: () => void;
  canvasProps?: React.ComponentProps<typeof ReactSketchCanvas>;
};

export const SketchInput = forwardRef(
  (
    { width = 256, height = 256, onClear, canvasProps }: Props,
    drawingCanvasRef: ForwardedRef<ReactSketchCanvasRef>
  ) => {
    const [strokeColor, setStrokeColor] = useState("#000000");

    return (
      <div className="flex flex-col gap-4">
        <ReactSketchCanvas
          ref={drawingCanvasRef}
          width={width + "px"}
          height={height + "px"}
          strokeColor={strokeColor}
          canvasColor="#ffffff"
          className="rounded-lg overflow-hidden"
          {...canvasProps}
        />

        <div className="flex flex-row gap-4">
          <button
            onClick={() => {
              setStrokeColor("#000000");
            }}
            className={`btn aspect-square bg-black hover:bg-gray-900 text-white p-0`}
          >
            {strokeColor === "#000000" ? <Check /> : ""}
          </button>
          <button
            onClick={() => {
              setStrokeColor("#ff0000");
            }}
            className={`btn aspect-square bg-red-300 hover:bg-red-300/80 text-black p-0`}
          >
            {strokeColor === "#ff0000" ? <Check /> : ""}
          </button>
          <button
            onClick={() => {
              setStrokeColor("#00ff00");
            }}
            className={`btn aspect-square bg-green-300 hover:bg-green-300/80 text-black p-0`}
          >
            {strokeColor === "#00ff00" ? <Check /> : ""}
          </button>
          <button
            onClick={() => {
              setStrokeColor("#0000ff");
            }}
            className={`btn aspect-square bg-blue-300 hover:bg-blue-300/80 text-black p-0`}
          >
            {strokeColor === "#0000ff" ? <Check /> : ""}
          </button>
          <button onClick={() => onClear?.()} className="btn btn-error">
            Clear
          </button>
        </div>
      </div>
    );
  }
);
