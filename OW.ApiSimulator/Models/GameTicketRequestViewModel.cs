namespace OW.ApiSimulator.Models
{
    public class GameTicketRequestViewModel
    {
        public long RoundId { get; set; }

        public int MemberId { get; set; }

        public byte GameTypeId { get; set; }
    }
}