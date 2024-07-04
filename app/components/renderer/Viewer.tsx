import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Entity } from "../renderer/Entity";
import { Geometry } from "../../types/geometry";
import { AxesHelper, Box3, Group, Object3D, Object3DEventMap, Sphere } from "three";
import { useRef } from "react";

type CameraProps = { objectToFit: Object3D<Object3DEventMap> | null; updateID: string };

function Camera({ objectToFit, updateID }: CameraProps) {
  const {
    camera,
    //size: { width, height },
  } = useThree();
  const controls = useRef<any>(null);
  const axis = useRef<AxesHelper>(null);

  if (objectToFit && controls.current) {
    const aabb = new Box3().setFromObject(objectToFit);
    const sphere = aabb.getBoundingSphere(new Sphere());
    const { center, radius } = sphere;
    camera.zoom = 120 / radius;
    camera.near = 0.1 * radius;
    camera.far = 1000 * radius;
    camera.position.set(center.x + radius, center.y + radius, center.z + radius);
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
  geometries: Geometry[];
  updateID: string;
};

export function Viewer({ geometries, updateID }: Props) {
  const uuid = Math.random().toString(36).substring(7);
  const groupRef = useRef<Group>(null);

  return (
    <div className="w-[256px] h-[256px] border border-primary rounded-lg">
      <Canvas
        orthographic
        camera={{ fov: 45, position: [100, 100, 100], far: 1000, near: 0.1 }}
        gl={{ preserveDrawingBuffer: true }}
        onCreated={({ gl }) => {
          gl.domElement.id = "model-canvas";
        }}
      >
        <Camera objectToFit={groupRef.current} updateID={updateID} />
        <group ref={groupRef} rotation={[-Math.PI / 2, 0, 0]}>
          {geometries.map((geometry, i) => (
            <Entity key={uuid + "-" + i} {...geometry} />
          ))}
        </group>
      </Canvas>
    </div>
  );
}
