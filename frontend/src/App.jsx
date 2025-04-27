import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import DriverAuth from './components/DriverAuth'
import DriverDashboard from './pages/DriverDashboard'
import './App.css'

function App() {
  const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('driverToken');
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Auth routes */}
            <Route path="/login" element={<DriverAuth isLogin={true} />} />
            <Route path="/register" element={<DriverAuth isLogin={false} />} />
            
            {/* Protected dashboard route */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <DriverDashboard />
                </PrivateRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
