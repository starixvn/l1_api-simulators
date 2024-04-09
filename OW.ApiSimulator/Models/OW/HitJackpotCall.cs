namespace OW.ApiSimulator.Models.OW
{
    public class HitJackpotCall : OWCall
    {
        public int GameRoundId { get; set; }

        public int GameTypeId { get; set; }

        public decimal WinningAmount { get; set; }
    }
}