class Floor extends Object{
    constructor(color){
        super(color);
        this.initialFloor();
    }

    initialFloor(){
        this.floor = new Cube(1,this.color);
        this.mMatrix = mat4.create();
        mat4.identity(this.mMatrix);  
        //manually translated lower to fit the robot   
        mat4.translate(this.mMatrix, [0,-0.7,0]);
        // mat4.translate(this.mMatrix, [2,-2,0]);


        mat4.scale(this.mMatrix, [5,0.005,5]);
        // mat4.scale(this.mMatrix, [2,2,2]);
        // mat4.rotate(this.mMatrix, 90*Math.PI/180, [0,1,0]);
        // console.log(this.mMatrix);

        
        this.nMatrix = mat4.create();
        mat4.identity(this.nMatrix);
        this.nMatrix = mat4.multiply(this.nMatrix, vMatrix);
        this.nMatrix = mat4.multiply(this.nMatrix, this.mMatrix); 	
        this.nMatrix = mat4.inverse(this.nMatrix);
        this.nMatrix = mat4.transpose(this.nMatrix);
    }

    drawObject(shaderProgram){
        // this.uniformMatrix = mat4.multiply(objectTransform, this.uniformMatrix);
        gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, this.mMatrix);
        gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, this.nMatrix);

        
        this.floor.drawObject(shaderProgram);
    }

}