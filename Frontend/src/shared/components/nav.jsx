import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router'
import { useCart } from '../../features/cart/hook/useCart'

const C = {
  bg:          '#fdf9f3',
  espresso:    '#3b1f0c',
  walnut:      '#7b4a2d',
  caramel:     '#c17a3f',
  sand:        '#e8d5b7',
  outline:     '#d4c3ba',
  faint:       '#82746d',
  serif:       "'EB Garamond', Georgia, serif",
  sans:        "'DM Sans', system-ui, sans-serif",
}

export default function Nav() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const cartItems = useSelector((state) => state.cart.items)
  const { handleGetCart } = useCart()
  const [hoverCart, setHoverCart] = useState(false)
  const [hoverUser, setHoverUser] = useState(false)

  // Fetch cart on mount if user is logged in
  useEffect(() => {
    if (user) {
      handleGetCart().catch((err) => console.log('Cart fetch failed:', err))
    }
  }, [user])

  // Count total items in the cart
  const cartCount = cartItems?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0

  return (
    <>
      {/* Ensure Google Fonts are injected if not already */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
      `}</style>
      
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(253,249,243,0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${C.sand}`,
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 64px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo / Brand */}
          <Link
            to="/"
            style={{
              fontFamily: C.serif,
              fontSize: '26px',
              fontWeight: 400,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: C.espresso,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Snitch
          </Link>

          {/* Right side: User name & Cart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {/* User info */}
            {user ? (
              <span
                onClick={() => {
                  if (user.role === 'seller') {
                    navigate('/seller/dashboard')
                  }
                }}
                onMouseEnter={() => setHoverUser(true)}
                onMouseLeave={() => setHoverUser(false)}
                style={{
                  fontFamily: C.sans,
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  color: hoverUser ? C.caramel : C.espresso,
                  cursor: user.role === 'seller' ? 'pointer' : 'default',
                  transition: 'color 0.2s',
                }}
              >
                {user.fullName}
                {user.role === 'seller' && ' (Seller)'}
              </span>
            ) : (
              <Link
                to="/login"
                onMouseEnter={() => setHoverUser(true)}
                onMouseLeave={() => setHoverUser(false)}
                style={{
                  fontFamily: C.sans,
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  color: hoverUser ? C.caramel : C.espresso,
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
              >
                Sign In
              </Link>
            )}

            {/* Cart Icon */}
            <Link
              to="/cart"
              onMouseEnter={() => setHoverCart(true)}
              onMouseLeave={() => setHoverCart(false)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                color: hoverCart ? C.caramel : C.espresso,
                transition: 'color 0.2s',
              }}
            >
              {/* Bag SVG Icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>

              {/* Cart Badge */}
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  background: C.caramel,
                  color: '#fdf9f3',
                  fontFamily: C.sans,
                  fontSize: '9px',
                  fontWeight: 700,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}
