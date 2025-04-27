import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('driverToken');
  const driverInfo = JSON.parse(localStorage.getItem('driverInfo'));

  const handleLogout = () => {
    localStorage.removeItem('driverToken');
    localStorage.removeItem('driverInfo');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Link to="/">Delivery Service</Link>
        </div>
        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <div className="user-info">
                <span>Welcome, {driverInfo?.name}</span>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link to="/" className="login-button">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;