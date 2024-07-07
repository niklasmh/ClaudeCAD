import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { AxesHelper, Box3, Object3D, Object3DEventMap, Sphere, Vector3 } from "three";
import { useRef } from "react";

type Props = {
  objectToFit: Object3D<Object3DEventMap> | null;
  cameraPosition?: Vector3;
  zoom: number;
};

export function Camera({ objectToFit, cameraPosition, zoom }: Props) {
  const { camera } = useThree();
  const controls = useRef<any>(null);
  const axis = useRef<AxesHelper>(null);
  const hasFit = useRef<boolean>(false);

  if (!hasFit.current && objectToFit && controls.current) {
    hasFit.current = true;
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
