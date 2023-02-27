namespace L1.Client
{
    public class SingleSignOnParams
    {
        private const string DefaultLanguageCode = "en-US";
        private const string DefaultOperatorToken = "ONEworks1Token";

        public SingleSignOnParams(
            string operatorId,
            string operatorSecret,
            string siteId,
            int playerId,
            string playerName,
            string currency,
            string iP,
            string browserUserAgent,
            string seq,
            byte? gameTypeId,
            string siteName,
            bool isCash,
            bool isMobi)
            : this(
                  operatorId,
                  operatorSecret,
                  siteId,
                  playerId,
                  playerName,
                  DefaultLanguageCode,
                  currency,
                  iP,
                  browserUserAgent,
                  seq,
                  gameTypeId,
                  siteName,
                  isCash,
                  isMobi)
        {
        }

        public SingleSignOnParams(
            string operatorId,
            string operatorSecret,
            string siteId,
            int playerId,
            string playerName,
            string language,
            string currency,
            string iP,
            string browserUserAgent,
            string seq,
            byte? gameTypeId,
            string siteName,
            bool isCash,
            bool isMobi)
        {
            Auth = new Auth
            {
                OperatorId = operatorId,
                OperatorSecret = operatorSecret
            };

            SiteId = siteId;
            Language = language;
            Currency = currency;
            IP = iP;
            BrowserUserAgent = browserUserAgent;
            Seq = seq;
            GameTypeId = gameTypeId;
            SiteName = siteName;
            IsCash = isCash;
            PlayerId = playerId;
            PlayerName = playerName;
        }

        public string Seq { get; set; }

        public string SiteId { get; set; }

        public string Domain { get; set; }

        public string BrowserUserAgent { get; set; }

        public string Currency { get; set; }

        public string Language { get; set; }

        public string IP { get; set; }

        public int PlayerId { get; set; }

        public string PlayerName { get; set; }

        public byte? GameTypeId { get; set; }

        public byte AppType { get; set; } = AppTypes.SabaClub;

        public string SiteName { get; set; }

        public Auth Auth { get; set; }

        public string OperatorToken { get; set; } = DefaultOperatorToken;

        public bool DisableJackpotGames { get; set; }

        public bool IsCash { get; set; }
    }

    public class Auth
    {
        public string OperatorId { get; set; }

        public string OperatorSecret { get; set; }
    }
}