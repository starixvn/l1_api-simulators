namespace MemberLoginApiSimulator.Models
{
    public class MemberInfoResult
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Currency { get; set; }
        public string SiteName { get; set; }
        public int ErrorCode { get; set; }
        public string ErrorDescription { get; set; }
    }
}