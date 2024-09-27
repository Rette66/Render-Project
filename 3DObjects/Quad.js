class Quad extends Object{

    constructor(color = [0,0,0]){
        super(color);
        this.initial();
    }

    initial(){
        var vertexPosition = [
            -0.5
           ,-0.5
           ,0
           ,0.5
           ,-0.5
           ,0
           ,-0.5
           ,0.5
           ,0
           ,0.5
           ,0.5
           ,0
       ]

       this.VertexPositionBuffer = gl.createBuffer();
       gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
       gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPosition), gl.STATIC_DRAW);
       this.VertexPositionBuffer.itemSize = 3;
       this.VertexPositionBuffer.numItems = 4;

       var normals =  [
            0
            ,0
            ,1
            ,0
            ,0
            ,1
            ,0
            ,0
            ,1
            ,0
            ,0
            ,1
        ]
        this.VertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        this.VertexNormalBuffer.itemSize = 3;
        this.VertexNormalBuffer.numItems = 4;

        var texCoord = [
            0
           ,0
           ,1
           ,0
           ,0
           ,1
           ,1
           ,1
        ]
        this.VertexTexCoordsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexTexCoordsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoord), gl.STATIC_DRAW);
        this.VertexTexCoordsBuffer.itemSize = 2;
        this.VertexTexCoordsBuffer.numItems = 4;

        var index = [0,1,2,1,3,2];

        this.VertexIndexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.VertexIndexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);  
        this.VertexIndexBuffer.itemsize = 1;
        this.VertexIndexBuffer.numItems = 6; 

        var sqcolors = [
            this.color[0], this.color[1], this.color[2], 1.0,
            this.color[0], this.color[1], this.color[2], 1.0,
            this.color[0], this.color[1], this.color[2], 1.0,
            this.color[0], this.color[1], this.color[2], 1.0,
        ];    
        this.VertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sqcolors), gl.STATIC_DRAW);
        this.VertexColorBuffer.itemSize = 4;
        this.VertexColorBuffer.numItems = 4;
    }

    drawObject(shaderProgram){

        gl.uniform1i(shaderProgram.use_textureUniform, 1);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.VertexNormalBuffer.itemSize, gl.FLOAT, false, 0,0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexTexCoordsBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, this.VertexTexCoordsBuffer.itemSize, gl.FLOAT, false, 0,0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.VertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.VertexIndexBuffer);
        gl.drawElements(gl.TRIANGLES, this.VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }

} 