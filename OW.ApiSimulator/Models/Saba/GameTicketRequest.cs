namespace OW.ApiSimulator.Models
{
    public class GameTicketRequest
    {
        public long GameRoundId { get; set; }

        public int PlayerId { get; set; }

        public byte GameTypeId { get; set; }

        public Auth Auth { get; set; } = new Auth();

        public string Language { get; set; }

        public bool FreeBet { get; set; }
    }

    public class Auth
    {
        public string OperatorId { get; set; }

        public string OperatorSecret { get; set; }
    }
}