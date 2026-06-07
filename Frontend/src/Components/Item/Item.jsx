import './Item.css'
import { Link } from 'react-router-dom'

const Item = (props) => {
  return (
    <Link to={`/product/${props.id}`} className='item' onClick={() => window.scrollTo(0, 0)}>
      <img src={props.image} alt="" />
      <p>{props.name}</p>
      <div className="item-prices">
        <div className="item-price-new">
            ${props.new_price}
        </div>
        <div className="item-price-old">
          {props.old_price}
        </div>
      </div>
    </Link>
  )
}

export default Item
