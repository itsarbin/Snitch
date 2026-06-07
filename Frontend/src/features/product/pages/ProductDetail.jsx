import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useProduct } from '../hook/useProduct'
import { useCart } from '../../cart/hook/useCart'

/* ── Design tokens ──────────────────────────────────────────────── */
const C = {
  bg:       '#fdf9f3',
  espresso: '#3b1f0c',
  walnut:   '#7b4a2d',
  caramel:  '#c17a3f',
  sand:     '#e8d5b7',
  outline:  '#d4c3ba',
  faint:    '#82746d',
}
const FONT_SERIF  = "'EB Garamond', Georgia, serif"
const FONT_SANS   = "'DM Sans', system-ui, sans-serif"

/* ── Icon helper ─────────────────────────────────────────────────── */
const Icon = ({ d, size = 18, stroke = 1.7, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
    style={style}>
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

/* ── Skeleton ─────────────────────────────────────────────────────── */
const Skeleton = () => (
  <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '48px 64px' }}>
    <div style={{ display: 'flex', flexDirection: 'row', gap: '64px' }}>
      <div style={{ width: '55%' }}>
        <div style={{ width: '100%', height: '85vh', backgroundColor: C.sand, opacity: 0.5, animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '8px' }}>
        <div style={{ height: '12px', width: '160px', backgroundColor: C.sand, borderRadius: '2px' }} />
        <div style={{ height: '48px', width: '75%', backgroundColor: C.sand, borderRadius: '2px' }} />
        <div style={{ height: '1px', width: '48px', backgroundColor: C.outline }} />
        <div style={{ height: '40px', width: '128px', backgroundColor: C.sand, borderRadius: '2px' }} />
        <div style={{ height: '12px', width: '100%', backgroundColor: C.sand, borderRadius: '2px' }} />
        <div style={{ height: '12px', width: '66%', backgroundColor: C.sand, borderRadius: '2px' }} />
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <div style={{ height: '48px', flex: 1, backgroundColor: C.sand, borderRadius: '2px' }} />
          <div style={{ height: '48px', flex: 1, backgroundColor: C.sand, borderRadius: '2px' }} />
        </div>
      </div>
    </div>
  </div>
)

/* ── Accordion ────────────────────────────────────────────────────── */
const Accordion = ({ label, children }) => {
  const [open, setOpen] = useState(false)
  const [hov,  setHov]  = useState(false)
  return (
    <div style={{ borderBottom: `1px solid ${C.sand}` }}>
      <button
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '16px 0',
          background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}>
        <span style={{
          fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: hov ? C.caramel : C.walnut, transition: 'color 0.2s',
        }}>
          {label}
        </span>
        <Icon d={ICONS.chevron} size={16}
          style={{
            color: C.caramel,
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.22s ease',
          }} />
      </button>
      {open && (
        <div style={{
          paddingBottom: '16px', fontFamily: FONT_SANS, fontSize: '13px',
          color: C.walnut, lineHeight: 1.75,
        }}>
          {children}
        </div>
      )}
    </div>
  )
}

/* ── Helpers ──────────────────────────────────────────────────────── */
const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s

const getAttrKeys = (variants) => {
  const keys = new Set()
  variants.forEach(v => {
    if (v.attributes) Object.keys(v.attributes).forEach(k => keys.add(k))
  })
  return [...keys]
}

const getValuesForKey = (variants, key) => {
  const vals = new Set()
  variants.forEach(v => {
    if (v.attributes?.[key]) vals.add(v.attributes[key])
  })
  return [...vals]
}

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
  const { productId }            = useParams()
  const navigate                 = useNavigate()
  const { handleProductDetails } = useProduct()

  const [product,       setProduct]       = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [activeImg,     setActiveImg]     = useState(0)
  const [qty,           setQty]           = useState(1)
  const [imgErr,        setImgErr]        = useState({})
  const [selectedAttrs, setSelectedAttrs] = useState({})

  // Gallery hover state (for prev/next arrows)
  const [galleryHov, setGalleryHov] = useState(false)

  // Hover states for buttons
  const [backHov,    setBackHov]    = useState(false)
  const [addHov,     setAddHov]     = useState(false)
  const [buyHov,     setBuyHov]     = useState(false)
  const [clearHov,   setClearHov]   = useState(false)

  const { handleAddToCart } = useCart()

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
  const variants      = useMemo(() => product?.variants || [], [product])
  const attrKeys      = useMemo(() => getAttrKeys(variants), [variants])
  const activeVariant = useMemo(() => findVariant(variants, selectedAttrs), [variants, selectedAttrs])

  const images = useMemo(() => {
    if (activeVariant?.images?.length) return activeVariant.images
    return product?.images || []
  }, [activeVariant, product])

  const price = useMemo(() => {
    if (activeVariant?.price?.amount) return activeVariant.price
    return product?.price
  }, [activeVariant, product])

  const stock      = activeVariant ? Number(activeVariant.stock ?? 0) : null
  const outOfStock = stock !== null && stock === 0
  const mainImg    = images[activeImg]?.url

  const handleAttrSelect = (key, value) => {
    setSelectedAttrs(prev => {
      const next = { ...prev }
      if (next[key] === value) {
        delete next[key]
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
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', fontFamily: FONT_SANS }}>
      <div style={{ height: '56px', borderBottom: `1px solid ${C.outline}`, backgroundColor: C.bg }} />
      <Skeleton />
    </div>
  )

  /* ── Not found ── */
  if (!product) return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '16px',
      backgroundColor: C.bg, fontFamily: FONT_SANS,
    }}>
      <Icon d={ICONS.img} size={48} style={{ color: C.outline }} />
      <p style={{ fontSize: '14px', color: C.faint }}>Product not found</p>
      <button
        onClick={() => navigate(-1)}
        style={{
          fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          padding: '10px 20px', border: `1px solid ${C.espresso}`,
          backgroundColor: C.espresso, color: C.bg, cursor: 'pointer',
        }}>
        Go Back
      </button>
    </div>
  )

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', fontFamily: FONT_SANS, color: C.espresso }}>

      {/* ══ CONTENT ═════════════════════════════════════════════════ */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 64px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <p style={{
            fontFamily: FONT_SANS, fontSize: '10px', letterSpacing: '0.14em',
            color: C.faint, margin: 0, textTransform: 'uppercase',
          }}>
            <span
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = C.caramel}
              onMouseLeave={e => e.target.style.color = C.faint}
            >Home</span>
            {' / '}
            <span
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = C.caramel}
              onMouseLeave={e => e.target.style.color = C.faint}
            >Products</span>
            {' / '}
            <span style={{ color: C.walnut }}>{product.title}</span>
          </p>
          <button
            onClick={() => navigate(-1)}
            onMouseEnter={() => setBackHov(true)}
            onMouseLeave={() => setBackHov(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: backHov ? C.caramel : C.espresso,
              fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 500,
              transition: 'color 0.15s',
            }}>
            <Icon d={ICONS.back} size={13} style={{ color: 'currentColor' }} />
            Back
          </button>
        </div>

        {/* ── Two-column layout ── */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '64px', alignItems: 'flex-start' }}>

          {/* ════ LEFT — Gallery ════════════════════════════════════ */}
          <div style={{ width: '55%', display: 'flex', flexDirection: 'row', gap: '12px' }}>

            {/* Vertical thumbnail strip */}
            {images.length > 1 && (
              <div style={{
                width: '68px', display: 'flex', flexDirection: 'column', gap: '8px',
                maxHeight: '85vh', overflowY: 'auto', scrollbarWidth: 'none', flexShrink: 0,
              }}>
                {images.map((img, i) => (
                  <button key={img._id || i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: '68px', height: '68px', flexShrink: 0,
                      border: `1px solid ${i === activeImg ? C.caramel : C.outline}`,
                      backgroundColor: C.sand, overflow: 'hidden',
                      cursor: 'pointer', padding: 0,
                      transition: 'border-color 0.15s',
                      outline: 'none',
                    }}>
                    {!imgErr[`t${i}`] ? (
                      <img src={img.url} alt={`view ${i + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={() => setImgErr(p => ({ ...p, [`t${i}`]: true }))} />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon d={ICONS.img} size={18} style={{ color: C.outline }} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div
              onMouseEnter={() => setGalleryHov(true)}
              onMouseLeave={() => setGalleryHov(false)}
              style={{
                flex: 1, position: 'relative', height: '85vh',
                backgroundColor: C.sand, border: `1px solid ${C.outline}`,
                overflow: 'hidden',
              }}>
              {mainImg && !imgErr[`main${activeImg}`] ? (
                <img
                  key={`${activeVariant?._id}-${activeImg}`}
                  src={mainImg} alt={product.title}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'contain', objectPosition: 'center',
                    display: 'block', transition: 'opacity 0.3s',
                  }}
                  onError={() => setImgErr(p => ({ ...p, [`main${activeImg}`]: true }))} />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon d={ICONS.img} size={56} style={{ color: C.outline }} />
                </div>
              )}

              {/* Out of stock overlay */}
              {outOfStock && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: 'rgba(253,249,243,0.65)',
                }}>
                  <span style={{
                    fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    padding: '8px 18px',
                    backgroundColor: '#fff0ea', color: '#991b1b',
                    border: '1px solid rgba(153,27,27,0.25)',
                  }}>
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Prev / Next arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                    style={{
                      position: 'absolute', left: '12px', top: '50%',
                      transform: 'translateY(-50%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '36px', height: '36px',
                      backgroundColor: galleryHov ? 'rgba(232,213,183,0.85)' : 'rgba(232,213,183,0)',
                      border: 'none', cursor: 'pointer',
                      transition: 'background-color 0.2s, opacity 0.2s',
                      opacity: galleryHov ? 1 : 0,
                      color: C.espresso,
                    }}>
                    <Icon d="M15 18l-6-6 6-6" size={16} style={{ color: C.espresso }} />
                  </button>
                  <button
                    onClick={() => setActiveImg(i => (i + 1) % images.length)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%',
                      transform: 'translateY(-50%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '36px', height: '36px',
                      backgroundColor: galleryHov ? 'rgba(232,213,183,0.85)' : 'rgba(232,213,183,0)',
                      border: 'none', cursor: 'pointer',
                      transition: 'background-color 0.2s, opacity 0.2s',
                      opacity: galleryHov ? 1 : 0,
                      color: C.espresso,
                    }}>
                    <Icon d="M9 18l6-6-6-6" size={16} style={{ color: C.espresso }} />
                  </button>
                </>
              )}

              {/* Image counter */}
              {images.length > 1 && (
                <div style={{
                  position: 'absolute', bottom: '12px', right: '12px',
                  fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 600,
                  padding: '4px 8px',
                  backgroundColor: 'rgba(232,213,183,0.8)', color: C.walnut,
                }}>
                  {activeImg + 1} / {images.length}
                </div>
              )}

              {/* Variant badge */}
              {activeVariant && (
                <div style={{
                  position: 'absolute', top: '12px', left: '12px',
                  fontFamily: FONT_SANS, fontSize: '9px', fontWeight: 700,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  padding: '4px 8px',
                  backgroundColor: 'rgba(193,122,63,0.12)', color: C.caramel,
                  border: `1px solid rgba(193,122,63,0.3)`,
                }}>
                  Variant View
                </div>
              )}
            </div>
          </div>

          {/* ════ RIGHT — Info ══════════════════════════════════════ */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '8px' }}>

            {/* Eyebrow */}
            <p style={{
              fontFamily: FONT_SANS, fontSize: '10px', letterSpacing: '0.22em',
              textTransform: 'uppercase', color: C.caramel, marginBottom: '-8px',
            }}>
              Menswear Collection
            </p>

            {/* Title */}
            <div>
              <h1 style={{
                fontFamily: FONT_SERIF, fontSize: '46px', fontWeight: 300,
                color: C.espresso, lineHeight: 1.15, margin: '0 0 14px 0',
                letterSpacing: '-0.01em',
              }}>
                {product.title}
              </h1>
              {/* Thin caramel rule */}
              <div style={{ width: '48px', height: '1px', backgroundColor: C.caramel }} />
            </div>

            {/* Price row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: FONT_SERIF, fontStyle: 'italic', fontSize: '38px',
                color: C.caramel, lineHeight: 1,
              }}>
                ₹{Number(price?.amount || 0).toLocaleString('en-IN')}
              </span>
              <span style={{
                fontFamily: FONT_SANS, fontSize: '11px', color: C.faint, marginLeft: '8px',
              }}>
                {price?.currency || 'INR'}
              </span>
              {activeVariant && (
                <span style={{
                  fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '3px 10px', borderRadius: '999px',
                  backgroundColor: outOfStock ? '#fef2f2' : '#f0fdf4',
                  color: outOfStock ? '#991b1b' : '#166534',
                  border: `1px solid ${outOfStock ? '#fecaca' : '#dcfce7'}`,
                }}>
                  {outOfStock ? 'Out of Stock' : `${stock} in stock`}
                </span>
              )}
            </div>

            {/* Description */}
            <p style={{
              fontFamily: FONT_SANS, fontSize: '14px', color: C.walnut,
              lineHeight: 1.85, margin: 0,
            }}>
              {product.description}
            </p>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: C.sand }} />

            {/* ══ VARIANT SELECTOR ═════════════════════════════════ */}
            {attrKeys.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {attrKeys.map(key => {
                  const values   = getValuesForKey(variants, key)
                  const selected = selectedAttrs[key]
                  return (
                    <div key={key}>
                      {/* Attribute label */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <p style={{
                          fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 700,
                          letterSpacing: '0.2em', textTransform: 'uppercase',
                          color: C.caramel, margin: 0,
                        }}>
                          {cap(key)}
                        </p>
                        {selected && (
                          <span style={{
                            fontFamily: FONT_SANS, fontSize: '10px', color: C.walnut,
                          }}>
                            — {cap(selected)}
                          </span>
                        )}
                      </div>

                      {/* Value buttons */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {values.map(val => {
                          const isSelected   = selected === val
                          const testAttrs    = { ...selectedAttrs, [key]: val }
                          const testVariant  = findVariant(variants, testAttrs)
                          const isUnavailable = testVariant && Number(testVariant.stock) === 0

                          const looksLikeColor = ['red','green','blue','black','white','brown','gray','grey',
                            'pink','purple','orange','yellow','beige','navy','maroon','cyan','teal'].includes(val.toLowerCase())

                          if (looksLikeColor) {
                            return (
                              <button key={val}
                                onClick={() => handleAttrSelect(key, val)}
                                title={cap(val)}
                                style={{
                                  position: 'relative', flexShrink: 0,
                                  width: '28px', height: '28px', borderRadius: '50%',
                                  backgroundColor: val.toLowerCase(),
                                  border: isSelected ? `2px solid ${C.caramel}` : `2px solid transparent`,
                                  boxShadow: isSelected
                                    ? `0 0 0 1px ${C.caramel}`
                                    : `0 0 0 1px ${C.outline}`,
                                  opacity: isUnavailable ? 0.35 : 1,
                                  cursor: 'pointer', padding: 0,
                                  transition: 'box-shadow 0.15s, border-color 0.15s',
                                }}>
                                {isSelected && (
                                  <span style={{
                                    position: 'absolute', inset: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}>
                                    <Icon d={ICONS.check} size={12}
                                      style={{ color: val.toLowerCase() === 'white' || val.toLowerCase() === 'yellow' ? '#000' : '#fff' }} />
                                  </span>
                                )}
                                {isUnavailable && !isSelected && (
                                  <span style={{
                                    position: 'absolute', inset: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}>
                                    <Icon d={ICONS.x} size={10} style={{ color: 'rgba(255,255,255,0.6)' }} />
                                  </span>
                                )}
                              </button>
                            )
                          }

                          return (
                            <button key={val}
                              onClick={() => handleAttrSelect(key, val)}
                              style={{
                                fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 600,
                                letterSpacing: '0.08em', textTransform: 'capitalize',
                                padding: '8px 14px',
                                border: `1px solid ${isSelected ? C.espresso : C.outline}`,
                                backgroundColor: isSelected ? C.espresso : C.sand,
                                color: isSelected ? C.bg : isUnavailable ? C.outline : C.espresso,
                                textDecoration: isUnavailable && !isSelected ? 'line-through' : 'none',
                                cursor: 'pointer', transition: 'all 0.15s',
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
                  <button
                    onClick={() => { setSelectedAttrs({}); setActiveImg(0); setImgErr({}) }}
                    onMouseEnter={() => setClearHov(true)}
                    onMouseLeave={() => setClearHov(false)}
                    style={{
                      alignSelf: 'flex-start',
                      fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 600,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: clearHov ? C.caramel : C.faint,
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px',
                      transition: 'color 0.15s', padding: 0,
                    }}>
                    <Icon d={ICONS.x} size={11} />
                    Clear selection
                  </button>
                )}

                <div style={{ height: '1px', backgroundColor: C.sand }} />
              </div>
            )}

            {/* ── Quantity stepper ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{
                fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: C.caramel, margin: 0,
              }}>
                Quantity
              </p>
              <div style={{ display: 'flex', alignItems: 'stretch' }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '36px', height: '36px',
                    border: `1px solid ${C.espresso}`, borderRight: 'none',
                    backgroundColor: 'transparent', cursor: 'pointer',
                    color: C.espresso, transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = C.sand}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Icon d={ICONS.minus} size={14} style={{ color: C.espresso }} />
                </button>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '44px', height: '36px',
                  borderTop: `1px solid ${C.espresso}`, borderBottom: `1px solid ${C.espresso}`,
                  fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600,
                  color: C.espresso,
                }}>
                  {qty}
                </div>
                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '36px', height: '36px',
                    border: `1px solid ${C.espresso}`, borderLeft: 'none',
                    backgroundColor: 'transparent', cursor: 'pointer',
                    color: C.espresso, transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = C.sand}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Icon d={ICONS.plus} size={14} style={{ color: C.espresso }} />
                </button>
              </div>
            </div>

            {/* ── CTA Buttons ── */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                disabled={outOfStock}
                onClick={async () => {
                  await handleAddToCart(product._id, activeVariant._id)
                }}
                onMouseEnter={() => setAddHov(true)}
                onMouseLeave={() => setAddHov(false)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '8px', padding: '14px 0',
                  fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  border: `1px solid ${C.espresso}`, color: C.espresso,
                  backgroundColor: addHov ? C.sand : 'transparent',
                  cursor: outOfStock ? 'not-allowed' : 'pointer',
                  opacity: outOfStock ? 0.3 : 1,
                  transition: 'background-color 0.18s',
                }}>
                <Icon d={ICONS.cart} size={14} style={{ color: C.espresso }} />
                Add to Cart
              </button>
              <button
                disabled={outOfStock}
                onMouseEnter={() => setBuyHov(true)}
                onMouseLeave={() => setBuyHov(false)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '14px 0',
                  fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  border: 'none', color: C.bg,
                  backgroundColor: buyHov ? C.walnut : C.espresso,
                  cursor: outOfStock ? 'not-allowed' : 'pointer',
                  opacity: outOfStock ? 0.3 : 1,
                  transition: 'background-color 0.18s',
                }}>
                {outOfStock ? 'Out of Stock' : 'Buy Now'}
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px', paddingBottom: '8px' }}>
              {[
                { icon: ICONS.truck,   label: 'Free Shipping' },
                { icon: ICONS.refresh, label: 'Easy Returns'  },
                { icon: ICONS.shield,  label: 'Secure Payment'},
              ].map(b => (
                <div key={b.label} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                }}>
                  <Icon d={b.icon} size={17} style={{ color: C.caramel }} />
                  <span style={{
                    fontFamily: FONT_SANS, fontSize: '9px', fontWeight: 600,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: C.walnut, textAlign: 'center',
                  }}>
                    {b.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: C.sand }} />

            {/* ── Accordions ── */}
            <div>
              <Accordion label="Product Details">
                <p style={{ margin: 0 }}>Premium quality materials. Handcrafted with attention to detail.</p>
                <ul style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '16px' }}>
                  <li>ID: {product._id}</li>
                  <li>Seller verified ✓</li>
                  {activeVariant && <li>SKU: {activeVariant.sku || activeVariant._id}</li>}
                  <li>High-resolution imagery included</li>
                </ul>
              </Accordion>
              <Accordion label="Shipping Info">
                <p style={{ margin: 0 }}>Free shipping on all orders. Delivered in 3–7 business days.</p>
                <p style={{ margin: '4px 0 0 0' }}>Express delivery available at checkout.</p>
              </Accordion>
            </div>
          </div>
        </div>

        {/* ══ VARIANTS SECTION ════════════════════════════════════════ */}
        {variants.length > 0 && (
          <div style={{ marginTop: '64px' }}>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '16px', height: '1px', backgroundColor: C.caramel }} />
              <p style={{
                fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.25em', textTransform: 'uppercase',
                color: C.walnut, margin: 0,
              }}>
                Available Variants
              </p>
              <span style={{
                fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 600,
                padding: '2px 8px',
                backgroundColor: C.sand, color: C.walnut,
                border: `1px solid ${C.outline}`,
              }}>
                {variants.length}
              </span>
            </div>

            <div style={{ height: '1px', backgroundColor: C.sand, marginBottom: '24px' }} />

            {/* Variants grid */}
            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
              {variants.map(v => {
                const vAttrs  = v.attributes ? Object.entries(v.attributes) : []
                const vPrice  = v.price?.amount ? v.price : product.price
                const vImages = v.images?.length ? v.images : product.images || []
                const vStock  = Number(v.stock ?? 0)
                const isActive = activeVariant?._id === v._id
                const isOos    = vStock === 0

                return (
                  <div key={v._id}
                    onClick={() => {
                      if (v.attributes) {
                        setSelectedAttrs({ ...v.attributes })
                        setActiveImg(0)
                        setImgErr({})
                      }
                    }}
                    style={{
                      display: 'flex', gap: '16px', padding: '16px',
                      backgroundColor: C.sand,
                      border: `1px solid ${isActive ? C.caramel : C.outline}`,
                      borderLeft: `3px solid ${isActive ? C.caramel : C.outline}`,
                      cursor: 'pointer', opacity: isOos ? 0.6 : 1,
                      transition: 'border-color 0.15s, transform 0.15s',
                    }}
                    onMouseEnter={e => { if (!isOos) e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {/* Variant thumbnail */}
                    <div style={{
                      flexShrink: 0, width: '64px', height: '80px',
                      backgroundColor: C.bg, border: `1px solid ${C.outline}`, overflow: 'hidden',
                    }}>
                      {vImages[0]?.url ? (
                        <img src={vImages[0].url} alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Icon d={ICONS.img} size={20} style={{ color: C.outline }} />
                        </div>
                      )}
                    </div>

                    {/* Variant info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0, flex: 1 }}>
                      {/* Attribute chips */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {vAttrs.map(([k, val]) => {
                          const isColor = ['red','green','blue','black','white','brown','gray','grey',
                            'pink','purple','orange','yellow','beige','navy','maroon','cyan','teal'].includes(val.toLowerCase())
                          return (
                            <span key={k} style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 600,
                              letterSpacing: '0.06em', padding: '2px 8px',
                              borderRadius: '999px',
                              backgroundColor: C.bg, color: C.walnut,
                              border: `1px solid ${C.outline}`,
                            }}>
                              {isColor && (
                                <span style={{
                                  width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                                  backgroundColor: val.toLowerCase(),
                                  border: `1px solid ${C.outline}`,
                                  display: 'inline-block',
                                }} />
                              )}
                              {cap(k)}: {cap(val)}
                            </span>
                          )
                        })}
                      </div>

                      {/* Price */}
                      <p style={{
                        fontFamily: FONT_SERIF, fontSize: '18px', fontWeight: 400,
                        color: C.caramel, margin: 0,
                      }}>
                        ₹{Number(vPrice?.amount || 0).toLocaleString('en-IN')}
                        <span style={{
                          fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 400,
                          color: C.faint, marginLeft: '4px',
                        }}>
                          {vPrice?.currency || 'INR'}
                        </span>
                      </p>

                      {/* Stock badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 700,
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                          padding: '2px 8px', borderRadius: '999px',
                          backgroundColor: isOos ? '#fef2f2' : '#f0fdf4',
                          color: isOos ? '#991b1b' : '#166534',
                          border: `1px solid ${isOos ? '#fecaca' : '#dcfce7'}`,
                        }}>
                          {isOos ? 'Out of Stock' : `${vStock} in stock`}
                        </span>
                        {isActive && (
                          <span style={{
                            fontFamily: FONT_SANS, fontSize: '9px', fontWeight: 700,
                            letterSpacing: '0.15em', textTransform: 'uppercase',
                            color: C.caramel,
                          }}>
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
      <footer style={{
        marginTop: '64px', padding: '16px 64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '12px',
        backgroundColor: C.sand, borderTop: `1px solid ${C.outline}`,
      }}>
        <span style={{
          fontFamily: FONT_SERIF, fontSize: '22px', fontWeight: 400,
          color: C.espresso, letterSpacing: '0.04em',
        }}>
          Snitch
        </span>
        <p style={{
          fontFamily: FONT_SANS, fontSize: '11px',
          color: C.faint, letterSpacing: '0.08em', margin: 0,
        }}>
          © 2026 Snitch. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default ProductDetail