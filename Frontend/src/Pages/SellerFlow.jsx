import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import all_product from '../assets/all_product'
import './Product.css'

const SellerFlow = () => {
  const { productId } = useParams()
  const product = useMemo(() => all_product.find((p) => p.id === Number(productId)), [productId])
  const [notes, setNotes] = useState('')
  const [markReady, setMarkReady] = useState(false)

  if (!product) return (<main className='product-empty'><h1>Product not found</h1><Link to='/'>Back</Link></main>)

  return (
    <main className='product-page'>
      <section className='product-info'>
        <p className='product-category'>{product.category}</p>
        <h1>{product.name} — Seller Flow</h1>
        <div className='product-prices'>
          <span className='product-price-new'>${product.new_price}</span>
        </div>

        <div style={{marginTop:20}}>
          <label>Internal notes</label>
          <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder='Add notes for packing/shipping' />
        </div>

        <div style={{marginTop:10}}>
          <label>
            <input type='checkbox' checked={markReady} onChange={(e)=>setMarkReady(e.target.checked)} /> Mark order ready to handoff
          </label>
        </div>

        <div style={{marginTop:20}}>
          <button type='button' onClick={()=>alert('Seller: continued with product flow')}>Continue</button>
          <Link to='/' style={{marginLeft:10}}>Back to shop</Link>
        </div>
      </section>
    </main>
  )
}

export default SellerFlow
