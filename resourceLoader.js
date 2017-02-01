class DataFetcher
{
  constructor()
  {
    //Loads the raw data from given file and creates a ModelData object from it
    this.loadOBJ = (id, filePath) =>
    {
      return new Promise((resolve, reject) =>{
        let XHTTP = new XMLHttpRequest();
        XHTTP.open("GET", filePath, true);

        //Vertices
        let objVertices = new Array();
        //Texture coordinates
        let objUVs = new Array();
        //Indices
        let objIndices = new Array();
        let objUVindices = new Array();
        let numFs;


        XHTTP.onreadystatechange = function()
        {
          if(this.readyState == 4 && this.status == 200)
          {
            let raw = this.responseText.split("\n");
            if(typeof raw === "undefined"){
              reject("No data recieved");
            }
            for(let j = 0; j < raw.length; j++)
            {
              //Vertices
              if(raw[j][0] === "v" && raw[j][1] !== "t")
              {
                let rawVector = raw[j].split(" ");
                objVertices.push([Number(rawVector[1]), Number(rawVector[2]), Number(rawVector[3])]);
              }
              //Texture coordinates
              else if(raw[j][0] === "v" && raw[j][1] === "t")
              {
                let rawTexCoord = raw[j].split(" ");
                objUVs.push([Number(rawTexCoord[1]), 1.0-(Number(rawTexCoord[2]))]);
              }
              //Indices
              else if(raw[j][0] === "f")
              {
                let rawIndices = raw[j].split(" ");

                //Determin the number of f values
                if(typeof numFs === "undefined")
                {
                  numFs = rawIndices[1].match(/\//g);
                }

                if(numFs === null)
                {
                  for(let h = 1; h < rawIndices.length; h++){
                    objIndices.push(Number(rawIndices[h])-1);
                  }
                }
                else if(numFs.length === 1)
                {
                  let slasher;
                  for(let h = 1; h < rawIndices.length; h++){
                    slasher = rawIndices[h].split("/");
                    objIndices.push(Number(slasher[0])-1);
                    objUVindices.push(Number(slasher[1])-1)
                  }
                } else {
                  console.log("Incompatible number of slashes in obj faces")
                }
              }

            }

            if(numFs === null)
            {
              let newVertices = new Array();
              for(let ea in objVertices)
              {
                newVertices.push(objVertices[ea][0]);
                newVertices.push(objVertices[ea][1]);
                newVertices.push(objVertices[ea][2]);
              }
              resolve(new ModelData(id, objIndices, newVertices, false));
            }
            else if(numFs.length === 1)
            {
              let newData = new Array(); // [vIndex, uvIndex, vertices, uvCoords]
              let newIndices = new Array();
              for(let inc = 0; inc < objIndices.length; inc++)
              {
                let notFound = true;
                for(let b = 0; b < newData.length; b++)
                {
                  if(newData[b][0] === objIndices[inc] && newData[b][1] === objUVindices[inc])
                  {
                    newIndices.push(b);
                    notFound = false;
                    break;
                  }
                }
                if(notFound)
                {
                  let loc = newData.length;
                  newIndices.push(loc);
                  newData[loc] = [objIndices[inc], objUVindices[inc], objVertices[objIndices[inc]], objUVs[objUVindices[inc]]];
                }
              }


              let newVertices = new Array();
              let newUVs = new Array();
              for(let r = 0; r < newData.length; r++)
              {
                newVertices.push(newData[r][2][0]);
                newVertices.push(newData[r][2][1]);
                newVertices.push(newData[r][2][2]);

                newUVs.push(newData[r][3][0]);
                newUVs.push(newData[r][3][1]);
              }
              resolve(new ModelData(id, newIndices, newVertices, newUVs));
            }
          }
        }
        XHTTP.send();
      });
    }

    //Loads a texture
    this.loadTexture = (id, filePath) =>
    {
      return new Promise((resolve, reject) => {
        let img = new Image();
        let startTime;

        img.onload = function()
        {
          startTime = new Date().getTime();
          isComplete();
        }
        function isComplete()
        {
          if(img.complete)
          {
            resolve(new TextureData(id, img));
          }else{
            if(new Date().getTime() - startTime < 60000)
            {
              setTimeout(isComplete, 50);
            } else {
              reject("Could not load texture '" + id + "':'" + filePath + "'");
            }
          }
        }
        img.src = filePath;
      });
    }

    //Load a shader
    this.loadShader = (id, filePath, type) =>
    {

      return new Promise((resolve, reject) =>
      {
        let response;
        let XHTTP = new XMLHttpRequest();
        XHTTP.onreadystatechange = function()
        {
          if(this.readyState == 4 && this.status == 200)
          {
            response = this.responseText;
            if(typeof response !== "undefined"){
              resolve(new ShaderData(id, response, type));
            } else {
              reject("No data recived from '" + id + "':'" + filePath + "'");
            }
          }
        }

        XHTTP.open("GET", filePath, true);
        XHTTP.send();
      });
    }
  }
}

class DataStorage
{
  constructor()
  {
    let _modelsData = new Array();
    let _texturesData = new Array();
    let _shadersData = new Array();

    this.storeAll = (data) =>
    {
      for(let ea in data)
      {
        if(data[ea] instanceof ModelData)
        {
          dataStorage.addModelData(data[ea]);
        } else if (data[ea] instanceof TextureData)
        {
          dataStorage.addTextureData(data[ea])
        } else if (data[ea] instanceof ShaderData)
        {
          dataStorage.addShaderData(data[ea])
        } else {
          console.log("Cannot store data. Uknown type.");
        }
      }
    }

    this.addShaderData = (data) =>
    {
      if(data instanceof ShaderData)
      {
        _shadersData[data.id()] = data;
      } else {
        console.log("Could not store ShaderData. Object wrong type.");
      }
    }

    this.addTextureData = (data) =>
    {
      if(data instanceof TextureData)
      {
        _texturesData[data.id()] = data;
      } else {
        console.log("Could not store TextureData. Object wrong type.");
      }
    }

    this.addModelData = (data) =>
    {
      if(data instanceof ModelData)
      {
        _modelsData[data.id()] = data;
      } else {
        console.log("Could not store ModelData. Object wrong type.");
      }
    }

    this.getModelData = (id) =>
    {
      if(typeof _modelsData[id] !== "undefined")
      {
        return _modelsData[id];
      } else {
        console.log("Data '" + id + "' is not in storage or of type 'ModelData'.");
      }
    }

    this.getTextureData = (id) =>
    {
      if(typeof _texturesData[id] !== "undefined")
      {
        return _texturesData[id];
      } else {
        console.log("Data '" + id + "' is not in storage or of type 'TextureData'.");
      }
    }

    this.getShaderData = (id) =>
    {
      if(typeof _shadersData[id] !== "undefined")
      {
        return _shadersData[id];
      } else {
        console.log("Data '" + id + "' is not in storage or of type 'ShaderData'.");
      }
    }
  }
}

class ShaderData
{
  constructor(id, data, type)
  {
    let _id = id;
    let _data = data;
    let _type = type;

    //Getters/Setters
    this.id = (val) => {
      if(typeof val === "undefined")
      {
        return _id;
      } else {
        console.log("Cannot change id for 'modelTexture' object.");
      }
    }

    this.data = (val) => {
      if(typeof val === "undefined")
      {
        return _data;
      } else {
        _data = val;
      }
    }

    this.type = (val) => {
      if(typeof val === "undefined")
      {
        return _type;
      } else {
        _type = val;
      }
    }
  }
}

class TextureData
{
  constructor(id, image)
  {
    let _id = id;
    let _image = image;

    //Getters/Setters
    this.id = (val) => {
      if(typeof val === "undefined")
      {
        return _id;
      } else {
        console.log("Cannot change id for 'modelTexture' object.");
      }
    }

    this.image = (val) => {
      if(typeof val === "undefined")
      {
        return _image;
      } else {
        _image = val;
      }
    }
  }
}

class ModelData
{
  constructor(id, indices, vertices, UVs)
  {
    let _id = id;
    let _indices = indices;
    let _vertices = vertices;
    let _UVs = UVs;


    //Getters/Setters
    this.id = (val) =>
    {
      if(typeof val === "undefined"){
        return id;
      } else {
        console.log("Cannot set id of 'ModelData' object.");
      }
    }

    this.indices = (val) =>
    {
      if(typeof val === "undefined")
      {
        return _indices;
      } else {
        _indices = val;
      }
    }

    this.vertices = (val) =>
    {
      if(typeof val === "undefined")
      {
        return _vertices;
      } else {
        _vertices = val;
      }
    }

    this.UVs = (val) =>
    {
      if(typeof val === "undefined")
      {
        return _UVs;
      } else {
        _UVs = val;
      }
    }
  }
}
