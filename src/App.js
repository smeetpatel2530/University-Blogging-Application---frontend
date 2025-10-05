import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavigationBar from './components/NavigationBar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavigationBar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute roles={['ROLE_ADMIN']}><AdminDashboard /></PrivateRoute>} />
              <Route path="*" element={
                <div className="container text-center py-5">
                  <h1>404 - Page Not Found</h1>
                  <p className="lead">The page you are looking for does not exist.</p>
                </div>
              } />
            </Routes>
          </main>
          <footer className="bg-dark text-white py-4 mt-5">
            <div className="container text-center">
              <p className="mb-0">&copy; {new Date().getFullYear()} DTU Blog. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
