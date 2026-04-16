# KrushiSahayak Backend API

A complete Node.js/Express/MongoDB backend for the KrushiSahayak equipment rental platform.

## Features

- JWT-based authentication
- User registration and login
- Equipment management (CRUD operations)
- Rental booking system
- User profile management
- Role-based access control (user, owner, admin)
- CORS enabled for frontend integration

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- dotenv (environment variables)

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current logged-in user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

### Equipment (`/api/equipment`)

- `GET /api/equipment` - Get all equipment (with filters)
- `GET /api/equipment/:id` - Get single equipment by ID
- `POST /api/equipment` - Create new equipment (owner/admin only)
- `PUT /api/equipment/:id` - Update equipment (owner/admin only)
- `DELETE /api/equipment/:id` - Delete equipment (owner/admin only)
- `POST /api/equipment/:id/reviews` - Add review to equipment

### Rentals (`/api/rentals`)

- `GET /api/rentals` - Get all rentals (filtered by user)
- `GET /api/rentals/:id` - Get single rental by ID
- `POST /api/rentals` - Create new rental
- `PUT /api/rentals/:id/status` - Update rental status
- `DELETE /api/rentals/:id` - Cancel rental

### Users (`/api/users`)

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

## Installation

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/krushisahayak
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

## Running the Server

### Development mode (with nodemon):

```bash
npm run dev
```

### Production mode:

```bash
npm start
```

The server will run on `http://localhost:5000`

## Database Setup

### Option 1: Local MongoDB

1. Install MongoDB locally or use MongoDB Community Server
2. Make sure MongoDB is running on the default port (27017)
3. The connection string is already configured in `.env`

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/krushisahayak
```

## Testing the API

You can test the API using tools like Postman, Insomnia, or cURL.

### Example: Register a new user

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "555-123-4567",
    "location": "Iowa, USA"
  }'
```

### Example: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Example: Get all equipment (public)

```bash
curl http://localhost:5000/api/equipment
```

### Example: Create equipment (requires JWT token)

```bash
curl -X POST http://localhost:5000/api/equipment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "name": "John Deere Tractor",
    "category": "Tractors",
    "description": "Heavy duty tractor for farming",
    "pricePerDay": 150,
    "location": "Iowa, USA",
    "images": ["https://example.com/image.jpg"]
  }'
```

## Frontend Integration

The frontend is configured to connect to the backend at:

- Development: `http://localhost:5000/api`
- Production: Set `VITE_API_URL` in frontend `.env`

### API Service

The frontend includes a comprehensive API service in `src/app/services/api.ts` that handles:

- JWT token management (localStorage)
- API requests with proper headers
- Error handling
- Type-safe API methods

### Using the API in React Components

```typescript
import { authAPI, equipmentAPI } from "../services/api";

// Login
const handleLogin = async () => {
  try {
    const response = await authAPI.login({ email, password });
    if (response.success) {
      // Token is automatically stored
      navigate("/explore");
    }
  } catch (error) {
    console.error(error);
  }
};

// Get equipment
const loadEquipment = async () => {
  const response = await equipmentAPI.getAll({ category: "Tractors" });
  setEquipment(response.data);
};
```

## Deployment

### Deploy to Render

1. Push your code to GitHub
2. Go to [Render](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Configure build settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables in Render dashboard
7. Deploy!

### Deploy to Railway

1. Push your code to GitHub
2. Go to [Railway](https://railway.app)
3. Create a new project
4. Add a MongoDB service
5. Add a Node.js service
6. Configure environment variables
7. Deploy!

### Deploy to VPS (DigitalOcean, AWS, etc.)

1. Install Node.js and MongoDB on your server
2. Clone your repository
3. Install dependencies: `npm install`
4. Create `.env` file with production values
5. Use PM2 to keep the server running:

```bash
npm install -g pm2
pm2 start server.js --name krushisahayak-backend
pm2 save
pm2 startup
```

## Security Notes

- Change `JWT_SECRET` in production
- Use strong passwords
- Enable HTTPS in production
- Implement rate limiting for API endpoints
- Add input validation and sanitization
- Use MongoDB Atlas for production database
- Regularly update dependencies

## Troubleshooting

### MongoDB Connection Error

- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- Verify MongoDB credentials

### CORS Error

- Check `FRONTEND_URL` in `.env` matches your frontend URL
- Ensure CORS is properly configured in `server.js`

### JWT Token Issues

- Make sure `JWT_SECRET` is set in `.env`
- Check token expiration time
- Verify token is being sent in Authorization header

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── models/
│   ├── User.js             # User model
│   ├── Equipment.js        # Equipment model
│   └── Rental.js           # Rental model
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── equipment.js       # Equipment routes
│   ├── rentals.js          # Rental routes
│   └── users.js            # User management routes
├── .env.example            # Environment variables template
├── package.json            # Dependencies
└── server.js               # Main server file
```

## License

MIT
