import React, { useEffect, useState } from 'react'
import { useProduct } from '../hook/useProduct'
import { useSelector } from 'react-redux'

/* ─── tiny icon components (no extra lib needed) ─────────────────── */
const Icon = ({ d, size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d={d} />
  </svg>
)

const icons = {
  grid:    'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z',
  package: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  tag:     'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01',
  edit:    'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  eye:     'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  search:  'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
  star:    'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  img:     'M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z',
  rupee:   'M6 3h12M6 8h12M6 13l8.5 8M6 13h3a6 6 0 0 0 0-5H6',
  loader:  'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
}

/* ─── Status badge ───────────────────────────────────────────────── */
const StatusBadge = ({ inStock }) =>
  inStock ? (
    <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border border-emerald-500/60 text-emerald-400">
      Active
    </span>
  ) : (
    <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border border-red-500/50 text-red-400">
      Out of Stock
    </span>
  )

/* ─── Product Card ───────────────────────────────────────────────── */
const ProductCard = ({ product }) => {
  const [imgErr, setImgErr] = useState(false)
  const image = product.images?.[0]?.url
  const inStock = product.stock !== 0  // treat undefined as in-stock

  return (
    <div
      className="group relative flex flex-col rounded-sm overflow-hidden"
      style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '3/4', backgroundColor: '#0a0a0a' }}
      >
        {image && !imgErr ? (
          <img
            src={image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon d={icons.img} size={40} className="opacity-20" />
          </div>
        )}

        {/* Stock badge overlay top-right */}
        <div className="absolute top-3 right-3">
          <StatusBadge inStock={inStock} />
        </div>

        {/* hover action strip */}
        <div
          className="absolute inset-x-0 bottom-0 flex gap-3 justify-center py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}
        >
          <button
            className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-black px-4 py-1.5 rounded-sm transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#F5C518' }}
          >
            <Icon d={icons.eye} size={13} /> View
          </button>
          <button
            className="flex items-center gap-1.5 text-xs font-semibold tracking-wider px-4 py-1.5 rounded-sm border text-white transition-opacity hover:opacity-70"
            style={{ borderColor: '#ffffff40' }}
          >
            <Icon d={icons.edit} size={13} /> Edit
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-3 py-2.5 flex flex-col gap-1">

        <h3
          className="font-semibold leading-snug text-base line-clamp-2"
          style={{ fontFamily: "'Playfair Display', serif", color: '#f5f5f5' }}
        >
          {product.title}
        </h3>
        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: '#666' }}>
          {product.description}
        </p>

        {/* Price row */}
        <div className="flex items-center justify-between mt-2">
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: '#F5C518', fontFamily: "'Inter', sans-serif" }}
          >
            ₹{Number(product.price?.amount).toLocaleString('en-IN')}
            <span className="text-xs font-normal ml-1" style={{ color: '#555' }}>
              {product.price?.currency || 'INR'}
            </span>
          </span>

          {/* image count pill */}
          {product.images?.length > 1 && (
            <span
              className="text-[10px] font-semibold tracking-widest px-2 py-0.5 rounded"
              style={{ backgroundColor: '#1a1a1a', color: '#a3a3a3' }}
            >
              +{product.images.length} imgs
            </span>
          )}
        </div>
      </div>

      {/* golden top-border on hover */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: '#F5C518' }}
      />
    </div>
  )
}

/* ─── Empty state ────────────────────────────────────────────────── */
const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 gap-6">
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center"
      style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
    >
      <Icon d={icons.package} size={32} className="opacity-30" />
    </div>
    <div className="text-center">
      <p className="text-lg font-semibold" style={{ color: '#f5f5f5', fontFamily: "'Playfair Display', serif" }}>
        No products yet
      </p>
      <p className="text-sm mt-1" style={{ color: '#a3a3a3' }}>
        Your listed products will appear here
      </p>
    </div>
  </div>
)

/* ─── Loading skeleton ───────────────────────────────────────────── */
const Skeleton = () => (
  <div
    className="rounded-sm overflow-hidden animate-pulse"
    style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
  >
    <div className="w-full bg-[#1a1a1a]" style={{ aspectRatio: '4/5' }} />
    <div className="px-4 py-4 flex flex-col gap-3">
      <div className="h-2.5 rounded bg-[#1a1a1a] w-1/3" />
      <div className="h-4 rounded bg-[#1a1a1a] w-3/4" />
      <div className="h-3 rounded bg-[#1a1a1a] w-full" />
      <div className="h-3 rounded bg-[#1a1a1a] w-2/3" />
    </div>
  </div>
)

/* ─── Main Component ─────────────────────────────────────────────── */
const SellerDashbord = () => {
  const { handleFetchSellerProducts } = useProduct()
  const sellerProducts = useSelector((state) => state.product.sellerProducts)

  const [loading, setLoading]   = useState(true)
  const [search,  setSearch]    = useState('')
  const [filter,  setFilter]    = useState('ALL')

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      await handleFetchSellerProducts().catch(() => {})
      setLoading(false)
    }
    fetch()
  }, [])

  /* filter logic */
  const tabs = ['ALL', 'OUT OF STOCK']
  const filtered = (sellerProducts || []).filter((p) => {
    const matchSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())

    const inStock = p.stock !== 0
    const matchFilter =
      filter === 'ALL' ||
      (filter === 'OUT OF STOCK' && !inStock)

    return matchSearch && matchFilter
  })

  const stats = [
    { label: 'Total Products', value: sellerProducts?.length ?? 0, accent: true },
    {
      label: 'Out of Stock',
      value: sellerProducts?.filter((p) => p.stock === 0).length ?? 0,
      accent: false,
    },
  ]

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor: '#050505',
        fontFamily: "'Inter', sans-serif",
        color: '#f5f5f5',
      }}
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-8 py-3"
        style={{
          backgroundColor: 'rgba(5,5,5,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #1a1a1a',
        }}
      >
        <div>
          <p
            className="text-[11px] font-bold tracking-[0.2em] uppercase mb-0.5"
            style={{ color: '#F5C518' }}
          >
            Snitch
          </p>
          <h1
            className="text-2xl font-semibold leading-none"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Seller Dashboard
          </h1>
        </div>

        {/* Search */}
        <div className="relative w-72 hidden md:block">
          <Icon
            d={icons.search}
            size={16}
            className="absolute left-0 top-1/2 -translate-y-1/2 opacity-40"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-transparent pl-6 pb-1.5 text-sm outline-none placeholder:text-[#444]"
            style={{
              borderBottom: '1px solid',
              borderColor: search ? '#F5C518' : '#333',
              color: '#f5f5f5',
              transition: 'border-color 0.2s',
            }}
          />
        </div>
      </header>

      <main className="px-6 md:px-12 lg:px-20 pt-6 pb-16 max-w-screen-xl mx-auto">

        {/* ── Stat cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-sm px-5 py-4 flex flex-col gap-1"
              style={{
                backgroundColor: '#111111',
                borderTop: `2px solid ${s.accent ? '#F5C518' : '#1f1f1f'}`,
                border: '1px solid #1f1f1f',
                borderTopColor: s.accent ? '#F5C518' : '#1f1f1f',
              }}
            >
              <p
                className="text-[10px] font-bold tracking-[0.18em] uppercase"
                style={{ color: '#a3a3a3' }}
              >
                {s.label}
              </p>
              <p
                className="text-2xl font-bold leading-none"
                style={{
                  color: s.accent ? '#F5C518' : '#f5f5f5',
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                {loading ? '—' : s.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Section heading + filter tabs ────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <p
            className="text-[11px] font-bold tracking-[0.2em] uppercase"
            style={{ color: '#a3a3a3' }}
          >
            My Products
          </p>

          <div className="flex items-center gap-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className="text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-sm transition-all duration-200"
                style={{
                  backgroundColor: filter === t ? '#F5C518' : 'transparent',
                  color: filter === t ? '#000' : '#a3a3a3',
                  border: filter === t ? '1px solid #F5C518' : '1px solid #1f1f1f',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile search */}
        <div className="relative mb-8 md:hidden">
          <Icon
            d={icons.search}
            size={16}
            className="absolute left-0 top-1/2 -translate-y-1/2 opacity-40"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-transparent pl-6 pb-1.5 text-sm outline-none placeholder:text-[#444]"
            style={{
              borderBottom: `1px solid ${search ? '#F5C518' : '#333'}`,
              color: '#f5f5f5',
            }}
          />
        </div>

        {/* ── Divider ──────────────────────────────────────────── */}
        <div className="mb-5" style={{ height: '1px', backgroundColor: '#1a1a1a' }} />

        {/* ── Grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>

        {/* ── Result count ─────────────────────────────────────── */}
        {!loading && filtered.length > 0 && (
          <p
            className="mt-12 text-center text-xs tracking-widest uppercase"
            style={{ color: '#333' }}
          >
            Showing {filtered.length} of {sellerProducts?.length} products
          </p>
        )}
      </main>
    </div>
  )
}

export default SellerDashbord