import { useCallback, useEffect, useMemo, useState } from 'react'
import { ORDER_STATUS } from './orderConstants'
import { OrderContext } from './orderStore'

const STORAGE_KEY = 'shopper-orders'

const normalizeDescription = (description) => {
  const mapping = {
    'User ne order place kiya. Ab seller verification ke liye pending hai.':
      'User placed the order. Awaiting seller verification.',
    'Seller ne stock verify karke order admin ko bhej diya.':
      'Seller verified stock and sent the order to admin.',
    'Admin ne order ko next delivery step par move kar diya.':
      'Admin moved the order to the next delivery step.',
    'Seller ne order verify kar diya.': 'Seller has verified the order.',
    'Seller ne order cancel kar diya.': 'Seller has cancelled the order.',
  }
  return mapping[description] || description
}

const isValidDate = (date) => {
  if (!date) return false
  const parsed = new Date(date)
  return !Number.isNaN(parsed.getTime())
}

const normalizeOrder = (order) => ({
  ...order,
  sellerNote: normalizeDescription(order.sellerNote),
  adminNote: normalizeDescription(order.adminNote),
  deliveryDate: isValidDate(order.deliveryDate) ? order.deliveryDate : '',
  cancelledItems: Array.isArray(order.cancelledItems) ? order.cancelledItems : [],
  timeline: Array.isArray(order.timeline)
    ? order.timeline.map((step) => ({
      ...step,
      description: normalizeDescription(step.description),
    }))
    : order.timeline,
})

const getStoredOrders = () => {
  try {
    const storedOrders = localStorage.getItem(STORAGE_KEY)
    const parsedOrders = storedOrders ? JSON.parse(storedOrders) : []

    return Array.isArray(parsedOrders) ? parsedOrders.map(normalizeOrder) : []
  } catch {
    return []
  }
}

const createTimelineItem = (title, description) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  title,
  description,
  date: new Date().toISOString(),
})

const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(getStoredOrders)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  }, [orders])

  const createOrder = useCallback(({ customer, items, subtotal }) => {
    const createdAt = new Date().toISOString()
    const order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      customer,
      items: items.map((item) => ({
        id: item.id,
        name: item.product.name,
        image: item.product.image,
        price: item.product.new_price,
        quantity: item.quantity,
        size: item.size,
        lineTotal: item.lineTotal,
      })),
      subtotal,
      status: ORDER_STATUS.SELLER_REVIEW,
      currentLocation: 'Seller warehouse',
      deliveryDate: '',
      sellerNote: '',
      adminNote: '',
      cancelledItems: [],
      createdAt,
      updatedAt: createdAt,
      timeline: [
        createTimelineItem(
          'Order placed',
          'User placed the order. Awaiting seller verification.'
        ),
      ],
    }

    setOrders((currentOrders) => [order, ...currentOrders])
    return order
  }, [])

  const sendOrderToAdmin = useCallback((orderId, sellerNote) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
            ...order,
            sellerNote: sellerNote || 'Seller has verified the order.',
            status: ORDER_STATUS.ADMIN_REVIEW,
            currentLocation: 'Admin dispatch desk',
            updatedAt: new Date().toISOString(),
            timeline: [
              ...order.timeline,
              createTimelineItem(
                'Sent to admin',
                sellerNote || 'Seller verified stock and sent the order to admin.'
              ),
            ],
          }
          : order
      )
    )
  }, [])

  const cancelOrder = useCallback((orderId, reason) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
            ...order,
            status: ORDER_STATUS.CANCELLED,
            sellerNote: reason || order.sellerNote,
            updatedAt: new Date().toISOString(),
            timeline: [
              ...order.timeline,
              createTimelineItem('Order cancelled', reason || 'Seller has cancelled the order.'),
            ],
          }
          : order
      )
    )
  }, [])

  const cancelOrderItem = useCallback((orderId, itemKey) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) => {
        if (order.id !== orderId) return order

        const cancelledItem = order.items.find((item) => `${item.id}-${item.size}` === itemKey)
        const remainingItems = order.items.filter((item) => `${item.id}-${item.size}` !== itemKey)
        const updatedSubtotal = remainingItems.reduce((sum, item) => sum + item.lineTotal, 0)
        const updatedStatus = remainingItems.length
          ? ORDER_STATUS.CANCELLATION_REVIEW
          : ORDER_STATUS.CANCELLED

        return {
          ...order,
          status: updatedStatus,
          currentLocation: remainingItems.length ? 'Admin review desk' : order.currentLocation,
          items: remainingItems,
          cancelledItems: cancelledItem ? [...(order.cancelledItems || []), cancelledItem] : order.cancelledItems || [],
          subtotal: updatedSubtotal,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...order.timeline,
            createTimelineItem(
              'Item cancelled',
              cancelledItem
                ? `${cancelledItem.name} (Size ${cancelledItem.size}) was removed from the order and is awaiting admin confirmation.`
                : 'A product was removed from the order and is awaiting admin confirmation.',
            ),
          ],
        }
      })
    )
  }, [])

  const deleteOrder = useCallback((orderId) => {
    setOrders((currentOrders) => currentOrders.filter((order) => order.id !== orderId))
  }, [])

  const updateAdminOrder = useCallback((orderId, details) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
            ...order,
            status: details.status || ORDER_STATUS.OUT_FOR_DELIVERY,
            currentLocation: details.currentLocation || order.currentLocation,
            deliveryDate: details.deliveryDate || order.deliveryDate,
            adminNote: details.adminNote || order.adminNote,
            updatedAt: new Date().toISOString(),
            timeline: [
              ...order.timeline,
              createTimelineItem(
                details.status === ORDER_STATUS.DELIVERED
                  ? 'Delivered'
                  : details.status === ORDER_STATUS.SELLER_REVIEW
                    ? 'Cancellation confirmed'
                    : details.status === ORDER_STATUS.OUT_FOR_DELIVERY
                      ? 'Delivery scheduled'
                      : 'Moved by admin',
                details.adminNote ||
                (details.status === ORDER_STATUS.SELLER_REVIEW
                  ? 'Admin confirmed the cancellation and notified the seller.'
                  : details.status === ORDER_STATUS.OUT_FOR_DELIVERY
                    ? `Admin moved the order to delivery. Expected delivery: ${isValidDate(details.deliveryDate || order.deliveryDate)
                      ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(details.deliveryDate || order.deliveryDate))
                      : 'Not assigned yet'}`
                    : 'Admin moved the order to the next delivery step.'),
              ),
            ],
          }
          : order
      )
    )
  }, [])

  const sellerOrders = useMemo(
    () => orders.filter((order) => order.status === ORDER_STATUS.SELLER_REVIEW),
    [orders]
  )

  const adminOrders = useMemo(
    () => orders.filter((order) => order.status !== ORDER_STATUS.SELLER_REVIEW),
    [orders]
  )

  const value = useMemo(
    () => ({
      adminOrders,
      cancelOrder,
      cancelOrderItem,
      createOrder,
      deleteOrder,
      orders,
      sellerOrders,
      sendOrderToAdmin,
      updateAdminOrder,
    }),
    [adminOrders, cancelOrder, cancelOrderItem, createOrder, deleteOrder, orders, sellerOrders, sendOrderToAdmin, updateAdminOrder]
  )

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export default OrderProvider
