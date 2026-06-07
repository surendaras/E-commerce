import { useState } from 'react'
import './Newsletter.css'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!email.trim()) {
      setMessage('Please enter your email address.')
      return
    }

    setMessage('Thanks for subscribing!')
    setEmail('')
  }

  return (
    <section className='newsletter'>
      <h1>Get Exclusive Offers on Your Email</h1>
      <p>Subscribe to our newsletter and stay updated</p>
      <form className='newsletter-form' onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder='Enter your email'
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            setMessage('')
          }}
          required
        />
        <button type='submit'>Subscribe</button>
      </form>
      {message && <span className='newsletter-message'>{message}</span>}
    </section>
  )
}

export default Newsletter
