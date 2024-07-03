"use client";

import { useRef, useState } from "react";
import * as jscad from "@jscad/modeling";
import { CodeEditor } from "./components/editor/Editor";
import { Viewer } from "./components/renderer/Viewer";
import { booleanExample, booleanExampleString } from "./examples/boolean";
import { geometryTransformer } from "./helpers/geometryTransformer";
import { Geometry } from "./components/models/geometry";
import { extruderFunctionsExample, extruderFunctionsExampleString } from "./examples/extruderFunctions";
import { extractError } from "./helpers/extractError";
import { extractImage } from "./helpers/extractImage";
import { llmConnector } from "./helpers/llmConnector";
import { generateCode } from "./prompts/generateCode";
import { fixCodeFromImage } from "./prompts/fixCodeFromImage";
import { fixCodeFromError } from "./prompts/fixCodeFromError";
import { extractCodeFromMessage } from "./helpers/extractCodeFromMessage";
import { LLMModel } from "./components/models/llm";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

const initialGeometries = geometryTransformer(booleanExample());
const model: LLMModel = "claude-3.5";

export default function Home() {
  const [geometries, setGeometries] = useState<Geometry[]>([]);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [basePrompt, setBasePrompt] = useState("Generate a pyramid with a square base.");
  const [loading, setLoading] = useState(false);
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);
  const [strokeColor, setStrokeColor] = useState("#000000");

  const runPrompt = async (type: "newCode" | "fixWithImage" | "fixWithError") => {
    setLoading(true);
    setError(null);

    try {
      let message = "";
      if (type === "newCode") {
        message = await llmConnector[model]([{ type: "text", text: generateCode(basePrompt), role: "user" }]);
      } else if (type === "fixWithImage" && image) {
        message = await llmConnector[model]([
          { type: "text", text: "Screenshot of JSCAD model:", role: "user" },
          { type: "image", image, role: "user" },
          {
            type: "text",
            text: fixCodeFromImage(basePrompt, prompt, code),
            role: "user",
          },
        ]);
      } else if (type === "fixWithError" && error) {
        message = await llmConnector[model]([{ type: "text", text: fixCodeFromError(code, error), role: "user" }]);
      }

      console.log(message);
      const newCode = extractCodeFromMessage(message);
      setCode(newCode);
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  const runCode = async () => {
    setError(null);

    try {
      const entities = new Function("jscad", code)(jscad);
      const geometries = geometryTransformer(entities);
      setGeometries(geometries);

      setTimeout(() => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const modelImage = extractImage(canvas);
        setModelImage(modelImage);
      }, 1000);
    } catch (e: any) {
      const details = extractError(e);
      let error = `${details.type}: ${details.message}`;
      if (details.lineNumber) {
        error += ` at ${details.lineNumber}`;
        if (details.columnNumber) {
          error += `:${details.columnNumber}`;
        }
      }
      setError(error);
      console.log(e);
    }
  };

  const mergeCanvas = async () => {
    const drawing = await canvasRef.current?.exportImage("png"); // Base64 string
    const resultCanvas = resultCanvasRef.current;

    if (drawing && modelImage && resultCanvas) {
      const context = resultCanvas.getContext("2d");

      if (context) {
        context.clearRect(0, 0, resultCanvas.width, resultCanvas.height);

        const modelImageEl = new Image();
        modelImageEl.src = modelImage;
        modelImageEl.onload = () => {
          context.drawImage(modelImageEl, 0, 0);

          const drawingEl = new Image();
          drawingEl.src = drawing;
          drawingEl.onload = () => {
            context.drawImage(drawingEl, 0, 0);

            setImage(resultCanvas.toDataURL());
          };
        };
      }
    }
  };

  return (
    <main className="w-screen h-screen flex flex-col">
      <h1 className="text-4xl text-center my-4">ClaudeCAD</h1>
      <div className="relative flex-1 flex flex-col">
        <CodeEditor {...{ code, setCode }} />
        {modelImage && (
          <button onClick={() => runPrompt("fixWithImage")} className="btn btn-success self-center">
            Evaluate
            {loading && <span className="loading loading-spinner loading-sm"></span>}
          </button>
        )}

        <div className="w-full flex flex-row gap-4 p-4">
          <textarea
            className="flex-1 input input-primary py-1 px-2 h-[60px]"
            value={basePrompt}
            onChange={(e) => setBasePrompt(e.target.value)}
          />
          {(modelImage || error) && (
            <textarea
              className="flex-1 input input-primary py-1 px-2 h-[60px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          )}
          <div className="flex flex-col gap-2">
            {code ? (
              <>
                {error ? (
                  <button
                    onClick={() => runPrompt("fixWithError")}
                    className="btn btn-error flex flex-row flex-wrap gap-2"
                  >
                    <span>Fix error</span>
                    {loading && <span className="loading loading-spinner loading-sm"></span>}
                  </button>
                ) : null}
                <button onClick={runCode} disabled={loading} className="btn btn-success">
                  Run code
                </button>
              </>
            ) : null}
            <button className="btn btn-primary" onClick={() => runPrompt("newCode")}>
              Generate code
              {loading && <span className="loading loading-spinner loading-sm"></span>}
            </button>
          </div>
        </div>

        <div className="relative" style={{ width: 256, height: 256 }}>
          <Viewer geometries={geometries} />
          <ReactSketchCanvas
            ref={canvasRef}
            width="256px"
            height="256px"
            strokeColor={strokeColor}
            canvasColor="transparent"
            className="absolute top-0 left-0"
          />
          <canvas
            ref={resultCanvasRef}
            onClick={mergeCanvas}
            width="256"
            height="256"
            className="absolute top-0 left-[110%] border-2 border-red-300 rounded-md"
          />
        </div>
        <div>
          <button onClick={() => setStrokeColor("#ff0000")} className="btn bg-red-300 hover:bg-red-300/80 text-black">
            Red
          </button>
          <button
            onClick={() => setStrokeColor("#00ff00")}
            className="btn bg-green-300 hover:bg-green-300/80 text-black"
          >
            Green
          </button>
          <button onClick={() => setStrokeColor("#0000ff")} className="btn bg-blue-300 hover:bg-blue-300/80 text-black">
            Blue
          </button>
          <button onClick={() => canvasRef.current?.clearCanvas()} className="btn btn-error">
            Clear
          </button>
        </div>
        {error && (
          <div className="fixed bottom-0 left-0 right-0 text-red-500 bg-black/20 whitespace-pre-wrap p-4">{error}</div>
        )}
        {/*<img src="/test.svg" alt="test" />*/}
      </div>
    </main>
  );
}
