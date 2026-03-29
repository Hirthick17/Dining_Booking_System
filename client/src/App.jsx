import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store from './redux/store';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import ChatbotPage from './pages/ChatbotPage';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E23744',
    },
    secondary: {
      main: '#F97316',
    },
  },
  typography: {
    // Inter as primary body font, Poppins for headings
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif',
    h1: {
      fontFamily: 'Poppins, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif',
      fontWeight: 800,
    },
    h2: {
      fontFamily: 'Poppins, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'Poppins, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: 'Poppins, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: 'Poppins, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: 'Poppins, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif',
      fontWeight: 600,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Footer />
          <ChatbotWidget />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

