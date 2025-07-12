using Microsoft.AspNetCore.Mvc;
using ClothingStore.Data;
using ClothingStore.Models;
using Microsoft.EntityFrameworkCore;

namespace ClothingStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationController : ControllerBase
    {
        private readonly ClothingStoreContext _context;

        public LocationController(ClothingStoreContext context)
        {
            _context = context;
        }

        [HttpGet("states")]
        public async Task<ActionResult<List<State>>> GetStates()
        {
            try
            {
                var states = await _context.States.ToListAsync();
                return Ok(states);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("cities/{stateId}")]
        public async Task<ActionResult<List<City>>> GetCitiesByState(long stateId)
        {
            try
            {
                var cities = await _context.Cities
                    .Where(c => c.StateId == stateId)
                    .ToListAsync();
                return Ok(cities);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}