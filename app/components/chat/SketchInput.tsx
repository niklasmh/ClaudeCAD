import { Check, Eraser, Image, Trash } from "lucide-react";
import { ForwardedRef, forwardRef, useEffect, useState } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

type Props = {
  className?: string;
  transparent?: boolean;
  width?: number;
  height?: number;
  onClear?: () => void;
  toggleEraser?: (enable: boolean) => void;
  showControls?: boolean;
  canvasProps?: React.ComponentProps<typeof ReactSketchCanvas>;
};

const colors = [
  {
    name: "Black",
    value: "#000000",
    className: "bg-black hover:bg-gray-900 text-white",
  },
  {
    name: "Red",
    value: "#ff0000",
    className: "bg-red-300 hover:bg-red-300/60 text-black",
  },
  {
    name: "Green",
    value: "#00ff00",
    className: "bg-green-300 hover:bg-green-300/60 text-black",
  },
  {
    name: "Blue",
    value: "#0000ff",
    className: "bg-blue-300 hover:bg-blue-300/60 text-black",
  },
];

export const SketchInput = forwardRef(
  (
    { className = "", transparent, width = 256, height = 256, onClear, toggleEraser, showControls, canvasProps }: Props,
    drawingCanvasRef: ForwardedRef<ReactSketchCanvasRef>
  ) => {
    const [strokeColor, setStrokeColor] = useState("#000000");
    const [eraser, setEraser] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState<string | undefined>();

    const handleToggleEraser = () => {
      setEraser((e) => !e);
    };

    const handleImageInput = (e: any) => {
      if (!e.target.files.length) return;

      const reader = new FileReader();

      reader.addEventListener("load", (evt: any) => {
        setBackgroundImage(evt.target.result);
      });

      reader.readAsDataURL(e.target.files[0]);
    };

    useEffect(() => {
      if (transparent) toggleEraser?.(eraser);
    }, [eraser, transparent, toggleEraser]);

    return (
      <div className={"flex flex-col gap-2 " + className}>
        <ReactSketchCanvas
          ref={drawingCanvasRef}
          width={width + "px"}
          height={height + "px"}
          strokeColor={eraser ? "#ffffff" : strokeColor}
          strokeWidth={eraser ? 16 : 4}
          canvasColor={transparent ? "transparent" : "#ffffff"}
          className="!rounded-lg overflow-hidden !border-none"
          {...canvasProps}
          {...(backgroundImage ? { backgroundImage, preserveBackgroundImageAspectRatio: "xMidYMid" } : {})}
        />

        {showControls && (
          <div className="flex flex-row gap-2 items-center">
            {colors.map(({ name, value, className }) => (
              <button
                key={value}
                onClick={() => {
                  setStrokeColor(value);
                  setEraser(false);
                }}
                className={`btn btn-sm rounded-full h-6 min-h-6 w-6 aspect-square ${className} p-0`}
                title={name}
              >
                {!eraser && strokeColor === value ? <Check size={16} /> : ""}
              </button>
            ))}
            <div className="divider divider-horizontal m-0" />
            <label className={`btn btn-primary btn-sm aspect-square p-0 ${eraser ? "" : "btn-ghost"}`}>
              <Image size={20} />
              <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleImageInput} />
            </label>
            <button
              onClick={handleToggleEraser}
              className={`btn btn-primary btn-sm aspect-square p-0 -mx-2 ${eraser ? "" : "btn-ghost"}`}
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
        )}
      </div>
    );
  }
);

SketchInput.displayName = "SketchInput";
