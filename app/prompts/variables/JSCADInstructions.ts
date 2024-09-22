export const JSCADInstructions = `
// These are the available primitives for constructing 2D and 3D geometries in JSCAD (found in jscad.primitives):

/**
 * Construct an arc in 2D space.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0]] - center of the arc
 * @param {Number} [options.radius=1] - radius of the arc
 * @param {Number} [options.startAngle=0] - starting angle of the arc in radians
 * @param {Number} [options.endAngle=TAU] - ending angle of the arc in radians
 * @param {Number} [options.segments=32] - number of segments per full rotation
 * @param {Boolean} [options.makeTangent=false] - adds tangent line segments at arc ends
 * @returns {path2} new 2D path
 */
function arc(options) {}

/**
 * Construct a circle in 2D space.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0]] - center of the circle
 * @param {Number} [options.radius=1] - radius of the circle
 * @param {Number} [options.startAngle=0] - start angle in radians
 * @param {Number} [options.endAngle=TAU] - end angle in radians
 * @param {Number} [options.segments=32] - segments per full rotation
 * @returns {geom2} new 2D geometry
 */
function circle(options) {}

/**
 * Construct a cube in 3D space.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0,0]] - center of the cube
 * @param {Number} [options.size=2] - size of the cube
 * @returns {geom3} new 3D geometry
 */
function cube(options) {}

/**
 * Construct a cuboid in 3D space.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0,0]] - center of the cuboid
 * @param {Array} [options.size=[2,2,2]] - dimensions of cuboid (width, depth, height)
 * @returns {geom3} new 3D geometry
 */
function cuboid(options) {}

/**
 * Construct a cylinder in 3D space.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0,0]] - center of the cylinder
 * @param {Number} [options.height=2] - height of the cylinder
 * @param {Number} [options.radius=1] - radius of the cylinder
 * @param {Number} [options.segments=32] - segments per full rotation
 * @returns {geom3} new 3D geometry
 */
function cylinder(options) {}

/**
 * Construct an elliptic cylinder in 3D space.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0,0]] - center of the cylinder
 * @param {Number} [options.height=2] - height of the cylinder
 * @param {Array} [options.startRadius=[1,1]] - start radius of the cylinder
 * @param {Array} [options.endRadius=[1,1]] - end radius of the cylinder
 * @param {Number} [options.startAngle=0] - start angle in radians
 * @param {Number} [options.endAngle=TAU] - end angle in radians
 * @param {Number} [options.segments=32] - segments per full rotation
 * @returns {geom3} new 3D geometry
 */
function cylinderElliptic(options) {}

/**
 * Construct an ellipse in 2D space.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0]] - center of the ellipse
 * @param {Array} [options.radius=[1,1]] - radii along X and Y
 * @param {Number} [options.startAngle=0] - start angle in radians
 * @param {Number} [options.endAngle=TAU] - end angle in radians
 * @param {Number} [options.segments=32] - segments per full rotation
 * @returns {geom2} new 2D geometry
 */
function ellipse(options) {}

/**
 * Construct an ellipsoid in 3D space.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0,0]] - center of the ellipsoid
 * @param {Array} [options.radius=[1,1,1]] - radii along X, Y, and Z
 * @param {Number} [options.segments=32] - segments per full rotation
 * @param {Array} [options.axes] - base vectors for X, Y, Z
 * @returns {geom3} new 3D geometry
 */
function ellipsoid(options) {}

/**
 * Construct a geodesic sphere in 3D space.
 * @param {Object} [options] - options for construction
 * @param {Number} [options.radius=1] - radius of the sphere
 * @param {Number} [options.frequency=6] - subdivision frequency per face
 * @returns {geom3} new 3D geometry
 */
function geodesicSphere(options) {}

/**
 * Construct a line in 2D space.
 * @param {Array} points - array of points for the line
 * @returns {path2} new 2D path
 */
function line(points) {}

/**
 * Construct a polygon in 2D space.
 * @param {Object} options - options for construction
 * @param {Array} options.points - array of points defining the polygon
 * @param {Array} [options.paths] - array of point indexes for the paths
 * @param {String} [options.orientation='counterclockwise'] - orientation of points
 * @returns {geom2} new 2D geometry
 */
function polygon(options) {}

/**
 * Construct a polyhedron in 3D space.
 * @param {Object} options - options for construction
 * @param {Array} options.points - array of points in 3D space
 * @param {Array} options.faces - array of face definitions
 * @param {Array} [options.colors] - array of RGBA colors for each face
 * @param {String} [options.orientation='outward'] - orientation of faces
 * @returns {geom3} new 3D geometry
 */
function polyhedron(options) {}

/**
 * Construct a rectangle in 2D space.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0]] - center of the rectangle
 * @param {Array} [options.size=[2,2]] - dimensions of the rectangle (width, length)
 * @returns {geom2} new 2D geometry
 */
function rectangle(options) {}

/**
 * Construct a rounded cuboid in 3D space.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0,0]] - center of the cuboid
 * @param {Array} [options.size=[2,2,2]] - dimensions of the cuboid
 * @param {Number} [options.roundRadius=0.2] - radius of rounded edges
 * @param {Number} [options.segments=32] - segments per full rotation
 * @returns {geom3} new 3D geometry
 */
function roundedCuboid(options) {}

/**
 * Construct a rounded cylinder in 3D space.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0,0]] - center of the cylinder
 * @param {Number} [options.height=2] - height of the cylinder
 * @param {Number} [options.radius=1] - radius of the cylinder
 * @param {Number} [options.roundRadius=0.2] - radius of rounded edges
 * @param {Number} [options.segments=32] - segments per full rotation
 * @returns {geom3} new 3D geometry
 */
function roundedCylinder(options) {}

/**
 * Construct a rounded rectangle in 2D space.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0]] - center of the rectangle
 * @param {Array} [options.size=[2,2]] - dimensions of the rectangle (width, length)
 * @param {Number} [options.roundRadius=0.2] - round radius of corners
 * @param {Number} [options.segments=32] - segments per full rotation
 * @returns {geom2} new 2D geometry
 */
function roundedRectangle(options) {}

/**
 * Construct a sphere in 3D space.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0,0]] - center of the sphere
 * @param {Number} [options.radius=1] - radius of the sphere
 * @param {Number} [options.segments=32] - segments per full rotation
 * @param {Array} [options.axes] - base vectors for X, Y, Z
 * @returns {geom3} new 3D geometry
 */
function sphere(options) {}

/**
 * Construct a square in 2D space.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0]] - center of the square
 * @param {Number} [options.size=2] - size of the square
 * @returns {geom2} new 2D geometry
 */
function square(options) {}

/**
 * Construct a star in 2D space.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0]] - center of the star
 * @param {Number} [options.vertices=5] - number of vertices
 * @param {Number} [options.density=2] - density of star
 * @param {Number} [options.outerRadius=1] - outer radius
 * @param {Number} [options.innerRadius=0] - inner radius
 * @param {Number} [options.startAngle=0] - starting angle in radians
 * @returns {geom2} new 2D geometry
 */
function star(options) {}

/**
 * Construct a torus in 3D space.
 * @param {Object} [options] - options for construction
 * @param {Number} [options.innerRadius=1] - radius of the inner circle
 * @param {Number} [options.outerRadius=4] - radius of the outer circle
 * @param {Number} [options.innerSegments=32] - segments of inner circle
 * @param {Number} [options.outerSegments=32] - segments of outer circle
 * @param {Number} [options.innerRotation=0] - rotation of inner circle in radians
 * @param {Number} [options.outerRotation=TAU] - rotation of torus in radians
 * @param {Number} [options.startAngle=0] - start angle of torus in radians
 * @returns {geom3} new 3D geometry
 */
function torus(options) {}

/**
 * Construct a triangle in 2D space.
 * @param {Object} [options] - options for construction
 * @param {String} [options.type='SSS'] - type of triangle ('AAS', 'SSA', etc.)
 * @param {Array} [options.values=[1,1,1]] - angle of corners or lengths of sides
 * @returns {geom2} new 2D geometry
 */
function triangle(options) {}
`;

export const JSCADInstructionsShort = `
// These are the available functions for constructing 2D and 3D geometries in JSCAD:

/**
 * Construct an arc in 2D space.
 * @param {Object} [options] - {center=[0,0], radius=1, startAngle=0, endAngle=TAU, segments=32, makeTangent=false}
 * @returns {path2}
 */
function arc(options) {}

/**
 * Construct a circle in 2D space.
 * @param {Object} [options] - {center=[0,0], radius=1, startAngle=0, endAngle=TAU, segments=32}
 * @returns {geom2}
 */
function circle(options) {}

/**
 * Construct a cube in 3D space.
 * @param {Object} [options] - {center=[0,0,0], size=2}
 * @returns {geom3}
 */
function cube(options) {}

/**
 * Construct a cuboid in 3D space.
 * @param {Object} [options] - {center=[0,0,0], size=[2,2,2]}
 * @returns {geom3}
 */
function cuboid(options) {}

/**
 * Construct a cylinder in 3D space.
 * @param {Object} [options] - {center=[0,0,0], height=2, radius=1, segments=32}
 * @returns {geom3}
 */
function cylinder(options) {}

/**
 * Construct an elliptic cylinder in 3D space.
 * @param {Object} [options] - {center=[0,0,0], height=2, startRadius=[1,1], endRadius=[1,1], segments=32}
 * @returns {geom3}
 */
function cylinderElliptic(options) {}

/**
 * Construct an ellipse in 2D space.
 * @param {Object} [options] - {center=[0,0], radius=[1,1], segments=32}
 * @returns {geom2}
 */
function ellipse(options) {}

/**
 * Construct an ellipsoid in 3D space.
 * @param {Object} [options] - {center=[0,0,0], radius=[1,1,1], segments=32}
 * @returns {geom3}
 */
function ellipsoid(options) {}

/**
 * Construct a geodesic sphere in 3D space.
 * @param {Object} [options] - {radius=1, frequency=6}
 * @returns {geom3}
 */
function geodesicSphere(options) {}

/**
 * Construct a line in 2D space.
 * @param {Array} points
 * @returns {path2}
 */
function line(points) {}

/**
 * Construct a polygon in 2D space.
 * @param {Object} options - {points, paths, orientation='counterclockwise'}
 * @returns {geom2}
 */
function polygon(options) {}

/**
 * Construct a polyhedron in 3D space.
 * @param {Object} options - {points, faces, colors, orientation='outward'}
 * @returns {geom3}
 */
function polyhedron(options) {}

/**
 * Construct a rectangle in 2D space.
 * @param {Object} [options] - {center=[0,0], size=[2,2]}
 * @returns {geom2}
 */
function rectangle(options) {}

/**
 * Construct a rounded cuboid in 3D space.
 * @param {Object} [options] - {center=[0,0,0], size=[2,2,2], roundRadius=0.2, segments=32}
 * @returns {geom3}
 */
function roundedCuboid(options) {}

/**
 * Construct a rounded cylinder in 3D space.
 * @param {Object} [options] - {center=[0,0,0], height=2, radius=1, roundRadius=0.2, segments=32}
 * @returns {geom3}
 */
function roundedCylinder(options) {}

/**
 * Construct a rounded rectangle in 2D space.
 * @param {Object} [options] - {center=[0,0], size=[2,2], roundRadius=0.2, segments=32}
 * @returns {geom2}
 */
function roundedRectangle(options) {}

/**
 * Construct a sphere in 3D space.
 * @param {Object} [options] - {center=[0,0,0], radius=1, segments=32}
 * @returns {geom3}
 */
function sphere(options) {}

/**
 * Construct a square in 2D space.
 * @param {Object} [options] - {center=[0,0], size=2}
 * @returns {geom2}
 */
function square(options) {}

/**
 * Construct a star in 2D space.
 * @param {Object} [options] - {center=[0,0], vertices=5, density=2, outerRadius=1, innerRadius=0, startAngle=0}
 * @returns {geom2}
 */
function star(options) {}

/**
 * Construct a torus in 3D space.
 * @param {Object} [options] - {innerRadius=1, outerRadius=4, innerSegments=32, outerSegments=32}
 * @returns {geom3}
 */
function torus(options) {}

/**
 * Construct a triangle in 2D space.
 * @param {Object} [options] - {type='SSS', values=[1,1,1]}
 * @returns {geom2}
 */
function triangle(options) {}
`;
