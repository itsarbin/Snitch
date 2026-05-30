import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useProduct } from '../hook/useProduct'

/* ── Icon helper ─────────────────────────────────────────────────── */
const Icon = ({ d, size = 18, stroke = 1.7, className = '' }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    <path d={d} />
  </svg>
)

const ICONS = {
  back:     'M19 12H5M12 5l-7 7 7 7',
  cart:     'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0',
  plus:     'M12 5v14M5 12h14',
  minus:    'M5 12h14',
  truck:    'M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  refresh:  'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  shield:   'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  chevron:  'M9 18l6-6-6-6',
  img:      'M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z',
}

/* ── Skeleton ────────────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="animate-pulse w-full max-w-screen-xl mx-auto px-6 md:px-12 py-10">
    <div className="flex flex-col md:flex-row gap-10">
      {/* image skeleton */}
      <div className="w-full md:w-[55%]">
        <div className="w-full rounded-sm bg-[#111]" style={{ height: '85vh' }} />
        <div className="flex gap-3 mt-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-20 h-20 rounded-sm bg-[#111] flex-shrink-0" />
          ))}
        </div>
      </div>
      {/* info skeleton */}
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

/* ── Accordion row ───────────────────────────────────────────────── */
const Accordion = ({ label, children }) => {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #1a1a1a' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#888' }}>
          {label}
        </span>
        <Icon
          d={ICONS.chevron} size={16}
          className="transition-transform duration-300"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', color: '#555' }}
        />
      </button>
      {open && (
        <div className="pb-4 text-sm leading-relaxed" style={{ color: '#555' }}>
          {children}
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   PRODUCT DETAIL
════════════════════════════════════════════════════════════════════ */
const ProductDetail = () => {
  const { productId }          = useParams()
  const navigate               = useNavigate()
  const { handleProductDetails } = useProduct()

  const [product,    setProduct]    = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [activeImg,  setActiveImg]  = useState(0)
  const [qty,        setQty]        = useState(1)
  const [imgErr,     setImgErr]     = useState({})

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const data = await handleProductDetails(productId)
        setProduct(data.product)
        setActiveImg(0)
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [productId])

  /* ── Loading ── */
  if (loading) return (
    <div style={{ backgroundColor: '#060606', minHeight: '100vh' }}>
      {/* minimal nav while loading */}
      <div className="h-14 border-b" style={{ borderColor: '#161616', backgroundColor: 'rgba(6,6,6,0.9)' }} />
      <Skeleton />
    </div>
  )

  /* ── Not found ── */
  if (!product) return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ backgroundColor: '#060606', color: '#f0f0f0' }}
    >
      <Icon d={ICONS.img} size={48} className="opacity-10" />
      <p className="text-sm" style={{ color: '#555' }}>Product not found</p>
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-sm"
        style={{ backgroundColor: '#F5C518', color: '#000' }}
      >
        Go Back
      </button>
    </div>
  )

  const images  = product.images || []
  const mainImg = images[activeImg]?.url

  return (
    <div style={{ backgroundColor: '#060606', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#f0f0f0' }}>

      {/* ══ NAVBAR ══════════════════════════════════════════════════ */}
      <nav
        className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-12 h-14"
        style={{ backgroundColor: 'rgba(6,6,6,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #161616' }}
      >
        {/* back + logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-8 h-8 rounded-sm transition-colors hover:bg-white/5"
            style={{ border: '1px solid #222' }}
          >
            <Icon d={ICONS.back} size={15} style={{ color: '#888' }} />
          </button>
          <span
            className="text-[10px] font-black tracking-[0.28em] uppercase px-2 py-0.5 rounded-sm"
            style={{ color: '#F5C518', border: '1px solid rgba(245,197,24,0.35)' }}
          >
            Snitch
          </span>
        </div>

        {/* cart */}
        <button className="opacity-50 hover:opacity-100 transition-opacity">
          <Icon d={ICONS.cart} size={20} />
        </button>
      </nav>

      {/* ══ CONTENT ═════════════════════════════════════════════════ */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-8 md:py-12">

        {/* Breadcrumb */}
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-8" style={{ color: '#333' }}>
          <span
            className="cursor-pointer hover:text-[#F5C518] transition-colors"
            onClick={() => navigate('/')}
          >
            Home
          </span>
          {' / '}
          <span className="cursor-pointer hover:text-[#F5C518] transition-colors" onClick={() => navigate('/')}>
            Products
          </span>
          {' / '}
          <span style={{ color: '#555' }}>{product.title}</span>
        </p>

        {/* ── Two-column layout ── */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">

          {/* ════ LEFT — Gallery ════════════════════════════════════ */}
          <div className="w-full md:w-[55%] flex flex-row gap-3">

            {/* ── Vertical thumbnail strip (LEFT of main image) ── */}
            {images.length > 1 && (
              <div
                className="flex flex-col gap-2 flex-shrink-0"
                style={{ width: '72px', height: '85vh', overflowY: 'auto', scrollbarWidth: 'none' }}
              >
                {images.map((img, i) => (
                  <button
                    key={img._id}
                    onClick={() => setActiveImg(i)}
                    className="flex-shrink-0 overflow-hidden rounded-sm transition-all duration-200"
                    style={{
                      width: '72px', height: '72px',
                      border: `1px solid ${i === activeImg ? '#F5C518' : '#1a1a1a'}`,
                      backgroundColor: '#0a0a0a',
                      boxShadow: i === activeImg ? '0 0 0 1px rgba(245,197,24,0.25)' : 'none',
                      flexShrink: 0,
                    }}
                  >
                    {!imgErr[i] ? (
                      <img
                        src={img.url} alt={`view ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={() => setImgErr(p => ({ ...p, [i]: true }))}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon d={ICONS.img} size={18} className="opacity-10" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* ── Main image (RIGHT of thumbnails) ── */}
            <div
              className="group relative flex-1 overflow-hidden rounded-sm"
              style={{ height: '85vh', backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a' }}
            >
              {mainImg && !imgErr[activeImg] ? (
                <img
                  key={activeImg}
                  src={mainImg}
                  alt={product.title}
                  className="w-full h-full transition-opacity duration-300"
                  style={{ objectFit: 'contain', objectPosition: 'center' }}
                  onError={() => setImgErr(p => ({ ...p, [activeImg]: true }))}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon d={ICONS.img} size={56} className="opacity-10" />
                </div>
              )}

              {/* ← Prev */}
              {images.length > 1 && (
                <button
                  onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
                >
                  <Icon d="M15 18l-6-6 6-6" size={16} style={{ color: '#f0f0f0' }} />
                </button>
              )}

              {/* → Next */}
              {images.length > 1 && (
                <button
                  onClick={() => setActiveImg(i => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
                >
                  <Icon d="M9 18l6-6-6-6" size={16} style={{ color: '#f0f0f0' }} />
                </button>
              )}

              {/* counter */}
              {images.length > 1 && (
                <div
                  className="absolute bottom-3 right-3 text-[10px] font-semibold px-2 py-1 rounded-sm"
                  style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: '#777', backdropFilter: 'blur(4px)' }}
                >
                  {activeImg + 1} / {images.length}
                </div>
              )}
            </div>

          </div>

          {/* ════ RIGHT — Info ══════════════════════════════════════ */}
          <div className="flex-1 flex flex-col gap-5 md:pt-2">

            {/* Title */}
            <div>
              <h1
                className="text-3xl lg:text-4xl font-bold leading-tight mb-3"
                style={{ fontFamily: "'Playfair Display', serif", color: '#f5f5f5', letterSpacing: '-0.01em' }}
              >
                {product.title}
              </h1>
              {/* gold accent line */}
              <div className="w-10 h-[2px]" style={{ backgroundColor: '#F5C518' }} />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span
                className="text-4xl font-bold leading-none"
                style={{ color: '#F5C518', fontFamily: "'Playfair Display', serif" }}
              >
                ₹{Number(product.price?.amount).toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#444' }}>
                {product.price?.currency || 'INR'}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed" style={{ color: '#666', lineHeight: 1.9 }}>
              {product.description}
            </p>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: '#1a1a1a' }} />

            {/* Quantity */}
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: '#444' }}>
                Quantity
              </p>
              <div className="flex items-center gap-0">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="flex items-center justify-center w-10 h-10 transition-colors hover:bg-white/5"
                  style={{ border: '1px solid #222', borderRadius: '2px 0 0 2px' }}
                >
                  <Icon d={ICONS.minus} size={14} style={{ color: '#888' }} />
                </button>
                <div
                  className="flex items-center justify-center w-12 h-10 text-sm font-semibold"
                  style={{ border: '1px solid #222', borderLeft: 'none', borderRight: 'none' }}
                >
                  {qty}
                </div>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="flex items-center justify-center w-10 h-10 transition-colors hover:bg-white/5"
                  style={{ border: '1px solid #222', borderRadius: '0 2px 2px 0' }}
                >
                  <Icon d={ICONS.plus} size={14} style={{ color: '#888' }} />
                </button>
              </div>
            </div>

            {/* ★ CTA Buttons ★ */}
            <div className="flex gap-3 mt-1">
              {/* Add to Cart — outlined */}
              <button
                className="flex-1 flex items-center justify-center gap-2 h-12 text-xs font-bold tracking-widest uppercase rounded-sm transition-all duration-200 hover:bg-white/5"
                style={{ border: '1px solid #f0f0f0', color: '#f0f0f0' }}
              >
                <Icon d={ICONS.cart} size={14} />
                Add to Cart
              </button>

              {/* Buy Now — solid gold */}
              <button
                className="flex-1 flex items-center justify-center h-12 text-xs font-bold tracking-widest uppercase rounded-sm transition-opacity duration-200 hover:opacity-85 active:scale-[0.98]"
                style={{ backgroundColor: '#F5C518', color: '#000' }}
              >
                Buy Now
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

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: '#1a1a1a' }} />

            {/* Accordions */}
            <div>
              <Accordion label="Product Details">
                <p>Premium quality materials. Handcrafted with attention to detail.</p>
                <ul className="mt-2 flex flex-col gap-1 list-disc list-inside">
                  <li>ID: {product._id}</li>
                  <li>Seller verified ✓</li>
                  <li>High-resolution imagery included</li>
                </ul>
              </Accordion>
              <Accordion label="Shipping Info">
                <p>Free shipping on all orders. Delivered in 3–7 business days.</p>
                <p className="mt-1">Express delivery available at checkout.</p>
              </Accordion>
            </div>

          </div>
          {/* ══════════════════════════════════════════════════════ */}
        </div>
      </div>

      {/* ══ FOOTER ══════════════════════════════════════════════════ */}
      <footer
        className="mt-16 px-6 md:px-12 py-5 flex items-center justify-between flex-wrap gap-3"
        style={{ borderTop: '1px solid #111', backgroundColor: '#060606' }}
      >
        <span
          className="text-[10px] font-black tracking-[0.25em] uppercase px-2 py-0.5 rounded-sm"
          style={{ color: '#F5C518', border: '1px solid rgba(245,197,24,0.25)' }}
        >
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