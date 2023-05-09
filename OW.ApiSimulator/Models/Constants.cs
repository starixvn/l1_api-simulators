using System.Collections.Generic;

namespace OW.ApiSimulator.Models
{
    public static class Constants
    {
        public static readonly string[] Operators = { "ow", "sbo", "ow_vg", "pff", "ONEworksSeal888" };
        public static readonly Dictionary<string, string> ForcedToUseOWOperatorsMapper = new Dictionary<string, string>{{ "ow_vg", "ow"}, { "ONEworksSeal888", "ow" } };
    }    
}