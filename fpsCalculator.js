class FPSCalculator
{
    constructor(element)
    {
        this.timeStart = 0;
        this.count = 0;
        this.timeNow = new Date().getTime();
        this.element = element;
    }

    update()
    {
        this.timeNow = new Date().getTime();
        if(this.timeStart !== 0)
        {
            if((this.timeNow - this.timeStart) >= 1000)
            {
                this.element.innerHTML = "FPS: " + this.count;
                this.count = 0;
                this.timeStart = this.timeNow;
            }else{
                this.count++;
            }
        }else{
            this.timeStart = this.timeNow;
        }
    }
}