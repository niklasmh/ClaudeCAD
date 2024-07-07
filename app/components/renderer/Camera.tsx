import { useThree } from "@react-three/fiber";
import { OrbitControls, OrbitControlsChangeEvent } from "@react-three/drei";
import { AxesHelper, Box3, Object3D, Object3DEventMap, Sphere, Vector3 } from "three";
import { useEffect, useRef } from "react";

type Props = {
  objectToFit: Object3D<Object3DEventMap> | null;
  cameraPosition?: Vector3;
  cameraPositionX?: number;
  cameraPositionY?: number;
  cameraPositionZ?: number;
  onPositionChange?: (position: Vector3) => void;
  zoom: number;
};

export function Camera({
  objectToFit,
  cameraPosition,
  cameraPositionX,
  cameraPositionY,
  cameraPositionZ,
  onPositionChange,
  zoom,
}: Props) {
  const { camera } = useThree();
  const controls = useRef<any>(null);
  const axis = useRef<AxesHelper>(null);
  const hasFit = useRef<boolean>(false);
  const centerPositionRef = useRef<Vector3>();
  const radiusRef = useRef<number>();

  useEffect(() => {
    if ((!hasFit.current || cameraPositionX || cameraPosition) && objectToFit && controls.current) {
      hasFit.current = true;
      const aabb = new Box3().setFromObject(objectToFit);
      const sphere = aabb.getBoundingSphere(new Sphere());
      const { center, radius } = sphere;
      centerPositionRef.current = center;
      radiusRef.current = radius;
      camera.zoom = (120 / radius) * zoom;
      camera.near = 0.1 * radius;
      camera.far = 1000 * radius;
      if (cameraPositionX && cameraPositionY && cameraPositionZ) {
        camera.position.set(
          center.x + cameraPositionX * radius,
          center.y + cameraPositionY * radius,
          center.z + cameraPositionZ * radius
        );
      } else if (cameraPosition) {
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
  }, [objectToFit, cameraPosition, cameraPositionX, cameraPositionY, cameraPositionZ, zoom]);

  const sendCameraChange = (position: Vector3, center: Vector3, radius: number) => {
    const { x, y, z } = position;
    onPositionChange?.(new Vector3((x - center.x) / radius, (y - center.y) / radius, (z - center.z) / radius));
  };

  const handleCameraChange = (event: OrbitControlsChangeEvent) => {
    const position = event.target.object.position;
    const center = centerPositionRef.current;
    const radius = radiusRef.current;
    if (position && center && radius) {
      sendCameraChange(position, center, radius);
      setTimeout(() => {
        sendCameraChange(position, center, radius);
      }, 500);
    }
  };

  return (
    <>
      <ambientLight intensity={Math.PI / 2} />
      <directionalLight intensity={Math.PI} position={[1, 2, -1.5]} />
      <axesHelper ref={axis} />
      <OrbitControls
        ref={controls}
        args={[camera]}
        onEnd={(e) => onPositionChange && e && handleCameraChange(e as any)}
      />
    </>
  );
}
