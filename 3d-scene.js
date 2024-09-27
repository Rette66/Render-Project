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
    var drawmode = 0;

        // set up the parameters for lighting 
    var light_ambient = [0,0,0,1]; 
    var light_diffuse = [.8,.8,.8,1];
    var light_specular = [0.9,0.9,0.9,1]; 
    var light_pos = [-2,2,0,1];   // eye space position 

    var mat_ambient = [0, 0, 0, 1]; 
    var mat_diffuse= [.5,.5,.5, 1]; 
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
        else if(event.key == 'u')
            lightUp();
        else if(event.key == 'j')
            lightDown();
        else if(event.key == 'i')
            lightLeft();
        else if(event.key == 'k')
            lightRight();
        else if(event.key == 'o')
            lightForward();
        else if(event.key == 'l')
            lightBack();
        else if(event.key == 't')
            showTexture();
        else if(event.key == 'c')
            showColor();
        else if(event.key == 'e')
            showEnvironemnt();
        drawScene();
    }



    var cubemapTexture;
var cubemapLoaded = false;

function initCubeMap() {
    var loaded = [];
    for (var i = 0; i < 6; i++) {
        loaded.push(false);
    }

    cubemapTexture = gl.createTexture();
    cubemapTexture.top = new Image();
    cubemapTexture.top.onload = function () {
        loaded[0] = true;
        for (var i = 0; i < 6; i++) {
            if (!loaded[i]) return;
        }
        handleCubemapTextureLoaded(cubemapTexture);
    }
    cubemapTexture.top.src = "Lycksele3/posy.jpg";

    cubemapTexture.bottom = new Image();
    cubemapTexture.bottom.onload = function () {
        loaded[1] = true;
        for (var i = 0; i < 6; i++) {
            if (!loaded[i]) return;
        }
        handleCubemapTextureLoaded(cubemapTexture);
    }
    cubemapTexture.bottom.src = "Lycksele3/negy.jpg";

    cubemapTexture.left = new Image();
    cubemapTexture.left.onload = function () {
        loaded[2] = true;
        for (var i = 0; i < 6; i++) {
            if (!loaded[i]) return;
        }
        handleCubemapTextureLoaded(cubemapTexture);
    }
    cubemapTexture.left.src = "Lycksele3/negx.jpg";

    cubemapTexture.right = new Image();
    cubemapTexture.right.onload = function () {
        loaded[3] = true;
        for (var i = 0; i < 6; i++) {
            if (!loaded[i]) return;
        }
        handleCubemapTextureLoaded(cubemapTexture);
    }
    cubemapTexture.right.src = "Lycksele3/posx.jpg";

    cubemapTexture.front = new Image();
    cubemapTexture.front.onload = function () {
        loaded[4] = true;
        for (var i = 0; i < 6; i++) {
            if (!loaded[i]) return;
        }
        handleCubemapTextureLoaded(cubemapTexture);
    }
    cubemapTexture.front.src = "Lycksele3/negz.jpg";

    cubemapTexture.back = new Image();
    cubemapTexture.back.onload = function () {
        loaded[5] = true;
        for (var i = 0; i < 6; i++) {
            if (!loaded[i]) return;
        }
        handleCubemapTextureLoaded(cubemapTexture);
    }
    cubemapTexture.back.src = "Lycksele3/posz.jpg";
}

    function handleCubemapTextureLoaded(texture) {
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X , 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
            texture.right);
        gl.texImage2D(gl. TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
            texture.left);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y , 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
            texture.top);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y , 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
            texture.bottom);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z , 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
            texture.back);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z , 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
            texture.front);
            console.log(texture);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        cubemapLoaded = true;
        drawScene();
    }


    var sampleTexture;
    var negx, negy, negz, posx, posy, posz;

    function initTextures(){
        sampleTexture = gl.createTexture();
        sampleTexture.image = new Image();
        sampleTexture.image.onload = function() { handleTextureLoaded(sampleTexture); }
        sampleTexture.image.src = "earth.png";
        console.log("loading texture....") 

        negx = gl.createTexture();
        negx.image = new Image();
        negx.image.onload = function() {handleTextureLoaded(negx)};
        negx.image.src = "Lycksele3/negx.jpg";

        negy = gl.createTexture();
        negy.image = new Image();
        negy.image.onload = function() {handleTextureLoaded(negy)};
        negy.image.src = "Lycksele3/negy.jpg";
        
        negz = gl.createTexture();
        negz.image = new Image();
        negz.image.onload = function() {handleTextureLoaded(negz)};
        negz.image.src = "Lycksele3/negz.jpg";
        
        posx = gl.createTexture();
        posx.image = new Image();
        posx.image.onload = function() {handleTextureLoaded(posx)};
        posx.image.src = "Lycksele3/posx.jpg";
        
        posy = gl.createTexture();
        posy.image = new Image();
        posy.image.onload = function() {handleTextureLoaded(posy)};
        posy.image.src = "Lycksele3/posy.jpg";
        
        posz = gl.createTexture();
        posz.image = new Image();
        posz.image.onload = function() {handleTextureLoaded(posz)};
        posz.image.src = "Lycksele3/posz.jpg";
        
    }

    function handleTextureLoaded(texture){
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP);
        gl.bindTexture(gl.TEXTURE_2D, null);   
        console.log("finish handle loaded texture.");
        drawScene();
    }


    var robot1;
    var floor;
    var tree;
    var teapot;
    var lightSphere;
    var skybox;
    // ----------------- generate corresponding shape vertices and bind them into array buffer-------------
    function initialObject(){
        robot1 = new Robot();
        // floor = new Cylinder(0,1,1,[1,0,0],30,50);
        floor = new Floor([0,1,0]);
        teapot = new Teapot();
        tree = new Tree();
        lightSphere = new Light([1,1,1], light_pos);
        skybox = new Skybox();
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

    //set up view matrix 
        mat4.identity(vMatrix);	
        vMatrix = mat4.lookAt([0,2,4], [0,0,0], [0,1,0], vMatrix);
        
        //view matrix transform
        var pyrMatrix = mat4.create();
        mat4.identity(pyrMatrix);
        console.log('Z angle = '+ Z_angle + '  '); 
        pyrMatrix = mat4.rotateX(pyrMatrix, degToRad(X_angle));   // update pitch
        pyrMatrix = mat4.rotate(pyrMatrix,  degToRad(Y_angle), [0, 1, 0]);   // update yaw 
        pyrMatrix = mat4.rotate(pyrMatrix, degToRad(Z_angle), [0, 0, 1]);   // update roll 
        vMatrix = mat4.multiply(pyrMatrix,vMatrix);
        // light_pos = mat4.multiply(pyrMatrix, light_pos);

    //set up model matrix
        mat4.identity(mMatrix);	
        // mMatrix = mat4.rotateX(mMatrix, Math.PI);

        mat4.identity(nMatrix);
        nMatrix = mat4.multiply(nMatrix, vMatrix);
        nMatrix = mat4.multiply(nMatrix, mMatrix); 	
        nMatrix = mat4.inverse(nMatrix);
        nMatrix = mat4.transpose(nMatrix); 

        console.log("light position: " + light_pos);
    
        gl.uniform4f(shaderProgram.light_posUniform, light_pos[0], light_pos[1], light_pos[2], light_pos[3]); 	
        gl.uniform4f(shaderProgram.ambient_coefUniform, mat_ambient[0], mat_ambient[1], mat_ambient[2], 1.0); 
        gl.uniform4f(shaderProgram.diffuse_coefUniform, mat_diffuse[0], mat_diffuse[1], mat_diffuse[2], 1.0); 
        gl.uniform4f(shaderProgram.specular_coefUniform, mat_specular[0], mat_specular[1], mat_specular[2], 1.0); 
        gl.uniform1f(shaderProgram.shininess_coefUniform, mat_shine[0]); 
    
        gl.uniform4f(shaderProgram.light_ambientUniform, light_ambient[0], light_ambient[1], light_ambient[2], 1.0); 
        gl.uniform4f(shaderProgram.light_diffuseUniform, light_diffuse[0], light_diffuse[1], light_diffuse[2], 1.0); 
        gl.uniform4f(shaderProgram.light_specularUniform, light_specular[0], light_specular[1], light_specular[2],1.0); 
    
        setMatrixUniforms();   // pass the modelview matrix and projection matrix to the shader 

        // gl.uniform1i(shaderProgram.use_textureUniform, 0);     

        gl.activeTexture(gl.TEXTURE0);   // set texture unit 0 to use 
	    gl.bindTexture(gl.TEXTURE_2D, sampleTexture);    // bind the texture object to the texture unit 
        gl.uniform1i(shaderProgram.textureUniform, 0);   // pass the texture unit to the shader


        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
        gl.uniform1i(shaderProgram.cube_map_textureUniform, 1);

        robot1.drawObject(shaderProgram);  
        floor.drawObject(shaderProgram);
        tree.drawObject(shaderProgram);
        teapot.drawObject(shaderProgram);
        lightSphere.drawObject(shaderProgram);
        skybox.drawObject(shaderProgram);
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

        shaderProgram.vertexTexCoordsAttribute = gl.getAttribLocation(shaderProgram, "aVertexTexCoords");
        gl.enableVertexAttribArray(shaderProgram.vertexTexCoordsAttribute);

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

        shaderProgram.textureUniform = gl.getUniformLocation(shaderProgram, "myTexture");
        shaderProgram.cube_map_textureUniform = gl.getUniformLocation(shaderProgram, "cubeMap");
        shaderProgram.posx = gl.getUniformLocation(shaderProgram, "posx");
        shaderProgram.posy = gl.getUniformLocation(shaderProgram, "posy");
        shaderProgram.posz = gl.getUniformLocation(shaderProgram, "posz");
        shaderProgram.negx = gl.getUniformLocation(shaderProgram, "negx");
        shaderProgram.negy = gl.getUniformLocation(shaderProgram, "negy");
        shaderProgram.negz = gl.getUniformLocation(shaderProgram, "negz");

        shaderProgram.use_textureUniform = gl.getUniformLocation(shaderProgram, "use_texture");


        // initJSON();

        initTextures();  
        initCubeMap();      

        initialObject();

        gl.clearColor(1, 1, 0, 1.0);

        window.setInterval(drawScene, 50);
        drawScene()
        window.setInterval(teapotRotate, 50);
    }

    function teapotRotate(){
        teapot.teapotRotate();
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

    function lightUp(){
        light_pos = [light_pos[0], light_pos[1] +0.05 ,light_pos[2], light_pos[3]];
        lightSphere.updatePosition(light_pos);
    }
    
    function lightDown(){
        light_pos = [light_pos[0], light_pos[1] -0.05 ,light_pos[2], light_pos[3]];
        lightSphere.updatePosition(light_pos);
    }
    
    function lightLeft(){
        light_pos = [light_pos[0]-0.05, light_pos[1]  ,light_pos[2], light_pos[3]];
        lightSphere.updatePosition(light_pos);
    }
    
    function lightRight(){
        light_pos = [light_pos[0] +0.05, light_pos[1] ,light_pos[2], light_pos[3]];
        lightSphere.updatePosition(light_pos);
    }
    
    function lightForward(){
        light_pos = [light_pos[0], light_pos[1] ,light_pos[2] -0.05, light_pos[3]];
        lightSphere.updatePosition(light_pos);
    }

    function lightBack(){
        light_pos = [light_pos[0], light_pos[1] ,light_pos[2] +0.05, light_pos[3]];
        lightSphere.updatePosition(light_pos);
    }

    function showColor(){
        drawmode = 0;
    }

    function showTexture(){
        drawmode = 1;
    }

    function showEnvironemnt(){
        drawmode = 2;
    }
