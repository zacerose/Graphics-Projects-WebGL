// Zachary Rose
// CSCI 445
// 9/29/2023
"use strict";

var canvas;
var gl;

// represents the number of steps stored for undo/redo
const UNDO_MAX = 20;

// represents the amount of vertices that can be stored before filling the buffer
var maxNumTriangles = 1000;
var maxNumVertices  = 3 * maxNumTriangles;
var index = 0;

const undo = [];
var undoIndex = 0;
const redo = []
var redoIndex = 0;

var redraw = false;

var colors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];
var selectedColor = colors[0];

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // color selection menu, selects color for next brush strokes
    var colormenu = document.getElementById("colormenu");
    colormenu.addEventListener("click", function() {
	switch (colormenu.selectedIndex) {
	case 0:
	    selectedColor = colors[0];
	    break;
	case 1:
	    selectedColor = colors[1];
	    break;
	case 2:
	    selectedColor = colors[2];
	    break;
	case 3:
	    selectedColor = colors[3];
	    break;
	case 4:
	    selectedColor = colors[4];
	    break;
	case 5:
	    selectedColor = colors[5];
	    break;
	case 6:
	    selectedColor = colors[6];
	    break;
	}
    });
    document.getElementById("EraseCanvas").onclick =
	function() {
	    // adds the current state to undo list so the erase canvas can be undone
	    if (undoIndex < UNDO_MAX){
		undo[undoIndex] = index;
		undoIndex++;
	    }
	    else{
		undo.shift();
		undo[UNDO_MAX - 1] = index;
	    }
	    redoIndex = 0;
	    index = 0;
	};
    
       document.getElementById("Undo").onclick =
	function() {
	    // Adds current index to redo list, so the undo can be undone
	    if (undoIndex > 0){
		if (redoIndex < UNDO_MAX){
		    redo[redoIndex] = index;
		    redoIndex++;
		}
		index = undo[undoIndex - 1];
		undoIndex--;
	    }
	};
    document.getElementById("Redo").onclick =
	function() {
	    if (redoIndex <= UNDO_MAX && redoIndex > 0){
		index = redo[redoIndex - 1];
		redoIndex--;
		undoIndex++;
	    }
	};
    document.getElementById("Eraser").onclick =
	function() {
	    selectedColor = vec4(0.0, 0.0, 0.0, 0.3);
	};
    canvas.addEventListener("mousedown", function(event){
	redraw = true;
	// adds current index to undo list before drawing
	if(undoIndex < UNDO_MAX){
	    undo[undoIndex] = index;
	    undoIndex++;
	}
	else{
	    // removes oldest element
	    undo.shift();
	    undo.push(index);
	}
	redoIndex = 0;
    });

    canvas.addEventListener("mouseup", function(event){
      redraw = false;
    });

    canvas.addEventListener("mousemove", function(event){

        if(redraw) {
            gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
            var t = vec2(2*event.clientX/canvas.width-1,
			 2*(canvas.height-event.clientY)/canvas.height-1);
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));

            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(selectedColor));

            index++;
	}

    } );
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 0.3 );


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // hidden surface removal
    //gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.VERTEX_PROGRAM_POINT_SIZE);
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
 
    render();

}


function render() {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.drawArrays( gl.POINTS, 0, index );

    window.requestAnimFrame(render);

}
