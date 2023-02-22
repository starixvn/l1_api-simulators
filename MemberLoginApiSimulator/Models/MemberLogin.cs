namespace MemberLoginApiSimulator.Models
{
    public class MemberLogin
    {
        public string VendorID { get; set; }

        public string SiteID { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }

        public string PasswordEncodeKey { get; set; }

        public string Seq { get; set; }

        public string Platform { get; set; }
    }
}