# Node.js Backend

## Requirements to run in VS Code

### Prerequisites
1. Install Node.js (v18 or higher)
2. Install npm
3. MySQL Server (same as Java backend)

### Setup
1. Open terminal in VS Code
2. Navigate to backend-nodejs folder
3. Run: `npm install`
4. Update .env file with database credentials
5. Run: `npm start` or `npm run dev`

### API Endpoints
- Base URL: http://localhost:8080
- Same endpoints as Java backend
- Uses same MySQL database (clothing_store)

### Development
- Use `npm run dev` for development with nodemon
- Database tables will be created automatically via Sequelize