using System;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using OW.ApiSimulator.Models.Saba;

namespace OW.ApiSimulator.Services
{
    public interface ISabaClubService
    {
        Task<SabaResponse<EndGameInfoResult>> RetrieveEndGameInfoAsync(EndGameInfoRequest request);
    }

    public class SabaClubService : ISabaClubService
    {
        private readonly HttpClient httpClient;
        private const string defaultMediaType = "application/json";

        public SabaClubService(HttpClient httpClient)
        {
            this.httpClient = httpClient;
        }

        public async Task<SabaResponse<EndGameInfoResult>> RetrieveEndGameInfoAsync(EndGameInfoRequest request)
        {
            var requestBody = JsonConvert.SerializeObject(request);
            var content = new StringContent(requestBody, Encoding.UTF8, defaultMediaType);

            httpClient.DefaultRequestHeaders.Add("Access-Key", CreateAccessKey(request.Auth.OperatorSecret, requestBody));
            var response = await httpClient.PostAsync("member/RetrieveEndGameInfo", content);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                return JsonConvert.DeserializeObject<SabaResponse<EndGameInfoResult>>(responseContent);
            }

            return new SabaResponse<EndGameInfoResult>
            {
                TimeStamp = DateTime.UtcNow,
                Result = new EndGameInfoResult
                {
                    ErrorDescription = $"{response.StatusCode}-{response.ReasonPhrase}-{responseContent}"
                }
            };
        }

        private string CreateAccessKey(string secretKey, string data)
        {

            var hmac = new HMACSHA256(Encoding.ASCII.GetBytes(secretKey));
            var hashResult = hmac.ComputeHash(Encoding.ASCII.GetBytes(data));

            return Convert.ToBase64String(hashResult);
        }
    }
}