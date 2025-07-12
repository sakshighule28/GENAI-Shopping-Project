using Microsoft.AspNetCore.Mvc;
using ClothingStore.Services;
using ClothingStore.Models;

namespace ClothingStore.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryService _categoryService;
        
        public CategoryController(CategoryService categoryService)
        {
            _categoryService = categoryService;
        }
        
        [HttpOptions]
        public ActionResult Options()
        {
            return Ok();
        }
        
        [HttpGet]
        public async Task<ActionResult<List<Category>>> GetAllCategories()
        {
            try
            {
                var categories = await _categoryService.GetAllCategoriesAsync();
                return Ok(categories);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { error = e.Message });
            }
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategoryById(long id)
        {
            try
            {
                var category = await _categoryService.GetCategoryByIdAsync(id);
                return category != null ? Ok(category) : NotFound();
            }
            catch (Exception e)
            {
                return StatusCode(500, new { error = e.Message });
            }
        }
    }
}