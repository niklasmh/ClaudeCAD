import { LLMModelMessage } from "@/app/types/llm";
import { Pen, Pencil, Rotate3D, Save, Send, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ReactSketchCanvasRef } from "react-sketch-canvas";
import { SketchInput } from "./SketchInput";
import { extractImage, getImageFromCanvas } from "@/app/helpers/extractImage";
import { Viewer } from "../renderer/Viewer";

type Props = {
  message: LLMModelMessage;
  onSketch: (sketchImage: string, modelImage: string, request: string) => void;
  onDelete: () => void;
};

export const ModelMessage = ({ message, onSketch, onDelete }: Props) => {
  const [edit, setEdit] = useState<boolean>(false);
  const modelCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<ReactSketchCanvasRef>(null);
  const [request, setRequest] = useState<string>("");
  const [updateID, setUpdateID] = useState<string>("");

  const handleToggleEditButtonClick = () => {
    setEdit((edit) => !edit);
  };

  const handleSaveEditButtonClick = async () => {
    setEdit(false);

    const sketchImage = await getImageFromCanvas(drawingCanvasRef.current);
    const modelImage = await getImageFromCanvas(modelCanvasRef.current);

    onSketch(sketchImage, modelImage, request);
  };

  const handleClearEditButtonClick = () => {
    drawingCanvasRef.current?.clearCanvas();
  };

  useEffect(() => {
    setTimeout(() => {
      setUpdateID(Math.random().toString());
    }, 1000);
  }, [message.geometries]);

  const tools = (
    <div className="absolute group-hover:visible invisible top-0 bottom-0 flex flex-row items-center mx-3 gap-2 opacity-30 left-full">
      {!edit && (
        <div onClick={handleToggleEditButtonClick} className="hover:opacity-80 cursor-pointer" title="Draw on model">
          <Pencil size={16} />
        </div>
      )}
      {edit && (
        <div onClick={handleSaveEditButtonClick} className="hover:opacity-80 cursor-pointer" title="Rotate model">
          <Rotate3D size={16} />
        </div>
      )}
      <div onClick={onDelete} className="hover:text-red-300 cursor-pointer" title="Remove message">
        <Trash size={16} />
      </div>
    </div>
  );

  const controls = (
    <div className="flex flex-col gap-2">
      <label className="flex flex-row gap-2 items-center cursor-pointer">
        <span className="label-text flex flex-row gap-2 items-center">
          <Rotate3D size={16} />
          <span>Rotate</span>
        </span>
        <input type="checkbox" className="toggle" checked={edit} onChange={handleToggleEditButtonClick} />
        <span className="label-text flex flex-row gap-2 items-center">
          <span>Sketch on model</span>
          <Pen size={16} />
        </span>
      </label>
      <textarea
        value={request}
        onChange={(e) => setRequest(e.target.value)}
        className="textarea textarea-primary min-h-[46px] h-[46px]"
        placeholder="E.g. Add hole through the top of the marked area."
      />
      <button onClick={handleSaveEditButtonClick} className="btn btn-sm btn-success">
        Request change <Send size={16} />
      </button>
    </div>
  );

  return (
    <div className="chat group chat-start pr-8">
      <div className="chat-header">3D model</div>
      <div className="chat-bubble relative p-3">
        <div className="relative mb-2">
          <Viewer ref={modelCanvasRef} geometries={message.geometries} updateID={""} width={256} height={256} />
          {edit && (
            <SketchInput
              ref={drawingCanvasRef}
              height={256}
              width={256}
              className="-mt-[256px] relative z-10"
              onClear={handleClearEditButtonClick}
              toggleEraser={drawingCanvasRef.current?.eraseMode}
              transparent
            />
          )}
        </div>
        {controls}
        {tools}
      </div>
      <div className="chat-footer opacity-50">Sent {new Date(message.date).toLocaleString()}</div>
    </div>
  );
};
