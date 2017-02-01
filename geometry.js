
class rect
{
  constructor(x, y, w, h)
  {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.intersects = function(r)
    {
      return !(((this.x + this.w) < r.x) || ((r.x + r.w) < this.x) || ((this.y + this.h) < r.y) || ((r.y + r.h) < this.y));
    }

    this.contains = function(p)
    {
      return !(p[0] < this.x || p[0] > this.w|| p[1] > this.y || p[1] < this.h);
    }
  }
}

class circle
{
  constructor(x, y, rad)
  {
    this.x = x;
    this.y = y;
    this.rad = rad;
  }
}
