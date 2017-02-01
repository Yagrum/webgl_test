class Player extends GameObject
{
  constructor(x, y, z, solid, modelID, textureID, rgba, shaderID)
  {
    super(x, y, z, solid, modelID, textureID, rgba, shaderID);

    let velocity = vec3.fromValues(0.0, 0.0, 0.0);
    let maxVelocity = 0.2;
    let acceleration = 0.03;
    let decceleration = 0.04;

    this.update = () =>
    {
      this.move();
      this.x(this.x() + velocity[0]);
      this.y(this.y() + velocity[1]);
      this.z(this.z() + velocity[2]);
    }

    //Accelerates a value by increment each tick
    this.accelerate = (goal, current, increment) =>
    {
      let dif = goal - current;

      if(dif > increment)
      {
        return current + increment;
      }
      if(dif < -increment)
      {
        return current - increment;
      }

      return goal;
    }

    //Performs acceleration and decceleration
    this.move = () =>
    {
      if(input.keyPressed("s"))
      {
        velocity[2] = this.accelerate(maxVelocity, velocity[2], acceleration);
      }
      if(input.keyPressed("w"))
      {
        velocity[2] = this.accelerate(-maxVelocity, velocity[2], acceleration);
      }
      if(!(input.keyPressed("w") || input.keyPressed("s")))
      {
        velocity[2] = this.accelerate(0.0, velocity[2], decceleration);
      }

      if(input.keyPressed("d"))
      {
        velocity[0] = this.accelerate(maxVelocity, velocity[0], acceleration);
      }
      if(input.keyPressed("a"))
      {
        velocity[0] = this.accelerate(-maxVelocity, velocity[0], acceleration);
      }
      if(!(input.keyPressed("d") || input.keyPressed("a")))
      {
        velocity[0] = this.accelerate(0.0, velocity[0], decceleration);
      }
    }
  }
}
