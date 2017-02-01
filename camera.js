class Camera
{
  constructor()
  {
    let _vMatrix = mat4.create();
    mat4.lookAt(_vMatrix, [0.0, 0.0, -10.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);

    //deg = degrees to rotate by
    //axis = vec3 for the axis to rotate
    this.rotate = (deg, axis) =>
    {
      mat4.rotate(_vMatrix, _vMatrix, (glMatrix.toRadian(deg)), axis);
    }

    //offset = vec3 for moving cameras location in the world.
    this.move = (offset) =>
    {
      mat4.translate(_vMatrix, _vMatrix, offset);
    }

    //cCoords = vec3 for cameras location in the world.
    //tCoords = vec3 for the spot camera should look at.
    //up = vec3 for the direction camera should consider the up direction. (example: [0.0, 1.0, 0.0])
    this.focusOn = (cCoords, tCoords, up) =>
    {
      mat4.lookAt(_vMatrix, cCoords, tCoords, up)
    }

    this.vMatrix = () =>
    {
      return _vMatrix;
    }
  }
}
