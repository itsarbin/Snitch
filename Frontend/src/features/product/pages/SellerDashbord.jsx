import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useProduct } from '../hook/useProduct'
import { useSelector } from 'react-redux'

/* ── SVG icon helper ─────────────────────────────────────────────── */
const Icon = ({ d, size = 18, className = '' }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8}
    strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    <path d={d} />
  </svg>
)

const PATHS = {
  plus:    'M12 5v14M5 12h14',
  search:  'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
  img:     'M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z',
  eye:     'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  edit:    'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  box:     'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  layers:  'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
}

/* ── Status badge ────────────────────────────────────────────────── */
const Badge = ({ inStock }) => (
  <span
    className="text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-sm"
    style={
      inStock
        ? { border: '1px solid rgba(52,211,153,0.5)', color: '#34d399', backgroundColor: 'rgba(52,211,153,0.06)' }
        : { border: '1px solid rgba(239,68,68,0.45)', color: '#f87171', backgroundColor: 'rgba(239,68,68,0.06)' }
    }
  >
    {inStock ? 'Active' : 'Out of stock'}
  </span>
)

/* ── Product card ────────────────────────────────────────────────── */
const ProductCard = ({ product }) => {
  const [err, setErr] = useState(false)
  const img     = product.images?.[0]?.url
  const inStock = product.stock !== 0

  return (
    <article
      className="group relative flex flex-col overflow-hidden transition-all duration-300"
      style={{ backgroundColor: '#0f0f0f', border: '1px solid #1c1c1c', borderRadius: '2px' }}
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden shrink-0" style={{ aspectRatio: '3/4', backgroundColor: '#080808' }}>
        {img && !err ? (
          <img
            src={img} alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            onError={() => setErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon d={PATHS.img} size={36} className="opacity-[0.12]" />
          </div>
        )}

        {/* badge */}
        <div className="absolute top-2.5 left-2.5">
          <Badge inStock={inStock} />
        </div>

        {/* hover overlay actions */}
        <div
          className="absolute inset-0 flex items-end justify-center pb-4 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }}
        >
          <button
            className="flex items-center gap-1 text-[11px] font-semibold tracking-wider px-3 py-1.5 rounded-sm text-black transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#F5C518' }}
          >
            <Icon d={PATHS.eye} size={11} /> View
          </button>
          <button
            className="flex items-center gap-1 text-[11px] font-semibold tracking-wider px-3 py-1.5 rounded-sm text-white transition-opacity hover:opacity-70"
            style={{ border: '1px solid rgba(255,255,255,0.25)' }}
          >
            <Icon d={PATHS.edit} size={11} /> Edit
          </button>
        </div>

        {/* gold top-line on hover */}
        <div
          className="absolute inset-x-0 top-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
          style={{ backgroundColor: '#F5C518' }}
        />
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col gap-0.5 px-3 py-3">
        <h3
          className="text-sm font-semibold leading-snug line-clamp-1"
          style={{ fontFamily: "'Playfair Display', serif", color: '#f0f0f0' }}
        >
          {product.title}
        </h3>

        <div className="flex items-center justify-between mt-1.5">
          <span className="text-base font-bold" style={{ color: '#F5C518' }}>
            ₹{Number(product.price?.amount).toLocaleString('en-IN')}
            <span className="text-[10px] font-normal ml-1" style={{ color: '#444' }}>
              {product.price?.currency || 'INR'}
            </span>
          </span>

          {product.images?.length > 1 && (
            <span
              className="text-[9px] font-semibold tracking-wider px-1.5 py-0.5 rounded"
              style={{ backgroundColor: '#1a1a1a', color: '#555' }}
            >
              {product.images.length} photos
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

/* ── Skeleton ────────────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-sm" style={{ backgroundColor: '#0f0f0f', border: '1px solid #1c1c1c' }}>
    <div style={{ aspectRatio: '3/4', backgroundColor: '#161616' }} />
    <div className="px-3 py-3 flex flex-col gap-2">
      <div className="h-3 rounded-sm bg-[#1c1c1c] w-3/4" />
      <div className="h-4 rounded-sm bg-[#1c1c1c] w-1/3" />
    </div>
  </div>
)

/* ── Empty state ─────────────────────────────────────────────────── */
const Empty = ({ onAdd }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 gap-5">
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center"
      style={{ backgroundColor: '#111', border: '1px solid #222' }}
    >
      <Icon d={PATHS.box} size={28} className="opacity-25" />
    </div>
    <div className="text-center">
      <p className="text-base font-semibold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: '#f0f0f0' }}>
        No products listed yet
      </p>
      <p className="text-xs mb-4" style={{ color: '#555' }}>Add your first product to get started</p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-sm text-black transition-opacity hover:opacity-85"
        style={{ backgroundColor: '#F5C518' }}
      >
        <Icon d={PATHS.plus} size={13} /> Create Product
      </button>
    </div>
  </div>
)

/* ════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════════ */
const SellerDashbord = () => {
  const navigate        = useNavigate()
  const { handleFetchSellerProducts } = useProduct()
  const sellerProducts  = useSelector((state) => state.product.sellerProducts)

  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState('ALL')

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      await handleFetchSellerProducts().catch(() => {})
      setLoading(false)
    })()
  }, [])

  const tabs     = ['ALL', 'OUT OF STOCK']
  const products = sellerProducts || []

  const filtered = products.filter((p) => {
    const q       = search.toLowerCase()
    const matches = p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    const inStock = p.stock !== 0
    const byTab   = filter === 'ALL' || (filter === 'OUT OF STOCK' && !inStock)
    return matches && byTab
  })

  const goCreate = () => navigate('/seller/create-product')

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#060606', fontFamily: "'Inter', sans-serif", color: '#f0f0f0' }}
    >

      {/* ══ HEADER ══════════════════════════════════════════════════ */}
      <header
        className="sticky top-0 z-30"
        style={{ backgroundColor: 'rgba(6,6,6,0.9)', backdropFilter: 'blur(24px)', borderBottom: '1px solid #181818' }}
      >
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 h-14 flex items-center justify-between gap-6">

          {/* Brand + title */}
          <div className="flex items-center gap-4 shrink-0">
            <span
              className="text-[10px] font-black tracking-[0.25em] uppercase px-2 py-0.5"
              style={{ color: '#F5C518', border: '1px solid rgba(245,197,24,0.3)', borderRadius: '2px' }}
            >
              Snitch
            </span>
            <h1
              className="text-lg font-semibold leading-none hidden sm:block"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Seller Dashboard
            </h1>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs hidden md:block">
            <Icon d={PATHS.search} size={14} className="absolute left-0 top-1/2 -translate-y-1/2 opacity-30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full bg-transparent pl-5 pb-1 text-sm outline-none placeholder-[#383838]"
              style={{
                color: '#f0f0f0',
                borderBottom: `1px solid ${search ? '#F5C518' : '#252525'}`,
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          {/* ★ Create Product button ★ */}
          <button
            onClick={goCreate}
            className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase px-4 py-2 rounded-sm text-black shrink-0 transition-opacity hover:opacity-85 active:scale-95"
            style={{ backgroundColor: '#F5C518' }}
          >
            <Icon d={PATHS.plus} size={13} />
            <span>Create Product</span>
          </button>

        </div>
      </header>

      {/* ══ MAIN ════════════════════════════════════════════════════ */}
      <main className="max-w-screen-xl mx-auto px-6 md:px-10 pt-7 pb-20">

        {/* ── Stats row ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 mb-7">
          {[
            { label: 'Total Products', value: products.length, gold: true },
            { label: 'Out of Stock',   value: products.filter(p => p.stock === 0).length, gold: false },
          ].map(s => (
            <div
              key={s.label}
              className="flex items-center gap-4 px-5 py-3.5 rounded-sm"
              style={{
                backgroundColor: '#0f0f0f',
                border: '1px solid #1c1c1c',
                borderTop: `2px solid ${s.gold ? '#F5C518' : '#1c1c1c'}`,
              }}
            >
              <Icon d={PATHS.layers} size={18} className="opacity-20 shrink-0" />
              <div>
                <p className="text-[9px] font-bold tracking-[0.18em] uppercase mb-0.5" style={{ color: '#555' }}>
                  {s.label}
                </p>
                <p
                  className="text-2xl font-bold leading-none"
                  style={{ color: s.gold ? '#F5C518' : '#f0f0f0', fontFamily: "'Playfair Display', serif" }}
                >
                  {loading ? '–' : s.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Toolbar: label + filters ─────────────────────────── */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: '#444' }}>
            My Products
            {!loading && (
              <span className="ml-2 font-normal" style={{ color: '#333' }}>({filtered.length})</span>
            )}
          </p>

          <div className="flex items-center gap-1">
            {tabs.map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className="text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm transition-all duration-150"
                style={{
                  backgroundColor: filter === t ? '#F5C518' : 'transparent',
                  color:           filter === t ? '#000'    : '#444',
                  border:          filter === t ? '1px solid #F5C518' : '1px solid #1e1e1e',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* mobile search */}
        <div className="relative mb-4 md:hidden">
          <Icon d={PATHS.search} size={14} className="absolute left-0 top-1/2 -translate-y-1/2 opacity-25" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-transparent pl-5 pb-1 text-sm outline-none placeholder-[#383838]"
            style={{ color: '#f0f0f0', borderBottom: `1px solid ${search ? '#F5C518' : '#252525'}` }}
          />
        </div>

        {/* thin divider */}
        <div className="mb-5" style={{ height: '1px', backgroundColor: '#141414' }} />

        {/* ── Product grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} />)
            : filtered.length === 0
              ? <Empty onAdd={goCreate} />
              : filtered.map(p => <ProductCard key={p._id} product={p} />)
          }
        </div>

        {/* result count */}
        {!loading && filtered.length > 0 && (
          <p className="mt-10 text-center text-[10px] tracking-widest uppercase" style={{ color: '#282828' }}>
            {filtered.length} / {products.length} products
          </p>
        )}

      </main>
    </div>
  )
}

export default SellerDashbord