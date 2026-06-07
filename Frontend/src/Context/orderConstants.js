export const ORDER_STATUS = {
  SELLER_REVIEW: 'seller-review',
  ADMIN_REVIEW: 'admin-review',
  CANCELLATION_REVIEW: 'cancellation-review',
  OUT_FOR_DELIVERY: 'out-for-delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.SELLER_REVIEW]: 'Waiting for seller',
  [ORDER_STATUS.ADMIN_REVIEW]: 'With admin',
  [ORDER_STATUS.CANCELLATION_REVIEW]: 'Cancellation review',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Out for delivery',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
}
