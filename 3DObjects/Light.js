class Light extends Object{
    constructor(color = [1,1,1], position){
        super(color);
        this.position = position;
        this.initialSphere();
    }

    initialSphere(){
        this.sphere = new Sphere(1,this.color, 50,50);
        this.matrix = mat4.create();
        mat4.identity(this.matrix);
        mat4.translate(this.matrix, this.position);
        mat4.scale(this.matrix, [0.3,0.3,0.3])

                
        this.nMatrix = mat4.create();
        mat4.identity(this.nMatrix);
        this.nMatrix = mat4.multiply(this.nMatrix, vMatrix);
        this.nMatrix = mat4.multiply(this.nMatrix, this.matrix); 	
        this.nMatrix = mat4.inverse(this.nMatrix);
        this.nMatrix = mat4.transpose(this.nMatrix);
    }

    updatePosition(position){
        this.position = position;
        this.initialSphere();
    }

    drawObject(shaderProgram){
        // gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, x);
        gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, this.matrix);
        gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, this.nMatrix);

        this.sphere.drawObject(shaderProgram);
    }

}