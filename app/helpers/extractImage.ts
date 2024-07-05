import { ReactSketchCanvasRef } from "react-sketch-canvas";

export const extractImage = (canvasElement: HTMLCanvasElement): string => {
  return canvasElement.toDataURL("image/png");
};

export const getImageFromCanvas = async (canvas: HTMLCanvasElement | ReactSketchCanvasRef | null): Promise<string> => {
  if (!canvas) {
    return "";
  }

  if (canvas instanceof HTMLCanvasElement) {
    return extractImage(canvas);
  }

  return await canvas.exportImage("png");
};
