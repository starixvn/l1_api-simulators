using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using OW.ApiSimulator.Models;

namespace OW.ApiSimulator.Extensions
{
    public static class SimulatorExtensions
    {
        public static void AddOW(this IServiceCollection services)
        {
            var partners = Constants.Partners.Select(x => new Partner(x));
            services.AddSingleton(partners.ToList());
        }
    }
}
