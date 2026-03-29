# Restaurant Booking System - MERN Stack

A full-stack restaurant booking application built with MongoDB, Express.js, React, and Node.js. This project demonstrates core MERN stack concepts including JWT authentication, Redux state management, RESTful API design, and responsive UI with Material-UI.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Restaurant Browsing**: Search and filter restaurants by city, cuisine, and name

- **Table Booking**: Make reservations with date, time, and party size
- **Booking Management**: View booking history and cancel reservations
- **Responsive Design**: Mobile-friendly interface using Material-UI
- **Real-time Validation**: Form validation and error handling

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Project
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your MongoDB connection string
# MONGODB_URI=mongodb://localhost:27017/restaurant-booking
# JWT_SECRET=your_secret_key_here

# Seed the database with sample restaurants
npm run seed

# Start the backend server
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend application will run on `http://localhost:3000`

## 📁 Project Structure

```
Project/
├── server/                 # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth & error handling
│   │   └── utils/         # Seed data & utilities
│   ├── .env              # Environment variables
│   ├── server.js         # Entry point
│   └── package.json
│
└── client/                # Frontend (React)
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── redux/        # State management
    │   │   ├── slices/  # Redux slices
    │   │   └── store.js
    │   ├── services/     # API calls
    │   ├── App.jsx       # Main app component
    │   └── index.js      # Entry point
    └── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Restaurants
- `GET /api/restaurants` - Get all restaurants (with filters)
- `GET /api/restaurants/:id` - Get single restaurant
- `GET /api/restaurants/cities/all` - Get all cities
- `GET /api/restaurants/cuisines/all` - Get all cuisines

### Bookings (Protected)
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get single booking
- `PUT /api/bookings/:id/cancel` - Cancel booking

## 🎯 Usage Flow

1. **Register/Login**: Create an account or login with existing credentials
2. **Browse Restaurants**: View all restaurants or filter by city/cuisine
3. **View Details**: Click on a restaurant to see full details and operating hours
4. **Make Booking**: Fill out the booking form with date, time, and party size
5. **Manage Bookings**: View all your bookings in the dashboard
6. **Cancel Booking**: Cancel confirmed bookings if needed

## 🧪 Sample Data

The application comes with 6 pre-seeded restaurants:
- Barbeque Nation (Mumbai)
- The Spice Route (Delhi)
- Coastal Kitchen (Mumbai)
- Punjab Grill (Bangalore)
- Italiano Bistro (Bangalore)
- The Royal Dine (Delhi)

## 🔐 Environment Variables

### Server (.env)
```
MONGODB_URI=mongodb://localhost:27017/restaurant-booking
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- Error handling middleware

## 🎨 Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **Redux Toolkit** - State management
- **Material-UI** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client

## 📝 Key Learning Concepts Demonstrated

1. **RESTful API Design**: Clean, organized API endpoints
2. **JWT Authentication**: Secure user authentication flow
3. **Redux State Management**: Centralized state with async thunks
4. **MongoDB Schemas**: Well-structured data models with validation
5. **React Hooks**: Modern functional components
6. **Protected Routes**: Client-side route protection
7. **Error Handling**: Comprehensive error handling on both frontend and backend
8. **Responsive Design**: Mobile-first approach with Material-UI

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

### Port Already in Use
- Backend: Change `PORT` in server `.env`
- Frontend: React will prompt to use different port

### Dependencies Not Installing
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Built as a demonstration of MERN stack fundamentals for academic evaluation.
