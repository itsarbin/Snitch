import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useProduct } from '../hook/useProduct'
import { useCart } from '../../cart/hook/useCart'


/* ── Icon helper ─────────────────────────────────────────────────── */
const Icon = ({ d, size = 18, stroke = 1.7, className = '', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
    className={className} style={style}>
    <path d={d} />
  </svg>
)

const ICONS = {
  back:    'M19 12H5M12 5l-7 7 7 7',
  cart:    'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0',
  plus:    'M12 5v14M5 12h14',
  minus:   'M5 12h14',
  truck:   'M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  refresh: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  shield:  'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  chevron: 'M9 18l6-6-6-6',
  img:     'M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z',
  layers:  'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  check:   'M20 6L9 17l-5-5',
  x:       'M18 6L6 18M6 6l12 12',
}

/* ── Skeleton ────────────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="animate-pulse w-full max-w-screen-xl mx-auto px-6 md:px-12 py-10">
    <div className="flex flex-col md:flex-row gap-10">
      <div className="w-full md:w-[55%]">
        <div className="w-full rounded-sm bg-[#111]" style={{ height: '85vh' }} />
      </div>
      <div className="flex-1 flex flex-col gap-4 pt-2">
        <div className="h-3 w-40 rounded bg-[#111]" />
        <div className="h-9 w-3/4 rounded bg-[#111]" />
        <div className="h-1 w-10 rounded bg-[#1a1a1a]" />
        <div className="h-10 w-32 rounded bg-[#111]" />
        <div className="h-3 w-full rounded bg-[#111]" />
        <div className="h-3 w-2/3 rounded bg-[#111]" />
        <div className="flex gap-3 mt-4">
          <div className="h-12 flex-1 rounded-sm bg-[#111]" />
          <div className="h-12 flex-1 rounded-sm bg-[#111]" />
        </div>
      </div>
    </div>
  </div>
)

/* ── Accordion ───────────────────────────────────────────────────── */
const Accordion = ({ label, children }) => {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #1a1a1a' }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left">
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#888' }}>{label}</span>
        <Icon d={ICONS.chevron} size={16}
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', color: '#555', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div className="pb-4 text-sm leading-relaxed" style={{ color: '#555' }}>
          {children}
        </div>
      )}
    </div>
  )
}

/* ── helpers ─────────────────────────────────────────────────────── */
// Capitalise first letter of each word
const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s

// Get all unique attribute keys across all variants
const getAttrKeys = (variants) => {
  const keys = new Set()
  variants.forEach(v => {
    if (v.attributes) Object.keys(v.attributes).forEach(k => keys.add(k))
  })
  return [...keys]
}

// Get all unique values for a given attribute key
const getValuesForKey = (variants, key) => {
  const vals = new Set()
  variants.forEach(v => {
    if (v.attributes?.[key]) vals.add(v.attributes[key])
  })
  return [...vals]
}

// Find variant matching currently selected attributes (partial match)
const findVariant = (variants, selected) => {
  const keys = Object.keys(selected).filter(k => selected[k])
  if (!keys.length) return null
  return variants.find(v =>
    keys.every(k => v.attributes?.[k] === selected[k])
  ) || null
}

/* ════════════════════════════════════════════════════════════════════
   PRODUCT DETAIL
════════════════════════════════════════════════════════════════════ */
const ProductDetail = () => {
  const { productId }          = useParams()
  const navigate               = useNavigate()
  const { handleProductDetails } = useProduct()

  const [product,        setProduct]        = useState(null)
  const [loading,        setLoading]        = useState(true)
  const [activeImg,      setActiveImg]      = useState(0)
  const [qty,            setQty]            = useState(1)
  const [imgErr,         setImgErr]         = useState({})
  // variant selection: { color: 'green', size: 'large' }
  const [selectedAttrs,  setSelectedAttrs]  = useState({})

  const {handleAddToCart} = useCart()

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const data = await handleProductDetails(productId)
        setProduct(data.product)
        setActiveImg(0)
        setSelectedAttrs({})
        setImgErr({})
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [productId])

  /* ── Derived state ── */
  const variants    = useMemo(() => product?.variants || [], [product])
  const attrKeys    = useMemo(() => getAttrKeys(variants), [variants])
  const activeVariant = useMemo(() => findVariant(variants, selectedAttrs), [variants, selectedAttrs])

  // Images: prefer variant's images if a variant is selected and has images
  const images = useMemo(() => {
    if (activeVariant?.images?.length) return activeVariant.images
    return product?.images || []
  }, [activeVariant, product])

  // Price: prefer variant price, fallback to product price
  const price = useMemo(() => {
    if (activeVariant?.price?.amount) return activeVariant.price
    return product?.price
  }, [activeVariant, product])

  // Stock
  const stock = activeVariant ? Number(activeVariant.stock ?? 0) : null
  const outOfStock = stock !== null && stock === 0

  const mainImg = images[activeImg]?.url

  const handleAttrSelect = (key, value) => {
    setSelectedAttrs(prev => {
      const next = { ...prev }
      if (next[key] === value) {
        delete next[key]  // deselect if same
      } else {
        next[key] = value
      }
      return next
    })
    setActiveImg(0)
    setImgErr({})
  }

  /* ── Loading ── */
  if (loading) return (
    <div style={{ backgroundColor: '#060606', minHeight: '100vh' }}>
      <div className="h-14 border-b" style={{ borderColor: '#161616', backgroundColor: 'rgba(6,6,6,0.9)' }} />
      <Skeleton />
    </div>
  )

  /* ── Not found ── */
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ backgroundColor: '#060606', color: '#f0f0f0' }}>
      <Icon d={ICONS.img} size={48} className="opacity-10" />
      <p className="text-sm" style={{ color: '#555' }}>Product not found</p>
      <button onClick={() => navigate(-1)}
        className="text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-sm"
        style={{ backgroundColor: '#F5C518', color: '#000' }}>
        Go Back
      </button>
    </div>
  )

  return (
    <div style={{ backgroundColor: '#060606', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#f0f0f0' }}>

      {/* ══ NAVBAR ══════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-12 h-14"
        style={{ backgroundColor: 'rgba(6,6,6,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #161616' }}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)}
            className="flex items-center justify-center w-8 h-8 rounded-sm transition-colors hover:bg-white/5"
            style={{ border: '1px solid #222' }}>
            <Icon d={ICONS.back} size={15} style={{ color: '#888' }} />
          </button>
          <span className="text-[10px] font-black tracking-[0.28em] uppercase px-2 py-0.5 rounded-sm"
            style={{ color: '#F5C518', border: '1px solid rgba(245,197,24,0.35)' }}>
            Snitch
          </span>
        </div>
        <button className="opacity-50 hover:opacity-100 transition-opacity">
          <Icon d={ICONS.cart} size={20} />
        </button>
      </nav>

      {/* ══ CONTENT ═════════════════════════════════════════════════ */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-8 md:py-12">

        {/* Breadcrumb */}
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-8" style={{ color: '#333' }}>
          <span className="cursor-pointer hover:text-[#F5C518] transition-colors" onClick={() => navigate('/')}>Home</span>
          {' / '}
          <span className="cursor-pointer hover:text-[#F5C518] transition-colors" onClick={() => navigate('/')}>Products</span>
          {' / '}
          <span style={{ color: '#555' }}>{product.title}</span>
        </p>

        {/* ── Two-column layout ── */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">

          {/* ════ LEFT — Gallery ════════════════════════════════════ */}
          <div className="w-full md:w-[55%] flex flex-row gap-3">

            {/* Vertical thumbnail strip */}
            {images.length > 1 && (
              <div className="flex flex-col gap-2 flex-shrink-0"
                style={{ width: '72px', height: '85vh', overflowY: 'auto', scrollbarWidth: 'none' }}>
                {images.map((img, i) => (
                  <button key={img._id || i} onClick={() => setActiveImg(i)}
                    className="flex-shrink-0 overflow-hidden rounded-sm transition-all duration-200"
                    style={{
                      width: '72px', height: '72px',
                      border: `1px solid ${i === activeImg ? '#F5C518' : '#1a1a1a'}`,
                      backgroundColor: '#0a0a0a',
                      boxShadow: i === activeImg ? '0 0 0 1px rgba(245,197,24,0.25)' : 'none',
                      flexShrink: 0,
                    }}>
                    {!imgErr[`t${i}`] ? (
                      <img src={img.url} alt={`view ${i + 1}`} className="w-full h-full object-cover"
                        onError={() => setImgErr(p => ({ ...p, [`t${i}`]: true }))} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon d={ICONS.img} size={18} className="opacity-10" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="group relative flex-1 overflow-hidden rounded-sm"
              style={{ height: '85vh', backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a' }}>
              {mainImg && !imgErr[`main${activeImg}`] ? (
                <img key={`${activeVariant?._id}-${activeImg}`}
                  src={mainImg} alt={product.title}
                  className="w-full h-full transition-opacity duration-300"
                  style={{ objectFit: 'contain', objectPosition: 'center' }}
                  onError={() => setImgErr(p => ({ ...p, [`main${activeImg}`]: true }))} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon d={ICONS.img} size={56} className="opacity-10" />
                </div>
              )}

              {/* Out of stock overlay */}
              {outOfStock && (
                <div className="absolute inset-0 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
                  <span className="text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-sm"
                    style={{ backgroundColor: '#1a0a0a', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}>
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Prev / Next */}
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                    <Icon d="M15 18l-6-6 6-6" size={16} style={{ color: '#f0f0f0' }} />
                  </button>
                  <button onClick={() => setActiveImg(i => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                    <Icon d="M9 18l6-6-6-6" size={16} style={{ color: '#f0f0f0' }} />
                  </button>
                </>
              )}

              {/* Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 text-[10px] font-semibold px-2 py-1 rounded-sm"
                  style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: '#777', backdropFilter: 'blur(4px)' }}>
                  {activeImg + 1} / {images.length}
                </div>
              )}

              {/* Variant badge */}
              {activeVariant && (
                <div className="absolute top-3 left-3 text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-sm"
                  style={{ backgroundColor: 'rgba(245,197,24,0.15)', color: '#F5C518', border: '1px solid rgba(245,197,24,0.3)', backdropFilter: 'blur(4px)' }}>
                  Variant View
                </div>
              )}
            </div>
          </div>

          {/* ════ RIGHT — Info ══════════════════════════════════════ */}
          <div className="flex-1 flex flex-col gap-5 md:pt-2">

            {/* Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-3"
                style={{ fontFamily: "'Playfair Display', serif", color: '#f5f5f5', letterSpacing: '-0.01em' }}>
                {product.title}
              </h1>
              <div className="w-10 h-[2px]" style={{ backgroundColor: '#F5C518' }} />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold leading-none transition-all duration-200"
                style={{ color: '#F5C518', fontFamily: "'Playfair Display', serif" }}>
                ₹{Number(price?.amount || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#444' }}>
                {price?.currency || 'INR'}
              </span>
              {/* Stock badge */}
              {activeVariant && (
                <span className="ml-2 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: outOfStock ? '#2a0f0f' : '#0f2a1a',
                    color: outOfStock ? '#f87171' : '#4ade80',
                    border: `1px solid ${outOfStock ? 'rgba(248,113,113,0.25)' : 'rgba(74,222,128,0.25)'}`,
                  }}>
                  {outOfStock ? 'Out of Stock' : `${stock} in stock`}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed" style={{ color: '#666', lineHeight: 1.9 }}>
              {product.description}
            </p>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: '#1a1a1a' }} />

            {/* ══ VARIANT SELECTOR ══════════════════════════════════ */}
            {attrKeys.length > 0 && (
              <div className="flex flex-col gap-5">
                {attrKeys.map(key => {
                  const values = getValuesForKey(variants, key)
                  const selected = selectedAttrs[key]
                  return (
                    <div key={key}>
                      {/* Attribute label */}
                      <div className="flex items-center gap-2 mb-3">
                        <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: '#555' }}>
                          {cap(key)}
                        </p>
                        {selected && (
                          <span className="text-[10px] font-semibold" style={{ color: '#F5C518' }}>
                            — {cap(selected)}
                          </span>
                        )}
                      </div>

                      {/* Value buttons */}
                      <div className="flex flex-wrap gap-2">
                        {values.map(val => {
                          const isSelected = selected === val
                          // Check if selecting this val with current selections would yield an in-stock variant
                          const testAttrs = { ...selectedAttrs, [key]: val }
                          const testVariant = findVariant(variants, testAttrs)
                          const isUnavailable = testVariant && Number(testVariant.stock) === 0

                          // Special rendering for colors
                          const looksLikeColor = ['red','green','blue','black','white','brown','gray','grey',
                            'pink','purple','orange','yellow','beige','navy','maroon','cyan','teal'].includes(val.toLowerCase())

                          if (looksLikeColor) {
                            return (
                              <button key={val} onClick={() => handleAttrSelect(key, val)}
                                className="relative flex-shrink-0 rounded-full transition-all duration-200"
                                title={cap(val)}
                                style={{
                                  width: '32px', height: '32px',
                                  backgroundColor: val.toLowerCase(),
                                  border: isSelected ? '2px solid #F5C518' : '2px solid transparent',
                                  boxShadow: isSelected ? '0 0 0 1px #F5C518, 0 0 8px rgba(245,197,24,0.3)' : '0 0 0 1px #2a2a2a',
                                  opacity: isUnavailable ? 0.35 : 1,
                                }}>
                                {isSelected && (
                                  <span className="absolute inset-0 flex items-center justify-center">
                                    <Icon d={ICONS.check} size={14} style={{ color: val.toLowerCase() === 'white' || val.toLowerCase() === 'yellow' ? '#000' : '#fff' }} />
                                  </span>
                                )}
                                {isUnavailable && !isSelected && (
                                  <span className="absolute inset-0 flex items-center justify-center">
                                    <Icon d={ICONS.x} size={10} style={{ color: 'rgba(255,255,255,0.5)' }} />
                                  </span>
                                )}
                              </button>
                            )
                          }

                          return (
                            <button key={val} onClick={() => handleAttrSelect(key, val)}
                              className="px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-sm transition-all duration-200"
                              style={{
                                border: `1px solid ${isSelected ? '#F5C518' : '#222'}`,
                                backgroundColor: isSelected ? 'rgba(245,197,24,0.1)' : '#0f0f0f',
                                color: isSelected ? '#F5C518' : isUnavailable ? '#333' : '#888',
                                boxShadow: isSelected ? '0 0 8px rgba(245,197,24,0.15)' : 'none',
                                textDecoration: isUnavailable && !isSelected ? 'line-through' : 'none',
                              }}>
                              {cap(val)}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}

                {/* Clear selection */}
                {Object.keys(selectedAttrs).length > 0 && (
                  <button onClick={() => { setSelectedAttrs({}); setActiveImg(0); setImgErr({}) }}
                    className="self-start text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-opacity hover:opacity-70"
                    style={{ color: '#444' }}>
                    <Icon d={ICONS.x} size={11} />
                    Clear selection
                  </button>
                )}

                <div style={{ height: '1px', backgroundColor: '#1a1a1a' }} />
              </div>
            )}

            {/* Quantity */}
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: '#444' }}>Quantity</p>
              <div className="flex items-center gap-0">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="flex items-center justify-center w-10 h-10 transition-colors hover:bg-white/5"
                  style={{ border: '1px solid #222', borderRadius: '2px 0 0 2px' }}>
                  <Icon d={ICONS.minus} size={14} style={{ color: '#888' }} />
                </button>
                <div className="flex items-center justify-center w-12 h-10 text-sm font-semibold"
                  style={{ border: '1px solid #222', borderLeft: 'none', borderRight: 'none' }}>
                  {qty}
                </div>
                <button onClick={() => setQty(q => q + 1)}
                  className="flex items-center justify-center w-10 h-10 transition-colors hover:bg-white/5"
                  style={{ border: '1px solid #222', borderRadius: '0 2px 2px 0' }}>
                  <Icon d={ICONS.plus} size={14} style={{ color: '#888' }} />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 mt-1">
              <button
                disabled={outOfStock}
                className="flex-1 flex items-center justify-center gap-2 h-12 text-xs font-bold tracking-widest uppercase rounded-sm transition-all duration-200 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                onclick={()=>{
                  handleAddToCart(product._id, activeVariant._id)
                }}
                style={{ border: '1px solid #f0f0f0', color: '#f0f0f0' }}>
                <Icon d={ICONS.cart} size={14} />
                Add to Cart
              </button>
              <button
                disabled={outOfStock}
                className="flex-1 flex items-center justify-center h-12 text-xs font-bold tracking-widest uppercase rounded-sm transition-opacity duration-200 hover:opacity-85 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#F5C518', color: '#000' }}>
                {outOfStock ? 'Out of Stock' : 'Buy Now'}
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-between pt-1 pb-2">
              {[
                { icon: ICONS.truck,   label: 'Free Shipping' },
                { icon: ICONS.refresh, label: 'Easy Returns'  },
                { icon: ICONS.shield,  label: 'Secure Payment'},
              ].map(b => (
                <div key={b.label} className="flex flex-col items-center gap-1.5">
                  <Icon d={b.icon} size={17} style={{ color: '#F5C518', opacity: 0.8 }} />
                  <span className="text-[9px] font-semibold tracking-widest uppercase text-center" style={{ color: '#444' }}>
                    {b.label}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ height: '1px', backgroundColor: '#1a1a1a' }} />

            {/* Accordions */}
            <div>
              <Accordion label="Product Details">
                <p>Premium quality materials. Handcrafted with attention to detail.</p>
                <ul className="mt-2 flex flex-col gap-1 list-disc list-inside">
                  <li>ID: {product._id}</li>
                  <li>Seller verified ✓</li>
                  {activeVariant && <li>SKU: {activeVariant.sku || activeVariant._id}</li>}
                  <li>High-resolution imagery included</li>
                </ul>
              </Accordion>
              <Accordion label="Shipping Info">
                <p>Free shipping on all orders. Delivered in 3–7 business days.</p>
                <p className="mt-1">Express delivery available at checkout.</p>
              </Accordion>
            </div>
          </div>
        </div>

        {/* ══ VARIANTS SECTION ══════════════════════════════════════ */}
        {variants.length > 0 && (
          <div className="mt-16">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-[2px]" style={{ backgroundColor: '#F5C518' }} />
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: '#555' }}>
                Available Variants
              </p>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm"
                style={{ backgroundColor: '#111', color: '#444', border: '1px solid #1a1a1a' }}>
                {variants.length}
              </span>
            </div>

            <div style={{ height: '1px', backgroundColor: '#161616', marginBottom: '24px' }} />

            {/* Variants grid */}
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {variants.map(v => {
                const vAttrs = v.attributes ? Object.entries(v.attributes) : []
                const vPrice = v.price?.amount ? v.price : product.price
                const vImages = v.images?.length ? v.images : product.images || []
                const vStock  = Number(v.stock ?? 0)
                const isActive = activeVariant?._id === v._id
                const isOos    = vStock === 0

                return (
                  <div key={v._id}
                    onClick={() => {
                      // Select all attributes of this variant at once
                      if (v.attributes) {
                        setSelectedAttrs({ ...v.attributes })
                        setActiveImg(0)
                        setImgErr({})
                      }
                    }}
                    className="flex gap-4 p-4 rounded-sm cursor-pointer transition-all duration-200 hover:translate-y-[-1px]"
                    style={{
                      backgroundColor: '#0f0f0f',
                      border: `1px solid ${isActive ? '#F5C518' : '#1a1a1a'}`,
                      borderLeft: `3px solid ${isActive ? '#F5C518' : '#2a2a2a'}`,
                      boxShadow: isActive ? '0 0 16px rgba(245,197,24,0.08)' : 'none',
                      opacity: isOos ? 0.6 : 1,
                    }}>

                    {/* Variant thumbnail */}
                    <div className="flex-shrink-0 rounded-sm overflow-hidden"
                      style={{ width: '72px', height: '88px', backgroundColor: '#080808', border: '1px solid #1a1a1a' }}>
                      {vImages[0]?.url ? (
                        <img src={vImages[0].url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon d={ICONS.img} size={20} className="opacity-10" />
                        </div>
                      )}
                    </div>

                    {/* Variant info */}
                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                      {/* Attribute chips */}
                      <div className="flex flex-wrap gap-1.5">
                        {vAttrs.map(([k, val]) => {
                          const isColor = ['red','green','blue','black','white','brown','gray','grey',
                            'pink','purple','orange','yellow','beige','navy','maroon','cyan','teal'].includes(val.toLowerCase())
                          return (
                            <span key={k} className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: '#1a1a1a', color: '#888', border: '1px solid #242424' }}>
                              {isColor && (
                                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 inline-block"
                                  style={{ backgroundColor: val.toLowerCase(), border: '1px solid rgba(255,255,255,0.15)' }} />
                              )}
                              {cap(k)}: {cap(val)}
                            </span>
                          )
                        })}
                      </div>

                      {/* Price */}
                      <p className="text-base font-bold" style={{ color: '#F5C518' }}>
                        ₹{Number(vPrice?.amount || 0).toLocaleString('en-IN')}
                        <span className="text-[10px] font-normal ml-1" style={{ color: '#444' }}>{vPrice?.currency || 'INR'}</span>
                      </p>

                      {/* Stock */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: isOos ? '#2a0f0f' : '#0f2a1a',
                            color: isOos ? '#f87171' : '#4ade80',
                            border: `1px solid ${isOos ? 'rgba(248,113,113,0.2)' : 'rgba(74,222,128,0.2)'}`,
                          }}>
                          {isOos ? 'Out of Stock' : `${vStock} in stock`}
                        </span>
                        {isActive && (
                          <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: '#F5C518' }}>
                            Selected ✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ══ FOOTER ══════════════════════════════════════════════════ */}
      <footer className="mt-16 px-6 md:px-12 py-5 flex items-center justify-between flex-wrap gap-3"
        style={{ borderTop: '1px solid #111', backgroundColor: '#060606' }}>
        <span className="text-[10px] font-black tracking-[0.25em] uppercase px-2 py-0.5 rounded-sm"
          style={{ color: '#F5C518', border: '1px solid rgba(245,197,24,0.25)' }}>
          Snitch
        </span>
        <p className="text-[10px]" style={{ color: '#2a2a2a', letterSpacing: '0.1em' }}>
          © 2026 Snitch. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default ProductDetail