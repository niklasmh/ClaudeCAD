import { Canvas } from "@react-three/fiber";
import { Entity } from "../renderer/Entity";
import { Geometry } from "../../types/geometry";
import { Group, Vector3 } from "three";
import { ForwardedRef, forwardRef, useRef } from "react";
import { Camera } from "./Camera";

type Props = {
  className?: string;
  applyNormalMap?: boolean;
  cameraPosition?: Vector3;
  cameraPositionX?: number;
  cameraPositionY?: number;
  cameraPositionZ?: number;
  onCameraPositionChange?: (position: Vector3) => void;
  width?: number;
  height?: number;
  geometries: Geometry[];
};

export const Viewer = forwardRef(
  (
    {
      className = "",
      width = 256,
      height = 256,
      applyNormalMap = false,
      geometries,
      cameraPosition,
      cameraPositionX,
      cameraPositionY,
      cameraPositionZ,
      onCameraPositionChange,
    }: Props,
    canvasRef: ForwardedRef<HTMLCanvasElement>
  ) => {
    const groupRef = useRef<Group>(null);
    const zoom = Math.min(width, height) / 256;

    return (
      <div
        className={"border border-primary rounded-lg " + className}
        style={{
          width,
          height,
        }}
      >
        <Canvas
          orthographic
          camera={{ fov: 45, position: [100, 100, 100], far: 1000, near: 0.1 }}
          gl={{ preserveDrawingBuffer: true }}
          ref={canvasRef}
        >
          <Camera
            objectToFit={groupRef.current}
            cameraPosition={cameraPosition}
            cameraPositionX={cameraPositionX}
            cameraPositionY={cameraPositionY}
            cameraPositionZ={cameraPositionZ}
            onPositionChange={onCameraPositionChange}
            zoom={zoom}
          />
          <group ref={groupRef} rotation={[-Math.PI / 2, 0, 0]}>
            {geometries.map((geometry, i) => (
              <Entity key={i} applyNormalMap={applyNormalMap} geometry={geometry} />
            ))}
          </group>
        </Canvas>
      </div>
    );
  }
);
