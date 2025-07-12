const User = require('../models/User');

class AuthController {
  async register(req, res) {
    try {
      const { username, password, email, role } = req.body;
      
      const existingUser = await User.findOne({ 
        where: { 
          $or: [{ username }, { email }] 
        } 
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      const user = await User.create({
        username,
        password,
        email,
        role: role || 'CUSTOMER'
      });
      
      res.json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      
      const user = await User.findOne({ where: { username } });
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      res.json({ 
        token: 'fake-jwt-token',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async logout(req, res) {
    res.json({ message: 'Logout successful' });
  }
}

module.exports = new AuthController();