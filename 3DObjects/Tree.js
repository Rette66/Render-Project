class Tree extends Object{
    constructor(green = [.16,.49,.10], brown = [.45,.36,.25]){
        super(green);
        this.green = green;
        this.brown = brown
        this.initialTree();
    }

    initialTree(){

        this.objectList = [,];
        var cylinderTop = new Cylinder(0,1,1,this.green,30,50);
        var cylinderTopMatrix = mat4.create();
        mat4.identity(cylinderTopMatrix);
        mat4.translate(cylinderTopMatrix, [-1.5,1,-1.5]);
        mat4.scale(cylinderTopMatrix, [1,0.7,1]);
        // mat4.rotate(cylinderTopMatrix, 0, [0,0,0]);
        this.objectList[0] = [cylinderTopMatrix, cylinderTop];

        var cylinderMiddle = new Cylinder(0,1,1,this.green,30,30);
        var cylinderMiddleMatrix = mat4.create();
        mat4.identity(cylinderMiddleMatrix);
        mat4.translate(cylinderMiddleMatrix, [-1.5,0.6,-1.5]);
        mat4.scale(cylinderMiddleMatrix, [1,0.7,1]);
        this.objectList[1] = [cylinderMiddleMatrix, cylinderMiddle];

        var cylinderBottome = new Cylinder(0.5,0.5,1.5,this.brown,30,30);
        var cylinderBottomeMatrix = mat4.create();
        mat4.identity(cylinderBottomeMatrix);
        mat4.translate(cylinderBottomeMatrix, [-1.5,-0.7,-1.5]);
        mat4.scale(cylinderBottomeMatrix, [0.5,1,0.5]);
        this.objectList[2] = [cylinderBottomeMatrix, cylinderBottome];
    }

    rotateObject(X_RAD, Y_RAD, Z_RAD){
        var i;
        for(i = 0; i < this.objectList.length; i++){
            this.objectList[i][0] = mat4.rotate(this.objectList[i][0], X_RAD, [1, 0, 0]);   // now set up the model matrix 
            this.objectList[i][0] = mat4.rotate(this.objectList[i][0], Y_RAD, [0, 1, 0]);   // now set up the model matrix 
            this.objectList[i][0] = mat4.rotate(this.objectList[i][0], Z_RAD, [0, 0, 1]);   // now set up the model matrix         }
        }
    }

    drawObject(shaderProgram){
        var i;
        for(i = 0; i < this.objectList.length; i++){
            // this.objectList[i][0] = mat4.multiply(objectTransform, this.objectList[i][0]);
            // console.log(this.objectList[i][0]);

            this.nMatrix = mat4.create();
            mat4.identity(this.nMatrix);
            this.nMatrix = mat4.multiply(this.nMatrix, vMatrix);
            this.nMatrix = mat4.multiply(this.nMatrix,  this.objectList[i][0]); 	
            this.nMatrix = mat4.inverse(this.nMatrix);
            this.nMatrix = mat4.transpose(this.nMatrix);

            gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, this.objectList[i][0]);
            gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, this.nMatrix);

            // console.log(this.objectList[i][1]);
            this.objectList[i][1].drawObject(shaderProgram);
        }
    }
}