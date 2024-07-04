import { DoubleSide } from "three";
import { Geometry } from "../../types/geometry";

export function Entity({ vertices, indices, normals, colors }: Geometry) {
  return (
    <mesh>
      <bufferGeometry attach="geometry">
        <bufferAttribute attach="attributes-position" array={vertices} itemSize={3} count={vertices.length / 3} />
        <bufferAttribute attach="attributes-normal" array={normals} itemSize={3} count={normals.length / 3} />
        <bufferAttribute attach="attributes-color" array={colors} itemSize={4} count={colors.length / 4} />
        <bufferAttribute attach="index" array={indices} itemSize={1} count={indices.length} />
      </bufferGeometry>
      <meshStandardMaterial attach="material" vertexColors side={DoubleSide} />
    </mesh>
  );
}
