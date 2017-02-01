function Renderer(_canvas)
{
    let canvas = _canvas;
    let gl = null;
    let shaderProgram;
    let vertexPositionAttribute = new Array(); let vertexColorAttribute = new Array(); let textureCoordAttribute = new Array();
    let pUniform = new Array(); let mvUniform = new Array(); let vUniform = new Array(); let uSampler = new Array();
    let pMatrix = mat4.create();
    let mvMatrix = mat4.create();
    let stack = new Array();
    let models = new Array(); let textures = new Array();


    //Function for initilizing WebGL
    this.initWebGL = () =>
    {
        try
        {
          gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        }
        catch(e)
        {
            alert("An error occured when trying to initilize WebGL.\nError: " + e.message);
        }

        if (!gl)
        {
          alert("Could not initialize WebGL. Browser may not support WebGL");
        }else
        {
            gl.clearColor(0.0, 0.6, 0.8, 1.0);
            gl.clearDepth(1.0);
            gl.depthFunc(gl.LEQUAL);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
            gl.frontFace(gl.CCW);
            gl.cullFace(gl.BACK);

        }
    }

    this.getAttribLocations = (shaderID) =>
    {
      vertexPositionAttribute[shaderID] = glsl.addAttribute( shaderID,"aVertexPosition");
      vertexColorAttribute[shaderID] = glsl.addAttribute( shaderID,"aVertexColor");

      if(shaderID !== "untextured"){
        textureCoordAttribute[shaderID] = glsl.addAttribute( shaderID,"aTextureCoord");
      }
    }

    this.getUniformLocations = (shaderID) =>
    {
      pUniform[shaderID] = glsl.addUniform(shaderID,"uPMatrix");
      mvUniform[shaderID] = glsl.addUniform(shaderID,"uMVMatrix");
      vUniform[shaderID] = glsl.addUniform(shaderID,"uVMatrix");

      if(shaderID !== "untextured"){
        uSampler[shaderID] = glsl.addUniform(shaderID,"uSampler");
      }
    }

    //Stores a texture into memory
    this.storeTexture = (id, image) =>
    {
      if(typeof textures[id] === "undefined")
      {
        textures[id] = new Array();
        textures[id][0] = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, textures[id][0]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);

      }
    }

    //Stores model into memory
    this.storeModel = (id, vertices, indices, UVs) =>
    {
        if(typeof models[id] === "undefined")
        {
            let VBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

            let IBO = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IBO);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


            let UVBO;
            if(UVs !== false){
              UVBO = gl.createBuffer();
              gl.bindBuffer(gl.ARRAY_BUFFER, UVBO);
              gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(UVs), gl.STATIC_DRAW);
            } else {
              UVBO = false;
            }
            models[id] = new Model(id, VBO, IBO, UVBO, vertices.length, indices.length);
        }
    }

    this.clear = () =>
    {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    //Sets the perspecitve matrix
    this.setPerspectiveMatrix = (fovy, aspect, near, far) =>
    {
      mat4.perspective(pMatrix, glMatrix.toRadian(fovy), aspect, near, far);
    }

    //Sets the perspective matrix into orthographic mode
    this.setOrthoMatrix =  (left, right, bottom, top, near, far) =>
    {
      mat4.ortho(pMatrix, left, right, bottom, top, near, far);
    }

    this.GL = () =>
    {
      return gl;
    }

    this.shaderProgram = (val) =>
    {
      if(typeof val === "undefined")
      {
        return shaderProgram;
      } else {
        shaderProgram = val;
      }
    }

    //Renders a model from memory with a texture from memory
    //id = models id in the models array
    this.renderModel = (id, rgba, textureID, shaderID) =>
    {
      glsl.use(shaderID);

      gl.bindBuffer(gl.ARRAY_BUFFER, models[id].VBO);
      gl.vertexAttribPointer(vertexPositionAttribute[shaderID], 3, gl.FLOAT, false, 0, 0);

      let color = new Array();
      if(rgba !== false){
        for(let i = 0; i < (models[id].numVertices / 3); i++)
        {
          color.push(rgba[0]);
          color.push(rgba[1]);
          color.push(rgba[2]);
          color.push(rgba[3]);
        }
      }else
      {
        for(let i = 0; i < (models[id].numVertices / 3); i++)
        {
          color.push(1.0);
          color.push(1.0);
          color.push(1.0);
          color.push(1.0);
        }
      }
      let colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
      gl.vertexAttribPointer(vertexColorAttribute[shaderID], 4, gl.FLOAT, false, 0, 0);

      if(models[id].UVBO !== false){
        gl.bindBuffer(gl.ARRAY_BUFFER, models[id].UVBO);
        gl.vertexAttribPointer(textureCoordAttribute[shaderID], 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textures[textureID][0]);
        gl.uniform1i(uSampler[shaderID], 0);
      }

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, models[id].IBO);
      this.setMatrixUniforms(shaderID);
      gl.drawElements(gl.TRIANGLES, models[id].numIndices, gl.UNSIGNED_SHORT, 0);
    }

    this.loadIdentity = () =>
    {
        mat4.identity(mvMatrix);
    }

    this.translate = (v) =>
    {
      mat4.translate(mvMatrix, mvMatrix, v);
    }

    this.rotate = (rad, axis) =>
    {
      mat4.rotate(mvMatrix, mvMatrix, rad, axis);
    }

    this.scale = (v) =>
    {
      mat4.scale(mvMatrix, mvMatrix, v);
    }

    this.setMatrixUniforms = (shaderID) =>
    {
        gl.uniformMatrix4fv(pUniform[shaderID], false, new Float32Array(pMatrix));
        gl.uniformMatrix4fv(mvUniform[shaderID], false, new Float32Array(mvMatrix));
        gl.uniformMatrix4fv(vUniform[shaderID], false, new Float32Array(camera.vMatrix()));
    }

    this.push = () =>
    {
      stack.push(mat4.clone(mvMatrix));
    }

    this.pop = () =>
    {
      mvMatrix = stack.pop();
    }
}
