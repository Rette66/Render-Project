//////////////////////////////////////////////////////////////////
//
//  An example to show you how to set up to draw a 3D cube
//  This is the first example you will need to set up a camera, and the model, view, and projection matrices 
//
//  Han-Wei Shen (shen.94@osu.edu)
//

var gl;
var shaderProgram;
var draw_type=2; 

//////////// Init OpenGL Context etc. ///////////////

    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    }

    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////

    var squareVertexPositionBuffer;
    var squareVertexColorBuffer;
    var squareVertexIndexBuffer; 


   ////////////////    Initialize VBO  ////////////////////////

   var cyverts = [];
   var cynormals = []; 
   var cycolors = []; 
   var cyindicies = [];
   
   function InitCylinder(nslices, nstacks,  r,  g,  b) 
   {
     var nvertices = nslices * nstacks;
       
     var Dangle = 2*Math.PI/(nslices-1); 
   
     for (j =0; j<nstacks; j++)
         for (i=0; i<nslices; i++) {
            var idx = j*nslices + i; // mesh[j][i] 
            var angle = Dangle * i; 
             cyverts.push(Math.cos(angle)); 
             cyverts.push(Math.sin(angle));
            // cyverts.push(0); 
            // cyverts.push(0); 
            cyverts.push(j*3.0/(nstacks-1)-1.5);
    
        //  cynormals.push(Math.cos(angle)); 
        //  cynormals.push(Math.sin(angle));
        //  cynormals.push(0.0); 
   
            cycolors.push(Math.cos(angle)); 
            cycolors.push(Math.sin(angle)); 
            // cycolors.push(0); 
            // cycolors.push(0); 
            cycolors.push(j*1.0/(nstacks-1));	
            // cycolors.push(1);
            // cycolors.push(0);
            // cycolors.push(0); 
            cycolors.push(1.0); 
       }
     // now create the index array 
   
     nindices = (nstacks-1)*6*(nslices+1); 
   
     for (j =0; j<nstacks-1; j++)
       for (i=0; i<=nslices; i++) {
         var mi = i % nslices;
         var mi2 = (i+1) % nslices;
         var idx = (j+1) * nslices + mi;	
         var idx2 = j*nslices + mi; // mesh[j][mi] 
         var idx3 = (j) * nslices + mi2;
         var idx4 = (j+1) * nslices + mi;
         var idx5 = (j) * nslices + mi2;
         var idx6 = (j+1) * nslices + mi2;
       
         cyindicies.push(idx); 
         cyindicies.push(idx2);
         cyindicies.push(idx3); 
         cyindicies.push(idx4);
         cyindicies.push(idx5); 
         cyindicies.push(idx6);
       }
   }
    
    function initCYBuffers() {

        var nslices = 30;
        var nstacks = 50; 
        InitCylinder(nslices,nstacks,1.0,1.0,0.0);

        cylinderVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cyverts), gl.STATIC_DRAW);
        cylinderVertexPositionBuffer.itemSize = 3;
        console.log(cyverts);
        cylinderVertexPositionBuffer.numItems = nslices * nstacks;

        // cylinderVertexNormalBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexNormalBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cynormals), gl.STATIC_DRAW);
        // cylinderVertexNormalBuffer.itemSize = 3;
        // cylinderVertexNormalBuffer.numItems = nslices * nstacks;    

        cylinderVertexIndexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderVertexIndexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cyindicies), gl.STATIC_DRAW);  
        cylinderVertexIndexBuffer.itemsize = 1;
        cylinderVertexIndexBuffer.numItems = (nstacks-1)*6*(nslices+1);

        cylinderVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cycolors), gl.STATIC_DRAW);
        console.log(cycolors);
        cylinderVertexColorBuffer.itemSize = 4;
        cylinderVertexColorBuffer.numItems = nslices * nstacks;

    }



    function initBuffers() {

        squareVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        var vertices = [
             0.5,  0.5,  -.5,
            -0.5,  0.5,  -.5, 
	        - 0.5, -0.5,  -.5,
            0.5, -0.5,  -.5,
            0.5,  0.5,  .5,
	        -0.5,  0.5,  .5, 
            -0.5, -0.5,  .5,
	        0.5, -0.5,  .5
	    
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        squareVertexPositionBuffer.itemSize = 3;
        squareVertexPositionBuffer.numItems = 8;

    	var indices = [0,1,2, 0,2,3, 0,3,7, 0, 7,4, 6,2,3,6,3,7,5,1,2, 5,2,6,5,1,0,5,0,4,5,6,7,5,7,4];
    	squareVertexIndexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);  
        squareVertexIndexBuffer.itemsize = 1;
        squareVertexIndexBuffer.numItems = 36;   //36 indices, 3 per triangle, so 12 triangles 

        squareVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
        var colors = [
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0,
            1.0, 0.0, 0.0	    
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        squareVertexColorBuffer.itemSize = 3;
        squareVertexColorBuffer.numItems = 8;
    }

    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////

    var vMatrix = mat4.create(); // view matrix
    var rotateMatrix = mat4.create();  // model matrix
    var mvMatrix = mat4.create();  // modelview matrix
    var pMatrix = mat4.create();  //projection matrix 
    var Z_angle = 0.0;

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);	
    }

     function degToRad(degrees) {
        return degrees * Math.PI / 180;
     }

    ///////////////////////////////////////////////////////////////

    function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	    mat4.perspective(60, 1.0, 0.1, 100, pMatrix);  // set up the projection matrix 

        mat4.identity(vMatrix);	
        vMatrix = mat4.lookAt([0,0,5], [0,0,0], [0,1,0], vMatrix);	// set up the view matrix, multiply into the modelview matrix

        mat4.identity(rotateMatrix);	
	
        console.log('Z angle = '+ Z_angle); 
        rotateMatrix = mat4.rotate(rotateMatrix, degToRad(Z_angle), [0, 1, 0]);   // now set up the model matrix 
        // mMatrix = mat4.scale(mMatrix,[1,1,1]);

        mat4.multiply(vMatrix,rotateMatrix, mvMatrix);  // mvMatrix = vMatrix * mMatrix and is the modelview Matrix 
       
        setMatrixUniforms();   // pass the modelview mattrix and projection matrix to the shader 

        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cylinderVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,cylinderVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// draw elementary arrays - triangle indices 
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderVertexIndexBuffer); 

       gl.drawElements(gl.TRIANGLES, cylinderVertexIndexBuffer.numItems , gl.UNSIGNED_SHORT, 0); 

    }


    ///////////////////////////////////////////////////////////////

     var lastMouseX = 0, lastMouseY = 0;

    ///////////////////////////////////////////////////////////////

     function onDocumentMouseDown( event ) {
          event.preventDefault();
          document.addEventListener( 'mousemove', onDocumentMouseMove, false );
          document.addEventListener( 'mouseup', onDocumentMouseUp, false );
          document.addEventListener( 'mouseout', onDocumentMouseOut, false );
          var mouseX = event.clientX;
          var mouseY = event.clientY;

          lastMouseX = mouseX;
          lastMouseY = mouseY; 

      }

     function onDocumentMouseMove( event ) {
          var mouseX = event.clientX;
          var mouseY = event.ClientY; 

          var diffX = mouseX - lastMouseX;
          var diffY = mouseY - lastMouseY;

          Z_angle = Z_angle + diffX/5;

          lastMouseX = mouseX;
          lastMouseY = mouseY;

          drawScene();
     }

     function onDocumentMouseUp( event ) {
          document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
          document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
          document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
     }

     function onDocumentMouseOut( event ) {
          document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
          document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
          document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
     }

    ///////////////////////////////////////////////////////////////

    function webGLStart() {
        var canvas = document.getElementById("code03-canvas");
        initGL(canvas);
        initShaders();

	    gl.enable(gl.DEPTH_TEST); 

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");	

        initCYBuffers(); 

        gl.clearColor(0.0, 0.0, 0.0, 1.0);

       document.addEventListener('mousedown', onDocumentMouseDown,
       false); 

        drawScene();
    }

function BG(red, green, blue) {

    gl.clearColor(red, green, blue, 1.0);
    drawScene(); 

} 

function redraw() {
    Z_angle = 0; 
    drawScene();
}
    

function geometry(type) {

    draw_type = type;
    drawScene();

} 
