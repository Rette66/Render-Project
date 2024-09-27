class Teapot extends Object{
    constructor(color = [0,0,0]){
        super(color);
        this.initJSON();
    }

    ReadToDraw(){
        return this.readToDraw;
    }

    initJSON(){
        var request = new XMLHttpRequest();
        request.open("GET", "teapot.json");
        this.readToDraw = false;

        request.onreadystatechange = () =>{
                if(request.readyState == 4){
                    console.log("readt state =" + request.readyState);
                    this.handleLoadedTeapot(JSON.parse(request.responseText));
                }
            }
        request.send();
    }


    handleLoadedTeapot(teapotData){
        console.log("In handle Loaded Teapot");
        this.teapotVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.teapotVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexPositions), gl.STATIC_DRAW);
        this.teapotVertexPositionBuffer.itemSize = 3;
        this.teapotVertexPositionBuffer.numItems = teapotData.vertexPositions.length/3;
        // console.log(this.teapotVertexPositionBuffer);

        this.teapotVertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.teapotVertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexNormals), gl.STATIC_DRAW);
        this.teapotVertexNormalBuffer.itemSize = 3;
        this.teapotVertexNormalBuffer.numItems = teapotData.vertexNormals.length/3;

        this.teapotVertexTextureCoordBuffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.teapotVertexTextureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(teapotData.vertexTextureCoords),gl.STATIC_DRAW);
        this.teapotVertexTextureCoordBuffer.itemSize=2;
        this.teapotVertexTextureCoordBuffer.numItems=teapotData.vertexTextureCoords.length/2;

        this.teapotVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.teapotVertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(teapotData.indices), gl.STATIC_DRAW);
        this.teapotVertexIndexBuffer.itemSize = 1;
        this.teapotVertexIndexBuffer.numItems = teapotData.indices.length;

        this.teapotVertexColorBuffer = this.teapotVertexNormalBuffer;

        this.rotateOffSet = 0;
        this.setupTransform();
    }

    setupTransform(){
        //transform 
        this.teapotMatrix = mat4.create();
        this.teapotMatrix = mat4.identity(this.teapotMatrix);       

        mat4.translate(this.teapotMatrix, [2,0,0])
        mat4.rotate(this.teapotMatrix, this.rotateOffSet * Math.PI/180, [0,1,0]);
        mat4.scale(this.teapotMatrix, [0.05,0.05,0.05]);

        this.nMatrix = mat4.create();
        mat4.identity(this.nMatrix);
        this.nMatrix = mat4.multiply(this.nMatrix, vMatrix);
        this.nMatrix = mat4.multiply(this.nMatrix, this.teapotMatrix); 	
        this.nMatrix = mat4.inverse(this.nMatrix);
        this.nMatrix = mat4.transpose(this.nMatrix);

        drawScene();
    }

    teapotRotate(){
        this.rotateOffSet+=5;
        console.log(this.rotateOffSet);
        if(this.rotateOffSet == 360){
            this.rotateOffSet = 0;
        }
        this.setupTransform();
    }


    drawObject(shaderProgram){

        if (this.teapotVertexPositionBuffer == null || this.teapotVertexNormalBuffer == null || this.teapotVertexIndexBuffer == null) {
            console.error("error!");// will call this once since first time call teapot draw obejct the teapot is on loading
            return;
        }
        console.log("draw teapot");
        gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, this.teapotMatrix);
        gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, this.nMatrix);

        // console.log(this.teapotVertexIndexBuffer);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.teapotVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.teapotVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
            gl.bindBuffer(gl.ARRAY_BUFFER, this.teapotVertexNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.teapotVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.teapotVertexTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, this.teapotVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0,0);
    
            gl.bindBuffer(gl.ARRAY_BUFFER, this.teapotVertexColorBuffer);  
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.teapotVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.teapotVertexIndexBuffer); 

        gl.uniform1i(shaderProgram.use_textureUniform, drawmode);

        gl.drawElements(gl.TRIANGLES, this.teapotVertexIndexBuffer.numItems , gl.UNSIGNED_SHORT, 0);
    }
}