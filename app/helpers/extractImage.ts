export function extractImage(canvasElement: HTMLCanvasElement): string {
  return canvasElement.toDataURL()
}
