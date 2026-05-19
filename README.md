# Restaurant Booking System — AI-Assisted Reservation Platform

A full-stack restaurant reservation platform built using the MERN stack with an AI-powered assistant for handling restaurant discovery, booking support, and real-time availability queries.

This project was built to explore how operational workflows in restaurants can be simplified using centralized booking systems and AI-assisted customer interaction.

---

# The Problem

Many restaurants still manage reservations manually through:
- phone calls
- WhatsApp messages
- spreadsheets
- disconnected systems

This creates operational problems such as:
- double bookings
- slow customer response times
- difficulty tracking reservations
- poor customer experience
- inefficient booking management

Customers also struggle to:
- find available restaurants quickly
- get accurate booking information
- manage reservations efficiently

---

# Why Existing Workflow Is Inefficient

Traditional reservation workflows depend heavily on manual coordination.

A restaurant staff member often has to:
1. answer customer calls
2. check availability manually
3. maintain spreadsheets or notebooks
4. update booking status manually
5. respond repeatedly to common questions

This increases:
- operational overhead
- response delays
- human errors
- workload during peak hours

The system becomes difficult to scale as customer volume increases.

---

# Solution Built

To solve this, I built a centralized restaurant booking platform with:

- user authentication
- restaurant discovery
- reservation management
- booking tracking
- AI chatbot assistance
- real-time MongoDB data integration

The platform allows users to:
- search restaurants
- check availability
- make reservations
- manage bookings
- ask natural language questions through an AI assistant

The AI chatbot retrieves live information directly from MongoDB and generates contextual responses using Gemini AI.

---

# Core Features

## User Authentication
- JWT-based authentication
- Secure login and registration
- Protected routes

## Restaurant Discovery
- Filter by city and cuisine
- Search restaurants by name
- View restaurant details and operating hours

## Booking Management
- Create table reservations
- View booking history
- Cancel bookings

## AI Chatbot
- Real-time restaurant assistance
- Booking-related queries
- Context-aware responses
- MongoDB-powered live data retrieval

## Responsive Interface
- Mobile-friendly UI
- Material-UI based design
- Clean user experience

---

# Business / Operational Impact

This type of system can help restaurants:
- reduce manual booking management
- improve reservation accuracy
- handle higher customer volume
- reduce repetitive customer support work
- centralize operational data

The AI assistant further reduces operational friction by answering common customer queries automatically.

For customers, the system improves:
- booking convenience
- response speed
- reservation visibility
- overall experience

---

# System Workflow

## User Flow

1. User registers or logs in
2. User browses restaurants
3. User checks availability
4. User books a table
5. Booking is stored in MongoDB
6. User can manage reservations from dashboard

---

## AI Chatbot Flow

1. User sends a query
2. Backend fetches live restaurant and booking data
3. Gemini AI receives contextual data
4. AI generates personalized response
5. Response is shown in chatbot interface

---

# Technologies Used

## Frontend
- React
- Redux Toolkit
- Material-UI
- React Router
- Axios

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## AI Integration
- Gemini AI API
- Real-time contextual prompt generation

---

# What I Learned

Through this project, I explored:

- designing RESTful APIs
- JWT authentication flow
- Redux state management
- MongoDB schema relationships
- AI integration into real-world workflows
- handling real-time contextual data
- building scalable backend architecture
- designing operational systems for user workflows

One important learning was understanding how AI becomes more useful when connected to live operational data instead of static prompts.

---

# Project Structure

```bash
Project/
├── server/
├── client/
└── README.md
How To Run The Project
Backend Setup
cd server
npm install
npm run seed
npm run dev
Frontend Setup
cd client
npm install
npm start
Environment Variables
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
GEMINI_API_KEY=your_gemini_api_key
Future Improvements
Real-time table availability tracking
Payment gateway integration
Admin dashboard for restaurants
AI-powered recommendation system
Reservation analytics
Notification system
Multi-language chatbot support
