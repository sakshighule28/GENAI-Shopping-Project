using Microsoft.EntityFrameworkCore;
using ClothingStore.Data;
using ClothingStore.Models;

namespace ClothingStore.Services
{
    public class UserService
    {
        private readonly ClothingStoreContext _context;
        
        public UserService(ClothingStoreContext context)
        {
            _context = context;
        }
        
        public async Task<User> RegisterUserAsync(string username, string password, string email, string role)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username || u.Email == email);
                
            if (existingUser != null)
            {
                throw new Exception("Username already exists");
            }
            
            var user = new User
            {
                Username = username,
                Password = BCrypt.Net.BCrypt.HashPassword(password),
                Email = email,
                Role = role ?? "CUSTOMER"
            };
            
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }
        
        public async Task<User?> FindByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }
        
        public bool ValidatePassword(string rawPassword, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(rawPassword, hashedPassword);
        }
    }
}