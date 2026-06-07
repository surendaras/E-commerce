export const LAST_SHOPPING_PATH_KEY = 'shopper-last-shopping-path'

export const getLocationPath = (location) =>
  `${location.pathname}${location.search}${location.hash}`

export const isShoppingPath = (path) => {
  const pathname = path.split(/[?#]/)[0]

  return (
    pathname === '/' ||
    pathname === '/mens' ||
    pathname === '/womens' ||
    pathname === '/kids' ||
    pathname.startsWith('/product/')
  )
}

export const getRememberedShoppingPath = () => {
  try {
    const rememberedPath = sessionStorage.getItem(LAST_SHOPPING_PATH_KEY)

    return rememberedPath && isShoppingPath(rememberedPath) ? rememberedPath : '/'
  } catch {
    return '/'
  }
}

export const getCartReturnPath = (fromPath) =>
  fromPath && isShoppingPath(fromPath) ? fromPath : getRememberedShoppingPath()
