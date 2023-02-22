using MemberLoginApiSimulator.Models;
using Refit;

namespace MemberLoginApiSimulator._Shared
{
    public interface IOWApi
    {
        [Get("/ow/sabaclub/GetMemberInfo/{username}")]
        Task<MemberInfoResult> GetMemberInfo(string username);
    }
}