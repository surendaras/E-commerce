import './Footer.css'
import { Link } from 'react-router-dom'
import footer_logo from '../../assets/cartify_logo_big.svg'
import instagram_icon from '../../assets/instagram_icon.png'
import pintester_icon from '../../assets/pintester_icon.png'
import whatsapp_icon from '../../assets/whatsapp_icon.png'





const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-logo">
        <img src={footer_logo} alt="" />
        <p>Cartify</p>
      </div>
      <ul className="footer-links">
        <li><Link to='/company'>Company</Link></li>
        <li><Link to='/products'>Products</Link></li>
        <li><Link to='/offices'>Offices</Link></li>
        <li><Link to='/about'>About</Link></li>
        <li><Link to='/contact'>Contact</Link></li>
      </ul>
      <div className="footer-social-icon">
        <div className="footer-icon-container">
          <img src={instagram_icon} alt="" />
        </div>
        <div className="footer-icon-container">
          <img src={pintester_icon} alt="" />
        </div>
        <div className="footer-icon-container">
          <img src={whatsapp_icon} alt="" />
        </div>


      </div>
      <div className="footer-copyright">
        <hr />
        <p>Copyright @ 2026 -All right Reversed</p>
      </div>
    </div>
  )
}

export default Footer
