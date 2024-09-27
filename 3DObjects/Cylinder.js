class Cylinder extends Object{

    constructor(topRadius, baseRadius, height, color, nslices = 20, nstacks = 5){
        super(color);
        this.topRadius = topRadius;
        this.baseRadius = baseRadius;
        this.height = height
        this.nslices = nslices;
        this.nstacks = nstacks;
        this.initObjectAndColor(this.topRadius, this.baseRadius, this.height, this.nslices, this.nstacks, color[0], color[1], color[2]);
        this.initialIndex(this.nslices, this.nstacks);
    }

    initObjectAndColor(topRadius, baseRadius, height, nslices, nstacks,  r,  g,  b) 
    {
        var nvertices = nslices * nstacks;
            
        var Dangle = 2*Math.PI/(nslices-1); 
        var deltaRadius = (topRadius - baseRadius)/(nstacks-1);
        
        var cyverts = [];
        var cynormals = [];
        var cycolors = [];
        var i,j;
        // for (j =0; j<nstacks; j++)
        //     var currentRadius = baseRadius - deltaRadius*j ;
        //     var h = -height /2 + j/nstacks*height;
        //     for (i=0; i<nslices; i++) {
        //         var idx = j*nslices + i; // mesh[j][i] 
        //         var angle = Dangle * i; 
        //         //vertex position
        //         cyverts.push(Math.sin(angle)); 
        //         cyverts.push(h);
        //         cyverts.push(Math.cos(angle));

        
        //         //color position
        //         cycolors.push(r);
        //         cycolors.push(g);
        //         cycolors.push(b); 
        //         cycolors.push(1.0); 
        //     }
        for (j =0; j<nstacks; j++){
            var currentRadius = baseRadius + deltaRadius*j;
            for (i=0; i<nslices; i++) {
                var idx = j*nslices + i; // mesh[j][i] 
                var angle = Dangle * i; 
                cyverts.push(currentRadius * Math.sin(angle)); 
                cyverts.push(j*height/(nstacks-1));
                cyverts.push(currentRadius * Math.cos(angle));

                cynormals.push(currentRadius * Math.sin(angle)); 
                cynormals.push(j*height/(nstacks-1));
                cynormals.push(currentRadius * Math.cos(angle));


                cycolors.push(r); 
                cycolors.push(g); 
                cycolors.push(b);	
                cycolors.push(1.0); 
            }
        }


        this.VertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cyverts), gl.STATIC_DRAW);
        this.VertexPositionBuffer.itemSize = 3;
        // console.log(cyverts);
        this.VertexPositionBuffer.numItems = nslices * nstacks;

        this.VertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cyverts), gl.STATIC_DRAW);
        this.VertexNormalBuffer.itemSize = 3;
        // console.log(cyverts);
        this.VertexNormalBuffer.numItems = nslices * nstacks;

        this.VertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cycolors), gl.STATIC_DRAW);
        // console.log(cycolors);
        this.VertexColorBuffer.itemSize = 4;
        this.VertexColorBuffer.numItems = nslices * nstacks;


    }

    initialIndex(nslices, nstacks){

        // now create the index array 
    var nindices = (nstacks-1)*6*(nslices+1); 

        var j,i;
        var cyindicies = [];
        for (j =0; j<nstacks-1; j++)
            for (i=0; i<=nslices; i++) {
                var mi = i % nslices;
                var mi2 = (i+1) % nslices;
                var idx = (j+1) * nslices + mi;	
                var idx2 = j*nslices + mi; // mesh[j][mi] 
                var idx3 = (j) * nslices + mi2;
                var idx4 = (j+1) * nslices + mi;
                var idx5 = (j) * nslices + mi2;
                var idx6 = (j+1) * nslices + mi2;
                
                cyindicies.push(idx); 
                cyindicies.push(idx2);
                cyindicies.push(idx3); 
                cyindicies.push(idx4);
                cyindicies.push(idx5); 
                cyindicies.push(idx6);
            }

        this.VertexIndexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.VertexIndexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cyindicies), gl.STATIC_DRAW);  
        this.VertexIndexBuffer.itemsize = 1;
        this.VertexIndexBuffer.numItems = (nstacks-1)*6*(nslices+1);
    }

    drawObject(shaderProgram){
        // console.log("draw cylinder");
        gl.uniform1i(shaderProgram.use_textureUniform, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.VertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.VertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.VertexIndexBuffer);
        gl.drawElements(gl.TRIANGLES, this.VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }

}