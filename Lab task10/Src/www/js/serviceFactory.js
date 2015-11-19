function serviceFactory($http,$state,$log)
{
    serviceFactory.prototype.serviceClass=appUserServices($http,$state,$log);
    serviceFactory.prototype.createService=function(choice)
    {
        switch(choice)
        {
            case "user":
                this.serviceClass=appUserServices
                break;
            case "userTask":
                this.serviceClass=userTaskServices;
                break;
        }
          return new this.serviceClass($http,$state,$log);
    }
  
};

function getServiceFactory($http,$state,$log)
{
    var serviceFactoryHandle;
    if(serviceFactoryHandle!=null)
        return this.serviceFactoryHandle;
    else 
    {
        serviceFactoryHandle = new serviceFactory($http,$state,$log);
        return serviceFactoryHandle;
    }
}