namespace OW.ApiSimulator.Models
{
    public class GameTicketRequest
    {
        public long RoundId { get; set; }

        public int MemberId { get; set; }

        public byte GameTypeId { get; set; }

        public Auth Auth { get; set; } = new Auth();

        public string Language { get; set; }
    }

    public class Auth
    {
        public string ClientId { get; set; }

        public string ClientKey { get; set; }
    }
}