import './Newcollections.css'
import new_collections from '../../assets/new_collections.js'
import Item from '../Item/Item.jsx'
const Newcollections = () => {
  return (
    <div className='new_collections' id='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {
          new_collections.map((item, i) => {
            return <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price} />
          })
        }
      </div>
    </div>
  )
}

export default Newcollections
