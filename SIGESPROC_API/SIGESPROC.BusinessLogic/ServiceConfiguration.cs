using Microsoft.Extensions.DependencyInjection;
using SIGESPROC.BusinessLogic.Services;
using SIGESPROC.DataAccess.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



namespace SIGESPROC.BusinessLogic
{
     public static class ServiceConfiguration
     {
        public static void DataAcces(this IServiceCollection service)
        {
            service.AddScoped<userRepository>();
            service.AddScoped<TokenRepository>();
            service.AddScoped<ProductRepository>();
            service.AddScoped<ClienteRepository>();
            service.AddScoped<FacturaRepository>();




        }
        public static void BusinessLogic(this IServiceCollection service)
        {

            service.AddScoped<UserService>();
            service.AddScoped<ProductService>();
            service.AddScoped<ClienteService>();
            service.AddScoped<FacturaService>();

        }
    }
  
  
}

   

