import * as jscad from "@jscad/modeling"

const { line, polygon, star } = jscad.primitives
const { extrudeRectangular, extrudeLinear, extrudeRotate } = jscad.extrusions
const { translate } = jscad.transforms
const { expand } = jscad.expansions

export const extruderFunctionsExample = () => {
  const shapes = []
  const aLine = line([
    [0, 0],
    [0, 5],
    [2, 8],
    [5, 9],
  ])
  shapes.push(translate([-17, 0, 0], aLine))

  const aRectangularExtrude = extrudeRectangular({ size: 1, height: 1 }, aLine)
  shapes.push(translate([-12, 0, 0], aRectangularExtrude))

  const anExpandedExtrude = extrudeLinear(
    { height: 1 },
    expand({ delta: 1, corners: "round", segments: 32 }, aLine)
  )
  shapes.push(translate([-7, 0, 0], anExpandedExtrude))

  const poly = polygon({
    points: [
      [-1, -1],
      [3, -1],
      [3.5, 2],
      [2, 1],
      [1, 2],
      [0, 1],
      [-1, 2],
    ],
  })
  const extrudedPoly = extrudeLinear(
    { height: 5, twistAngle: Math.PI / 4, twistSteps: 10 },
    poly
  )
  shapes.push(translate([-1, 0, 0], extrudedPoly))

  const starPoly = translate([3, 0, 0], star())
  const extrudedStar = extrudeRotate(
    { segments: 32, startAngle: 0, angle: Math.PI * 0.75, overflow: "cap" },
    starPoly
  )
  shapes.push(translate([9, 0, 0], extrudedStar))

  return shapes
}

export const extruderFunctionsExampleString = `// import * as jscad from '@jscad/modeling'

const { line, polygon, star } = jscad.primitives
const { extrudeRectangular, extrudeLinear, extrudeRotate } = jscad.extrusions
const { translate } = jscad.transforms
const { expand } = jscad.expansions

const main = () => {
  const shapes = []
  const aLine = line([[0, 0], [0, 5], [2, 8], [5, 9]])
  shapes.push(translate([-17, 0, 0], aLine))

  const aRectangularExtrude = extrudeRectangular({ size: 1, height: 1 }, aLine)
  shapes.push(translate([-12, 0, 0], aRectangularExtrude))

  const anExpandedExtrude = extrudeLinear({ height: 1 }, expand({ delta: 1, corners: 'round', segments: 32 }, aLine))
  shapes.push(translate([-7, 0, 0], anExpandedExtrude))

  const poly = polygon({ points: [[-1, -1], [3, -1], [3.5, 2], [2, 1], [1, 2], [0, 1], [-1, 2]] })
  const extrudedPoly = extrudeLinear({ height: 5, twistAngle: Math.PI / 4, twistSteps: 10 }, poly)
  shapes.push(translate([-1, 0, 0], extrudedPoly))

  const starPoly = translate([3, 0, 0], star())
  const extrudedStar = extrudeRotate({ segments: 32, startAngle: 0, angle: (Math.PI * 0.75), overflow: 'cap' }, starPoly)
  shapes.push(translate([9, 0, 0], extrudedStar))

  return shapes
}

return main()
`
