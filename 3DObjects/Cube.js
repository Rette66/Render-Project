class Cube extends Object{

    constructor(size, color){
        super(color);
        this.size = size
        this.color = color;
        this.initialVertex();
        this.initialIndex();
        this.initialColor();  
        // this.initialNormal();      
    }

    initialVertex(){
        var halfsize = this.size/2;
        var sqvertices = [
            halfsize,  halfsize,  -halfsize,
            -halfsize,  halfsize,  -halfsize, 
            - halfsize, -halfsize,  -halfsize,
            halfsize, -halfsize,  -halfsize,
            halfsize,  halfsize,  halfsize,
            -halfsize,  halfsize,  halfsize, 
            -halfsize, -halfsize,  halfsize,
            halfsize, -halfsize,  halfsize,	    
        ];

        this.VertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sqvertices), gl.STATIC_DRAW);
        this.VertexPositionBuffer.itemSize = 3;
        this.VertexPositionBuffer.numItems = 8;
        // console.log(sqvertices);

        var sqnormal = sqvertices;

        this.VertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sqnormal), gl.STATIC_DRAW);
        this.VertexNormalBuffer.itemSize = 3;
        this.VertexNormalBuffer.numItems = 8;
    }

    initialIndex(){
        var sqindices = [0,1,2, 0,2,3, 0,3,7, 0,7,4, 6,2,3, 6,3,7, 5,1,2, 5,2,6, 5,1,0, 5,0,4, 5,6,7, 5,7,4];

        this.VertexIndexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.VertexIndexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sqindices), gl.STATIC_DRAW);  
        this.VertexIndexBuffer.itemsize = 1;
        this.VertexIndexBuffer.numItems = 36;  
    }

    initialColor(){
        var sqcolors = [
            this.color[0], this.color[1], this.color[2], 1.0,
            this.color[0], this.color[1], this.color[2], 1.0,
            this.color[0], this.color[1], this.color[2], 1.0,
            this.color[0], this.color[1], this.color[2], 1.0,
            this.color[0], this.color[1], this.color[2], 1.0,
            this.color[0], this.color[1], this.color[2], 1.0,
            this.color[0], this.color[1], this.color[2], 1.0,
            this.color[0], this.color[1], this.color[2], 1.0,
        ];    

        // console.log(sqcolors);

        this.VertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sqcolors), gl.STATIC_DRAW);
        this.VertexColorBuffer.itemSize = 4;
        this.VertexColorBuffer.numItems = 8;
    }

    // initialNormal(){
    //     var sqnormal = new Float32Array(this.VertexPositionBuffer.itemSize * this.VertexPositionBuffer.numItems);


    // }
    

    drawObject(shaderProgram){
        
        gl.uniform1i(shaderProgram.use_textureUniform, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.VertexNormalBuffer.itemSize, gl.FLOAT, false, 0,0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.VertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.VertexIndexBuffer);
        // console.log(gl.ELEMENT_ARRAY_BUFFER);
        gl.drawElements(gl.TRIANGLES, this.VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }


}