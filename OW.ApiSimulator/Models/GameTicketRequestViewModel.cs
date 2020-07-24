namespace OW.ApiSimulator.Models
{
    public class GameTicketRequestViewModel
    {
        public long GameRoundId { get; set; }

        public int ObCustId { get; set; }

        public byte GameTypeId { get; set; }

        public string Culture { get; set; }
    }
}