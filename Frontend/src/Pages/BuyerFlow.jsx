import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import all_product from '../assets/all_product'
import './Product.css'

const BuyerFlow = () => {
    const { productId } = useParams()
    const product = useMemo(() => all_product.find((p) => p.id === Number(productId)), [productId])
    const [location, setLocation] = useState('')
    const [deliveryDate, setDeliveryDate] = useState('')

    if (!product) return (<main className='product-empty'><h1>Product not found</h1><Link to='/'>Back</Link></main>)

    return (
        <main className='product-page'>
            <section className='product-info'>
                <p className='product-category'>{product.category}</p>
                <h1>{product.name} — Buyer Checkout</h1>
                <div className='product-prices'>
                    <span className='product-price-new'>${product.new_price}</span>
                </div>

                <div style={{ marginTop: 20 }}>
                    <label>Delivery location</label>
                    <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder='Enter address' />
                </div>

                <div style={{ marginTop: 10 }}>
                    <label>Preferred delivery date</label>
                    <input type='date' value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                </div>

                <div style={{ marginTop: 20 }}>
                    <button type='button'>Confirm Order</button>
                    <Link to='/' style={{ marginLeft: 10 }}>Back to shop</Link>
                </div>
            </section>
        </main>
    )
}

export default BuyerFlow
