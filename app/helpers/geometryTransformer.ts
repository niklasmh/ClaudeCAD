import { Geom3 } from "@jscad/modeling/src/geometries/types"
import { entitiesFromSolids } from "@jscad/regl-renderer"
import { Geometry } from "../components/models/geometry"
import { Vector3, Matrix4 } from "three"

export const geometryTransformer = (geometry: Geom3[]): Geometry[] => {
  const entities = entitiesFromSolids({}, ...geometry)
  return entities.map((entity) => {
    let colors
    if (entity.geometry.color) {
      colors = new Float32Array(
        Array((entity.geometry as any).positions.length)
          .fill(entity.geometry.color)
          .flat(),
      )
    } else {
      colors = new Float32Array((entity.geometry as any).colors.flat())
    }
    const indices = new Uint32Array((entity.geometry as any).indices.flat())
    const normals = new Float32Array(
      (entity.geometry as any).normals
        .map((n: Float32Array) => [n[0], n[1], n[2]])
        .flat(),
    )
    const transforms = (entity.geometry as any).transforms as number[]

    const transformMatrix = new Matrix4(
      transforms[0],
      transforms[4],
      transforms[8],
      transforms[12],
      transforms[1],
      transforms[5],
      transforms[9],
      transforms[13],
      transforms[2],
      transforms[6],
      transforms[10],
      transforms[14],
      transforms[3],
      transforms[7],
      transforms[11],
      transforms[15],
    )

    const vertices = new Float32Array((entity.geometry as any).positions.flat())

    for (let i = 0; i < vertices.length; i += 3) {
      const vertex = new Vector3(vertices[i], vertices[i + 1], vertices[i + 2])
      vertex.applyMatrix4(transformMatrix)
      vertices[i] = vertex.x
      vertices[i + 1] = vertex.y
      vertices[i + 2] = vertex.z
    }

    return {
      vertices,
      indices,
      normals,
      colors,
    }
  })
}
