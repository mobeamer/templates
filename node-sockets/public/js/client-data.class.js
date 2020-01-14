function Data(options)
{
    this.msgCount = 0;

    this.init = function()
    {
      debug("data.init()");
      this.msgCount=1;
      debug('data.init(): connecting to socket');
    }


}