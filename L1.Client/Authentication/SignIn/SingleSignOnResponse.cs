using System;

namespace L1.Client
{
    public class SingleSignOnResponse
    {
        public SingleSignOnResponse(SingleSignOnResult result)
        {
            Result = result;
        }

        public DateTimeOffset TimeStamp { get; } = DateTimeOffset.UtcNow;

        public SingleSignOnResult Result { get; }
    }
}