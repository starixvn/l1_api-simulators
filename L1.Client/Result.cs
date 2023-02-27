using System;

namespace L1.Client
{
    public abstract class Result
    {
        public Result(int errorCode, string errorDescription, string seq)
        {
            ErrorCode = errorCode;
            ErrorDescription = errorDescription;
            Seq = seq;
        }

        public int ErrorCode { get;  }

        public string ErrorDescription { get; }

        public string Seq { get; }

        public bool IsSuccessful() => ErrorCode == 0;
    }
}