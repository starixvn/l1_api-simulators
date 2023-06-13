using System;

namespace OW.ApiSimulator.Models.OW
{
    public class LoginCall
    {
        public DateTimeOffset TimeStamp { get; set; } = DateTimeOffset.UtcNow;
        public string Seq { get; set; }
        public CustInfo CustInfo { get; set; }
    }


    public class CustInfo
    {
        public int ObCustId { get; set; }
        public string ObCustName { get; set; }
        public string Currency { get; set; }
        public string Ip { get; set; }
        public string BrowserUserAgent { get; set; }
        public string BetFrom { get; set; } 
        public string Platform { get; set; }
        public string Language { get; set; }
        public string SiteId { get; set; }
        public string Site { get; set; }
    }
}