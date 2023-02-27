using System;

namespace L1.Client
{
    public class SingleSignOnResult : Result
    {
        public SingleSignOnResult(Uri redirectUri, string seq) : base(0, string.Empty, seq)
        {
            RedirectUri = redirectUri;
        }

        public SingleSignOnResult(int errorCode, string errorDescription, string seq) : base(errorCode, errorDescription, seq)
        {

        }

        public Uri RedirectUri { get; }
    }
}