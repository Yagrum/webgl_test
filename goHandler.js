class GOHandler
{
  constructor()
  {
    let _solid = new Array();
    let _non_solid = new Array();
    let _id = 0;

    //Adds a new GameObject to the game
    this.add = (go) =>
    {
      if(go.solid())
      {
        go.id(_id+1);
        _solid.push(go);
      } else {
        go.id(_id+1);
        _non_solid.push(go);
      }
      _id++;
      return _id;
    }

    //Removes a GameObject from the game
    this.remove = (id) =>
    {
      for(let ea in _solid)
      {
        if(_solid[ea].id() === id)
        {
          _solid.splice(ea, 1);
          return;
        }
      }
      for(let ea in _non_solid)
      {
        if(_non_solid[ea].id() === id)
        {
          _non_solid.splice(ea, 1);
          return;
        }
      }
    }

    //Loops through all the GOs and returns the one with matching id.
    this.getByID = (id) =>
    {
      for(let ea in _solid)
      {
        if(_solid[ea].id() === id){
          return _solid[ea];
        }
      }

      for(let ea in _non_solid)
      {
        if(_non_solid[ea].id() === id){
          return _non_solid[ea];
        }
      }

      console.log("Could not find object");
    }

    //Returns all the GameObjects
    this.getAll = () =>
    {
      let out = new Array();
      for(let i = 0; i < _solid.length; i++)
      {
        out.push(_solid[i]);
      }
      for(let i = 0; i < _non_solid.length; i++)
      {
        out.push(_non_solid[i]);
      }
      return out;
    }

    //Returns the solid GameObjects
    this.getAllSolid = () =>
    {
        return _solid;
    }

    //Returns the non-solid GameObjects
    this.getAllNon_Solid = () =>
    {
      return _non_solid;
    }
  }
}
