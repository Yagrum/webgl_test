class GameObject
{
  constructor(x, y, z, solid, modelID, textureID, rgba, shaderID)
  {
    let _x = x;
    let _y = y;
    let _z = z;

    let _solid = solid;

    let _modelID = modelID;
    let _textureID = textureID;
    let _shaderID = shaderID;
    let _id;

    let _rgba = rgba;
    let _scale = vec3.fromValues(1.0, 1.0, 1.0);

    let _flags = new Array();
    _flags["remove"] = false;

    this.render = () =>
    {
      renderer.push();
        renderer.translate(vec3.fromValues(_x, _y, _z));
        renderer.scale(_scale);
        renderer.renderModel(_modelID, _rgba, _textureID, _shaderID);
      renderer.pop();
    }

    this.update = () =>
    {
    }

    //Getters/Setters
    this.x = (val) =>
    {
      if(typeof val === "undefined")
      {
        return _x;
      } else {
        _x = val;
      }
    }

    this.y = (val) =>
    {
      if(typeof val === "undefined")
      {
        return _y;
      } else {
        _y = val;
      }
    }

    this.z = (val) =>
    {
      if(typeof val === "undefined")
      {
        return _z;
      } else {
        _z = val;
      }
    }

    this.solid = (val) =>
    {
      if(typeof val === "undefined")
      {
        return _solid;
      } else {
        _solid = val;
      }
    }

    this.modelID = (val) =>
    {
      if(typeof val === "undefined")
      {
        return _modelID;
      } else {
        _modelID = val;
      }
    }

    this.textureID = (val) =>
    {
      if(typeof val === "undefined")
      {
        return _textureID;
      } else {
        _textureID = val;
      }
    }

    this.shaderID = (val) =>
    {
      if(typeof val === "undefined")
      {
        return _shaderID;
      } else {
        _shaderID = val;
      }
    }

    this.id = (val) =>
    {
      if(typeof val === "undefined")
      {
        return _id;
      } else {
        _id = val
      }
    }

    this.rgba = (val) =>
    {
      if(typeof val === "undefined")
      {
        return _rgba;
      } else {
        _rgba = val;
      }
    }

    this.scale = (val) =>
    {
      if(typeof val === "undefined")
      {
        return _scale;
      } else {
        _scale = val;
      }
    }

    this.remove = (val) =>
    {
      if(typeof val === "undefined")
      {
        return _flags["remove"];
      } else {
        _flags[remove] = val;
      }
    }
  }
}
