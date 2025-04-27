import { useState, useEffect } from 'react';
import './DriverDashboard.css';

function DriverDashboard() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [driverInfo, setDriverInfo] = useState(null);

  useEffect(() => {
    const driverId = JSON.parse(localStorage.getItem('driverInfo'))?.id;
    if (driverId) {
      fetchOrders(driverId);
      fetchDriverInfo(driverId);
    }
  }, []);

  const fetchOrders = async (driverId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/deliveries/driver/${driverId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('driverToken')}`
        }
      });
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError('Error fetching orders');
    }
  };

  const fetchDriverInfo = async (driverId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/drivers/${driverId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('driverToken')}`
        }
      });
      const data = await response.json();
      setDriverInfo(data);
    } catch (err) {
      setError('Error fetching driver information');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch('http://localhost:3000/api/deliveries/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('driverToken')}`
        },
        body: JSON.stringify({
          deliveryId: orderId,
          status: newStatus
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Refresh orders after status update
      const driverId = JSON.parse(localStorage.getItem('driverInfo'))?.id;
      fetchOrders(driverId);
    } catch (err) {
      setError('Error updating order status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('driverToken');
    localStorage.removeItem('driverInfo');
    window.location.href = '/';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#ffc107',
      'Assigned': '#17a2b8',
      'On the Way': '#28a745',
      'Delivered': '#6c757d',
      'Rejected': '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Driver Dashboard</h1>
          {driverInfo && (
            <div className="driver-info">
              <p>Welcome, {driverInfo.name}</p>
              <p>Delivery Cities: {driverInfo.deliveryCities?.join(', ')}</p>
            </div>
          )}
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <main className="dashboard-content">
        {error && <div className="error">{error}</div>}
        
        <section className="orders-section">
          <h2>Your Assigned Orders</h2>
          {orders.length === 0 ? (
            <p className="no-orders">No orders assigned yet.</p>
          ) : (
            <div className="orders-grid">
              {orders.map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <h3>Order #{order._id.slice(-6)}</h3>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="order-details">
                    <p><strong>Customer:</strong> {order.customerName}</p>
                    <p><strong>Address:</strong> {order.address}</p>
                    <p><strong>City:</strong> {order.city}</p>
                    <p><strong>Items:</strong> {order.items?.length || 0}</p>
                  </div>
                  <div className="order-actions">
                    {order.status !== 'Delivered' && order.status !== 'Rejected' && (
                      <>
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'On the Way')}
                          className="action-btn start-btn"
                        >
                          Start Delivery
                        </button>
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'Delivered')}
                          className="action-btn complete-btn"
                        >
                          Mark Delivered
                        </button>
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'Rejected')}
                          className="action-btn reject-btn"
                        >
                          Reject Order
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default DriverDashboard;