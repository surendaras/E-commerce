import './LoginSignUp.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthProvider.jsx'

const DEFAULT_USER_HINT = [
  { label: 'Buyer', email: 'buyer@cartify.com', password: 'Buyer123' },
  { label: 'Seller', email: 'seller@cartify.com', password: 'Seller123' },
  { label: 'Admin', email: 'admin@cartify.com', password: 'Admin123' },
]

const LoginSignUp = () => {
  const [mode, setMode] = useState('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('buyer')
  const [error, setError] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  const { isAuthenticated, user, login, signup } = useAuth()
  const navigate = useNavigate()

  const isSignUp = mode === 'signup'

  const getLandingPath = (role) => {
    if (role === 'seller') return '/seller'
    if (role === 'admin') return '/admin'
    return '/'
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate(getLandingPath(user?.role), { replace: true })
    }
  }, [isAuthenticated, navigate, user?.role])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!email || !password || (isSignUp && !name)) {
      setError('Please fill in all required fields.')
      return
    }

    if (isSignUp && !agreeTerms) {
      setError('Please agree to the terms before creating your account.')
      return
    }

    try {
      if (isSignUp) {
        await signup({ name, email, password, role })
      } else {
        await login({ email, password })
      }
    } catch (authError) {
      setError(authError.message || 'Authentication failed. Please try again.')
    }
  }

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <div className="loginsignup-tabs">
          <button
            className={isSignUp ? 'active' : ''}
            type="button"
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
          <button
            className={!isSignUp ? 'active' : ''}
            type="button"
            onClick={() => setMode('signin')}
          >
            Sign In
          </button>
        </div>

        <h1>{isSignUp ? 'Create Account' : 'Sign In'}</h1>

        <form className="loginsignup-field" onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              type="text"
              placeholder="Your Name"
            />
          )}
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Email Address"
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Password"
          />

          {isSignUp && (
            <select value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          )}

          {error && <p className="loginsignup-error">{error}</p>}

          <button type="submit">{isSignUp ? 'Create Account' : 'Sign In'}</button>
        </form>

        <p className="loginsignup-login">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={() => setMode(isSignUp ? 'signin' : 'signup')}>
            {isSignUp ? ' Sign In' : ' Sign Up'}
          </span>
        </p>

        {isSignUp && (
          <div className="loginsignup-agree">
            <input
              checked={agreeTerms}
              onChange={(event) => setAgreeTerms(event.target.checked)}
              type="checkbox"
              aria-label="Agree terms"
            />
            <p>By continuing, I agree to the terms of use & privacy policy.</p>
          </div>
        )}

        {!isSignUp && (
          <div className="loginsignup-hint">
            <p>Use one of these demo accounts for quick access:</p>
            <ul>
              {DEFAULT_USER_HINT.map((account) => (
                <li key={account.email}>
                  <strong>{account.label}:</strong> {account.email} / {account.password}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginSignUp
