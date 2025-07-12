using Microsoft.EntityFrameworkCore;
using ClothingStore.Data;
using ClothingStore.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Add Entity Framework
builder.Services.AddDbContext<ClothingStoreContext>(options =>
    options.UseMySql(
        "Server=localhost;Database=clothing_store;User=root;Password=root;",
        new MySqlServerVersion(new Version(8, 0, 21))
    )
);

// Add all services
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<WishlistService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<JwtService>();

var app = builder.Build();

// CORS
app.Use(async (context, next) =>
{
    context.Response.Headers["Access-Control-Allow-Origin"] = "*";
    context.Response.Headers["Access-Control-Allow-Methods"] = "*";
    context.Response.Headers["Access-Control-Allow-Headers"] = "*";
    
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.StatusCode = 200;
        return;
    }
    
    await next();
});

app.MapControllers();

Console.WriteLine("✅ .NET Backend running on http://localhost:5000");

app.Run();