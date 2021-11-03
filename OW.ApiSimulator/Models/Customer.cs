namespace OW.ApiSimulator.Models
{
    public class Customer
    {
        public int ObCustId { get; set; }

        public decimal Balance { get; set; }

        public decimal MinBet { get; set; }

        public decimal MaxBet { get; set; }

        public string Partner { get; set; }

        public DelayTime Delay { get; set; } = new DelayTime();

        public CustomerErrorCode ErrorCode { get; set; } = new CustomerErrorCode();
    }

    public class DelayTime
    {
        public int GetBalance { get; set; } = 0;

        public int PlaceBet { get; set; } = 0;

        public int EndGame { get; set; } = 0;

        public int GetBetLimit { get; set; } = 0;
    }

    public class CustomerErrorCode 
    {
        public int GetBalance { get; set; } = 0;

        public int PlaceBet { get; set; } = 0;

        public int EndGame { get; set; } = 0;

        public int GetBetLimit { get; set; } = 0;

        public int EnterPortal { get; set; } = 0;
    }

}
