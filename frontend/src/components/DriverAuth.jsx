import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './DriverAuth.css';

function DriverAuth({ isLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    deliveryCities: [''],
  });
  
  // Replace the internal isLogin state with the prop
  useEffect(() => {
    // Clear form data when switching between login and register
    setFormData({
      name: '',
      email: '',
      password: '',
      deliveryCities: [''],
    });
  }, [isLogin]);

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/drivers/login' : '/api/drivers/register';
    
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      if (isLogin) {
        localStorage.setItem('driverToken', data.token);
        localStorage.setItem('driverInfo', JSON.stringify(data.driver));
        navigate('/dashboard');
      } else {
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCityChange = (index, value) => {
    const updatedCities = [...formData.deliveryCities];
    updatedCities[index] = value;
    setFormData({ ...formData, deliveryCities: updatedCities });
  };

  const addCity = () => {
    setFormData({
      ...formData,
      deliveryCities: [...formData.deliveryCities, '']
    });
  };

  const removeCity = (index) => {
    const updatedCities = formData.deliveryCities.filter((_, i) => i !== index);
    setFormData({ ...formData, deliveryCities: updatedCities });
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{isLogin ? 'Driver Login' : 'Driver Registration'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Delivery Cities</label>
                {formData.deliveryCities.map((city, index) => (
                  <div key={index} className="city-input">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => handleCityChange(index, e.target.value)}
                      placeholder="Enter city name"
                      required
                    />
                    {formData.deliveryCities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCity(index)}
                        className="remove-city"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCity}
                  className="add-city"
                >
                  Add Another City
                </button>
              </div>
            </>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          
          <button type="submit" className="submit-btn">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        
        {/* Replace toggle button with Link */}
        <Link 
          to={isLogin ? '/register' : '/login'} 
          className="toggle-auth-btn"
        >
          {isLogin ? 'Need to register?' : 'Already have an account?'}
        </Link>
      </div>
    </div>
  );
}

export default DriverAuth;