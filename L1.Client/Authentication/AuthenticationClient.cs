using System;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace L1.Client
{
    public interface IAuthenticationClient
    {
        Task<SingleSignOnResponse> SingleSignOnAsync(SingleSignOnParams signOnParams, Action<string> errorHandler = null);
    }

    public class AuthenticationClient : IAuthenticationClient
    {
        private readonly HttpClient client;

        private const string singInEndpoint = "signin/index";

        public AuthenticationClient(Uri apiUri)
        {
            client = HttpClientManager.GetApiClient(apiUri);
        }

        public async Task<SingleSignOnResponse> SingleSignOnAsync(SingleSignOnParams signOnParams, Action<string> errorHandler = null)
        {
            var jsonContent = JsonConvert.SerializeObject(signOnParams);
            var paramContent = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            client.DefaultRequestHeaders.Remove("Access-Key");
            client.DefaultRequestHeaders.Add("Access-Key", HashHMACHex(signOnParams.Auth.OperatorSecret, jsonContent));

            var response = await client.PostAsync(singInEndpoint, paramContent);

            if (!response.IsSuccessStatusCode)
            {
                errorHandler?.Invoke($"{response.StatusCode}-{response.ReasonPhrase}-{await response.Content.ReadAsStringAsync()}");
                var error = Error.CreateErrorFromResponseStatusCode(response.StatusCode);
                return new SingleSignOnResponse(new SingleSignOnResult(error.Code, error.Message, signOnParams.Seq));
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var signInResponse = JsonConvert.DeserializeObject<SignInResponse>(responseContent);

            return new SingleSignOnResponse(new SingleSignOnResult(new Uri(signInResponse.RedirectUrl), signOnParams.Seq));
        }

        private string HashHMACHex(string keyHex, string messageHex)
        {
            HMACSHA256 hashObject = new HMACSHA256(Encoding.UTF8.GetBytes(keyHex));

            var signature = hashObject.ComputeHash(Encoding.UTF8.GetBytes(messageHex));

            return Convert.ToBase64String(signature);
        }
    }
}