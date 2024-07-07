import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Entity } from "../renderer/Entity";
import { Geometry } from "../../types/geometry";
import { AxesHelper, Box3, Group, Object3D, Object3DEventMap, Sphere, Vector3 } from "three";
import { ForwardedRef, forwardRef, useRef } from "react";

type CameraProps = { objectToFit: Object3D<Object3DEventMap> | null; cameraPosition?: Vector3; zoom: number };

function Camera({ objectToFit, cameraPosition, zoom }: CameraProps) {
  const { camera } = useThree();
  const controls = useRef<any>(null);
  const axis = useRef<AxesHelper>(null);

  if (objectToFit && controls.current) {
    const aabb = new Box3().setFromObject(objectToFit);
    const sphere = aabb.getBoundingSphere(new Sphere());
    const { center, radius } = sphere;
    camera.zoom = (120 / radius) * zoom;
    camera.near = 0.1 * radius;
    camera.far = 1000 * radius;
    if (cameraPosition) {
      camera.position.set(
        center.x + cameraPosition.x * radius,
        center.y + cameraPosition.y * radius,
        center.z + cameraPosition.z * radius
      );
    } else {
      camera.position.set(center.x + radius, center.y + radius, center.z + radius);
    }
    controls.current.target.set(center.x, center.y, center.z);
    camera.updateProjectionMatrix();
  }

  return (
    <>
      <ambientLight intensity={Math.PI / 2} />
      <directionalLight intensity={Math.PI} position={[1, 2, -1.5]} />
      <axesHelper ref={axis} />
      <OrbitControls ref={controls} args={[camera]} />
    </>
  );
}

type Props = {
  className?: string;
  applyNormalMap?: boolean;
  cameraPosition?: Vector3;
  width?: number;
  height?: number;
  geometries: Geometry[];
};

export const Viewer = forwardRef(
  (
    { className = "", width = 256, height = 256, applyNormalMap = false, geometries, cameraPosition }: Props,
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
          <Camera objectToFit={groupRef.current} cameraPosition={cameraPosition} zoom={zoom} />
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
