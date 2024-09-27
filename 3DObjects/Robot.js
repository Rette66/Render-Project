class Robot {

    constructor(){
        this.headColor = [.66,.66,.67];
        this.bodyColor = [.4,.5,.55];
        this.armColor = [.96,.51,.45];
        this.legColor = [.92,.88,.78];
        this.heatColor = [.1,.3,.365];
        this.handColor = [.65,.33,.1];
        this.footColor = [.60,.80,.20];

        this.scaleOffsetX = 0;
        this.scaleOffsetY = 0;
        this.scaleOffsetZ = 0;

        this.translateOffsetX = 0;
        this.translateOffsetY = 0;
        this.translateOffsetZ = 0;

        this.rotateOffsetRAD = 0;
        this.rotateOffsetAxis = [0,1,0];
        this.initialRobot();
    }

    initialRobot(){
        this.objectList =[,];

        //head
        var head = new Sphere (1, this.headColor, 50,50);
        var headMatrix = mat4.create();
        mat4.identity(headMatrix);
        mat4.translate(headMatrix, [0+this.translateOffsetX, 1.2+this.translateOffsetY ,0+this.translateOffsetZ]);
        mat4.rotate(headMatrix, this.rotateOffsetRAD, this.rotateOffsetAxis);
        mat4.scale(headMatrix, [0.2+this.scaleOffsetX, 0.2+this.scaleOffsetY, 0.2+this.scaleOffsetZ]);
        this.objectList[0] = [headMatrix,head];

        //body
        var body = new Cube(1,this.bodyColor);
        var bodyMatrix = mat4.create();
        mat4.identity(bodyMatrix);
        mat4.translate(bodyMatrix, [0+this.translateOffsetX, 0.5+this.translateOffsetY ,0+this.translateOffsetZ]);
        mat4.rotate(bodyMatrix, this.rotateOffsetRAD, this.rotateOffsetAxis);
        mat4.scale(bodyMatrix, [0.7 + this.scaleOffsetX, 1+this.scaleOffsetY, 0.4 +this.scaleOffsetZ]);
        this.objectList[1] = [bodyMatrix,body];

        //right arm
        var rightArm = new Cube(0.7,this.armColor);
        var rightArmMtrix = mat4.create();
        mat4.identity(rightArmMtrix);
        mat4.translate(rightArmMtrix, [0.45+this.translateOffsetX, 0.65+this.translateOffsetY ,-0.1+this.translateOffsetZ]);
        mat4.rotate(rightArmMtrix, 10 * Math.PI/180, [0,0,1]);
        mat4.rotate(rightArmMtrix, this.rotateOffsetRAD, this.rotateOffsetAxis);        
        mat4.scale(rightArmMtrix, [0.2+this.scaleOffsetX, 0.8+this.scaleOffsetY, 0.2+this.scaleOffsetZ]);

        // mat4.scale(rightArmMtrix, [0.2+this.scaleOffsetX, 0.3+this.scaleOffsetY, 0.2+this.scaleOffsetZ]);
        // mat4.translate(rightArmMtrix, [0+this.translateOffsetX, 1.2+this.translateOffsetY ,0+this.translateOffsetZ]);
        // mat4.rotate(rightArmMtrix, this.rotateOffsetRAD, this.rotateOffsetAxis);

        this.objectList[2] = [rightArmMtrix,rightArm];

        // var temp = bodyMatrix;
        // rightArmMtrix =  mat4.translate(temp, [2,0,0]);
        // this.objectList[2] = [rightArmMtrix,rightArm];

        //left arm
        var leftArm = new Cube(0.7,this.armColor);
        var leftArmMatrix = mat4.create();
        mat4.identity(leftArmMatrix);
        mat4.translate(leftArmMatrix, [-0.45+this.translateOffsetX, 0.65+this.translateOffsetY ,-0.1+this.translateOffsetZ]);
        mat4.rotate(leftArmMatrix, 10 * Math.PI/180, [0,0,-1]);
        mat4.rotate(leftArmMatrix, this.rotateOffsetRAD, this.rotateOffsetAxis);
        mat4.scale(leftArmMatrix, [0.2+this.scaleOffsetX, 0.8+this.scaleOffsetY, 0.2+this.scaleOffsetZ]);
        this.objectList[3] = [leftArmMatrix,leftArm];

        //right leg
        var rightLeg = new Cylinder(0.5,0.5,1,this.legColor,30,30);
        var rightLegMatrix = mat4.create();
        mat4.identity(rightLegMatrix);
        mat4.translate(rightLegMatrix, [0.2+this.translateOffsetX, -0.7+this.translateOffsetY ,0+this.translateOffsetZ]);
        mat4.rotate(rightLegMatrix, 0 * Math.PI/180, [0,0,1]);
        mat4.rotate(rightLegMatrix, this.rotateOffsetRAD, this.rotateOffsetAxis);
        mat4.scale(rightLegMatrix, [0.2+this.scaleOffsetX, 0.7+this.scaleOffsetY, 0.2+this.scaleOffsetZ]);
        this.objectList[4] = [rightLegMatrix,rightLeg];

        //left leg
        var leftLeg = new Cylinder(0.5,0.5,1,this.legColor,30,30);
        var leftLegMatrix = mat4.create();
        mat4.identity(leftLegMatrix);
        mat4.translate(leftLegMatrix, [-0.2+this.translateOffsetX, -0.7+this.translateOffsetY ,0+this.translateOffsetZ]);
        mat4.rotate(leftLegMatrix, 0 * Math.PI/180, [0,0,1]);
        mat4.rotate(leftLegMatrix, this.rotateOffsetRAD, this.rotateOffsetAxis);
        mat4.scale(leftLegMatrix, [0.2+this.scaleOffsetX, 0.7+this.scaleOffsetY, 0.2+this.scaleOffsetZ]);
        this.objectList[5] = [leftLegMatrix,leftLeg];

        //heat
        var heat = new Cylinder(0,1,1,this.heatColor,30,30);
        var heatMatrix = mat4.create();
        mat4.identity(heatMatrix);
        mat4.translate(heatMatrix, [0+this.translateOffsetX, 1.27+this.translateOffsetY ,0+this.translateOffsetZ]);
        mat4.rotate(heatMatrix, 0 * Math.PI/180, [0,0,1]);
        mat4.rotate(heatMatrix, this.rotateOffsetRAD, this.rotateOffsetAxis);
        mat4.scale(heatMatrix, [0.5+this.scaleOffsetX, 0.3+this.scaleOffsetY, 0.5+this.scaleOffsetZ]);
        this.objectList[6] = [heatMatrix,heat];
    }


    walkForward(){
        this.translateOffsetZ-=0.3;
        this.initialRobot();
    }

    walkBack(){
        this.translateOffsetZ+=0.3;
        this.initialRobot();
    }

    walkLeft(){
        this.translateOffsetX-=0.3;
        this.initialRobot();
    }

    walkRight(){
        this.translateOffsetX+=0.3;
        this.initialRobot();
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