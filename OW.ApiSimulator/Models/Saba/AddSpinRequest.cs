using System;

namespace OW.ApiSimulator.Models.Saba
{
    public class AddSpinRequest
    {
        public DateTimeOffset TimeStamp { get; set; } = DateTimeOffset.UtcNow;
    
        public int ObCustId { get; set; }

        public byte Spins { get; set; }

        public string Seq { get; set; } = Guid.NewGuid().ToString();

        public Auth Auth { get; set; } = new Auth();
    }
}
