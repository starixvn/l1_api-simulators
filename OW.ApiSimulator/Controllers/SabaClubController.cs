using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using OW.ApiSimulator.Models;
using OW.ApiSimulator.Models.OW;
using OW.ApiSimulator.Services;

namespace OW.ApiSimulator.Controllers
{
    [Route("{partner}/[controller]/[action]")]
    public class SabaClubController : Controller
    {
        private readonly IServiceProvider serviceProvider;

        public SabaClubController(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;
        }

        [HttpGet]
        [Route("/[controller]/[action]")]
        [Route("/[controller]")]
        [Route("/")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("/[controller]/[action]")]
        public IActionResult CreateCustomer(int memId, string partner)
        {
            var selectedPartner = GetPartner(partner);
            var customer = selectedPartner?.Customers.FirstOrDefault(x => x.ObCustId == memId);

            return View(customer ?? new Customer { ObCustId = memId, Balance = 2000, MinBet = 1, MaxBet = 3000 });
        }

        [HttpPost]
        [Route("/[controller]/[action]")]
        public IActionResult CreateCustomer(Customer model)
        {
            var selectedPartner = GetPartner(model.Partner);

            selectedPartner.Customers.RemoveAll(x => x.ObCustId == model.ObCustId);
            selectedPartner.Customers.Add(model);

            return View(model);
        }

        [HttpGet]
        [Route("/[controller]/[action]")]
        public IActionResult UpdateCustomerBalance()
        {
            var partners = serviceProvider.GetRequiredService<List<Partner>>();
            return View(partners.SelectMany(x => x.Customers).ToList());
        }

        [HttpPost]
        [Route("/[controller]/[action]")]
        public IActionResult UpdateCustomerBalance(IEnumerable<Customer> model)
        {
            var partners = serviceProvider.GetRequiredService<List<Partner>>();
            foreach (var updateCustomer in model)
            {
                var partner = partners.FirstOrDefault(x => x.Name == updateCustomer.Partner);
                var customer = partner.Customers.FirstOrDefault(x => x.ObCustId == updateCustomer.ObCustId);
                customer.Balance = updateCustomer.Balance;
                customer.MinBet = updateCustomer.MinBet;
                customer.MaxBet = updateCustomer.MaxBet;
            }

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> EnterPortal([FromBody] EnterPortalCall request, [FromRoute] string partner)
        {
            var selectedPartner = GetPartner(partner);
            var result = selectedPartner.EnterPortalResult;
            var loginCustomer = selectedPartner.Customers.FirstOrDefault(x => x.ObCustId == request.ObCustId);

            if (result.ErrorCode == 0)
            {
                result.MinBet = loginCustomer?.MinBet ?? 0;
                result.MaxBet = loginCustomer?.MaxBet ?? 0;
            }
            else
            {
                result.MinBet = result.MaxBet = 0;
            }

            result.Seq = request.Seq;

            await Task.Delay(result.DelayTime);

            return Ok(new OWResponse<EnterPortalResult>
            {
                TimeStamp = DateTimeOffset.UtcNow,
                Result = result
            });
        }

        [HttpPost]
        public async Task<IActionResult> GetBalance([FromBody] GetBalanceCall request, [FromRoute] string partner)
        {
            var selectedPartner = GetPartner(partner);
            var customer = selectedPartner.Customers.FirstOrDefault(x => x.ObCustId == request.ObCustId);

            var result = new GetBalanceResult();

            var resultTemplate = selectedPartner.GetBalanceResult;
            result.Seq = request.Seq;

            if (resultTemplate.ErrorCode == 0 && customer != null)
            {
                result.Balance = customer.Balance;
            }
            else
            {
                result.Balance = 0;
                result.ErrorDescription = resultTemplate.ErrorDescription;
            }

            var delayTime = customer?.Delay.GetBalance > 0 ? customer.Delay.GetBalance : resultTemplate.DelayTime;
            result.ErrorCode = customer?.ErrorCode.GetBalance > 0 ? customer.ErrorCode.GetBalance : resultTemplate.ErrorCode;

            await Task.Delay(delayTime);

            return Ok(new OWResponse<GetBalanceResult>
            {
                TimeStamp = DateTimeOffset.UtcNow,
                Result = result
            });
        }

        [HttpPost]
        public async Task<IActionResult> PlaceBet([FromBody] PlaceBetCall request, [FromRoute] string partner)
        {
            var selectedPartner = GetPartner(partner);
            var customer = selectedPartner.Customers.FirstOrDefault(x => x.ObCustId == request.ObCustId);

            var result = new PlaceBetResult();
            var resultTemplate = selectedPartner.PlaceBetResult;
            result.Seq = request.Seq;

            var delayTime = customer?.Delay.PlaceBet > 0 ? customer.Delay.PlaceBet : resultTemplate.DelayTime;
            result.ErrorCode = GetPlaceBetErrorCode(resultTemplate, customer, request.Amount);

            if (result.ErrorCode == 0 && customer != null)
            {
                result.ObCustId = request.ObCustId;

                if (request.Amount <= customer.Balance)
                {
                    customer.Balance -= request.Amount;
                    result.Balance = customer.Balance;
                }
            }
            else
            {
                result.Balance = 0;
            }

            if (result.ErrorCode == 0 || result.ErrorCode == 3003 || result.ErrorCode == 3009 || result.ErrorCode == 3002)
            {
                result.MinBet = customer?.MinBet ?? 0;
                result.MaxBet = customer?.MaxBet ?? 0;
            }
            else
            {
                result.MinBet = result.MaxBet = 0;
            }

            await Task.Delay(delayTime);

            return Ok(new OWResponse<PlaceBetResult>
            {
                TimeStamp = DateTimeOffset.UtcNow,
                Result = result
            });
        }

        private static int GetPlaceBetErrorCode(PlaceBetResult result, Customer customer, decimal amount)
        {
            var errorCode = customer?.ErrorCode.PlaceBet > 0 ? customer.ErrorCode.PlaceBet : result.ErrorCode;

            return (customer != null && amount > customer.Balance) ? 3002 : errorCode;
        }

        [HttpPost]
        public async Task<IActionResult> EndGame([FromBody] EndGameCall request, [FromRoute] string partner)
        {
            var selectedPartner = GetPartner(partner);
            var result = new EndGameResult();
            var customer = selectedPartner.Customers.Find(x => x.ObCustId == request.ObCustId);
            var resultTemplate = selectedPartner.EndGameResult;

            var delayTime = customer?.Delay.EndGame > 0 ? customer.Delay.EndGame : resultTemplate.DelayTime;
            result.ErrorCode = customer?.ErrorCode.EndGame > 0 ? customer.ErrorCode.EndGame : resultTemplate.ErrorCode;
            result.Seq = request.Seq;

            if (result.ErrorCode == 0 && customer != null)
            {
                result.ObCustId = request.ObCustId;
                customer.Balance += request.TotalWin;
            }

            await Task.Delay(delayTime);

            return Ok(new OWResponse<EndGameResult>
            {
                TimeStamp = DateTimeOffset.UtcNow,
                Result = result
            });
        }

        [HttpPost]
        public async Task<IActionResult> VoidGame([FromBody] VoidGameCall request, [FromRoute] string partner)
        {
            var selectedPartner = GetPartner(partner);
            var result = selectedPartner.VoidGameResult;
            result.Seq = request.Seq;
            if (result.ErrorCode == 0)
            {
                result.ObCustId = request.ObCustId;
            }

            await Task.Delay(result.DelayTime);

            return Ok(new OWResponse<VoidGameResult>
            {
                TimeStamp = DateTimeOffset.UtcNow,
                Result = result
            });
        }

        [HttpPost]
        public async Task<IActionResult> CheckMaintenance([FromBody] CheckMaintenanceCall request, [FromRoute] string partner)
        {
            var selectedPartner = GetPartner(partner);
            var result = selectedPartner.CheckMaintenanceResult;
            result.Seq = request.Seq;

            await Task.Delay(result.DelayTime);

            return Ok(new OWResponse<CheckMaintenanceResult>
            {
                TimeStamp = DateTimeOffset.UtcNow,
                Result = result
            });
        }

        [HttpGet]
        [Route("/[controller]/[action]")]
        public IActionResult RetrieveEndGameInfo([FromRoute] string partner)
        {
            return View(new RetriveEndGameInfoViewModel());
        }

        [HttpPost]
        [Route("/[controller]/[action]")]
        public async Task<IActionResult> RetrieveEndGameInfo(RetriveEndGameInfoViewModel viewModel, [FromServices] ISabaClubService sabaClubService)
        {
            viewModel.Result = await sabaClubService.RetrieveEndGameInfoAsync(viewModel.Request);
            return View(viewModel);
        }

        [HttpGet]
        [Route("/[controller]/[action]")]
        public IActionResult GameTicket()
        {
            return View(new GameTicketRequestViewModel());
        }

        [HttpPost]
        [Route("/[controller]/[action]")]
        public async Task<IActionResult> GameTicket(GameTicketRequestViewModel model)
        {
            if (ModelState.IsValid)
            {
                var service = serviceProvider.GetRequiredService<IResultPageService>();
                var result = await service.GetGameTicketAccessUrl(model.Request);

                if (!string.IsNullOrWhiteSpace(result))
                {
                    return Redirect(result);
                }
            }

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> GetBetLimit([FromBody] GetBetLimitCall request, [FromRoute] string partner)
        {
            var selectedPartner = GetPartner(partner);
            var customer = selectedPartner.Customers.FirstOrDefault(x => x.ObCustId == request.ObCustId);
            var result = selectedPartner.GetBetLimitResult;
            result.Seq = request.Seq;
            var delayTime = customer?.Delay.GetBetLimit > 0 ? customer.Delay.GetBetLimit : result.DelayTime;
            result.ErrorCode = customer?.ErrorCode.GetBetLimit > 0 ? customer.ErrorCode.GetBetLimit : result.ErrorCode;

            if (result.ErrorCode == 0)
            {
                if (customer != null)
                {
                    result.MinBet = customer.MinBet;
                    result.MaxBet = customer.MaxBet;
                }
                else
                {
                    result.MinBet = result.MaxBet = 0;
                }
            }
            else
            {
                result.MinBet = result.MaxBet = 0;
            }

            await Task.Delay(delayTime);

            return Ok(new OWResponse<GetBetLimitResult>
            {
                TimeStamp = DateTimeOffset.UtcNow,
                Result = result
            });
        }

        [HttpGet]
        [Route("/[controller]/[action]")]
        public IActionResult UpdatePartner(string name)
        {
            var selectedPartner = GetPartner(name);

            return View(selectedPartner);
        }

        [HttpPost]
        [Route("/[controller]/[action]")]
        public IActionResult UpdatePartner(Partner model)
        {
            var selectedPartner = GetPartner(model.Name);
            selectedPartner.EnterPortalResult = model.EnterPortalResult;
            selectedPartner.GetBalanceResult = model.GetBalanceResult;
            selectedPartner.PlaceBetResult = model.PlaceBetResult;
            selectedPartner.EndGameResult = model.EndGameResult;
            selectedPartner.VoidGameResult = model.VoidGameResult;
            selectedPartner.CheckMaintenanceResult = model.CheckMaintenanceResult;
            selectedPartner.GetBetLimitResult = model.GetBetLimitResult;

            return View(selectedPartner);
        }

        private Partner GetPartner(string partnerName)
        {
            return serviceProvider.GetRequiredService<List<Partner>>().FirstOrDefault(x => string.Compare(x.Name, partnerName, true) == 0);
        }
    }
}