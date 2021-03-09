using System;
using System.Collections.Generic;
using Microsoft.Extensions.DependencyInjection;
using OW.ApiSimulator.Models;
using OW.ApiSimulator.Models.OW;

namespace OW.ApiSimulator.Extensions
{
    public static class SimulatorExtensions
    {
        public static void AddOW(this IServiceCollection services)
        {
            services.AddSingleton(new EnterPortalResult());
            services.AddSingleton(new GetBalanceResult());
            services.AddSingleton(new PlaceBetResult());
            services.AddSingleton(new EndGameResult());
            services.AddSingleton(new VoidGameResult());
            services.AddSingleton(new CheckMaintenanceResult { StartTime = DateTimeOffset.UtcNow, EndTime = DateTimeOffset.UtcNow.AddHours(1) });
            services.AddSingleton(new List<Customer>());
            services.AddSingleton(new HitJackpotResult());
            services.AddSingleton(new GetBetLimitResult());
        }
    }
}