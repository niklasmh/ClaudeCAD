import { DoubleSide, MeshNormalMaterial, MeshNormalMaterialParameters } from "three";
import { ExtendedColors, NodeProps, Overwrite, extend } from "@react-three/fiber";
import { Geometry } from "../../types/geometry";
import { shaderMaterial } from "@react-three/drei";

const MappingMaterial = shaderMaterial(
  {},
  `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    varying vec3 vNormal;
    void main() {
      vec3 n = normalize(vNormal);
      vec3 color = n * 0.5 + 0.5;
      gl_FragColor = vec4(color.x, color.z, 1.0 - color.y, 1.0);
    }
  `
);

extend({ MappingMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mappingMaterial: ExtendedColors<
        Overwrite<Partial<MeshNormalMaterial>, NodeProps<MeshNormalMaterial, [MeshNormalMaterialParameters]>>
      >;
    }
  }
}

type Props = {
  geometry: Geometry;
  applyNormalMap?: boolean;
};

export function Entity({ applyNormalMap, geometry: { vertices, indices, normals, colors } }: Props) {
  return (
    <mesh>
      <bufferGeometry attach="geometry">
        <bufferAttribute attach="attributes-position" array={vertices} itemSize={3} count={vertices.length / 3} />
        <bufferAttribute attach="attributes-normal" array={normals} itemSize={3} count={normals.length / 3} />
        <bufferAttribute attach="attributes-color" array={colors} itemSize={4} count={colors.length / 4} />
        <bufferAttribute attach="index" array={indices} itemSize={1} count={indices.length} />
      </bufferGeometry>
      {applyNormalMap ? (
        <mappingMaterial side={DoubleSide} />
      ) : (
        <meshStandardMaterial attach="material" vertexColors side={DoubleSide} />
      )}
    </mesh>
  );
}
