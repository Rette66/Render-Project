class Sphere extends Object{

    constructor(radius, color, nslices = 30, nstacks = 30){
        super(color)
        this.radius = radius;
        this.color = color;
        this.nslices = nslices;
        this.nstacks = nstacks;
        this.iniObjectAndColor(this.nslices, this.nstacks, color[0], color[1], color[2]);
        this.initialIndex(this.nslices, this.nstacks);
    }

    iniObjectAndColor(nslices, nstacks, r, g, b){
        var sectorStep = Math.PI * 2 / (nslices-1);
        var stackStep = Math.PI / nstacks;
        var spverts = [];
        var spnormals = []
        var spcolor = [];
        
        var i, j

        for(j = 0; j< nstacks; j++){      
            //phi, current stack angle          
            var currentStack = Math.PI/2 - stackStep * j;
            for(i = 0; i <= nslices; i++){
                //theta current sector angle
                var currentSector = sectorStep * i;
                var x = this.radius * Math.cos(currentStack) * Math.cos(currentSector);
                var y = this.radius * Math.cos(currentStack) * Math.sin(currentSector);
                var z = this.radius * Math.sin(currentStack);
                //position
                spverts.push(x);
                spverts.push(y);
                spverts.push(z);

                spnormals.push(x);
                spnormals.push(y);
                spnormals.push(z);
                
 
                //color position
                spcolor.push(r);
                spcolor.push(g);
                spcolor.push(b);
                spcolor.push(1);
                
            }
        }
        this.VertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(spverts), gl.STATIC_DRAW);
        this.VertexPositionBuffer.itemSize = 3;
        // console.log(spverts);
        this.VertexPositionBuffer.numItems = nslices * nstacks;

        this.vertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(spnormals), gl.STATIC_DRAW);
        this.vertexNormalBuffer.itemSize = 3;
        this.vertexNormalBuffer.numItems = nslices * nstacks;

        this.VertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(spcolor), gl.STATIC_DRAW);
        // console.log(spcolor);
        this.VertexColorBuffer.itemSize = 4;
        this.VertexColorBuffer.numItems = nslices * nstacks;
    }

    initialIndex(nslices, nstacks){
        var j,i;
        var spindex = [];
        for(j = 0; j < nstacks; j++){
            var k1 = j * (nslices + 1); //beginning of current stack
            var k2 = k1 + nslices + 1;  //beginning of next stack
            for(i = 0; i < nslices; i++ , ++k1, ++k2){

                if(j != 0){
                    spindex.push(k1);
                    spindex.push(k2);
                    spindex.push(k1 + 1);
                }

                if(j != (nstacks-1)){
                    spindex.push(k1 + 1);
                    spindex.push(k2);
                    spindex.push(k2 + 1);
                }
            }
        }
        // console.log(spindex);
        this.VertexIndexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.VertexIndexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(spindex), gl.STATIC_DRAW);  
        this.VertexIndexBuffer.itemsize = 1;
        this.VertexIndexBuffer.numItems = spindex.length;
    }

    drawObject(shaderProgram){
        gl.uniform1i(shaderProgram.use_textureUniform, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.VertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.VertexIndexBuffer);
        gl.drawElements(gl.TRIANGLES, this.VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}