import { useEffect } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from './Context/AuthProvider.jsx'
import Shop from './Pages/Shop'
import ShopCatageory from './Pages/ShopCatageory'
import Product from './Pages/Product'
import Cart from './Pages/Cart'
import Orders from './Pages/Orders'
import SellerDashboard from './Pages/SellerDashboard'
import AdminDashboard from './Pages/AdminDashboard'
import BuyerFlow from './Pages/BuyerFlow'
import SellerFlow from './Pages/SellerFlow'
import AdminFlow from './Pages/AdminFlow'
import LoginSignUp from './Pages/LoginSignUp'
import Company from './Pages/Company'
import Products from './Pages/Products'
import Offices from './Pages/Offices'
import About from './Pages/About'
import Contact from './Pages/Contact'
import Footer from './Components/Footer/Footer'
import { LAST_SHOPPING_PATH_KEY, getLocationPath } from './utils/navigation'

const RememberLastShoppingPage = () => {
  const location = useLocation()
  const currentPath = getLocationPath(location)

  useEffect(() => {
    if (location.pathname === '/cart') {
      return
    }

    sessionStorage.setItem(
      LAST_SHOPPING_PATH_KEY,
      currentPath
    )
  }, [currentPath, location.pathname])

  return null
}

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  const getLandingPath = (role) => {
    if (role === 'seller') return '/seller'
    if (role === 'admin') return '/admin'
    return '/'
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getLandingPath(user?.role)} replace />
  }

  return children
}

function App() {
  return (
    <div>

      <Navbar />
      <RememberLastShoppingPage />

      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Shop />
            </ProtectedRoute>
          }
        />
        <Route
          path='/mens'
          element={
            <ProtectedRoute>
              <ShopCatageory category="men" />
            </ProtectedRoute>
          }
        />
        <Route
          path='/womens'
          element={
            <ProtectedRoute>
              <ShopCatageory category="women" />
            </ProtectedRoute>
          }
        />
        <Route
          path='/kids'
          element={
            <ProtectedRoute>
              <ShopCatageory category="kid" />
            </ProtectedRoute>
          }
        />
        <Route
          path='/product/:productId'
          element={
            <ProtectedRoute>
              <Product />
            </ProtectedRoute>
          }
        />
        <Route
          path='/company'
          element={
            <ProtectedRoute>
              <Company />
            </ProtectedRoute>
          }
        />
        <Route
          path='/products'
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path='/offices'
          element={
            <ProtectedRoute>
              <Offices />
            </ProtectedRoute>
          }
        />
        <Route
          path='/about'
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path='/contact'
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />
        <Route
          path='/flow/buyer/:productId'
          element={
            <ProtectedRoute>
              <BuyerFlow />
            </ProtectedRoute>
          }
        />
        <Route
          path='/flow/seller/:productId'
          element={
            <ProtectedRoute>
              <SellerFlow />
            </ProtectedRoute>
          }
        />
        <Route
          path='/flow/admin/:productId'
          element={
            <ProtectedRoute>
              <AdminFlow />
            </ProtectedRoute>
          }
        />
        <Route
          path='/cart'
          element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path='/orders'
          element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/seller'
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path='/login' element={<LoginSignUp />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
