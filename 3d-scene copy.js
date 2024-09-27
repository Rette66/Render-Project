//////////////////////////////////////////////////////.........
//
//    Simple 2D Drawing
//
//    Ray Wei  
//
    var gl;
    var shaderProgram;
    //shape type:
    //p for point as 0
    //h for horizontal line as 1
    //v for vertical line as 2
    //t for triangle as 3 (default)
    //q for square as 4
    //R for circle as 5
    var draw_shape = 3;
    
    //default red color
    var draw_color = [1.0, 0.0, 0.0];
    var vertex_num = 3;

    var currentShape;
    var currnetMatrix;
    var currentOnScreenShape;

    var shapeList;
    var onScreenShapeList;

    var globalTransform;

    var canvas;

        // set up the parameters for lighting 
    var light_ambient = [0,0,0,1]; 
    var light_diffuse = [.8,.8,.8,1];
    var light_specular = [1,1,1,1]; 
    var light_pos = [0,5,0,1];   // eye space position 

    var mat_ambient = [0, 0, 0, 1]; 
    var mat_diffuse= [1, 1, 0, 1]; 
    var mat_specular = [.9, .9, .9,1]; 
    var mat_shine = [50]; 

// ************** Init OpenGL Context etc. ************* 

    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true});
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
        console.log(gl);
    }


//******************* Initialize JSON geometry file */

    var teapotVertexPositionBuffer;
    var teapotVertexNormalBuffer; 
    var teapotVertexTextureCoordBuffer; 
    var teapotVertexIndexBuffer;

    function initJSON(){
        var request = new XMLHttpRequest();
        request.open("GET", "teapot.json");

        request.onreadystatechange = 
            function(){
                if(request.readyState == 4){
                    console.log("readt state =" + request.readyState);
                    handleLoadedTeapot(JSON.parse(request.responseText));
                }
            }
        request.send();
    }


    // function handleLoadedTeapot(teapotData){
    //     console.log("In handle Loaded Teapot");
    //     this.teapotVertexPositionBuffer = gl.createBuffer();
    //     gl.bindBuffer(gl.ARRAY_BUFFER, this.teapotVertexPositionBuffer);
    //     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexPositions), gl.STATIC_DRAW);
    //     this.teapotVertexPositionBuffer.itemSize = 3;
    //     this.teapotVertexPositionBuffer.numItems = teapotData.vertexPositions.length/3;

    //     this.teapotVertexNormalBuffer = gl.createBuffer();
    //     gl.bindBuffer(gl.ARRAY_BUFFER, this.teapotVertexNormalBuffer);
    //     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexNormals), gl.STATIC_DRAW);
    //     this.teapotVertexNormalBuffer.itemSize = 3;
    //     this.teapotVertexNormalBuffer.numItems = teapotData.vertexNormals.length/3;

    //     this.teapotVertexIndexBuffer = gl.createBuffer();
    //     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.teapotVertexIndexBuffer);
    //     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(teapotData.indices), gl.STATIC_DRAW);
    //     this.teapotVertexIndexBuffer.itemSize = 1;
    //     this.teapotVertexIndexBuffer.numItems = teapotData.indices.length;

    //     teapotVertexColorBuffer = this.teapotVertexNormalBuffer;

    //     var teapotMatrix = mat4.create();
    //     teapotMatrix = mat4.identity;
    //     mat4.scale(teapotMatrix, [0.1,0.1,0.1]);

    //     gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, this.mMatrix);

    //     drawScene();
    // }


//  ************** Initialize VBO  *************** 


    // ---------------- keyborad event--------------
    function onKeyDown(event) {
        console.log(event.key);
        if(event.key == 'r')
            CameraRollCounterClockwise();
        else if(event.key == 'R')
            CameraRollClockwise();
        else if(event.key == 'p')
            CameraPitchUp();
        else if(event.key == 'P')
            CameraPitchDown();
        else if(event.key == 'y')
            CameraYawLeft();
        else if(event.key == 'Y')
            CameraYawRight();
        else if(event.key == 'w' || event.key =='W')
            walkForward();
        else if(event.key == 's' || event.key =='S')
            walkBack();
        else if(event.key == 'a' || event.key =='A')
            walkLeft();
        else if(event.key == 'd' || event.key =='D')
            walkRight();

        drawScene();
    }

    var robot1;
    var floor;
    var tree;
    var teapot;
    // ----------------- generate corresponding shape vertices and bind them into array buffer-------------
    function initialObject(){
        // robot1 = new Robot();
        // floor = new Cylinder(0,1,1,[1,0,0],30,50);
        floor = new Floor([0,1,0]);
        teapot = new Teapot();
        // tree = new Tree();
    }

    
    var vMatrix = mat4.create(); // view matrix
    var mMatrix = mat4.create();  //camera rotation(model) matrix
    var pMatrix = mat4.create();  //projection matrix 
    var nMatrix = mat4.create();  //normal matrix
    var X_angle = 0.0;
    var Y_angle = 0.0;
    var Z_angle = 0.0;

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);	      
        gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, mMatrix);
        gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, nMatrix);
    }

    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    function drawScene() {

        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);



        mat4.perspective(60, 1.0, 0.1, 100, pMatrix);  // set up the projection matrix 

        mat4.identity(vMatrix);	
        vMatrix = mat4.lookAt([0,0,5], [0,0,0], [0,1,0], vMatrix);	// set up the view matrix, multiply into the modelview matrix

        mat4.identity(mMatrix);	
        // console.log(mMatrix);

        console.log('Z angle = '+ Z_angle + '  '); 

        // mMatrix = mat4.scale(mMatrix, [1/10, 1/10, 1/10]);

        mMatrix = mat4.rotateX(mMatrix, degToRad(X_angle));   // update pitch
        mMatrix = mat4.rotate(mMatrix, degToRad(Y_angle), [0, 1, 0]);   // update yaw 
        mMatrix = mat4.rotate(mMatrix, degToRad(Z_angle), [0, 0, 1]);   // update roll 
        // console.log(mMatrix);

        var tempVMatrix = vMatrix;
        // console.log(vMatrix);
        mat4.multiply(mMatrix, vMatrix, vMatrix);  // mvMatrix = vMatrix * mMatrix and is the modelview Matrix 
        // console.log(vMatrix);

        mat4.identity(nMatrix);
        nMatrix = mat4.multiply(nMatrix, tempVMatrix);
        nMatrix = mat4.multiply(nMatrix, mMatrix); 	
        nMatrix = mat4.inverse(nMatrix);
        nMatrix = mat4.transpose(nMatrix); 
        console.log(nMatrix);
    
            // shaderProgram.light_posUniform = gl.getUniformLocation(shaderProgram, "light_pos");
    
    
        gl.uniform4f(shaderProgram.light_posUniform, light_pos[0], light_pos[1], light_pos[2], light_pos[3]); 	
        gl.uniform4f(shaderProgram.ambient_coefUniform, mat_ambient[0], mat_ambient[1], mat_ambient[2], 1.0); 
        gl.uniform4f(shaderProgram.diffuse_coefUniform, mat_diffuse[0], mat_diffuse[1], mat_diffuse[2], 1.0); 
        gl.uniform4f(shaderProgram.specular_coefUniform, mat_specular[0], mat_specular[1], mat_specular[2], 1.0); 
        gl.uniform1f(shaderProgram.shininess_coefUniform, mat_shine[0]); 
    
        gl.uniform4f(shaderProgram.light_ambientUniform, light_ambient[0], light_ambient[1], light_ambient[2], 1.0); 
        gl.uniform4f(shaderProgram.light_diffuseUniform, light_diffuse[0], light_diffuse[1], light_diffuse[2], 1.0); 
        gl.uniform4f(shaderProgram.light_specularUniform, light_specular[0], light_specular[1], light_specular[2],1.0); 
    


        setMatrixUniforms();   // pass the modelview matrix and projection matrix to the shader 

        // gl.uniformMatrix4fv(shaderProgram.tMatrixUniform, false, transformMatrix);
        // robot1.drawObject(shaderProgram);  

        // gl.drawElements(gl.TRIANGLES, this.teapotVertexIndexBuffer.numItems , gl.UNSIGNED_SHORT, 0);

        teapot.drawObject(shaderProgram);
        floor.drawObject(shaderProgram);
        // tree.drawObject(shaderProgram);
    }


    function webGLStart() {
        document.addEventListener('keydown', onKeyDown);

        canvas = document.getElementById("lab1-canvas");
        initGL(canvas);
        initShaders();
        // globalTransform = false;

        gl.enable(gl.DEPTH_TEST);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute); 

        shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
        shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

        shaderProgram.light_posUniform = gl.getUniformLocation(shaderProgram, "light_pos");
        shaderProgram.ambient_coefUniform = gl.getUniformLocation(shaderProgram, "ambient_coef");
        shaderProgram.diffuse_coefUniform = gl.getUniformLocation(shaderProgram, "diffuse_coef");
        shaderProgram.specular_coefUniform = gl.getUniformLocation(shaderProgram, "specular_coef");
        shaderProgram.shininess_coefUniform = gl.getUniformLocation(shaderProgram, "mat_shininess");

        shaderProgram.light_ambientUniform = gl.getUniformLocation(shaderProgram, "light_ambient");	
        shaderProgram.light_diffuseUniform = gl.getUniformLocation(shaderProgram, "light_diffuse");
        shaderProgram.light_specularUniform = gl.getUniformLocation(shaderProgram, "light_specular");	

        // initJSON();
        
        initialObject();

        gl.clearColor(1, 1, 0.0, 1.0);

        drawScene()
    }

    function walkForward(){
        console.log("forward");
        robot1.walkForward();
    }

    function walkBack(){
        console.log("back");
        robot1.walkBack();
    }    
    
    function walkLeft(){
        console.log("left");
        robot1.walkLeft();
    }    
    
    function walkRight(){
        console.log("right");
        robot1.walkRight();
    }

    function CameraPitchUp(){
        X_angle -=1;
    }

    function CameraPitchDown(){
        X_angle +=1;
    }

    function CameraYawLeft(){
        Y_angle+=1;
    }

    function CameraYawRight(){
        Y_angle-=1;
    }

    function CameraRollCounterClockwise(){
        Z_angle+=1;
    }

    function CameraRollClockwise(){
        Z_angle-=1;
    }

    // function shape(type, count){
    //     draw_shape = type;
    //     vertex_num = count;
    // }

    // function color(type){
    //     draw_color = type;
    // }

    // function clear(){
    //     onScreenShapeList = new Array();
    //     currentOnScreenShape = onScreenShapeList.length-1;
    //     drawScene();
    // }

    // function redraw(){
    //     onScreenShapeList.pop();
    //     currentOnScreenShape = onScreenShapeList.length-1;
    //     drawScene();
    // }

    // function enlarge(){
    //     if(globalTransform){
    //         for(var i = 0; i < onScreenShapeList.length; i++){
    //             onScreenShapeList[i][0] = Scale(onScreenShapeList[i][0], [1.05, 1.05, 1.05]);
    //         }
    //     }
    //     else
    //         onScreenShapeList[currentOnScreenShape][0] = Scale(onScreenShapeList[currentOnScreenShape][0], [1.05, 1.05, 1.05]);
    //     drawScene();
    // }

    // function shrink(){
    //     if(globalTransform){
    //         for(var i = 0; i < onScreenShapeList.length; i++){
    //             onScreenShapeList[i][0] = Scale(onScreenShapeList[i][0], [0.95, 0.95, 0.95]);
    //         }
    //     }
    //     else
    //     onScreenShapeList[currentOnScreenShape][0] = Scale(onScreenShapeList[currentOnScreenShape][0], [0.95, 0.95, 0.95]);
    //     drawScene();
    // }