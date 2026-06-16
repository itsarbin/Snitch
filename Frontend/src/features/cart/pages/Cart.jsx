import { useEffect, useState } from 'react'
import { useCart } from '../hook/useCart'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'


/* ─── Design tokens ─────────────────────────────────────────────────────────── */
const C = {
  bg: '#fdf9f3',
  espresso: '#3b1f0c',
  walnut: '#7b4a2d',
  caramel: '#c17a3f',
  sand: '#e8d5b7',
  outline: '#d4c3ba',
  faint: '#82746d',
  cream: '#fdf9f3',
  surface: '#f1ede7',
}

const garamond = "'EB Garamond', Georgia, serif"
const dmSans = "'DM Sans', system-ui, sans-serif"


/* ─── Helpers ────────────────────────────────────────────────────────────────── */
const cap = (s) => s ? String(s).charAt(0).toUpperCase() + String(s).slice(1) : ''

const formatPrice = (n) =>
  n == null ? '—' : `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0 })}`

const getVariantObj = (item) => {
  const product = item?.productId ?? item?.product
  if (!product || !item?.variantId) return null
  const v = product.variants
  if (!v) return null
  // After aggregation, variants is a single object (not an array)
  if (Array.isArray(v)) {
    return v.find(variant => variant._id === item.variantId || variant.id === item.variantId) || null
  }
  // Single variant object — check if it matches
  if (v._id === item.variantId || v.id === item.variantId) return v
  return null
}

const getVariantLabel = (item) => {
  if (!item) return ''
  const variant = getVariantObj(item)
  const parts = []
  const attrs = variant?.attributes ?? item?.attributes
  if (attrs) {
    Object.entries(attrs).forEach(([k, v]) => {
      parts.push(`${cap(k)}: ${cap(v)}`)
    })
  }
  if (item.size) parts.push(`Size: ${cap(item.size)}`)
  if (item.color) parts.push(`Color: ${cap(item.color)}`)
  if (item.variant?.size) parts.push(`Size: ${cap(item.variant.size)}`)
  if (item.variant?.color) parts.push(`Color: ${cap(item.variant.color)}`)
  return [...new Set(parts)].join('  ·  ')
}

const getItemPrice = (item) => {
  if (item?.price) {
    if (typeof item.price === 'object') return Number(item.price.amount ?? 0)
    return Number(item.price)
  }
  const variant = getVariantObj(item)
  if (variant?.price) {
    if (typeof variant.price === 'object') return Number(variant.price.amount ?? 0)
    return Number(variant.price)
  }
  const product = item?.productId ?? item?.product
  if (product?.price) {
    if (typeof product.price === 'object') return Number(product.price.amount ?? 0)
    return Number(product.price)
  }
  return null
}

const getItemImage = (item) => {
  const variant = getVariantObj(item)
  if (variant?.images?.length > 0) {
    const imgObj = variant.images[0]
    return typeof imgObj === 'object' ? imgObj.url : imgObj
  }
  const product = item?.productId ?? item?.product
  if (product?.images?.length > 0) {
    const imgObj = product.images[0]
    return typeof imgObj === 'object' ? imgObj.url : imgObj
  }
  const fallback = item?.image ?? item?.variant?.image ?? null
  if (fallback && typeof fallback === 'object') return fallback.url
  return fallback
}

const getItemName = (item) => {
  const product = item?.productId ?? item?.product
  return product?.title ?? product?.name ?? item?.name ?? item?.productName ?? 'Product'
}

/* ─── Trust badge SVGs ───────────────────────────────────────────────────────── */
const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.caramel} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
const TruckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.caramel} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <path d="M16 8h4l3 5v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
)
const ReturnIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.caramel} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-4.36" />
  </svg>
)

/* ═══════════════════════════════════════════════════════════════════════════════
   CART PAGE
═══════════════════════════════════════════════════════════════════════════════ */
const Cart = () => {
  const { handleGetCart, handleIncrementCartQuantity, handleDecrementCartQuantity, handleRemoveItemFromCart } = useCart()
  const navigate = useNavigate()
  const cartItems = useSelector((state) => state.cart.items)
  // console.log('Cart items from Redux:', cartItems)  // Debug log

  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState({})   // { [key]: true } per item
  const [hoverBack, setHoverBack] = useState(false)
  const [hoverChk, setHoverChk] = useState(false)
  const [hoverCont, setHoverCont] = useState(false)

  /* fetch on mount */
  useEffect(() => {
    const fetchCart = async () => {
      try {
        await handleGetCart()

      } catch (_) {
        /* handled in hook */
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
  }, [])

  /* ── quantity update ──────────────────────────────────────────────────── */
  const handleIncrementChange = async (item, delta) => {
    const key = item._id ?? item.variantId ?? item.productId


    setUpdating(prev => ({ ...prev, [key]: true }))
    try {
      const prodId = item.productId?._id ?? item.productId

      await handleIncrementCartQuantity(prodId, item.variantId)
      // re-sync Redux state from server
    } catch (err) {
      console.error('Failed to update qty:', err)
    } finally {
      setUpdating(prev => ({ ...prev, [key]: false }))
    }
  }

  const handleDecrementChange = async (item, delta) => {
    const key = item._id ?? item.variantId ?? item.productId


    setUpdating(prev => ({ ...prev, [key]: true }))
    try {
      const prodId = item.productId?._id ?? item.productId

      await handleDecrementCartQuantity(prodId, item.variantId)
      // re-sync Redux state from server
    } catch (err) {
      console.error('Failed to update qty:', err)
    } finally {
      setUpdating(prev => ({ ...prev, [key]: false }))
    }
  }

  /* ── remove item ─────────────────────────────────────────────────────── */
  const handleRemove = async (item) => {
    console.log('Removing item:', item)  // Debug log
    const key = item._id ?? item.variantId ?? item.productId
    setUpdating(prev => ({ ...prev, [key]: true }))
    try {
      const prodId = item.productId?._id ?? item.productId
      await handleRemoveItemFromCart(prodId, item.variantId)
    
    } catch (err) {
      console.error('Failed to remove item:', err)
      
    } finally {
      setUpdating(prev => ({ ...prev, [key]: false }))
    }
  }

  /* ── order totals ─────────────────────────────────────────────────────── */
  const subtotal = useSelector((state) => state.cart.totalPrice) || 0

  const tax = Math.round(subtotal * 0.05)
  const shipping = subtotal > 0 ? 0 : 0          // free shipping
  const total = subtotal + tax + shipping

  /* ════════════════════════════════ RENDER ══════════════════════════════ */
  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .snitch-btn-stepper:hover  { background: ${C.espresso} !important; color: ${C.cream} !important; }
        .snitch-remove:hover       { color: ${C.espresso} !important; }
        .snitch-item-row:hover .snitch-item-img { transform: scale(1.03); }
        .snitch-item-img           { transition: transform 0.35s ease; }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .snitch-cart-item { animation: fadeSlideUp 0.4s ease both; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        .snitch-skeleton { animation: pulse 1.4s ease infinite; background: ${C.sand}; border-radius: 4px; }
      `}</style>

      {/* ROOT */}
      <div style={{ background: C.bg, minHeight: '100vh', fontFamily: dmSans, color: C.espresso }}>

        {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
        <div style={{ paddingTop: '0' }}>
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '48px 64px',
            display: 'flex',
            gap: '48px',
            alignItems: 'flex-start',
          }}>

            {/* ══════════ LEFT — CART ITEMS ══════════ */}
            <div style={{ flex: '1.5', minWidth: 0 }}>
              {/* Back button */}
              <button
                id="cart-back-btn"
                onClick={() => navigate(-1)}
                onMouseEnter={() => setHoverBack(true)}
                onMouseLeave={() => setHoverBack(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: hoverBack ? C.caramel : C.espresso,
                  fontFamily: dmSans,
                  fontSize: '13px',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                  padding: '4px 0',
                  marginBottom: '16px',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back to shopping
              </button>

              {/* Section header */}
              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '16px' }}>
                <h1 style={{ fontFamily: garamond, fontSize: '36px', fontStyle: 'italic', fontWeight: 400, color: C.espresso, lineHeight: 1.1 }}>
                  Your Selection
                </h1>
                {!loading && (
                  <span style={{ fontFamily: dmSans, fontSize: '13px', color: C.walnut, marginLeft: '12px', fontWeight: 400 }}>
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>

              {/* Divider */}
              <div style={{ borderBottom: `1px solid ${C.sand}`, marginBottom: '8px' }} />

              {/* ── Loading skeletons ── */}
              {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ display: 'flex', gap: '16px', padding: '20px 0', borderBottom: `1px solid ${C.outline}` }}>
                      <div className="snitch-skeleton" style={{ width: '88px', height: '110px', flexShrink: 0 }} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '4px' }}>
                        <div className="snitch-skeleton" style={{ width: '55%', height: '18px' }} />
                        <div className="snitch-skeleton" style={{ width: '30%', height: '12px' }} />
                        <div className="snitch-skeleton" style={{ width: '90px', height: '28px', marginTop: '8px' }} />
                      </div>
                      <div className="snitch-skeleton" style={{ width: '60px', height: '20px', alignSelf: 'flex-start' }} />
                    </div>
                  ))}
                </div>
              )}

              {/* ── Empty state ── */}
              {!loading && cartItems.length === 0 && (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  {/* Bag icon */}
                  <div style={{ marginBottom: '24px', opacity: 0.25 }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={C.espresso} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                  </div>
                  <p style={{ fontFamily: garamond, fontSize: '28px', fontStyle: 'italic', color: C.espresso, marginBottom: '10px' }}>
                    Your cart is empty
                  </p>
                  <p style={{ fontFamily: dmSans, fontSize: '13px', color: C.walnut, marginBottom: '28px', fontWeight: 400 }}>
                    Looks like you haven't added anything yet.
                  </p>
                  <button
                    id="cart-start-shopping-btn"
                    onClick={() => navigate('/')}
                    style={{
                      background: C.espresso,
                      color: C.cream,
                      border: 'none',
                      fontFamily: dmSans,
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '14px 36px',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = C.walnut}
                    onMouseLeave={e => e.currentTarget.style.background = C.espresso}
                  >
                    Start Shopping
                  </button>
                </div>
              )}

              {/* ── Cart items list ── */}
              {!loading && cartItems.length > 0 && (
                <div>
                  {cartItems.map((item, idx) => {
                    const key = item._id ?? item.variantId ?? item.productId ?? idx
                    const name = getItemName(item)
                    const price = getItemPrice(item)
                    const image = getItemImage(item)
                    const variant = getVariantLabel(item)
                    const qty = item.quantity ?? 1
                    const isUpdating = updating[key]

                    return (
                      <div
                        key={key}
                        className="snitch-cart-item snitch-item-row"
                        style={{
                          display: 'flex',
                          gap: '16px',
                          padding: '20px 0',
                          borderBottom: `1px solid ${C.outline}`,
                          animationDelay: `${idx * 0.07}s`,
                          opacity: isUpdating ? 0.55 : 1,
                          transition: 'opacity 0.25s',
                        }}
                      >
                        {/* Product image */}
                        <div style={{ width: '88px', height: '110px', flexShrink: 0, background: C.surface, overflow: 'hidden' }}>
                          {image ? (
                            <img
                              className="snitch-item-img"
                              src={image}
                              alt={name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.outline} strokeWidth="1.4">
                                <rect x="3" y="3" width="18" height="18" rx="1" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                          {/* Top */}
                          <div>
                            <p style={{ fontFamily: garamond, fontSize: '18px', fontWeight: 500, color: C.espresso, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {name}
                            </p>
                            {variant && (
                              <p style={{ fontFamily: dmSans, fontSize: '11px', color: C.faint, fontWeight: 400, marginBottom: '0' }}>
                                {variant}
                              </p>
                            )}
                          </div>

                          {/* Bottom: stepper + remove */}
                          <div>
                            {/* Qty stepper */}
                            <div style={{ display: 'inline-flex', alignItems: 'center', border: `1px solid ${C.espresso}`, marginBottom: '8px' }}>
                              <button
                                id={`cart-qty-minus-${key}`}
                                className="snitch-btn-stepper"
                                onClick={() => handleDecrementChange(item, -1)}
                                disabled={isUpdating || qty <= 1}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  background: 'none',
                                  border: 'none',
                                  cursor: isUpdating || qty <= 1 ? 'not-allowed' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: isUpdating || qty <= 1 ? C.outline : C.espresso,
                                  fontSize: '16px',
                                  fontFamily: dmSans,
                                  transition: 'background 0.15s, color 0.15s',
                                }}
                              >
                                −
                              </button>
                              <span style={{
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontFamily: dmSans,
                                fontSize: '12px',
                                fontWeight: 500,
                                color: C.espresso,
                                borderLeft: `1px solid ${C.espresso}`,
                                borderRight: `1px solid ${C.espresso}`,
                              }}>
                                {qty}
                              </span>
                              <button
                                id={`cart-qty-plus-${key}`}
                                className="snitch-btn-stepper"
                                onClick={() => handleIncrementChange(item, 1)}
                                disabled={isUpdating}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  background: 'none',
                                  border: 'none',
                                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: C.espresso,
                                  fontSize: '16px',
                                  fontFamily: dmSans,
                                  transition: 'background 0.15s, color 0.15s',
                                }}
                              >
                                +
                              </button>
                            </div>

                            {/* Remove */}
                            <div>
                              <span
                                id={`cart-remove-${key}`}
                                className="snitch-remove"
                                onClick={() => !isUpdating && handleRemove(item)}
                                style={{
                                  fontFamily: dmSans,
                                  fontSize: '10px',
                                  fontWeight: 400,
                                  color: C.walnut,
                                  textDecoration: 'underline',
                                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                                  letterSpacing: '0.02em',
                                  transition: 'color 0.2s',
                                }}
                              >
                                Remove
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div style={{ marginLeft: 'auto', alignSelf: 'flex-start', paddingTop: '2px' }}>
                          <span style={{ fontFamily: garamond, fontSize: '20px', fontStyle: 'italic', fontWeight: 400, color: C.caramel, whiteSpace: 'nowrap' }}>
                            {price != null ? formatPrice(price * qty) : '—'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* ══════════ RIGHT — ORDER SUMMARY ══════════ */}
            <div style={{
              width: '360px',
              flexShrink: 0,
              position: 'sticky',
              top: '80px',
              background: C.sand,
              padding: '32px',
              alignSelf: 'flex-start',
            }}>
              {/* Heading */}
              <p style={{ fontFamily: garamond, fontSize: '22px', fontWeight: 500, color: C.espresso, marginBottom: '24px', letterSpacing: '0.01em' }}>
                Order Summary
              </p>

              {/* Line items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '0' }}>
                {/* Subtotal */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: dmSans, fontSize: '13px', color: C.walnut, fontWeight: 400 }}>Subtotal</span>
                  <span style={{ fontFamily: dmSans, fontSize: '13px', color: C.espresso, fontWeight: 500 }}>{formatPrice(subtotal)}</span>
                </div>

                {/* Shipping */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: dmSans, fontSize: '13px', color: C.walnut, fontWeight: 400 }}>Shipping</span>
                  <span style={{ fontFamily: dmSans, fontSize: '13px', color: C.caramel, fontWeight: 500 }}>Free</span>
                </div>

                {/* Tax */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: dmSans, fontSize: '13px', color: C.walnut, fontWeight: 400 }}>Tax (5%)</span>
                  <span style={{ fontFamily: dmSans, fontSize: '13px', color: C.espresso, fontWeight: 500 }}>{formatPrice(tax)}</span>
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderBottom: `1px solid ${C.espresso}`, margin: '16px 0' }} />

              {/* Total row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                <span style={{ fontFamily: dmSans, fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.walnut }}>
                  Total
                </span>
                <span style={{ fontFamily: garamond, fontSize: '28px', fontWeight: 500, color: C.espresso, lineHeight: 1 }}>
                  {formatPrice(total)}
                </span>
              </div>
              <p style={{ fontFamily: garamond, fontSize: '24px', fontStyle: 'italic', color: C.caramel, textAlign: 'right', marginBottom: '0' }}>
                {cartItems.length > 0 ? 'incl. all taxes' : ''}
              </p>

              {/* Checkout button */}
              <button
                id="cart-checkout-btn"
                onClick={() => navigate('/checkout')}
                disabled={cartItems.length === 0}
                onMouseEnter={() => setHoverChk(true)}
                onMouseLeave={() => setHoverChk(false)}
                style={{
                  width: '100%',
                  background: hoverChk && cartItems.length > 0 ? C.walnut : C.espresso,
                  color: C.cream,
                  border: 'none',
                  fontFamily: dmSans,
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '14px',
                  cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer',
                  marginTop: '20px',
                  opacity: cartItems.length === 0 ? 0.5 : 1,
                  transition: 'background 0.25s, opacity 0.2s',
                }}
              >
                Proceed to Checkout
              </button>

              {/* Continue shopping */}
              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <span
                  id="cart-continue-shopping-link"
                  onMouseEnter={() => setHoverCont(true)}
                  onMouseLeave={() => setHoverCont(false)}
                  onClick={() => navigate('/')}
                  style={{
                    fontFamily: dmSans,
                    fontSize: '12px',
                    color: hoverCont ? C.espresso : C.walnut,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: 400,
                    transition: 'color 0.2s',
                  }}
                >
                  Continue Shopping
                </span>
              </div>

              {/* Trust badges */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: `1px solid ${C.outline}`,
                justifyContent: 'space-around',
              }}>
                {[
                  { icon: <ShieldIcon />, label: 'Secure Pay' },
                  { icon: <TruckIcon />, label: 'Free Delivery' },
                  { icon: <ReturnIcon />, label: 'Easy Returns' },
                ].map(({ icon, label }) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                    {icon}
                    <span style={{ fontFamily: dmSans, fontSize: '10px', color: C.walnut, fontWeight: 400, letterSpacing: '0.03em', textAlign: 'center' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Cart