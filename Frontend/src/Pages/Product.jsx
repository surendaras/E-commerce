import { useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import all_product from '../assets/all_product'
import star_icon from '../assets/star_icon.png'
import star_dull_icon from '../assets/star_dull_icon.png'
import Item from '../Components/Item/Item'
import { useCart } from '../Context/cartStore'
import { useAuth } from '../Context/AuthProvider'
import { getLocationPath } from '../utils/navigation'
import './Product.css'

const Product = () => {
  const { productId } = useParams()
  const location = useLocation()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const currentPath = getLocationPath(location)
  const product = useMemo(
    () => all_product.find((item) => item.id === Number(productId)),
    [productId]
  )
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const relatedProducts = useMemo(() => {
    if (!product) {
      return []
    }

    return all_product
      .filter((item) => item.category === product.category && item.id !== product.id)
      .slice(0, 4)
  }, [product])

  const productDescription = product
    ? `${product.name} is a stylish ${product.category} wear option made for daily comfort, easy pairing, and a clean modern look. It works well for casual outings, shopping days, and everyday wardrobe use.`
    : ''

  if (!product) {
    return (
      <main className='product-empty'>
        <h1>Product not found</h1>
        <Link to='/'>Back to shop</Link>
      </main>
    )
  }

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity)
    setMessage(`${quantity} item added to cart - Size ${selectedSize}`)
  }

  return (
    <main className='product-page'>
      <section className='product-display'>
        <div className='product-gallery'>
          <div className='product-thumbs'>
            {[1, 2, 3, 4].map((thumb) => (
              <button key={thumb} type='button'>
                <img src={product.image} alt={product.name} />
              </button>
            ))}
          </div>
          <div className='product-main-image'>
            <img src={product.image} alt={product.name} />
          </div>
        </div>

        <div className='product-info'>
          <p className='product-category'>{product.category}</p>
          <h1>{product.name}</h1>
          <div className='product-rating'>
            <img src={star_icon} alt='' />
            <img src={star_icon} alt='' />
            <img src={star_icon} alt='' />
            <img src={star_icon} alt='' />
            <img src={star_dull_icon} alt='' />
            <span>(122 reviews)</span>
          </div>
          <div className='product-prices'>
            <span className='product-price-new'>${product.new_price}</span>
            <span className='product-price-old'>${product.old_price}</span>
          </div>
          <p className='product-description'>
            {productDescription}
          </p>

          <div className='product-option'>
            <h2>Select Size</h2>
            <div className='product-sizes'>
              {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <button
                  key={size}
                  type='button'
                  className={selectedSize === size ? 'active' : ''}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className='product-option'>
            <h2>Quantity</h2>
            <div className='product-quantity'>
              <button type='button' onClick={() => setQuantity((value) => Math.max(1, value - 1))}>-</button>
              <span>{quantity}</span>
              <button type='button' onClick={() => setQuantity((value) => value + 1)}>+</button>
            </div>
          </div>

          <button
            className='product-add-cart'
            type='button'
            onClick={handleAddToCart}
            disabled={user?.role !== 'buyer' && user?.role !== undefined}
            style={user?.role !== 'buyer' && user?.role ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            Add To Cart
          </button>
          {user?.role !== 'buyer' && user?.role && (
            <div style={{ marginTop: 12, padding: '12px', backgroundColor: '#fff3cd', borderRadius: '4px', color: '#856404' }}>
              <p><strong>{user.role === 'seller' ? 'Seller' : 'Admin'} Account:</strong> You can only view products. Purchasing is available for buyers only.</p>
            </div>
          )}
          <div style={{ marginTop: 12 }}>
            <h3>Continue as</h3>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <Link to={`/flow/buyer/${product.id}`}>Buyer</Link>
              <Link to={`/flow/seller/${product.id}`}>Seller</Link>
              <Link to={`/flow/admin/${product.id}`}>Admin</Link>
            </div>
          </div>
          {message && (
            <div className='product-message' role='status'>
              <span>{message}</span>
              <Link to='/cart' state={{ from: currentPath }}>View Cart</Link>
            </div>
          )}
        </div>
      </section>

      <section className='related-products'>
        <div className='related-products-header'>
          <h2>Related Products</h2>
          <p>More picks from the same category</p>
        </div>
        <div className='related-products-grid'>
          {relatedProducts.map((item) => (
            <Item
              key={item.id}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))}
        </div>
      </section>
    </main>
  )
}

export default Product
