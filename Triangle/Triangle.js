// Zachary Rose
// CSCI 445
// 9/9/2023
"use strict";

var canvas;
var gl;

var points = [];
var colors = [];
var angle = 180;
var centroid;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height);
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

// x : divided by 3, y: divided by 3, plus 0.5
// moved towards the top to give room for other triangle
// tessellated triangle
        var vertices = [
        vec2( -1/3, (-1/3) + 0.5 ),
        vec2(  0,  (1/3) + 0.5 ),
        vec2(  1/3, (-1/3) + 0.5 )
    ];

// x : divided by 3, y: divided by 3, minus 0.5
// moved towards the bottom to give room for other triangle
// tessellated and twisted triangle
       var vertices2 = [
        vec2( -1/3, (-1/3) -0.3 ),
        vec2(  0,  (1/3) - 0.3 ),
        vec2(  1/3, (-1/3) - 0.3 )
    ];

// approximate midpoint of second triangle, used to transform axis of rotation to midpoint
centroid = [(vertices2[0][0] + vertices2[1][0] + vertices2[2][0]) / 3, (vertices2[0][1] + vertices2[1][1] + vertices2[2][1]) / 3];

triangle(vertices[0], vertices[1], vertices[2], 0);
triangleTwisted(vertices2[0], vertices2[1], vertices2[2], 1);


   // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

   var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

   var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    render();
};

// rotates point around midpoint of the triangle
function twist( vector){
    var x = vector[0] - centroid[0];
    var y = vector[1] - centroid[1];

    var d = Math.sqrt( x * x +   y * y );
    var theta = radians(angle);
    var sin = Math.sin(d * theta);
    var cos = Math.cos(d * theta);

    return [x * cos - y * sin + centroid[0], x * sin + y * cos + centroid[1]];
}

// pushes vertices for a wireframe triangle, color passed as 0 or 1 to choose black or red, respectively
function triangle(a, b, c, color)
{
   // 0 for black, 1 for red
   var baseColors = [
        vec3(0.0, 0.0, 0.0),
        vec3(1.0, 0.0, 0.0)
    ];

    colors.push( baseColors[color] );
    points.push( a );
    colors.push( baseColors[color] );
    points.push( b );
    colors.push( baseColors[color] );
    points.push( b );
    colors.push( baseColors[color] );
    points.push( c );
    colors.push( baseColors[color] );
    points.push( c );
    colors.push( baseColors[color] );
    points.push( a );

}

// pushes vertices for a solid triangle, color passed as 0 or 1 to choose black or red, respectively
function triangleTwisted( a, b, c , color)
{
   // 0 for black, 1 for red
   var baseColors = [
        vec3(0.0, 0.0, 0.0),
        vec3(1.0, 0.0, 0.0)
    ];

    colors.push( baseColors[color] );
    points.push( twist(a) );
    colors.push( baseColors[color] );
    points.push( twist(b) );
    colors.push( baseColors[color] );
    points.push( twist(c) );

}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINES, 0, 6);
    gl.drawArrays( gl.TRIANGLES, 6, 3); 
}
