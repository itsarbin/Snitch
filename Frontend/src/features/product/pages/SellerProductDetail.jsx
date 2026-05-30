import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useProduct } from '../hook/useProduct'

/* ── Icon ────────────────────────────────────────────────────────── */
const Icon = ({ d, size = 16, className = '', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.7} strokeLinecap="round"
    strokeLinejoin="round" className={className} style={style}>
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

/* ── helpers ─────────────────────────────────────────────────────── */
const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

/* ── Toast notification ──────────────────────────────────────────── */
const Toast = ({ msg, type }) => (
  <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-sm text-sm font-semibold shadow-xl"
    style={{
      backgroundColor: type === 'success' ? '#0f2a1a' : '#2a0f0f',
      border: `1px solid ${type === 'success' ? '#22c55e40' : '#ef444440'}`,
      color: type === 'success' ? '#4ade80' : '#f87171',
    }}>
    <Icon d={type === 'success' ? IC.check : IC.x} size={15} />
    {msg}
  </div>
)

/* ── Skeleton ────────────────────────────────────────────────────── */
const PageSkeleton = () => (
  <div className="animate-pulse max-w-screen-xl mx-auto px-6 md:px-12 py-10 flex flex-col gap-8">
    <div className="flex gap-8">
      <div className="w-48 h-64 rounded-sm bg-[#111]" />
      <div className="flex-1 flex flex-col gap-3 pt-2">
        <div className="h-8 w-2/3 rounded bg-[#111]" />
        <div className="h-4 w-1/4 rounded bg-[#111]" />
        <div className="h-3 w-full rounded bg-[#111] mt-2" />
        <div className="h-3 w-3/4 rounded bg-[#111]" />
      </div>
    </div>
    <div className="h-px bg-[#1a1a1a]" />
    {[1, 2].map(i => (
      <div key={i} className="h-40 rounded-sm bg-[#0f0f0f]" style={{ border: '1px solid #1a1a1a' }} />
    ))}
  </div>
)

/* ── Add Variant Form (slide-up panel) ───────────────────────────── */
const AddVariantForm = ({ productId, onClose, onCreated }) => {
  const { handleCreateVariant } = useProduct()

  const [attrs,      setAttrs]      = useState([{ key: '', value: '' }])
  const [price,      setPrice]      = useState({ amount: '', currency: 'INR' })
  const [stock,      setStock]      = useState('0')
  const [images,     setImages]     = useState([])      // File[]
  const [previews,   setPreviews]   = useState([])      // blob URLs
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')

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

  const inputCls = "w-full bg-transparent text-sm outline-none px-3 py-2.5 rounded-sm placeholder-[#333]"
  const inputStyle = { border: '1px solid #222', color: '#f0f0f0' }

  return (
    <div className="fixed inset-0 z-40 flex justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div
        className="h-full flex flex-col overflow-y-auto"
        style={{ width: '480px', backgroundColor: '#0a0a0a', borderLeft: '1px solid #1a1a1a' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 sticky top-0 z-10"
          style={{ backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: '#F5C518' }}>New Variant</p>
            <h2 className="text-lg font-semibold mt-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>Add Product Variant</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-white/5 transition-colors"
            style={{ border: '1px solid #222' }}>
            <Icon d={IC.x} size={15} style={{ color: '#666' }} />
          </button>
        </div>

        <div className="flex flex-col gap-6 px-6 py-6">

          {/* Attributes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#555' }}>Attributes</label>
              <button onClick={addAttr} className="text-[10px] font-bold tracking-wider uppercase flex items-center gap-1"
                style={{ color: '#F5C518' }}>
                <Icon d={IC.plus} size={11} /> Add
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {attrs.map((a, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={a.key} onChange={e => setAttr(i, 'key', e.target.value)}
                    placeholder="Name (e.g. Size)"
                    className={`${inputCls} flex-1`} style={inputStyle} />
                  <input value={a.value} onChange={e => setAttr(i, 'value', e.target.value)}
                    placeholder="Value (e.g. L)"
                    className={`${inputCls} flex-1`} style={inputStyle} />
                  {attrs.length > 1 && (
                    <button onClick={() => rmAttr(i)} className="w-8 h-9 flex items-center justify-center rounded-sm flex-shrink-0"
                      style={{ border: '1px solid #222' }}>
                      <Icon d={IC.x} size={12} style={{ color: '#555' }} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: '#555' }}>Price</label>
            <div className="flex gap-2">
              <input value={price.amount} onChange={e => setPrice(p => ({ ...p, amount: e.target.value }))}
                placeholder="Amount" type="number" min="0"
                className={`${inputCls} flex-1`} style={inputStyle} />
              <select value={price.currency} onChange={e => setPrice(p => ({ ...p, currency: e.target.value }))}
                className="px-3 py-2.5 rounded-sm text-sm outline-none bg-transparent"
                style={{ border: '1px solid #222', color: '#f0f0f0', minWidth: '80px' }}>
                <option value="INR" style={{ backgroundColor: '#111' }}>INR</option>
                <option value="USD" style={{ backgroundColor: '#111' }}>USD</option>
              </select>
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: '#555' }}>Initial Stock</label>
            <div className="flex items-center gap-0">
              <button onClick={() => setStock(s => String(Math.max(0, Number(s) - 1)))}
                className="w-10 h-10 flex items-center justify-center rounded-l-sm"
                style={{ border: '1px solid #222', borderRight: 'none' }}>
                <Icon d={IC.minus} size={14} style={{ color: '#666' }} />
              </button>
              <input value={stock} onChange={e => setStock(e.target.value)} type="number" min="0"
                className="w-16 h-10 text-center text-sm bg-transparent outline-none"
                style={{ border: '1px solid #222', borderLeft: 'none', borderRight: 'none', color: '#f0f0f0' }} />
              <button onClick={() => setStock(s => String(Number(s) + 1))}
                className="w-10 h-10 flex items-center justify-center rounded-r-sm"
                style={{ border: '1px solid #222', borderLeft: 'none' }}>
                <Icon d={IC.plus} size={14} style={{ color: '#666' }} />
              </button>
            </div>
          </div>

          {/* Images upload */}
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: '#555' }}>Images</label>

            {/* Drag-drop zone */}
            <label
              className="flex flex-col items-center justify-center gap-2 cursor-pointer rounded-sm transition-colors hover:border-[#F5C518]/40"
              style={{ border: '2px dashed #222', padding: '24px', backgroundColor: '#0f0f0f' }}
              onDragOver={e => { e.preventDefault() }}
              onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
            >
              <Icon d={IC.upload} size={28} style={{ color: '#333' }} />
              <p className="text-xs text-center" style={{ color: '#555' }}>
                Drag & drop images here<br />
                <span style={{ color: '#F5C518' }}>or click to browse</span>
              </p>
              <input type="file" accept="image/*" multiple className="hidden"
                onChange={e => handleFiles(e.target.files)} />
            </label>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative flex-shrink-0" style={{ width: '64px', height: '64px' }}>
                    <img src={src} className="w-full h-full object-cover rounded-sm" style={{ border: '1px solid #1a1a1a' }} />
                    <button onClick={() => removeImg(i)}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center rounded-full"
                      style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
                      <Icon d={IC.x} size={8} style={{ color: '#888' }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {error && <p className="text-xs" style={{ color: '#f87171' }}>{error}</p>}
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 flex gap-3 px-6 py-5 mt-auto"
          style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid #1a1a1a' }}>
          <button onClick={onClose}
            className="flex-1 h-11 text-xs font-bold tracking-widest uppercase rounded-sm transition-colors hover:bg-white/5"
            style={{ border: '1px solid #222', color: '#666' }}>
            Cancel
          </button>
          <button onClick={submit} disabled={submitting}
            className="flex-1 h-11 text-xs font-bold tracking-widest uppercase rounded-sm transition-opacity hover:opacity-85 disabled:opacity-50"
            style={{ backgroundColor: '#F5C518', color: '#000' }}>
            {submitting ? 'Creating…' : 'Create Variant'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Variant Card ────────────────────────────────────────────────── */
const VariantCard = ({ variant, productId, onDelete, onStockUpdated }) => {
  const { handleUpdateVariantStock, handleDeleteVariant } = useProduct()

  const [stockVal,  setStockVal]  = useState(String(variant.stock ?? '0'))
  const [updating,  setUpdating]  = useState(false)
  const [deleting,  setDeleting]  = useState(false)
  const [stockMsg,  setStockMsg]  = useState('')

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
      className="flex flex-col gap-5 rounded-sm p-5"
      style={{
        backgroundColor: '#0f0f0f',
        border: '1px solid #1a1a1a',
        borderLeft: '3px solid #F5C518',
      }}
    >
      {/* Top row: attributes + actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Attribute chips */}
          {attrs.map(([k, v]) => (
            <span key={k}
              className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#1a1a1a', color: '#888', border: '1px solid #222' }}>
              {k}: {v}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={doDelete} disabled={deleting}
            className="w-8 h-8 flex items-center justify-center rounded-sm transition-colors hover:bg-red-500/10 disabled:opacity-40"
            style={{ border: '1px solid #222' }}>
            <Icon d={IC.trash} size={13} style={{ color: '#f87171' }} />
          </button>
        </div>
      </div>

      {/* Price + images row */}
      <div className="flex items-center gap-6 flex-wrap">
        {/* Price */}
        <div>
          <p className="text-[9px] font-bold tracking-widest uppercase mb-0.5" style={{ color: '#444' }}>Price</p>
          <p className="text-lg font-bold" style={{ color: '#F5C518' }}>
            ₹{Number(variant.price?.amount || 0).toLocaleString('en-IN')}
            <span className="text-[10px] font-normal ml-1" style={{ color: '#333' }}>{variant.price?.currency || 'INR'}</span>
          </p>
        </div>

        {/* Variant images */}
        {variant.images?.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {variant.images.map((img, i) => (
              <div key={i} className="w-12 h-12 rounded-sm overflow-hidden flex-shrink-0" style={{ border: '1px solid #1a1a1a' }}>
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stock management row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div>
          <p className="text-[9px] font-bold tracking-widest uppercase mb-1.5" style={{ color: '#444' }}>Stock</p>
          <div className="flex items-center gap-0">
            <button
              onClick={() => setStockVal(s => String(Math.max(0, Number(s) - 1)))}
              className="w-9 h-9 flex items-center justify-center"
              style={{ border: '1px solid #222', borderRight: 'none', borderRadius: '2px 0 0 2px' }}>
              <Icon d={IC.minus} size={13} style={{ color: '#666' }} />
            </button>
            <input
              type="number" min="0" value={stockVal}
              onChange={e => setStockVal(e.target.value)}
              className="w-16 h-9 text-center text-sm bg-transparent outline-none"
              style={{ border: '1px solid #222', borderLeft: 'none', borderRight: 'none', color: '#f0f0f0' }}
            />
            <button
              onClick={() => setStockVal(s => String(Number(s) + 1))}
              className="w-9 h-9 flex items-center justify-center"
              style={{ border: '1px solid #222', borderLeft: 'none', borderRadius: '0 2px 2px 0' }}>
              <Icon d={IC.plus} size={13} style={{ color: '#666' }} />
            </button>
          </div>
        </div>

        <div className="flex items-end gap-2 pb-0.5">
          <button
            onClick={updateStock} disabled={updating}
            className="text-[10px] font-bold tracking-widest uppercase px-4 h-9 rounded-sm transition-opacity hover:opacity-85 disabled:opacity-50 mt-auto"
            style={{ backgroundColor: '#F5C518', color: '#000' }}>
            {updating ? '…' : 'Update Stock'}
          </button>
          {stockMsg && (
            <span className="text-[10px] font-semibold"
              style={{ color: stockMsg === 'Updated!' ? '#4ade80' : '#f87171' }}>
              {stockMsg}
            </span>
          )}
        </div>
      </div>
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
    <div style={{ backgroundColor: '#060606', minHeight: '100vh' }}>
      <div className="h-14" style={{ backgroundColor: '#060606', borderBottom: '1px solid #161616' }} />
      <PageSkeleton />
    </div>
  )

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ backgroundColor: '#060606', color: '#f0f0f0' }}>
      <Icon d={IC.package} size={48} className="opacity-10" />
      <p className="text-sm" style={{ color: '#555' }}>Product not found</p>
      <button onClick={() => navigate('/seller/dashboard')}
        className="text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-sm"
        style={{ backgroundColor: '#F5C518', color: '#000' }}>
        Back to Dashboard
      </button>
    </div>
  )

  const images   = product.images || []
  const variants = product.variants || []

  return (
    <div style={{ backgroundColor: '#060606', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#f0f0f0' }}>

      {/* ══ NAVBAR ══════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-12 h-14"
        style={{ backgroundColor: 'rgba(6,6,6,0.93)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #161616' }}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/seller/dashboard')}
            className="flex items-center justify-center w-8 h-8 rounded-sm hover:bg-white/5 transition-colors"
            style={{ border: '1px solid #222' }}>
            <Icon d={IC.back} size={15} style={{ color: '#888' }} />
          </button>
          <span className="text-[10px] font-black tracking-[0.28em] uppercase px-2 py-0.5 rounded-sm"
            style={{ color: '#F5C518', border: '1px solid rgba(245,197,24,0.35)' }}>
            Snitch
          </span>
          <span className="text-[10px] font-bold tracking-widest uppercase hidden sm:block" style={{ color: '#333' }}>
            / Seller / Product Detail
          </span>
        </div>
      </nav>

      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-8">

        {/* ══ SECTION 1 — Product Overview ════════════════════════ */}
        <div className="flex flex-col sm:flex-row gap-10 mb-10" style={{ minHeight: '380px' }}>

          {/* Image mini-gallery */}
          <div className="flex gap-3 flex-shrink-0">
            {/* Thumbnails strip */}
            {images.length > 1 && (
              <div className="flex flex-col gap-2 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                {images.map((img, i) => (
                  <button key={img._id} onClick={() => setActiveImg(i)}
                    className="w-16 h-16 overflow-hidden rounded-sm flex-shrink-0 transition-all"
                    style={{ border: `1px solid ${i === activeImg ? '#F5C518' : '#1a1a1a'}`, backgroundColor: '#0a0a0a', boxShadow: i === activeImg ? '0 0 0 1px rgba(245,197,24,0.2)' : 'none' }}>
                    {!imgErr[`t${i}`] ? (
                      <img src={img.url} alt="" className="w-full h-full object-cover"
                        onError={() => setImgErr(p => ({ ...p, [`t${i}`]: true }))} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon d={IC.img} size={16} className="opacity-10" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Main preview — larger */}
            <div className="rounded-sm overflow-hidden flex-shrink-0" style={{ width: '288px', height: '380px', backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a' }}>
              {images[activeImg] && !imgErr['m'] ? (
                <img src={images[activeImg].url} alt={product.title}
                  className="w-full h-full object-cover"
                  onError={() => setImgErr(p => ({ ...p, m: true }))} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon d={IC.img} size={48} className="opacity-10" />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-3 pt-1 flex-1 min-w-0">
            {/* Status strip */}
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: '#F5C518' }}>
              Seller Dashboard
            </p>

            <h1 className="text-3xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {product.title}
            </h1>

            <div className="w-8 h-[2px]" style={{ backgroundColor: '#F5C518' }} />

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold" style={{ color: '#F5C518' }}>
                ₹{Number(product.price?.amount).toLocaleString('en-IN')}
              </span>
              <span className="text-xs" style={{ color: '#444' }}>{product.price?.currency || 'INR'}</span>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: '#555', lineHeight: 1.8 }}>
              {product.description}
            </p>

            <div className="flex items-center gap-4 mt-1 flex-wrap">
              <span className="text-[10px] tracking-wider" style={{ color: '#333' }}>
                Created: {fmtDate(product.createdAt)}
              </span>
              <span className="text-[10px] tracking-wider" style={{ color: '#333' }}>
                Updated: {fmtDate(product.updatedAt)}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-sm" style={{ backgroundColor: '#111', color: '#555', border: '1px solid #1a1a1a' }}>
                {images.length} image{images.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* divider */}
        <div className="mb-8" style={{ height: '1px', backgroundColor: '#161616' }} />

        {/* ══ SECTION 2 — Variants ════════════════════════════════ */}
        <div>
          {/* Section header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Icon d={IC.layers} size={16} style={{ color: '#F5C518' }} />
              <p className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: '#555' }}>
                Product Variants
              </p>
              <span className="text-[10px] px-2 py-0.5 rounded-sm font-semibold"
                style={{ backgroundColor: '#111', color: '#444', border: '1px solid #1a1a1a' }}>
                {variants.length}
              </span>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase px-4 py-2 rounded-sm transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#F5C518', color: '#000' }}>
              <Icon d={IC.plus} size={13} />
              Add Variant
            </button>
          </div>

          {/* Variants list */}
          {variants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 rounded-sm"
              style={{ border: '2px dashed #1a1a1a', backgroundColor: '#0a0a0a' }}>
              <Icon d={IC.tag} size={36} className="opacity-10" />
              <p className="text-sm" style={{ color: '#444' }}>No variants yet</p>
              <p className="text-xs" style={{ color: '#333' }}>Add variants to manage size, color, stock and more</p>
              <button onClick={() => setShowForm(true)}
                className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase px-4 py-2.5 rounded-sm mt-2"
                style={{ backgroundColor: '#F5C518', color: '#000' }}>
                <Icon d={IC.plus} size={12} /> Create First Variant
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
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

      {/* ══ Add Variant Panel ══════════════════════════════════════ */}
      {showForm && (
        <AddVariantForm
          productId={productId}
          onClose={() => setShowForm(false)}
          onCreated={onVariantCreated}
        />
      )}

      {/* ══ Toast ══════════════════════════════════════════════════ */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  )
}

export default SellerProductDetail
