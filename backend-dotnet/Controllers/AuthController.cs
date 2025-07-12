using Microsoft.AspNetCore.Mvc;
using ClothingStore.Services;
using ClothingStore.Models;

namespace ClothingStore.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly UserService _userService;
        
        public AuthController(JwtService jwtService, UserService userService)
        {
            _jwtService = jwtService;
            _userService = userService;
        }
        
        [HttpOptions]
        public ActionResult Options()
        {
            return Ok();
        }
        
        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var user = await _userService.RegisterUserAsync(
                    request.Username, 
                    request.Password, 
                    request.Email, 
                    request.Role ?? "CUSTOMER"
                );
                
                return Ok(new
                {
                    message = "User registered successfully",
                    userId = user.Id
                });
            }
            catch (Exception e)
            {
                return BadRequest(new { error = e.Message });
            }
        }
        
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var user = await _userService.FindByUsernameAsync(request.Username);
                
                if (user != null && _userService.ValidatePassword(request.Password, user.Password))
                {
                    var token = _jwtService.GenerateToken(user.Username, user.Role);
                    
                    return Ok(new
                    {
                        token = token,
                        user = new
                        {
                            id = user.Id,
                            username = user.Username,
                            email = user.Email,
                            role = user.Role
                        }
                    });
                }
                
                return BadRequest(new { error = "Invalid credentials" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { error = e.Message });
            }
        }
    }
    
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
    
    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Role { get; set; }
    }
}