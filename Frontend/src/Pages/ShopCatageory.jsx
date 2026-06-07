import Item from '../Components/Item/Item'
import all_product from '../assets/all_product'
import banner_mens from '../assets/banner_mens.png'
import banner_women from '../assets/banner_women.png'
import banner_kids from '../assets/banner_kids.png'
import './ShopCatageory.css'

const banners = {
  men: banner_mens,
  women: banner_women,
  kid: banner_kids,
}

const categoryTitles = {
  men: "Men's Collection",
  women: "Women's Collection",
  kid: "Kid's Collection",
}

const ShopCatageory = ({ category }) => {
  const products = all_product.filter((item) => item.category === category)

  return (
    <main className='shop-category'>
      <img className='shop-category-banner' src={banners[category]} alt={categoryTitles[category]} />
      <div className='shop-category-header'>
        <h1>{categoryTitles[category]}</h1>
        <p>Showing {products.length} products</p>
      </div>
      <div className='shop-category-products'>
        {products.map((item) => (
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
    </main>
  )
}

export default ShopCatageory
