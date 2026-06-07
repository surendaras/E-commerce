import { useCallback, useEffect, useMemo, useState } from 'react'
import all_product from '../assets/all_product'
import { CartContext } from './cartStore'

const STORAGE_KEY = 'shopper-cart'

const makeCartKey = (id, size) => `${id}-${size}`

const normalizeQuantity = (quantity) => Math.max(1, Number(quantity) || 1)

const getStoredCart = () => {
  try {
    const storedCart = localStorage.getItem(STORAGE_KEY)
    const parsedCart = storedCart ? JSON.parse(storedCart) : []

    return Array.isArray(parsedCart) ? parsedCart : []
  } catch {
    return []
  }
}

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(getStoredCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart = useCallback((product, size, quantity) => {
    const productId = Number(product.id)
    const selectedSize = size || 'M'
    const selectedQuantity = normalizeQuantity(quantity)

    setCart((currentCart) => {
      const cartKey = makeCartKey(productId, selectedSize)
      const existingItem = currentCart.find((item) => makeCartKey(item.id, item.size) === cartKey)

      if (existingItem) {
        return currentCart.map((item) =>
          makeCartKey(item.id, item.size) === cartKey
            ? { ...item, quantity: item.quantity + selectedQuantity }
            : item
        )
      }

      return [
        ...currentCart,
        {
          id: productId,
          size: selectedSize,
          quantity: selectedQuantity,
        },
      ]
    })
  }, [])

  const updateCartItem = useCallback((id, size, quantity) => {
    const productId = Number(id)
    const selectedQuantity = Number(quantity)

    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId && item.size === size
            ? { ...item, quantity: selectedQuantity }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }, [])

  const removeFromCart = useCallback((id, size) => {
    const productId = Number(id)

    setCart((currentCart) =>
      currentCart.filter((item) => !(item.id === productId && item.size === size))
    )
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const cartItems = useMemo(
    () =>
      cart
        .map((item) => {
          const product = all_product.find((productItem) => productItem.id === item.id)

          if (!product) {
            return null
          }

          return {
            ...item,
            key: makeCartKey(item.id, item.size),
            product,
            lineTotal: product.new_price * item.quantity,
          }
        })
        .filter(Boolean),
    [cart]
  )

  const totalQuantity = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  )

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.lineTotal, 0),
    [cartItems]
  )

  const value = useMemo(
    () => ({
      addToCart,
      cartItems,
      clearCart,
      removeFromCart,
      subtotal,
      totalQuantity,
      updateCartItem,
    }),
    [addToCart, cartItems, clearCart, removeFromCart, subtotal, totalQuantity, updateCartItem]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartProvider
