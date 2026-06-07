import './Navbar.css'
import logo from '../../assets/cartify_logo.svg';
import cart_icon from '../../assets/cart_icon.png';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../../Context/cartStore';
import { useAuth } from '../../Context/AuthProvider.jsx'
import { getLocationPath } from '../../utils/navigation';

function Navbar() {
    const { totalQuantity } = useCart()
    const { isAuthenticated, user, logout } = useAuth()
    const location = useLocation()
    const cartLabel = totalQuantity === 1 ? 'Cart with 1 item' : `Cart with ${totalQuantity} items`
    const currentPath = getLocationPath(location)
    const cartLinkState = location.pathname === '/cart' ? undefined : { from: currentPath }

    return (
        <header className='navbar'>

            <Link className='nav-logo' to='/'>
                <img src={logo} alt="logo" />
                <p>Cartify</p>
            </Link>

            <ul className='nav-menu'>
                <li><NavLink to='/' end>Shop</NavLink></li>
                <li><NavLink to='/mens'>Men</NavLink></li>
                <li><NavLink to='/womens'>Women</NavLink></li>
                <li><NavLink to='/kids'>Kid</NavLink></li>

                <li className='nav-dropdown'>
                    <button aria-haspopup="true" aria-expanded="false">More</button>
                    <ul className='dropdown-menu'>
                        <li><NavLink to='/company'>Company</NavLink></li>
                        <li><NavLink to='/products'>Products</NavLink></li>
                        <li><NavLink to='/offices'>Offices</NavLink></li>
                        <li><NavLink to='/about'>About</NavLink></li>
                        <li><NavLink to='/contact'>Contact</NavLink></li>
                    </ul>
                </li>

                {user?.role === 'buyer' && (
                    <li><NavLink to='/orders'>My Orders</NavLink></li>
                )}
                {isAuthenticated && (
                    <li>
                        <NavLink to={user?.role === 'seller' ? '/seller' : user?.role === 'admin' ? '/admin' : '/'}>
                            {user?.role === 'seller'
                                ? 'Seller Dashboard'
                                : user?.role === 'admin'
                                    ? 'Admin Dashboard'
                                    : 'Buyer Dashboard'}
                        </NavLink>
                    </li>
                )}
            </ul>

            <div className='nav-login-cart'>
                {isAuthenticated ? (
                    <>
                        <span className='nav-user'>Hi, {user?.name || 'Cartify'} </span>
                        <button type='button' onClick={logout} className='nav-logout-btn'>Logout</button>
                    </>
                ) : (
                    <Link className='nav-login-link' to='/login'>
                        <button>Login</button>
                    </Link>
                )}
                {user?.role === 'buyer' && (
                    <Link className='nav-cart-link' to='/cart' state={cartLinkState} aria-label={cartLabel}>
                        <img src={cart_icon} alt="" />
                        <span className='nav-cart-count'>{totalQuantity}</span>
                    </Link>
                )}
            </div>

        </header>
    )
}

export default Navbar
