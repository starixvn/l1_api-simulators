using System.Collections.Generic;

namespace OW.ApiSimulator.Configuration
{
    public class SabaClubSettings
    {
        public string BaseUrl { get; set; }

        public Dictionary<string, string> EnvironmentBaseUrls { get; set; }
    }
}