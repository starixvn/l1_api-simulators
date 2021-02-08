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
    public class SabaClubController : Controller
    {
        private readonly IServiceProvider serviceProvider;

        public SabaClubController(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult CreateCustomer(int memId)
        {
            return View(new Customer { ObCustId = memId, Balance = 2000, MinBet = 1, MaxBet = 2000 });
        }

        [HttpPost]
        public IActionResult CreateCustomer(Customer model)
        {
            var customers = serviceProvider.GetRequiredService<List<Customer>>();
            var customer = customers.FirstOrDefault(x => x.ObCustId == model.ObCustId);

            if (customer != null)
            {
                customer.Balance = model.Balance;
                customer.MinBet = model.MinBet;
                customer.MaxBet = model.MaxBet;
            }
            else
            {
                customers.Add(model);
            }

            return View(model);
        }

        [HttpGet]
        public IActionResult UpdateCustomerBalance()
        {
            var customers = serviceProvider.GetRequiredService<List<Customer>>();
            return View(customers);
        }

        [HttpPost]
        public IActionResult UpdateCustomerBalance(IEnumerable<Customer> model)
        {
            var customers = serviceProvider.GetRequiredService<List<Customer>>();
            foreach (var updateCustomer in model)
            {
                var customer = customers.FirstOrDefault(x => x.ObCustId == updateCustomer.ObCustId);
                customer.Balance = updateCustomer.Balance;
                customer.MinBet = updateCustomer.MinBet;
                customer.MaxBet = updateCustomer.MaxBet;
            }

            return View(model);
        }

        [HttpGet]
        public IActionResult UpdateEnterPortalResult()
        {
            return View(serviceProvider.GetRequiredService<EnterPortalResult>());
        }

        [HttpPost]
        public IActionResult UpdateEnterPortalResult(EnterPortalResult model)
        {
            var result = serviceProvider.GetRequiredService<EnterPortalResult>();
            result.ErrorCode = model.ErrorCode;
            result.ErrorDescription = model.ErrorDescription;
            result.DelayTime = model.DelayTime;

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> EnterPortal([FromBody] OWRequest<EnterPortalCall> request)
        {
            var result = serviceProvider.GetRequiredService<EnterPortalResult>();
            var customers = serviceProvider.GetRequiredService<List<Customer>>();
            var loginCustomer = customers.FirstOrDefault(x => x.ObCustId == request.Call.ObCustId);

            if (result.ErrorCode == 0)
            {
                result.MinBet = loginCustomer?.MinBet ?? 0;
                result.MaxBet = loginCustomer?.MaxBet ?? 0;
            }
            else
            {
                result.MinBet = result.MaxBet = 0;
            }

            result.Seq = request.Call?.Seq;

            await Task.Delay(result.DelayTime);

            return Ok(new OWResponse<EnterPortalResult>
            {
                TimeStamp = DateTimeOffset.UtcNow,
                Result = result
            });
        }

        [HttpGet]
        public IActionResult UpdateGetBalanceResult()
        {
            return View(serviceProvider.GetRequiredService<GetBalanceResult>());
        }

        [HttpPost]
        public IActionResult UpdateGetBalanceResult(GetBalanceResult model)
        {
            var result = serviceProvider.GetRequiredService<GetBalanceResult>();
            result.ErrorCode = model.ErrorCode;
            result.ErrorDescription = model.ErrorDescription;
            result.DelayTime = model.DelayTime;

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> GetBalance([FromBody] OWRequest<GetBalanceCall> request)
        {
            var customers = serviceProvider.GetRequiredService<List<Customer>>();
            var customer = customers.FirstOrDefault(x => x.ObCustId == request.Call.ObCustId);

            var result = serviceProvider.GetRequiredService<GetBalanceResult>();
            result.Seq = request.Call?.Seq;

            if (result.ErrorCode == 0 && customer != null)
            {
                result.Balance = customer.Balance;
            }
            else
            {
                result.Balance = 0;
            }

            await Task.Delay(result.DelayTime);

            return Ok(new OWResponse<GetBalanceResult>
            {
                TimeStamp = DateTimeOffset.UtcNow,
                Result = result
            });
        }

        [HttpGet]
        public IActionResult UpdatePlaceBetResult()
        {
            return View(serviceProvider.GetRequiredService<PlaceBetResult>());
        }

        [HttpPost]
        public IActionResult UpdatePlaceBetResult(PlaceBetResult model)
        {
            var result = serviceProvider.GetRequiredService<PlaceBetResult>();
            result.ErrorCode = model.ErrorCode;
            result.ErrorDescription = model.ErrorDescription;
            result.ObTransId = model.ObTransId;
            result.DelayTime = model.DelayTime;

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> PlaceBet([FromBody] OWRequest<PlaceBetCall> request)
        {
            var customers = serviceProvider.GetRequiredService<List<Customer>>();
            var customer = customers.FirstOrDefault(x => x.ObCustId == request.Call.ObCustId);

            var result = serviceProvider.GetRequiredService<PlaceBetResult>();
            result.Seq = request.Call?.Seq;

            if (result.ErrorCode == 0 && customer != null)
            {
                result.ObCustId = request.Call?.ObCustId;
                result.Balance = customer.Balance = customer.Balance - request.Call.Amount;
            }
            else
            {
                result.Balance = 0;
            }

            if (result.ErrorCode == 0 || result.ErrorCode == 3003 || result.ErrorCode == 3009)
            {
                result.MinBet = customer?.MinBet ?? 0;
                result.MaxBet = customer?.MaxBet ?? 0;
            }
            else
            {
                result.MinBet = result.MaxBet = 0;
            }

            await Task.Delay(result.DelayTime);

            return Ok(new OWResponse<PlaceBetResult>
            {
                TimeStamp = DateTimeOffset.UtcNow,
                Result = result
            });
        }

        [HttpGet]
        public IActionResult UpdateEndGameResult()
        {
            return View(serviceProvider.GetRequiredService<EndGameResult>());
        }

        [HttpPost]
        public IActionResult UpdateEndGameResult(EndGameResult model)
        {
            var result = serviceProvider.GetRequiredService<EndGameResult>();
            result.ErrorCode = model.ErrorCode;
            result.ErrorDescription = model.ErrorDescription;
            result.DelayTime = model.DelayTime;

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> EndGame([FromBody] OWRequest<EndGameCall> request)
        {
            var customers = serviceProvider.GetRequiredService<List<Customer>>();
            var customer = customers.Find(x => x.ObCustId == request.Call.ObCustId);
            var result = serviceProvider.GetRequiredService<EndGameResult>();

            result.Seq = request.Call?.Seq;

            if (result.ErrorCode == 0 && customer != null)
            {
                result.ObCustId = request.Call?.ObCustId;
                customer.Balance += request.Call.TotalWin;
            }

            await Task.Delay(result.DelayTime);

            return Ok(new OWResponse<EndGameResult>
            {
                TimeStamp = DateTimeOffset.UtcNow,
                Result = result
            });
        }

        [HttpGet]
        public IActionResult UpdateVoidGameResult()
        {
            return View(serviceProvider.GetRequiredService<VoidGameResult>());
        }

        [HttpPost]
        public IActionResult UpdateVoidGameResult(VoidGameResult model)
        {
            var result = serviceProvider.GetRequiredService<VoidGameResult>();
            result.ErrorCode = model.ErrorCode;
            result.ErrorDescription = model.ErrorDescription;
            result.DelayTime = model.DelayTime;

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> VoidGame([FromBody] OWRequest<VoidGameCall> request)
        {
            var result = serviceProvider.GetRequiredService<VoidGameResult>();
            result.Seq = request.Call?.Seq;
            if (result.ErrorCode == 0)
            {
                result.ObCustId = request.Call?.ObCustId;
            }

            await Task.Delay(result.DelayTime);

            return Ok(new OWResponse<VoidGameResult>
            {
                TimeStamp = DateTimeOffset.UtcNow,
                Result = result
            });
        }

        [HttpGet]
        public IActionResult UpdateCheckMaintenanceResult()
        {
            return View(serviceProvider.GetRequiredService<CheckMaintenanceResult>());
        }

        [HttpPost]
        public IActionResult UpdateCheckMaintenanceResult(CheckMaintenanceResult model)
        {
            var result = serviceProvider.GetRequiredService<CheckMaintenanceResult>();
            result.ErrorCode = model.ErrorCode;
            result.ErrorDescription = model.ErrorDescription;
            result.StartTime = model.StartTime;
            result.EndTime = model.EndTime;
            result.DelayTime = model.DelayTime;

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> CheckMaintenance([FromBody] OWRequest<CheckMaintenanceCall> request)
        {
            var result = serviceProvider.GetRequiredService<CheckMaintenanceResult>();
            result.Seq = request.Call?.Seq;

            await Task.Delay(result.DelayTime);

            return Ok(new OWResponse<CheckMaintenanceResult>
            {
                TimeStamp = DateTimeOffset.UtcNow,
                Result = result
            });
        }

        [HttpGet]
        public IActionResult RetrieveEndGameInfo()
        {
            return View(new RetriveEndGameInfoViewModel());
        }

        [HttpPost]
        public async Task<IActionResult> RetrieveEndGameInfo(RetriveEndGameInfoViewModel viewModel, [FromServices] ISabaClubService sabaClubService)
        {
            viewModel.Result = await sabaClubService.RetrieveEndGameInfoAsync(viewModel.Request);
            return View(viewModel);
        }

        [HttpGet]
        public IActionResult GameTicket()
        {
            return View(new GameTicketRequestViewModel());
        }

        [HttpPost]
        public async Task<IActionResult> GameTicket(GameTicketRequestViewModel model)
        {
            if (ModelState.IsValid)
            {
                var service = serviceProvider.GetRequiredService<IResultPageService>();
                var result = await service.GetGameTicketAccessUrl(new GameTicketRequest
                {
                    GameTypeId = model.GameTypeId,
                    ObCustId = model.ObCustId,
                    GameRoundId = model.GameRoundId,
                    Language = model.Culture
                });

                if (!string.IsNullOrWhiteSpace(result))
                {
                    return Redirect(result);
                }
            }

            return View(model);
        }
    }
}