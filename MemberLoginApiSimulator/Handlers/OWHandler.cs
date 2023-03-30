using MemberLoginApiSimulator._Shared;
using MemberLoginApiSimulator.Models;

namespace MemberLoginApiSimulator.Handlers
{
    public interface IOWHandler
    {
        Task<MemberLoginResult> HandleMemberLogin(MemberLogin model);
    }

    public class OWHandler : IOWHandler
    {
        private readonly IOWApi api;

        public OWHandler(IOWApi api)
        {
            this.api = api;
        }

        public async Task<MemberLoginResult> HandleMemberLogin(MemberLogin model)
        {
            var memberInfoResult = await api.GetMemberInfo(model.UserName);

            var memberLoginResult = new MemberLoginResult
            {
                ErrorCode = memberInfoResult.ErrorCode,
                ErrorMsg = memberInfoResult.ErrorDescription,
            };

            if (memberInfoResult.ErrorCode == 0)
            {
                memberLoginResult.PublicUserInfo = new PublicUserInfo
                {
                    UserID = memberInfoResult.UserId,
                    UserName = memberInfoResult.Username,
                    SiteID = int.Parse(model.SiteID),
                    SiteName = memberInfoResult.SiteName,
                    UserInfo = new UserInfo
                    {
                        Currency = memberInfoResult.Currency
                    }
                };
            }

            return memberLoginResult;
        }
    }
}