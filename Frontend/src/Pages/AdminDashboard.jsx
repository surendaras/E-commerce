import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../Context/orderConstants'
import { useOrders } from '../Context/orderStore'
import './Orders.css'

const formatPrice = (price) => `$${price.toFixed(2)}`

const isValidDate = (date) => {
  if (!date) return false
  const parsed = new Date(date)
  return !Number.isNaN(parsed.getTime())
}

const formatDate = (date) => {
  if (!isValidDate(date)) return 'Not assigned yet'
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: date.includes('T') ? 'short' : undefined,
  }).format(new Date(date))
}

const AdminDashboard = () => {
  const { adminOrders, updateAdminOrder, deleteOrder } = useOrders()
  const [details, setDetails] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  const handleDetailChange = (orderId, field, value) => {
    setDetails((currentDetails) => ({
      ...currentDetails,
      [orderId]: {
        ...currentDetails[orderId],
        [field]: value,
      },
    }))
  }

  const getOrderDetails = (order) => ({
    currentLocation: details[order.id]?.currentLocation || order.currentLocation,
    deliveryDate: details[order.id]?.deliveryDate || order.deliveryDate,
    adminNote: details[order.id]?.adminNote || '',
  })

  const moveOrder = (order, status) => {
    const statusLabel = status === ORDER_STATUS.OUT_FOR_DELIVERY ? 'Out for Delivery' : 'Delivered'
    updateAdminOrder(order.id, {
      ...getOrderDetails(order),
      status,
    })
    setSuccessMessage(`✓ Order moved to ${statusLabel}`)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  return (
    <main className='orders-page'>
      <section className='orders-hero'>
        <div>
          <p>Admin System</p>
          <h1>Admin Dashboard</h1>
          <span>Move seller-approved orders to the next delivery stage.</span>
        </div>
        <Link to='/orders'>User Tracking</Link>
      </section>

      {!adminOrders.length ? (
        <section className='orders-empty'>
          <h2>No admin orders</h2>
          <p>Orders will appear here once the seller sends them to admin.</p>
          <Link to='/seller'>Open Seller</Link>
        </section>
      ) : (
        <section className='dashboard-grid'>
          {adminOrders.map((order) => (
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
                    <span>Address</span>
                    <strong>{order.customer.address}, {order.customer.city} - {order.customer.pincode}</strong>
                  </div>
                  <div>
                    <span>Phone</span>
                    <strong>{order.customer.phone}</strong>
                  </div>
                  <div>
                    <span>Seller Note</span>
                    <strong>{order.sellerNote || 'No seller note'}</strong>
                  </div>
                  <div>
                    <span>Expected Delivery</span>
                    <strong>{formatDate(order.deliveryDate)}</strong>
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
                  <input
                    type='text'
                    placeholder='Current location'
                    value={details[order.id]?.currentLocation || order.currentLocation}
                    onChange={(event) => handleDetailChange(order.id, 'currentLocation', event.target.value)}
                  />
                  <input
                    type='date'
                    value={details[order.id]?.deliveryDate || order.deliveryDate}
                    onChange={(event) => handleDetailChange(order.id, 'deliveryDate', event.target.value)}
                  />
                  <textarea
                    placeholder='Admin note for user tracking'
                    value={details[order.id]?.adminNote || ''}
                    onChange={(event) => handleDetailChange(order.id, 'adminNote', event.target.value)}
                  />
                  <div className='dashboard-button-row'>
                    {order.status === ORDER_STATUS.CANCELLED ? (
                      <button
                        className='dashboard-danger'
                        type='button'
                        onClick={() => deleteOrder(order.id)}
                      >
                        Delete order
                      </button>
                    ) : order.status === ORDER_STATUS.DELIVERED ? (
                      <div style={{ padding: '12px', backgroundColor: '#d4edda', borderRadius: '4px', color: '#155724', textAlign: 'center' }}>
                        <strong>✓ Delivery Completed</strong>
                      </div>
                    ) : order.status === ORDER_STATUS.CANCELLATION_REVIEW ? (
                      <>
                        <button
                          className='dashboard-primary'
                          type='button'
                          onClick={() => moveOrder(order, ORDER_STATUS.SELLER_REVIEW)}
                        >
                          Confirm cancellation and notify seller
                        </button>
                        <button
                          className='dashboard-danger'
                          type='button'
                          onClick={() => deleteOrder(order.id)}
                        >
                          Delete order
                        </button>
                      </>
                    ) : order.status === ORDER_STATUS.OUT_FOR_DELIVERY ? (
                      <button
                        className='dashboard-secondary'
                        type='button'
                        onClick={() => moveOrder(order, ORDER_STATUS.DELIVERED)}
                      >
                        Mark Delivered
                      </button>
                    ) : (
                      <>
                        <button
                          className='dashboard-primary'
                          type='button'
                          onClick={() => moveOrder(order, ORDER_STATUS.OUT_FOR_DELIVERY)}
                        >
                          Move To Delivery
                        </button>
                        <button
                          className='dashboard-secondary'
                          type='button'
                          onClick={() => moveOrder(order, ORDER_STATUS.DELIVERED)}
                        >
                          Mark Delivered
                        </button>
                      </>
                    )}
                  </div>
                  {successMessage && (
                    <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px', color: '#155724', textAlign: 'center' }}>
                      {successMessage}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default AdminDashboard
