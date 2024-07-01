import { primitives, transforms, booleans, colors } from "@jscad/modeling"

const { cube, sphere } = primitives
const { translate } = transforms
const { colorize } = colors
const { union, subtract, intersect } = booleans

export const booleanExample = () => {
  const aCube = colorize([1, 0, 0], translate([0, 0, 0], cube()))
  const aSphere = colorize(
    [0, 1, 0],
    translate([-0.2, -0.8, 0.8], sphere({ segments: 32 }))
  )

  const aUnion = union(aCube, aSphere)
  const aSubtract = subtract(aCube, aSphere)
  const aIntersection = intersect(aCube, aSphere)
  return [
    aCube,
    aSphere,
    translate([3, 0, 0], aUnion),
    translate([6, 0, 0], aSubtract),
    translate([9, 0, 0], aIntersection),
  ]
}

export const booleanExampleString = `// import * as jscad from "@jscad/modeling"

const { cube, sphere } = jscad.primitives
const { translate } = jscad.transforms
const { colorize } = jscad.colors
const { union, subtract, intersect } = jscad.booleans

const main = () => {
  const aCube = colorize([1, 0, 0], translate([0, 0, 0], cube()))
  const aSphere = colorize(
    [0, 1, 0],
    translate([-0.2, -0.8, 0.8], sphere({ segments: 32 }))
  )

  const aUnion = union(aCube, aSphere)
  const aSubtract = subtract(aCube, aSphere)
  const aIntersection = intersect(aCube, aSphere)
  return [
    aCube,
    aSphere,
    translate([3, 0, 0], aUnion),
    translate([6, 0, 0], aSubtract),
    translate([9, 0, 0], aIntersection),
  ]
}

return main()
`
