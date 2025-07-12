using Microsoft.AspNetCore.Mvc;

namespace ClothingStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public ActionResult Get()
        {
            Response.Headers["Access-Control-Allow-Origin"] = "*";
            Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
            Response.Headers["Access-Control-Allow-Headers"] = "*";
            return Ok(new { message = "CORS working" });
        }
        
        [HttpOptions]
        public ActionResult Options()
        {
            Response.Headers["Access-Control-Allow-Origin"] = "*";
            Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
            Response.Headers["Access-Control-Allow-Headers"] = "*";
            return Ok();
        }
    }
}