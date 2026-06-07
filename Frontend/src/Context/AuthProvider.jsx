import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const AUTH_TOKEN_KEY = 'cartify-auth-token'
const AUTH_USERS_KEY = 'cartify-users'
const DEFAULT_USERS = [
    {
        id: 'buyer-1',
        name: 'Cartify Shopper',
        email: 'buyer@cartify.com',
        password: 'Buyer123',
        role: 'buyer',
    },
    {
        id: 'seller-1',
        name: 'Cartify Seller',
        email: 'seller@cartify.com',
        password: 'Seller123',
        role: 'seller',
    },
    {
        id: 'admin-1',
        name: 'Cartify Admin',
        email: 'admin@cartify.com',
        password: 'Admin123',
        role: 'admin',
    },
]

const encodeBase64 = (value) => {
    try {
        return btoa(unescape(encodeURIComponent(value)))
    } catch {
        return ''
    }
}

const decodeBase64 = (value) => {
    try {
        return decodeURIComponent(escape(atob(value)))
    } catch {
        return ''
    }
}

const createJwt = ({ name, email, role }) => {
    const header = encodeBase64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const issuedAt = Math.floor(Date.now() / 1000)
    const expiresAt = issuedAt + 60 * 60
    const payload = encodeBase64(
        JSON.stringify({ name, email, role, iat: issuedAt, exp: expiresAt, iss: 'cartify' })
    )
    const signature = encodeBase64(`cartify-secret.${header}.${payload}`)
    return `${header}.${payload}.${signature}`
}

const decodeJwt = (token) => {
    if (!token || typeof token !== 'string') return null
    const [_, payload] = token.split('.')
    if (!payload) return null
    try {
        return JSON.parse(decodeBase64(payload))
    } catch {
        return null
    }
}

const getStoredUsers = () => {
    try {
        const stored = localStorage.getItem(AUTH_USERS_KEY)
        if (!stored) return DEFAULT_USERS
        const parsed = JSON.parse(stored)
        return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_USERS
    } catch {
        return DEFAULT_USERS
    }
}

const saveUsers = (users) => {
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users))
}

const getStoredToken = () => {
    try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY)
        const payload = decodeJwt(token)
        if (!payload || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
            localStorage.removeItem(AUTH_TOKEN_KEY)
            return null
        }
        return token
    } catch {
        return null
    }
}

const AuthContext = createContext({
    user: null,
    token: null,
    isAuthenticated: false,
    login: async () => { },
    signup: async () => { },
    logout: () => { },
})

export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(getStoredToken)
    const [user, setUser] = useState(() => {
        const storedToken = getStoredToken()
        return storedToken ? decodeJwt(storedToken) : null
    })

    useEffect(() => {
        if (!token) {
            setUser(null)
            localStorage.removeItem(AUTH_TOKEN_KEY)
            return
        }
        const payload = decodeJwt(token)
        if (!payload) {
            setUser(null)
            setToken(null)
            localStorage.removeItem(AUTH_TOKEN_KEY)
            return
        }
        setUser(payload)
        localStorage.setItem(AUTH_TOKEN_KEY, token)
    }, [token])

    const login = useCallback(async ({ email, password }) => {
        const users = getStoredUsers()
        const account = users.find((userAccount) => userAccount.email.toLowerCase() === email.toLowerCase())
        if (!account) {
            throw new Error('No account found for this email address.')
        }
        if (account.password !== password) {
            throw new Error('Invalid password. Please try again.')
        }
        const authToken = createJwt(account)
        setToken(authToken)
        return authToken
    }, [])

    const signup = useCallback(async ({ name, email, password, role }) => {
        const users = getStoredUsers()
        const normalizedEmail = email.toLowerCase()
        if (users.some((existing) => existing.email.toLowerCase() === normalizedEmail)) {
            throw new Error('An account already exists with this email address.')
        }
        const newAccount = {
            id: `user-${Date.now()}`,
            name: name.trim() || 'Cartify User',
            email: normalizedEmail,
            password,
            role: role || 'buyer',
        }
        const nextUsers = [newAccount, ...users]
        saveUsers(nextUsers)
        const authToken = createJwt(newAccount)
        setToken(authToken)
        return authToken
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUser(null)
        localStorage.removeItem(AUTH_TOKEN_KEY)
    }, [])

    const value = useMemo(
        () => ({
            user,
            token,
            isAuthenticated: Boolean(user),
            login,
            signup,
            logout,
        }),
        [login, logout, signup, token, user]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
