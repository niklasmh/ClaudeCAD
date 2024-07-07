import { extractImage } from "./extractImage";

type Position = { x: number; y: number };
type Size = { width: number; height: number };

type Options = {
  positions?: Position[];
  sizes?: Size[];
  outputSize?: Size;
};

export const mergeImages = async (
  images: string[],
  { positions, sizes, outputSize = { width: 256, height: 256 } }: Options = {}
): Promise<string | undefined> => {
  const resultCanvas = document.createElement("canvas");
  resultCanvas.width = outputSize.width;
  resultCanvas.height = outputSize.height;
  const context = resultCanvas?.getContext("2d");

  if (!context) return;

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const position = positions?.[i] ?? { x: 0, y: 0 };
    const size = sizes?.[i] ?? outputSize;

    await new Promise<void>((resolve) => {
      const imageEl = new Image();
      imageEl.src = image;
      imageEl.onload = () => {
        context.drawImage(imageEl, position.x, position.y, size.width, size.height);
        resolve();
      };
    });
  }

  const image = extractImage(resultCanvas);

  resultCanvas.remove();

  return image;
};
