class Input
{
  constructor()
  {
    let _key_w = false;
    let _key_s = false;
    let _key_a = false;
    let _key_d = false;

    let _key_e = false;
    let _key_shift = false;
    let _key_tab = false;

    window.addEventListener('keydown', e => this.keyDown(e));
    window.addEventListener('keyup', e => this.keyUp(e));

    /*
    let _gpConnected = false;
    let _gps = new Array();
    window.addEventListener("gamepadconnected", e => this.gamepadConnected(e));
    window.addEventListener("gamepaddisconnected", e => this.gamepadDisconnected(e));
    */
    
    window.oncontextmenu = e => this.disableContextMenu(e);

    this.keyDown = (e) =>
    {
      switch (e.keyCode)
      {
        case 87:
          _key_w = true;
          break;
        case 83:
          _key_s = true;
          break;
        case 65:
          _key_a = true;
          break;
        case 68:
          _key_d = true;
          break;
        case 69:
          _key_e = true;
          break;
        case 16:
          _key_shift = true;
          break;
        case 9:
          _key_tab = true;
          break;
      }
    }

    this.keyUp = (e) =>
    {
      switch (e.keyCode)
      {
        case 87:
          _key_w = false;
          break;
        case 83:
          _key_s = false;
          break;
        case 65:
          _key_a = false;
          break;
        case 68:
          _key_d = false;
          break;
        case 69:
          _key_e = false;
          break;
        case 16:
          _key_shift = false;
          break;
        case 9:
          _key_tab = false;
          break;
      }
    }

    this.disableContextMenu = (e) =>
    {
        return false;
    }

    this.keyPressed = (key) =>
    {
      switch(key)
      {
        case "w":
          case "W":
            return _key_w;
        case "s":
          case "S":
            return _key_s;
        case "a":
          case "A":
            return _key_a;
        case "d":
          case "D":
            return _key_d;
        case "e":
          case "E":
            return _key_e;
        case "shift":
          case "SHIFT":
            return _key_shift;
        case "tab":
          case "TAB":
            return _key_tab;
        default:
          return "undefined"
      }
    }

    /*
    this.gpUpdate = () =>
    {

      if(_gpConnected === true)
      {
        debugP.innerHTML = "";
        for(let ea in _gps[0].buttons)
        {
          debugP.innerHTML += _gps[0].buttons[ea].pressed + ", ";
        }

      }
    }

    this.gamepadConnected = (e) =>
    {
      _gpConnected = true;
      _gps.push(navigator.getGamepads()[e.gamepad.index]);
      //let gp = navigator.getGamepads()[e.gamepad.index]
      //debugP.innerHTML = gp.id + ",</br>" + gp.index + ",</br>" + gp.buttons.length + ",</br>" + gp.axes.length + "</br>";
    }

    this.gamepadDisconnected = (e) =>
    {
      for(let ea in _gps)
      {
        if(_gps[ea].index === e){
          _gps.splice(ea, 1);
        }
      }
      if(_gps.length === 0.0)
      {
        _gpConnected = false;
      }
    }
    */
  }
}
