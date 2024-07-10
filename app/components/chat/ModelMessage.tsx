import * as io from "@jscad/io";
import { LLMModelMessage } from "@/app/types/llm";
import {
  Download,
  Minus,
  Pen,
  Pencil,
  Plus,
  Redo,
  Rotate3D,
  Scissors,
  Send,
  ThumbsDown,
  ThumbsUp,
  Trash,
  Undo,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ReactSketchCanvasRef } from "react-sketch-canvas";
import { SketchInput } from "./SketchInput";
import { getImageFromCanvas } from "@/app/helpers/extractImage";
import { Viewer } from "../renderer/Viewer";
import { Vector3 } from "three";
import { mergeImages } from "@/app/helpers/mergeImages";
import { useAppStore } from "@/app/store";
import { SpeechInput } from "./SpeechInput";

type Props = {
  message: LLMModelMessage;
  onSketch: (sketchImage: string, modelImage: string, normalMapImages: string, request: string) => void;
  onDelete: () => void;
};

export const ModelMessage = ({ message, onSketch, onDelete }: Props) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [cameraPositionX, setCameraPositionX] = useState<number>(1);
  const [cameraPositionY, setCameraPositionY] = useState<number>(1);
  const [cameraPositionZ, setCameraPositionZ] = useState<number>(1);
  const modelCanvasRef = useRef<HTMLCanvasElement>(null);
  const modelNormalMapCanvasRef = useRef<HTMLCanvasElement>(null);
  const modelNormalMapTopCanvasRef = useRef<HTMLCanvasElement>(null);
  const modelNormalMapFrontCanvasRef = useRef<HTMLCanvasElement>(null);
  const modelNormalMapSideCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<ReactSketchCanvasRef>(null);
  const [request, setRequest] = useState<string>("");
  const [_, setUpdateID] = useState<string>("");

  const projectName = useAppStore((state) => state.projectName);
  const setProjectName = useAppStore((state) => state.setProjectName);

  const handleToggleEditButtonClick = () => {
    setEdit((edit) => !edit);
  };

  const handleSaveEditButtonClick = async (customRequest: string = "") => {
    setEdit(false);

    const sketchImage = await getImageFromCanvas(drawingCanvasRef.current);
    const modelImage = await getImageFromCanvas(modelCanvasRef.current);

    const modelNormalMapImage = await getImageFromCanvas(modelNormalMapCanvasRef.current);
    const modelNormalMapTopImage = await getImageFromCanvas(modelNormalMapTopCanvasRef.current);
    const modelNormalMapFrontImage = await getImageFromCanvas(modelNormalMapFrontCanvasRef.current);
    const modelNormalMapSideImage = await getImageFromCanvas(modelNormalMapSideCanvasRef.current);

    const modelNormalMapImages =
      (await mergeImages(
        [modelNormalMapImage, modelNormalMapTopImage, modelNormalMapFrontImage, modelNormalMapSideImage],
        {
          positions: [
            { x: 128, y: 128 },
            { x: 0, y: 128 },
            { x: 0, y: 0 },
            { x: 128, y: 0 },
          ],
          sizes: [
            { width: 128, height: 128 },
            { width: 128, height: 128 },
            { width: 128, height: 128 },
            { width: 128, height: 128 },
          ],
        }
      )) ?? "";

    onSketch(sketchImage, modelImage, modelNormalMapImages, customRequest || request);
  };

  const handleNotCorrectButtonClick = () => {
    handleSaveEditButtonClick("Not correct. Make it again.");
  };

  const handleCloseToGoodButtonClick = () => {
    handleSaveEditButtonClick("Almost there! Make it again.");
  };

  const handleCutButtonClick = () => {
    handleSaveEditButtonClick(
      "Cut off the marked area of the model using a boolean operation. The cut should have the same shape as in the sketch, and go straight through."
    );
  };

  const handleClearEditButtonClick = () => {
    drawingCanvasRef.current?.clearCanvas();
    setIsDirty(false);
  };

  const handleUndoClick = () => {
    drawingCanvasRef.current?.undo();
  };

  const handleRedoClick = () => {
    drawingCanvasRef.current?.redo();
  };

  const handleDownloadButtonClick = () => {
    const rawData = io.stlSerializer.serialize({ binary: false }, ...message.originalGeometries);
    const blob = new Blob([rawData]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    if (projectName) {
      link.download = projectName + ".stl";
    } else {
      const newProjectName = prompt("Please enter a project name", "My ClaudeCAD Project");
      if (newProjectName) {
        setProjectName(newProjectName);
        link.download = newProjectName + ".stl";
      } else {
        setProjectName("model");
        link.download = "model.stl";
      }
    }
    link.click();
    URL.revokeObjectURL(url);
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
        <div onClick={handleToggleEditButtonClick} className="hover:opacity-80 cursor-pointer" title="Rotate model">
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
      {!edit && (
        <div className="flex flex-row flex-wrap gap-2 items-center">
          <button onClick={handleNotCorrectButtonClick} className="btn btn-sm btn-error">
            Far away <ThumbsDown size={16} />
          </button>
          <button onClick={handleCloseToGoodButtonClick} className="btn btn-sm btn-success">
            Almost there <ThumbsUp size={16} />
          </button>
        </div>
      )}
      {edit && (
        <div className="flex flex-row flex-wrap gap-2 items-center">
          <button onClick={handleCutButtonClick} className="btn btn-sm btn-success" disabled={!isDirty}>
            Cut marked area <Scissors size={16} />
          </button>
          <button onClick={handleUndoClick} className="btn btn-sm btn-square btn-outline">
            <Undo size={16} />
          </button>
          <button onClick={handleRedoClick} className="btn btn-sm btn-square btn-outline">
            <Redo size={16} />
          </button>
        </div>
      )}
      <label className="flex flex-row gap-2 items-center justify-center cursor-pointer">
        <span className="label-text flex flex-row gap-2 items-center">
          <Rotate3D size={16} />
          <span>Rotate</span>
        </span>
        <input type="checkbox" className="toggle" checked={edit} onChange={handleToggleEditButtonClick} />
        <span className="label-text flex flex-row gap-2 items-center">
          <Pen size={16} />
          <span>Sketch</span>
        </span>
      </label>
      <div className="relative w-full -mb-1">
        <textarea
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          className="textarea textarea-primary w-full min-h-[72px] h-[72px] pr-11"
          placeholder="E.g. Add hole through the top of the marked area."
        />
        <SpeechInput onChange={setRequest} className="self-start btn-sm btn-square absolute top-2 right-2" />
      </div>
      <div className="flex flex-row flex-wrap-reverse gap-2 items-center">
        <button onClick={handleDownloadButtonClick} className="btn btn-sm btn-primary">
          Download
          <Download size={16} />
        </button>
        <button onClick={() => handleSaveEditButtonClick()} className="btn btn-sm btn-success">
          Send request <Send size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="chat group chat-start pr-8">
      <div className="chat-header">Generated 3D model</div>
      <div className="chat-bubble relative p-3">
        <div className="relative mb-2">
          <div className="absolute invisible top-0 left-0 z-0 grid grid-cols-2 grid-rows-2">
            <Viewer
              ref={modelNormalMapFrontCanvasRef}
              applyNormalMap
              cameraPosition={new Vector3(0, 0, 1)}
              geometries={message.geometries}
              width={128}
              height={128}
              className="border-none"
            />
            <Viewer
              ref={modelNormalMapSideCanvasRef}
              applyNormalMap
              cameraPosition={new Vector3(1, 0, 0)}
              geometries={message.geometries}
              width={128}
              height={128}
              className="border-none"
            />
            <Viewer
              ref={modelNormalMapTopCanvasRef}
              applyNormalMap
              cameraPosition={new Vector3(0, 1, 0)}
              geometries={message.geometries}
              width={128}
              height={128}
              className="border-none"
            />
            <Viewer
              ref={modelNormalMapCanvasRef}
              applyNormalMap
              cameraPositionX={cameraPositionX}
              cameraPositionY={cameraPositionY}
              cameraPositionZ={cameraPositionZ}
              geometries={message.geometries}
              width={128}
              height={128}
              className="border-none"
            />
          </div>
          <Viewer
            ref={modelCanvasRef}
            geometries={message.geometries}
            width={256}
            height={256}
            onCameraPositionChange={({ x, y, z }) => {
              setCameraPositionX(x);
              setCameraPositionY(y);
              setCameraPositionZ(z);
            }}
          />
          <SketchInput
            ref={drawingCanvasRef}
            height={256}
            width={256}
            showControls={edit}
            className={`-mt-[256px] relative ${edit ? "" : "pointer-events-none"}`}
            onClear={handleClearEditButtonClick}
            toggleEraser={drawingCanvasRef.current?.eraseMode}
            transparent
            canvasProps={{
              onStroke: () => setIsDirty(true),
            }}
          />
        </div>
        {controls}
        {tools}
      </div>
      <div className="chat-footer opacity-50">Sent {new Date(message.date).toLocaleString()}</div>
    </div>
  );
};
