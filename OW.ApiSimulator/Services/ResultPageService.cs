using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using OW.ApiSimulator.Configuration;
using OW.ApiSimulator.Models;
using OW.ApiSimulator.Models.Saba;

namespace OW.ApiSimulator.Services
{
    public interface IResultPageService
    {
        Task<string> GetGameTicketAccessUrl(GameTicketRequest request);
    }

    public class ResultPageService : IResultPageService
    {
        private readonly HttpClient httpClient;
        private const string defaultMediaType = "application/json";
        private readonly ResultPageConfiguration configuration;

        public ResultPageService(HttpClient httpClient, IOptionsSnapshot<ResultPageConfiguration> optionsSnapshot)
        {
            this.httpClient = httpClient;
            configuration = optionsSnapshot.Value;
        }

        public async Task<string> GetGameTicketAccessUrl(GameTicketRequest request)
        {
            request.Auth.ClientId = configuration.Name;
            request.Auth.ClientKey = configuration.Key;

            var content = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, defaultMediaType);
            var response = await httpClient.PostAsync(configuration.GameTicketQueryKeyEndPoint, content);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var responseObj = JsonConvert.DeserializeObject<GetAccessUrlResult>(responseContent);

                return responseObj.RedirectUrl; ;
            }

            return string.Empty;
        }
    }
}