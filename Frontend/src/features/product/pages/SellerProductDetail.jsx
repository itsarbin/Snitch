import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useProduct } from '../hook/useProduct'

/* ── Design tokens ──────────────────────────────────────────────── */
const T = {
  bg:        '#fdf9f3',
  espresso:  '#3b1f0c',
  walnut:    '#7b4a2d',
  caramel:   '#c17a3f',
  sand:      '#e8d5b7',
  outline:   '#d4c3ba',
  faint:     '#82746d',
  white:     '#ffffff',
  surface:   '#f1ede7',
}
const FONT_SERIF  = "'EB Garamond', Georgia, serif"
const FONT_SANS   = "'DM Sans', system-ui, sans-serif"

/* ── Google Fonts injection ─────────────────────────────────────── */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.45; }
    }
    .snitch-skeleton { animation: pulse 1.6s ease-in-out infinite; }
  `}</style>
)

/* ── SVG Icon Helper ────────────────────────────────────────────── */
const Icon = ({ d, size = 16, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: 'inline-block', flexShrink: 0, ...style }}>
    <path d={d} />
  </svg>
)

const IC = {
  back:    'M19 12H5M12 5l-7 7 7 7',
  plus:    'M12 5v14M5 12h14',
  minus:   'M5 12h14',
  trash:   'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  edit:    'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  img:     'M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z',
  upload:  'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  x:       'M18 6L6 18M6 6l12 12',
  check:   'M20 6L9 17l-5-5',
  package: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  tag:     'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01',
  layers:  'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
}

/* ── Helpers ────────────────────────────────────────────────────── */
const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''

/* ── Reusable Form Field ────────────────────────────────────────── */
const Field = ({ label, type = 'text', value, onChange, placeholder, style = {} }) => {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
      <label style={{
        fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 600,
        letterSpacing: '0.15em', textTransform: 'uppercase',
        color: focused ? T.caramel : T.faint, transition: 'color 0.2s',
      }}>
        {label}
      </label>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          fontFamily: FONT_SANS, fontSize: '14px', color: T.espresso,
          background: 'transparent', border: 'none', outline: 'none',
          borderBottom: `1px solid ${focused ? T.caramel : T.outline}`,
          padding: '8px 0 8px', transition: 'border-color 0.25s',
          width: '100%',
        }}
      />
    </div>
  )
}

/* ── Skeleton ───────────────────────────────────────────────────── */
const PageSkeleton = () => (
  <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '48px 64px' }} className="snitch-skeleton">
    <div style={{ display: 'flex', flexDirection: 'row', gap: '48px', flexWrap: 'wrap' }}>
      <div style={{ width: '288px', height: '380px', backgroundColor: T.sand, opacity: 0.5 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '8px' }}>
        <div style={{ height: '12px', width: '120px', backgroundColor: T.sand }} />
        <div style={{ height: '40px', width: '80%', backgroundColor: T.sand }} />
        <div style={{ height: '1px', width: '48px', backgroundColor: T.outline }} />
        <div style={{ height: '32px', width: '150px', backgroundColor: T.sand }} />
        <div style={{ height: '12px', width: '100%', backgroundColor: T.sand }} />
        <div style={{ height: '12px', width: '70%', backgroundColor: T.sand }} />
      </div>
    </div>
  </div>
)

/* ── Add Variant Form (slide-up panel) ──────────────────────────── */
const AddVariantForm = ({ productId, onClose, onCreated }) => {
  const { handleCreateVariant } = useProduct()

  const [attrs,      setAttrs]      = useState([{ key: '', value: '' }])
  const [price,      setPrice]      = useState({ amount: '', currency: 'INR' })
  const [stock,      setStock]      = useState('0')
  const [images,     setImages]     = useState([])      // File[]
  const [previews,   setPreviews]   = useState([])      // blob URLs
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')
  const [dragOver,   setDragOver]   = useState(false)

  const addAttr  = () => setAttrs(a => [...a, { key: '', value: '' }])
  const rmAttr   = (i) => setAttrs(a => a.filter((_, idx) => idx !== i))
  const setAttr  = (i, field, val) => setAttrs(a => a.map((r, idx) => idx === i ? { ...r, [field]: val } : r))

  const handleFiles = (files) => {
    const arr = Array.from(files)
    setImages(prev => [...prev, ...arr])
    setPreviews(prev => [...prev, ...arr.map(f => URL.createObjectURL(f))])
  }

  const removeImg = (i) => {
    URL.revokeObjectURL(previews[i])
    setImages(prev => prev.filter((_, idx) => idx !== i))
    setPreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  const submit = async () => {
    setError(''); setSubmitting(true)

    const attributes = attrs.reduce((obj, { key, value }) => {
      if (key.trim()) obj[key.trim()] = value
      return obj
    }, {})

    try {
      const fd = new FormData()
      fd.append('priceAmount', price.amount)
      fd.append('priceCurrency', price.currency)
      fd.append('stock', stock)
      fd.append('attributes', JSON.stringify(attributes))
      images.forEach(f => fd.append('images', f))
      const data = await handleCreateVariant(productId, fd)
      onCreated(data)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to create variant')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        backgroundColor: 'rgba(59,31,12,0.4)', backdropFilter: 'blur(4px)',
        display: 'flex', justifyContent: 'flex-end',
      }}
    >
      <div style={{
        height: '100%', width: '480px', maxWidth: '100%',
        backgroundColor: T.bg, borderLeft: `1px solid ${T.outline}`,
        boxShadow: '-4px 0 24px rgba(59,31,12,0.08)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 32px', borderBottom: `1px solid ${T.outline}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.caramel, margin: 0 }}>New Variant</p>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: '22px', fontWeight: 300, color: T.espresso, margin: '4px 0 0 0' }}>Add Product Variant</h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', border: `1px solid ${T.outline}`,
              background: 'transparent', cursor: 'pointer', outline: 'none',
            }}
          >
            <Icon d={IC.x} size={14} style={{ color: T.espresso }} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '32px 32px',
          display: 'flex', flexDirection: 'column', gap: '28px',
        }}>
          {/* Attributes */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.caramel }}>
                Attributes
              </label>
              <button
                type="button"
                onClick={addAttr}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: T.caramel, background: 'transparent', border: 'none',
                  cursor: 'pointer', outline: 'none',
                }}
              >
                + Add Attribute
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {attrs.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <input
                      value={a.key}
                      onChange={e => setAttr(i, 'key', e.target.value)}
                      placeholder="Name (e.g. Size)"
                      style={{
                        fontFamily: FONT_SANS, fontSize: '13px', color: T.espresso,
                        background: 'transparent', border: 'none', outline: 'none',
                        borderBottom: `1px solid ${T.outline}`,
                        padding: '6px 0', width: '100%',
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <input
                      value={a.value}
                      onChange={e => setAttr(i, 'value', e.target.value)}
                      placeholder="Value (e.g. L)"
                      style={{
                        fontFamily: FONT_SANS, fontSize: '13px', color: T.espresso,
                        background: 'transparent', border: 'none', outline: 'none',
                        borderBottom: `1px solid ${T.outline}`,
                        padding: '6px 0', width: '100%',
                      }}
                    />
                  </div>
                  {attrs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => rmAttr(i)}
                      style={{
                        width: '32px', height: '32px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', border: `1px solid ${T.outline}`,
                        background: 'transparent', cursor: 'pointer', outline: 'none',
                      }}
                    >
                      <Icon d={IC.x} size={12} style={{ color: T.walnut }} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <Field
              label="Price Amount"
              type="number"
              value={price.amount}
              onChange={e => setPrice(p => ({ ...p, amount: e.target.value }))}
              placeholder="e.g. 1499"
              style={{ flex: 1 }}
            />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '120px' }}>
              <label style={{
                fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 600,
                letterSpacing: '0.15em', textTransform: 'uppercase', color: T.faint,
              }}>
                Currency
              </label>
              <select
                value={price.currency}
                onChange={e => setPrice(p => ({ ...p, currency: e.target.value }))}
                style={{
                  fontFamily: FONT_SANS, fontSize: '14px', color: T.espresso,
                  background: 'transparent', border: 'none', outline: 'none',
                  borderBottom: `1px solid ${T.outline}`,
                  padding: '8px 0 8px', cursor: 'pointer', width: '100%',
                }}
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          {/* Stock */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.faint }}>
              Initial Stock
            </label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setStock(s => String(Math.max(0, Number(s) - 1)))}
                style={{
                  width: '36px', height: '36px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', border: `1px solid ${T.espresso}`,
                  background: T.bg, cursor: 'pointer', outline: 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = T.sand}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = T.bg}
              >
                <Icon d={IC.minus} size={12} style={{ color: T.espresso }} />
              </button>
              <input
                type="number" min="0" value={stock}
                onChange={e => setStock(e.target.value)}
                style={{
                  width: '56px', height: '36px', textAlign: 'center', fontFamily: FONT_SANS,
                  fontSize: '13px', color: T.espresso, background: 'transparent',
                  borderTop: `1px solid ${T.espresso}`, borderBottom: `1px solid ${T.espresso}`,
                  borderLeft: 'none', borderRight: 'none', outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setStock(s => String(Number(s) + 1))}
                style={{
                  width: '36px', height: '36px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', border: `1px solid ${T.espresso}`,
                  background: T.bg, cursor: 'pointer', outline: 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = T.sand}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = T.bg}
              >
                <Icon d={IC.plus} size={12} style={{ color: T.espresso }} />
              </button>
            </div>
          </div>

          {/* Images upload */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.faint }}>
              Images
            </label>

            {/* Drag drop zone */}
            <label
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: '12px', padding: '32px 24px',
                backgroundColor: dragOver ? T.surface : T.bg,
                border: `2px dashed ${dragOver ? T.caramel : T.outline}`,
                cursor: 'pointer', transition: 'all 0.25s',
                textAlign: 'center',
              }}
            >
              <Icon d={IC.upload} size={28} style={{ color: dragOver ? T.caramel : T.walnut }} />
              <div style={{ fontFamily: FONT_SANS, fontSize: '13px', color: T.espresso }}>
                Drag & drop images here<br />
                <span style={{ color: T.caramel, textDecoration: 'underline' }}>or click to browse</span>
              </div>
              <span style={{ fontFamily: FONT_SANS, fontSize: '10px', color: T.faint }}>
                PNG, JPG, WEBP — UP TO 10MB
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={e => handleFiles(e.target.files)}
                style={{ display: 'none' }}
              />
            </label>

            {/* Previews */}
            {previews.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                {previews.map((src, i) => (
                  <div key={i} style={{ position: 'relative', width: '64px', height: '80px', border: `1px solid ${T.outline}`, backgroundColor: T.surface }}>
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => removeImg(i)}
                      style={{
                        position: 'absolute', top: '-6px', right: '-6px',
                        width: '18px', height: '18px', borderRadius: '50%',
                        backgroundColor: T.espresso, border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', outline: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                      }}
                    >
                      <Icon d={IC.x} size={10} style={{ color: T.white }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#991b1b', margin: 0 }}>
              {error}
            </p>
          )}
        </div>

        {/* Footer actions */}
        <div style={{
          padding: '24px 32px', borderTop: `1px solid ${T.outline}`,
          backgroundColor: T.bg, display: 'flex', gap: '16px',
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1, height: '44px', border: `1px solid ${T.espresso}`,
              background: 'transparent', color: T.espresso,
              fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              cursor: 'pointer', outline: 'none', transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = T.sand}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            style={{
              flex: 1, height: '44px', border: `1px solid ${T.espresso}`,
              background: T.espresso, color: T.bg,
              fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              cursor: submitting ? 'not-allowed' : 'pointer', outline: 'none',
              opacity: submitting ? 0.6 : 1, transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => { if(!submitting) e.currentTarget.style.backgroundColor = T.walnut }}
            onMouseLeave={e => { if(!submitting) e.currentTarget.style.backgroundColor = T.espresso }}
          >
            {submitting ? 'Creating...' : 'Create Variant'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Variant Card ───────────────────────────────────────────────── */
const VariantCard = ({ variant, productId, onDelete, onStockUpdated }) => {
  const { handleUpdateVariantStock, handleDeleteVariant } = useProduct()

  const [stockVal,  setStockVal]  = useState(String(variant.stock ?? '0'))
  const [updating,  setUpdating]  = useState(false)
  const [deleting,  setDeleting]  = useState(false)
  const [stockMsg,  setStockMsg]  = useState('')
  const [isTrashHover, setIsTrashHover] = useState(false)

  const attrs = variant.attributes
    ? Object.entries(
        typeof variant.attributes.toJSON === 'function'
          ? variant.attributes.toJSON()
          : variant.attributes
      )
    : []

  const updateStock = async () => {
    setUpdating(true); setStockMsg('')
    try {
      await handleUpdateVariantStock(productId, variant._id, stockVal)
      setStockMsg('Updated!')
      onStockUpdated(variant._id, stockVal)
      setTimeout(() => setStockMsg(''), 2000)
    } catch {
      setStockMsg('Failed')
    } finally {
      setUpdating(false)
    }
  }

  const doDelete = async () => {
    if (!confirm('Delete this variant?')) return
    setDeleting(true)
    try {
      await handleDeleteVariant(productId, variant._id)
      onDelete(variant._id)
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', gap: '20px',
        padding: '24px', backgroundColor: T.white,
        border: `1px solid ${T.outline}`,
        borderLeft: `3px solid ${T.caramel}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-1px)'
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,31,12,0.06)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Top row: attributes + delete action */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyBetween: 'space-between', gap: '16px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          {attrs.map(([k, v]) => (
            <span key={k} style={{
              fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.05em', textTransform: 'uppercase',
              padding: '4px 10px', backgroundColor: T.surface,
              color: T.espresso, border: `1px solid ${T.outline}`,
            }}>
              {cap(k)}: {cap(v)}
            </span>
          ))}
        </div>

        <button
          onClick={doDelete}
          disabled={deleting}
          onMouseEnter={() => setIsTrashHover(true)}
          onMouseLeave={() => setIsTrashHover(false)}
          style={{
            width: '32px', height: '32px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', border: `1px solid ${isTrashHover ? '#ef4444' : T.outline}`,
            background: isTrashHover ? '#fef2f2' : 'transparent',
            cursor: deleting ? 'not-allowed' : 'pointer', outline: 'none',
            opacity: deleting ? 0.4 : 1, transition: 'all 0.15s',
          }}
        >
          <Icon d={IC.trash} size={14} style={{ color: isTrashHover ? '#ef4444' : T.walnut }} />
        </button>
      </div>

      {/* Price + Variant images */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontFamily: FONT_SANS, fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.faint, margin: '0 0 4px 0' }}>Price</p>
          <p style={{ fontFamily: FONT_SERIF, fontSize: '18px', fontWeight: 400, color: T.caramel, margin: 0 }}>
            ₹{Number(variant.price?.amount || 0).toLocaleString('en-IN')}
            <span style={{ fontFamily: FONT_SANS, fontSize: '10px', color: T.faint, marginLeft: '4px' }}>
              {variant.price?.currency || 'INR'}
            </span>
          </p>
        </div>

        {variant.images?.length > 0 && (
          <div>
            <p style={{ fontFamily: FONT_SANS, fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.faint, margin: '0 0 4px 0' }}>Images</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {variant.images.map((img, i) => (
                <div key={i} style={{
                  width: '40px', height: '50px', overflow: 'hidden', flexShrink: 0,
                  border: `1px solid ${T.outline}`, backgroundColor: T.surface,
                }}>
                  <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stock Management */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', paddingTop: '12px', borderTop: `1px solid ${T.outline}` }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontFamily: FONT_SANS, fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.faint }}>Stock Level</span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setStockVal(s => String(Math.max(0, Number(s) - 1)))}
              style={{
                width: '32px', height: '32px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', border: `1px solid ${T.espresso}`,
                background: T.bg, cursor: 'pointer', outline: 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = T.sand}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = T.bg}
            >
              <Icon d={IC.minus} size={11} style={{ color: T.espresso }} />
            </button>
            <input
              type="number" min="0" value={stockVal}
              onChange={e => setStockVal(e.target.value)}
              style={{
                width: '52px', height: '32px', textAlign: 'center', fontFamily: FONT_SANS,
                fontSize: '13px', color: T.espresso, background: 'transparent',
                borderTop: `1px solid ${T.espresso}`, borderBottom: `1px solid ${T.espresso}`,
                borderLeft: 'none', borderRight: 'none', outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={() => setStockVal(s => String(Number(s) + 1))}
              style={{
                width: '32px', height: '32px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', border: `1px solid ${T.espresso}`,
                background: T.bg, cursor: 'pointer', outline: 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = T.sand}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = T.bg}
            >
              <Icon d={IC.plus} size={11} style={{ color: T.espresso }} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '52px' }}>
          <button
            onClick={updateStock} disabled={updating}
            style={{
              height: '32px', border: `1px solid ${T.espresso}`,
              backgroundColor: T.espresso, color: T.bg,
              fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              padding: '0 16px', cursor: 'pointer', outline: 'none',
              opacity: updating ? 0.6 : 1, transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => { if(!updating) e.currentTarget.style.backgroundColor = T.walnut }}
            onMouseLeave={e => { if(!updating) e.currentTarget.style.backgroundColor = T.espresso }}
          >
            {updating ? 'Updating...' : 'Update Stock'}
          </button>
          {stockMsg && (
            <span style={{
              fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 600,
              color: stockMsg === 'Updated!' ? '#166534' : '#991b1b',
              paddingBottom: '8px',
            }}>
              {stockMsg}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Toast Notification ─────────────────────────────────────────── */
const Toast = ({ msg, type }) => {
  const isSuccess = type === 'success'
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '12px 20px', fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 500,
      backgroundColor: isSuccess ? '#f0fdf4' : '#fef2f2',
      border: `1px solid ${isSuccess ? '#bbf7d0' : '#fecaca'}`,
      color: isSuccess ? '#166534' : '#991b1b',
      boxShadow: '0 4px 16px rgba(59,31,12,0.06)',
    }}>
      <Icon d={isSuccess ? IC.check : IC.x} size={16} style={{ color: isSuccess ? '#166534' : '#991b1b' }} />
      {msg}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════════ */
const SellerProductDetail = () => {
  const { productId } = useParams()
  const navigate      = useNavigate()
  const { handleSellerProductDetails } = useProduct()

  const [product,   setProduct]   = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [showForm,  setShowForm]  = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  const [toast,     setToast]     = useState(null)
  const [imgErr,    setImgErr]    = useState({})

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const data = await handleSellerProductDetails(productId)
        setProduct(data.product)
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [productId])

  const onVariantCreated = (data) => {
    setShowForm(false)
    setProduct(p => ({ ...p, variants: [...(p.variants || []), data.variant || data] }))
    showToast('Variant created successfully!')
  }

  const onVariantDeleted = (variantId) => {
    setProduct(p => ({ ...p, variants: (p.variants || []).filter(v => v._id !== variantId) }))
    showToast('Variant deleted', 'error')
  }

  const onStockUpdated = (variantId, newStock) => {
    setProduct(p => ({
      ...p,
      variants: (p.variants || []).map(v => v._id === variantId ? { ...v, stock: newStock } : v)
    }))
  }

  if (loading) return (
    <div style={{ backgroundColor: T.bg, minHeight: '100vh', fontFamily: FONT_SANS }}>
      <FontStyle />
      <PageSkeleton />
    </div>
  )

  if (!product) return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '20px',
      backgroundColor: T.bg, color: T.espresso, fontFamily: FONT_SANS,
    }}>
      <FontStyle />
      <Icon d={IC.package} size={48} style={{ color: T.outline }} />
      <p style={{ fontFamily: FONT_SERIF, fontSize: '20px', margin: 0 }}>Product not found</p>
      <button
        onClick={() => navigate('/seller/dashboard')}
        style={{
          fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          padding: '14px 28px', backgroundColor: T.espresso, color: T.bg,
          border: 'none', cursor: 'pointer', transition: 'background-color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = T.walnut}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = T.espresso}
      >
        Back to Dashboard
      </button>
    </div>
  )

  const images   = product.images || []
  const variants = product.variants || []

  return (
    <div style={{ backgroundColor: T.bg, minHeight: '100vh', fontFamily: FONT_SANS, color: T.espresso, paddingBottom: '64px' }}>
      <FontStyle />



      {/* ══ MAIN BODY ════════════════════════════════════════════════ */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 64px 0' }}>
        
        {/* SECTION 1: Product overview */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '48px', marginBottom: '48px', flexWrap: 'wrap' }}>
          {/* Image mini-gallery */}
          <div style={{ display: 'flex', gap: '16px', flexShrink: 0 }}>
            {/* Thumbnails strip */}
            {images.length > 1 && (
              <div style={{
                display: 'flex', flexDirection: 'column', gap: '8px',
                maxHeight: '380px', overflowY: 'auto', scrollbarWidth: 'none',
              }}>
                {images.map((img, i) => (
                  <button
                    key={img._id || i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: '64px', height: '80px', overflow: 'hidden',
                      flexShrink: 0, padding: 0, cursor: 'pointer',
                      backgroundColor: T.surface, border: `1px solid ${i === activeImg ? T.caramel : T.outline}`,
                      transition: 'border-color 0.15s',
                    }}
                  >
                    {!imgErr[`t${i}`] ? (
                      <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={() => setImgErr(p => ({ ...p, [`t${i}`]: true }))} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon d={IC.img} size={16} style={{ color: T.faint }} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Main preview */}
            <div style={{
              width: '288px', height: '380px', backgroundColor: T.surface,
              border: `1px solid ${T.outline}`, overflow: 'hidden',
            }}>
              {images[activeImg] && !imgErr['m'] ? (
                <img src={images[activeImg].url} alt={product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={() => setImgErr(p => ({ ...p, m: true }))} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon d={IC.img} size={36} style={{ color: T.outline }} />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 600,
                letterSpacing: '0.22em', textTransform: 'uppercase', color: T.caramel,
              }}>
                Seller Dashboard
              </span>
              <button
                onClick={() => navigate('/seller/dashboard')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: T.espresso, fontFamily: FONT_SANS, fontSize: '12px',
                  fontWeight: 500, transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = T.caramel}
                onMouseLeave={e => e.currentTarget.style.color = T.espresso}
              >
                <Icon d={IC.back} size={13} style={{ color: 'currentColor' }} />
                Back to Dashboard
              </button>
            </div>
            
            <h1 style={{
              fontFamily: FONT_SERIF, fontSize: '38px', fontWeight: 300,
              color: T.espresso, margin: 0, lineHeight: 1.15,
            }}>
              {product.title}
            </h1>

            <div style={{ width: '48px', height: '1px', backgroundColor: T.caramel }} />

            <p style={{
              fontFamily: FONT_SERIF, fontSize: '28px', fontWeight: 400,
              color: T.espresso, margin: 0, fontStyle: 'italic',
            }}>
              ₹{Number(product.price?.amount || 0).toLocaleString('en-IN')}
              <span style={{ fontFamily: FONT_SANS, fontSize: '11px', fontStyle: 'normal', color: T.faint, marginLeft: '8px' }}>
                {product.price?.currency || 'INR'}
              </span>
            </p>

            <p style={{
              fontFamily: FONT_SANS, fontSize: '14px', color: T.walnut,
              lineHeight: 1.8, margin: 0,
            }}>
              {product.description}
            </p>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              flexWrap: 'wrap', marginTop: '8px', paddingTop: '16px',
              borderTop: `1px solid ${T.outline}`,
            }}>
              <span style={{ fontFamily: FONT_SANS, fontSize: '10px', color: T.faint, letterSpacing: '0.05em' }}>
                CREATED: {fmtDate(product.createdAt)}
              </span>
              <span style={{ fontFamily: FONT_SANS, fontSize: '10px', color: T.faint, letterSpacing: '0.05em' }}>
                UPDATED: {fmtDate(product.updatedAt)}
              </span>
              <span style={{
                fontFamily: FONT_SANS, fontSize: '9px', fontWeight: 600,
                letterSpacing: '0.1em', padding: '2px 8px',
                backgroundColor: T.sand, color: T.espresso,
              }}>
                {images.length} IMAGE{images.length !== 1 ? 'S' : ''}
              </span>
            </div>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: T.outline, margin: '40px 0' }} />

        {/* SECTION 2: Variants list */}
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Icon d={IC.layers} size={18} style={{ color: T.caramel }} />
              <h2 style={{
                fontFamily: FONT_SERIF, fontSize: '24px', fontWeight: 300,
                color: T.espresso, margin: 0,
              }}>
                Product Variants
              </h2>
              <span style={{
                fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 600,
                padding: '2px 8px', backgroundColor: T.sand, color: T.espresso,
              }}>
                {variants.length}
              </span>
            </div>

            <button
              onClick={() => setShowForm(true)}
              style={{
                fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 600,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                padding: '12px 20px', backgroundColor: T.espresso, color: T.bg,
                border: 'none', cursor: 'pointer', transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = T.walnut}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = T.espresso}
            >
              + Add Variant
            </button>
          </div>

          {/* List or Empty State */}
          {variants.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '64px 32px', gap: '16px',
              border: `2px dashed ${T.outline}`, backgroundColor: T.white,
              textAlign: 'center',
            }}>
              <Icon d={IC.tag} size={36} style={{ color: T.outline }} />
              <p style={{ fontFamily: FONT_SERIF, fontSize: '20px', margin: 0, color: T.espresso }}>No variants yet</p>
              <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: T.walnut, margin: 0 }}>
                Create variants to manage sizing, color options, pricing adjustments, and inventory stock levels.
              </p>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 600,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  padding: '12px 24px', backgroundColor: T.espresso, color: T.bg,
                  border: 'none', cursor: 'pointer', transition: 'background-color 0.2s',
                  marginTop: '8px',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = T.walnut}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = T.espresso}
              >
                Create First Variant
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {variants.map(v => (
                <VariantCard
                  key={v._id}
                  variant={v}
                  productId={productId}
                  onDelete={onVariantDeleted}
                  onStockUpdated={onStockUpdated}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ══ ADD VARIANT DRAWER ═════════════════════════════════════ */}
      {showForm && (
        <AddVariantForm
          productId={productId}
          onClose={() => setShowForm(false)}
          onCreated={onVariantCreated}
        />
      )}

      {/* ══ TOAST NOTIFICATION ═════════════════════════════════════ */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  )
}

export default SellerProductDetail
