using System;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using OW.ApiSimulator.Configuration;
using OW.ApiSimulator.Models.Saba;

namespace OW.ApiSimulator.Services
{
    public interface ISabaClubService
    {
        Task<SabaResponse<EndGameInfoResult>> RetrieveEndGameInfoAsync(EndGameInfoRequest request, string environment);
    }

    public class SabaClubService : ISabaClubService
    {
        private readonly HttpClient httpClient;
        private const string defaultMediaType = "application/json";
        private readonly SabaClubSettings settings;

        public SabaClubService(HttpClient httpClient, IOptionsSnapshot<SabaClubSettings> optionsSnapshot)
        {
            this.httpClient = httpClient;
            settings = optionsSnapshot.Value;
        }

        public async Task<SabaResponse<EndGameInfoResult>> RetrieveEndGameInfoAsync(EndGameInfoRequest request, string environment)
        {
            httpClient.BaseAddress = new Uri(settings.EnvironmentBaseUrls[environment]);

            var requestBody = JsonConvert.SerializeObject(request);
            var content = new StringContent(requestBody, Encoding.UTF8, defaultMediaType);

            httpClient.DefaultRequestHeaders.Add("Access-Key", CreateAccessKey(request.Auth.OperatorSecret, requestBody));
            var response = await httpClient.PostAsync("player/RetrieveEndRoundInfo", content);
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