using MemberLoginApiSimulator._Shared;
using Refit;

namespace MemberLoginApiSimulator.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddRestServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton(RestService.For<IOWApi>(configuration["OWApiSimulatorUrl"]));
        }
    }
}