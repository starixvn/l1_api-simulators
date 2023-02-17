using Microsoft.AspNetCore.Mvc;
using OW.DirectLoginSimulator.Models;

namespace OW.DirectLoginSimulator.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        [HttpPost]
        public IActionResult Login([FromBody] VenderLogin model)
        {
            return Ok();
        }
    }
}