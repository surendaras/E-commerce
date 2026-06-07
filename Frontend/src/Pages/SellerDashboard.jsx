import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ORDER_STATUS_LABELS } from '../Context/orderConstants'
import { useOrders } from '../Context/orderStore'
import './Orders.css'

const formatPrice = (price) => `$${price.toFixed(2)}`

const SellerDashboard = () => {
  const { orders, sellerOrders, sendOrderToAdmin, cancelOrder } = useOrders()
  const [notes, setNotes] = useState({})

  const handleNoteChange = (orderId, value) => {
    setNotes((currentNotes) => ({ ...currentNotes, [orderId]: value }))
  }

  return (
    <main className='orders-page'>
      <section className='orders-hero'>
        <div>
          <p>Seller System</p>
          <h1>Seller Dashboard</h1>
          <span>New user orders yahan aayenge. Verify karke admin ko forward karein.</span>
        </div>
        <Link to='/admin'>Go To Admin</Link>
      </section>

      {!orders.length ? (
        <section className='orders-empty'>
          <h2>No orders found</h2>
          <p>User cart se order place karega to seller panel par dikhega.</p>
          <Link to='/'>Open Shop</Link>
        </section>
      ) : !sellerOrders.length ? (
        <section className='orders-empty'>
          <h2>No seller pending orders</h2>
          <p>All current orders are already moved ahead or completed.</p>
          <Link to='/orders'>View User Orders</Link>
        </section>
      ) : (
        <section className='dashboard-grid'>
          {sellerOrders.map((order) => (
            <article className='dashboard-card' key={order.id}>
              <div className='dashboard-card-header'>
                <div>
                  <p className='dashboard-panel-label'>{order.id}</p>
                  <h2>{order.customer.name}</h2>
                </div>
                <span className={`order-status ${order.status}`}>{ORDER_STATUS_LABELS[order.status]}</span>
              </div>

              <div className='dashboard-card-body'>
                <div className='order-details-grid'>
                  <div>
                    <span>Phone</span>
                    <strong>{order.customer.phone}</strong>
                  </div>
                  <div>
                    <span>Address</span>
                    <strong>{order.customer.address}, {order.customer.city} - {order.customer.pincode}</strong>
                  </div>
                  <div>
                    <span>Current Location</span>
                    <strong>{order.currentLocation}</strong>
                  </div>
                  <div>
                    <span>Total</span>
                    <strong>{formatPrice(order.subtotal)}</strong>
                  </div>
                </div>

                <div className='order-items'>
                  {order.items.map((item) => (
                    <div className='order-item' key={`${order.id}-${item.id}-${item.size}`}>
                      <img src={item.image} alt={item.name} />
                      <div>
                        <h3>{item.name}</h3>
                        <p>Size {item.size} | Qty {item.quantity}</p>
                      </div>
                      <strong>{formatPrice(item.lineTotal)}</strong>
                    </div>
                  ))}
                </div>

                <div className='dashboard-actions'>
                  <textarea
                    placeholder='Seller note for admin'
                    value={notes[order.id] || ''}
                    onChange={(event) => handleNoteChange(order.id, event.target.value)}
                  />
                  <div className='dashboard-button-row'>
                    <button
                      className='dashboard-primary'
                      type='button'
                      onClick={() => sendOrderToAdmin(order.id, notes[order.id])}
                    >
                      Send To Admin
                    </button>
                    <button
                      className='dashboard-danger'
                      type='button'
                      onClick={() => cancelOrder(order.id, notes[order.id] || 'Seller rejected the order.')}
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default SellerDashboard
