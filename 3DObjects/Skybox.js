class Skybox extends Object{

    constructor(color = [0,0,0]){
        super(color);
        this.initialBox();
    }

    initialBox(){
        this.objectList = [,,];

        var front = new Quad();
        var frontMatrix = mat4.create();
        mat4.identity(frontMatrix);
        mat4.translate(frontMatrix, [0,0,-5]);
        mat4.scale(frontMatrix, [10,10,10]);
        this.objectList[0] = [frontMatrix,front, negz];

        var back = new Quad();
        var backMatrix = mat4.create();
        mat4.identity(backMatrix);
        mat4.translate(backMatrix, [0,0,5]);
        mat4.scale(backMatrix, [10,10,10]);
        mat4.rotate(backMatrix, Math.PI, [0,1,0]);
        this.objectList[1] = [backMatrix, back, posz];

        var left = new Quad();
        var leftMatrix = mat4.create();
        mat4.identity(leftMatrix);
        mat4.translate(leftMatrix, [-5,0,0]);
        mat4.scale(leftMatrix, [10,10,10]);
        mat4.rotate(leftMatrix, Math.PI/2, [0,1,0]);
        this.objectList[2] = [leftMatrix, left, posx];

        var right = new Quad();
        var rightMatrix = mat4.create();
        mat4.identity(rightMatrix);
        mat4.translate(rightMatrix, [5,0,0]);
        mat4.scale(rightMatrix, [10,10,10]);
        mat4.rotate(rightMatrix, 3*Math.PI/2, [0,1,0]);
        this.objectList[3] = [rightMatrix, right, negx];

        var top = new Quad();
        var topMatrix = mat4.create();
        mat4.identity(topMatrix);
        mat4.translate(topMatrix, [0,5,0]);
        mat4.scale(topMatrix, [10,10,10]);
        mat4.rotate(topMatrix, Math.PI/2, [1,0,0]);
        this.objectList[4] = [topMatrix, top, posy];    
    
        var bottom = new Quad();
        var bottomMatrix = mat4.create();
        mat4.identity(bottomMatrix);
        mat4.translate(bottomMatrix, [0,-5,0]);
        mat4.scale(bottomMatrix, [10,10,10]);
        mat4.rotate(bottomMatrix, 3*Math.PI/2, [1,0,0]);
        this.objectList[5] = [bottomMatrix, bottom, negy];    
    }

    drawObject(shaderProgram){
        for(var i = 0; i< this.objectList.length; i++){
            this.nMatrix = mat4.create();
            mat4.identity(this.nMatrix);
            this.nMatrix = mat4.multiply(this.nMatrix, vMatrix);
            this.nMatrix = mat4.multiply(this.nMatrix,  this.objectList[i][0]); 	
            this.nMatrix = mat4.inverse(this.nMatrix);
            this.nMatrix = mat4.transpose(this.nMatrix);

            gl.activeTexture(gl.TEXTURE0);   // set texture unit 0 to use 
            gl.bindTexture(gl.TEXTURE_2D, this.objectList[i][2]);    // bind the texture object to the texture unit 
            gl.uniform1i(shaderProgram.textureUniform, 0);   // pass the texture unit to the shader
    
            gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, this.objectList[i][0]);
            gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, this.nMatrix);


            this.objectList[i][1].drawObject(shaderProgram);
        }
    }

}