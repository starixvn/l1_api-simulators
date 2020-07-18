namespace OW.ApiSimulator.Models
{
    public class GameTicketRequest
    {
        public long RoundId { get; set; }

        public int MemberId { get; set; }

        public byte GameTypeId { get; set; }

        public string Key { get; set; }

        public string Language { get; set; }
    }
}