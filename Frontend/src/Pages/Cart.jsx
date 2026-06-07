import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../Context/cartStore'
import { useOrders } from '../Context/orderStore'
import { getRememberedShoppingPath } from '../utils/navigation'
import cart_icon from '../assets/cart_icon.png'
import './Cart.css'

const formatPrice = (price) => `$${price.toFixed(2)}`

const Cart = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { createOrder } = useOrders()
  const {
    cartItems,
    clearCart,
    removeFromCart,
    subtotal,
    totalQuantity,
    updateCartItem,
  } = useCart()
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  })
  const [checkoutError, setCheckoutError] = useState('')
  const fromPath = typeof location.state?.from === 'string' ? location.state.from : ''
  const continueShoppingPath = fromPath && fromPath !== '/cart' ? fromPath : getRememberedShoppingPath()

  const handleCustomerChange = (event) => {
    const { name, value } = event.target
    setCustomer((currentCustomer) => ({ ...currentCustomer, [name]: value }))
  }

  const handlePlaceOrder = (event) => {
    event.preventDefault()
    const requiredFields = ['name', 'phone', 'address', 'city', 'pincode']
    const hasMissingField = requiredFields.some((field) => !customer[field].trim())

    if (hasMissingField) {
      setCheckoutError('Please fill all delivery details before placing the order.')
      return
    }

    const order = createOrder({
      customer,
      items: cartItems,
      subtotal,
    })

    clearCart()
    navigate('/orders', { state: { orderId: order.id } })
  }

  if (!cartItems.length) {
    return (
      <main className='cart-page'>
        <section className='cart-empty'>
          <div className='cart-empty-icon'>
            <img src={cart_icon} alt='' />
          </div>
          <h1>Your cart is empty</h1>
          <p>Add your favourite products and they will appear here instantly.</p>
          <Link to={continueShoppingPath}>Start Shopping</Link>
        </section>
      </main>
    )
  }

  return (
    <main className='cart-page'>
      <section className='cart-header'>
        <div>
          <p>Shopping Cart</p>
          <h1>{totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} ready for checkout</h1>
        </div>
        <Link to={continueShoppingPath}>Continue Shopping</Link>
      </section>

      <section className='cart-layout'>
        <div className='cart-items'>
          {cartItems.map((item) => (
            <article className='cart-item' key={item.key}>
              <Link className='cart-item-image' to={`/product/${item.id}`}>
                <img src={item.product.image} alt={item.product.name} />
              </Link>

              <div className='cart-item-info'>
                <p className='cart-item-category'>{item.product.category}</p>
                <h2>
                  <Link to={`/product/${item.id}`}>{item.product.name}</Link>
                </h2>
                <div className='cart-item-meta'>
                  <span>Size {item.size}</span>
                  <span>{formatPrice(item.product.new_price)} each</span>
                </div>

                <div className='cart-item-actions'>
                  <div className='cart-quantity'>
                    <button
                      type='button'
                      aria-label='Decrease quantity'
                      onClick={() => updateCartItem(item.id, item.size, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type='button'
                      aria-label='Increase quantity'
                      onClick={() => updateCartItem(item.id, item.size, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className='cart-remove'
                    type='button'
                    onClick={() => removeFromCart(item.id, item.size)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className='cart-item-total'>
                <span>Total</span>
                <strong>{formatPrice(item.lineTotal)}</strong>
              </div>
            </article>
          ))}
        </div>

        <form className='cart-summary' onSubmit={handlePlaceOrder}>
          <h2>Order Summary</h2>
          <div className='cart-summary-row'>
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div className='cart-summary-row'>
            <span>Delivery</span>
            <strong>Free</strong>
          </div>
          <div className='cart-summary-total'>
            <span>Total</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div className='cart-delivery-form'>
            <h3>Delivery Details</h3>
            <input
              name='name'
              type='text'
              placeholder='Full name'
              value={customer.name}
              onChange={handleCustomerChange}
            />
            <input
              name='phone'
              type='tel'
              placeholder='Phone number'
              value={customer.phone}
              onChange={handleCustomerChange}
            />
            <textarea
              name='address'
              placeholder='Full address'
              value={customer.address}
              onChange={handleCustomerChange}
            />
            <div className='cart-form-grid'>
              <input
                name='city'
                type='text'
                placeholder='City'
                value={customer.city}
                onChange={handleCustomerChange}
              />
              <input
                name='pincode'
                type='text'
                placeholder='Pincode'
                value={customer.pincode}
                onChange={handleCustomerChange}
              />
            </div>
            {checkoutError && <p className='cart-form-error'>{checkoutError}</p>}
          </div>
          <button className='cart-checkout' type='submit'>Place Order</button>
          <button className='cart-clear' type='button' onClick={clearCart}>Clear Cart</button>
        </form>
      </section>
    </main>
  )
}

export default Cart
