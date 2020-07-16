using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OW.ApiSimulator.Configuration
{
    public class ResultPageConfiguration
    {
        public string BaseUrl { get; set; }

        public string GameTicketEndPoint { get; set; }

        public string GameTicketQueryKeyEndPoint { get; set; }

        public string Key { get; set; }
    }
}
