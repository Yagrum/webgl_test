class GLSL
{
  constructor(gl)
  {
    let _shaderProgram = new Array();
    let _fragmentShader = new Array();
    let _vertexShader = new Array();
    let _gl = gl;

    //Takes in raw shadercode for fragment and vertex shader and initilizes the shader program
    this.initShaders = (id, vsShaderData, fsShaderData) =>
    {
      //Fetch shader code
      _fragmentShader[id] = this.getShader(fsShaderData.data(), fsShaderData.type());
      _vertexShader[id] = this.getShader(vsShaderData.data(), vsShaderData.type());

      //Create the shader program
      _shaderProgram[id] = _gl.createProgram();

      //Attach shaders to program
      _gl.attachShader(_shaderProgram[id], _vertexShader[id]);
      _gl.attachShader(_shaderProgram[id], _fragmentShader[id]);

      //Link the program
      _gl.linkProgram(_shaderProgram[id]);

      //Checking for linking error
      if (!_gl.getProgramParameter(_shaderProgram[id], _gl.LINK_STATUS)) {
        alert("Could not initialize the shader program: " + _gl.getProgramInfoLog(_shaderProgram[id]));
      }

      this.use(id);
    }

    //Converts raw shader code into a shader
    this.getShader = (data, type) =>
    {
      let shader;

      if (type === "fs")
      {
          shader = _gl.createShader(_gl.FRAGMENT_SHADER);
      }
      else if (type === "vs")
      {
          shader = _gl.createShader(_gl.VERTEX_SHADER);
      } else {
          return null;
      }

      _gl.shaderSource(shader, data);

      _gl.compileShader(shader);


      if (!_gl.getShaderParameter(shader, _gl.COMPILE_STATUS)) {
          alert("Could not create shader.\nError: " + _gl.getShaderInfoLog(shader));
          return null;
      }

      return shader;
    }

    //Gets the location of an attribute
    this.addAttribute = (id, aName) =>
    {
      let varLoc = _gl.getAttribLocation(_shaderProgram[id], aName);
      _gl.enableVertexAttribArray(varLoc);
      return varLoc;
    }

    //Gets the location of an uniform variable
    this.addUniform = (id, uName) =>
    {
      return _gl.getUniformLocation(_shaderProgram[id], uName);
    }

    //Getters/Setters
    this.shaderProgram = (id) =>
    {
      if(typeof val === "undefined")
      {
        console.log("Shader not found.");
      } else {
        return _shaderProgram[id];
      }
    }

    this.use = (id) =>
    {
      //User shader program
      _gl.useProgram(_shaderProgram[id]);
    }

  }
}
