import { Link, useLocation } from 'react-router-dom'
import { ORDER_STATUS_LABELS, ORDER_STATUS } from '../Context/orderConstants'
import { useOrders } from '../Context/orderStore'
import { useMemo, useState } from 'react'
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

const dedupeTimeline = (timeline = []) => {
    const seen = new Set()
    return timeline.filter((step) => {
        const key = `${step.title}::${step.description}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
    })
}

const Orders = () => {
    const location = useLocation()
    const { orders, cancelOrder, cancelOrderItem, deleteOrder } = useOrders()
    const newOrderId = location.state?.orderId
    const [tab, setTab] = useState('active')
    const [pendingCancelItem, setPendingCancelItem] = useState(null)

    const requestCancelItem = (orderId, itemKey, itemName, itemSize) => {
        setPendingCancelItem({ orderId, itemKey, itemName, itemSize })
    }

    const confirmCancelItem = () => {
        if (!pendingCancelItem) return
        cancelOrderItem(pendingCancelItem.orderId, pendingCancelItem.itemKey)
        setPendingCancelItem(null)
    }

    const closeCancelModal = () => setPendingCancelItem(null)

    const activeOrders = useMemo(
        () => orders.filter((o) => o.status !== ORDER_STATUS.DELIVERED && o.status !== ORDER_STATUS.CANCELLED),
        [orders]
    )
    const historyOrders = useMemo(
        () => orders.filter((o) => o.status === ORDER_STATUS.DELIVERED || o.status === ORDER_STATUS.CANCELLED),
        [orders]
    )

    return (
        <main className='orders-page'>
            <section className='orders-hero'>
                <div>
                    <p>User System</p>
                    <h1>My Orders</h1>
                    <span>Track seller approval, admin movement, location, address and delivery date.</span>
                </div>
                <Link to='/'>Shop More</Link>
            </section>

            {newOrderId && <div className='orders-success'>Order {newOrderId} placed successfully and sent to seller.</div>}

            {!orders.length ? (
                <section className='orders-empty'>
                    <h2>No orders yet</h2>
                    <p>Place an order from your cart and it will appear here.</p>
                    <Link to='/'>Start Shopping</Link>
                </section>
            ) : (
                <>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                        <button type='button' onClick={() => setTab('active')} style={{ fontWeight: tab === 'active' ? 700 : 400 }}>
                            My Orders ({activeOrders.length})
                        </button>
                        <button type='button' onClick={() => setTab('history')} style={{ fontWeight: tab === 'history' ? 700 : 400 }}>
                            Order History ({historyOrders.length})
                        </button>
                    </div>

                    <section className='orders-list'>
                        {(tab === 'active' ? activeOrders : historyOrders).map((order) => (
                            <article className='order-card' key={order.id}>
                                <div className='order-card-header'>
                                    <div>
                                        <p>{order.id}</p>
                                        {order.status === ORDER_STATUS.DELIVERED ? (
                                            <h2>
                                                {`You ordered this on ${formatDate((order.timeline && order.timeline[0] && order.timeline[0].date) || order.createdAt)}`}
                                            </h2>
                                        ) : (
                                            <h2>{ORDER_STATUS_LABELS[order.status]}</h2>
                                        )}
                                    </div>

                                    {order.status !== ORDER_STATUS.DELIVERED && (
                                        <span className={`order-status ${order.status}`}>{ORDER_STATUS_LABELS[order.status]}</span>
                                    )}
                                </div>

                                <div className='order-details-grid'>
                                    <div>
                                        <span>Current Location</span>
                                        <strong>{order.currentLocation}</strong>
                                    </div>
                                    <div>
                                        <span>Expected Delivery</span>
                                        <strong>{formatDate(order.deliveryDate)}</strong>
                                    </div>
                                    <div>
                                        <span>Address</span>
                                        <strong>
                                            {order.customer.address}, {order.customer.city} - {order.customer.pincode}
                                        </strong>
                                    </div>
                                    <div>
                                        <span>Contact</span>
                                        <strong>
                                            {order.customer.name} | {order.customer.phone}
                                        </strong>
                                    </div>
                                </div>

                                {(order.status === ORDER_STATUS.CANCELLATION_REVIEW || order.timeline.some((step) => step.title === 'Item cancelled' || step.title === 'Cancellation requested')) && order.status !== ORDER_STATUS.CANCELLED && (
                                    <div className='order-partial-notice'>
                                        One or more products were cancelled from this order. The cancellation request will be processed by admin before the seller is notified.
                                    </div>
                                )}

                                {order.cancelledItems?.length > 0 && (
                                    <div className='order-cancelled-items'>
                                        <div className='cancelled-items-header'>Cancelled item removed from this order</div>
                                        {order.cancelledItems.map((item) => (
                                            <div className='cancelled-item' key={`${order.id}-${item.id}-${item.size}`}>
                                                <span>{item.name}</span>
                                                <small>Size {item.size} | Qty {item.quantity}</small>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className='order-items'>
                                    {order.items.map((item) => (
                                        <div className='order-item' key={`${order.id}-${item.id}-${item.size}`}>
                                            <Link to={`/product/${item.id}`} className='order-item-image'>
                                                <img src={item.image} alt={item.name} />
                                            </Link>
                                            <div>
                                                <h3>
                                                    <Link to={`/product/${item.id}`}>{item.name}</Link>
                                                </h3>
                                                <p>
                                                    Size {item.size} | Qty {item.quantity}
                                                </p>
                                                {order.items.length > 1 && order.status !== ORDER_STATUS.DELIVERED && order.status !== ORDER_STATUS.CANCELLED && (
                                                    <button
                                                        className='order-item-cancel'
                                                        type='button'
                                                        onClick={() => requestCancelItem(order.id, `${item.id}-${item.size}`, item.name, item.size)}
                                                    >
                                                        Cancel item
                                                    </button>
                                                )}
                                            </div>
                                            <strong>{formatPrice(item.lineTotal)}</strong>
                                        </div>
                                    ))}
                                </div>

                                <div className='order-total'>
                                    <span>Total</span>
                                    <strong>{formatPrice(order.subtotal)}</strong>
                                </div>

                                <div className='order-action-row'>
                                    {order.status !== ORDER_STATUS.DELIVERED && order.status !== ORDER_STATUS.CANCELLED && (
                                        <button className='order-cancel' type='button' onClick={() => cancelOrder(order.id)}>
                                            Cancel Order
                                        </button>
                                    )}
                                    {(tab === 'history' || order.status === ORDER_STATUS.CANCELLED) && (
                                        <button className='order-delete' type='button' onClick={() => deleteOrder(order.id)}>
                                            Delete history
                                        </button>
                                    )}
                                </div>

                                <div className='order-timeline'>
                                    {dedupeTimeline(order.timeline).map((step) => (
                                        <div className={`timeline-step ${step.title === 'Item cancelled' ? 'timeline-step-cancelled' : ''}`} key={step.id}>
                                            <span />
                                            <div>
                                                <strong>{step.title}</strong>
                                                <p>{step.description}</p>
                                                <small>{formatDate(step.date)}</small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </section>

                    {pendingCancelItem && (
                        <div className='modal-backdrop' role='dialog' aria-modal='true'>
                            <div className='confirm-modal'>
                                <h3>Confirm item cancellation</h3>
                                <p>
                                    Do you want to cancel <strong>{pendingCancelItem.itemName}</strong> (Size {pendingCancelItem.itemSize})?
                                    This request will be sent to admin for confirmation.
                                </p>
                                <div className='modal-actions'>
                                    <button type='button' className='modal-confirm' onClick={confirmCancelItem}>
                                        Yes, cancel item
                                    </button>
                                    <button type='button' className='modal-cancel' onClick={closeCancelModal}>
                                        No, keep item
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </main>
    )
}

export default Orders
