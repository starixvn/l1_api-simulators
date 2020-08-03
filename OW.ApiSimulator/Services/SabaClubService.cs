using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using OW.ApiSimulator.Models.Saba;

namespace OW.ApiSimulator.Services
{
    public interface ISabaClubService
    {
        Task<SabaResponse<EndGameInfoResult>> RetrieveEndGameInfoAsync(EndGameInfoRequest request);

        Task<SabaResponse<AddSpinResult>> AddSpinAsync(AddSpinRequest request);
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
            var content = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, defaultMediaType);
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

        public async Task<SabaResponse<AddSpinResult>> AddSpinAsync(AddSpinRequest request)
        {
            var content = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, defaultMediaType);
            var response = await httpClient.PostAsync("member/AddSpins", content);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                return JsonConvert.DeserializeObject<SabaResponse<AddSpinResult>>(responseContent);
            }

            return new SabaResponse<AddSpinResult>
            {
                TimeStamp = DateTime.UtcNow,
                Result = new AddSpinResult
                {
                    ErrorDescription = $"{response.StatusCode}-{response.ReasonPhrase}-{responseContent}"
                }
            };
        }
    }
}