import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useProduct } from '../hook/useProduct'

/* ── icon helper ─────────────────────────────────────────────────── */
const Icon = ({ d, size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    <path d={d} />
  </svg>
)
const PATHS = {
  search: 'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
  cart:   'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0',
  img:    'M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z',
  arrow:  'M5 12h14M12 5l7 7-7 7',
  bag:    'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0',
}

/* ── Skeleton ────────────────────────────────────────────────────── */
const CardSkeleton = () => (
  <div className="animate-pulse rounded-sm overflow-hidden"
    style={{ backgroundColor: '#0f0f0f', border: '1px solid #1a1a1a' }}>
    <div style={{ aspectRatio: '3/4', backgroundColor: '#161616' }} />
    <div className="px-3 py-3 flex flex-col gap-2">
      <div className="h-3 rounded bg-[#1c1c1c] w-3/4" />
      <div className="h-2.5 rounded bg-[#1c1c1c] w-full" />
      <div className="h-4 rounded bg-[#1c1c1c] w-1/3 mt-1" />
    </div>
  </div>
)

/* ── Product Card ────────────────────────────────────────────────── */
const ProductCard = ({ product }) => {
  const [imgErr, setImgErr] = useState(false)
  const img = product.images?.[0]?.url

  const desc = product.description && product.description.length > 50
    ? product.description.slice(0, 50) + '…'
    : product.description

  return (
    <article
      className="group flex flex-col overflow-hidden cursor-pointer"
      style={{ backgroundColor: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '2px' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden flex-shrink-0"
        style={{ aspectRatio: '3/4', backgroundColor: '#080808' }}>
        {img && !imgErr ? (
          <img
            src={img} alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon d={PATHS.img} size={36} className="opacity-10" />
          </div>
        )}

        {/* hover CTA */}
        <div
          className="absolute inset-x-0 bottom-0 flex justify-center pb-3 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}
        >
          <button
            className="text-[10px] font-bold tracking-widest uppercase px-5 py-2 rounded-sm text-black"
            style={{ backgroundColor: '#F5C518' }}
          >
            Add to Cart
          </button>
        </div>

        {/* gold line on hover */}
        <div
          className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
          style={{ backgroundColor: '#F5C518' }}
        />
      </div>

      {/* Info */}
      <div className="px-3 py-3">
        <h3
          className="text-sm font-semibold leading-snug truncate mb-1"
          style={{ fontFamily: "'Playfair Display', serif", color: '#f0f0f0' }}
        >
          {product.title}
        </h3>

        <p className="text-[11px] leading-relaxed mb-2 line-clamp-1" style={{ color: '#4a4a4a' }}>
          {desc}
        </p>

        <p className="text-sm font-bold" style={{ color: '#F5C518' }}>
          ₹{Number(product.price?.amount).toLocaleString('en-IN')}
          <span className="text-[10px] font-normal ml-1" style={{ color: '#333' }}>
            {product.price?.currency || 'INR'}
          </span>
        </p>
      </div>
    </article>
  )
}

/* ════════════════════════════════════════════════════════════════════
   HOME PAGE
════════════════════════════════════════════════════════════════════ */
const Home = () => {
  const { handleFetchAllProducts } = useProduct()
  const allProducts = useSelector((state) => state.product.allProducts)

  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      await handleFetchAllProducts().catch(() => {})
      setLoading(false)
    })()
  }, [])

  const products = allProducts || []
  const filtered = search.trim()
    ? products.filter(p =>
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      )
    : products

  return (
    <div style={{ backgroundColor: '#060606', fontFamily: "'Inter', sans-serif", color: '#f0f0f0', minHeight: '100vh' }}>

      {/* ══ NAVBAR ══════════════════════════════════════════════════ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 30,
        backgroundColor: 'rgba(6,6,6,0.93)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #161616',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: '0 40px', height: '60px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px',
        }}>
          {/* Logo */}
          <span style={{
            fontSize: '10px', fontWeight: 900, letterSpacing: '0.28em',
            textTransform: 'uppercase', color: '#F5C518',
            border: '1px solid rgba(245,197,24,0.35)',
            padding: '3px 8px', borderRadius: '2px', flexShrink: 0,
          }}>
            Snitch
          </span>



          {/* Search + Cart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
            <div style={{ position: 'relative' }}>
              <Icon d={PATHS.search} size={13}
                className="absolute left-0 top-1/2 -translate-y-1/2 opacity-30"
                style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products…"
                style={{
                  background: 'transparent', border: 'none', outline: 'none',
                  borderBottom: `1px solid ${search ? '#F5C518' : '#222'}`,
                  paddingLeft: '20px', paddingBottom: '2px',
                  fontSize: '12px', color: '#f0f0f0', width: '160px',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>
            <Icon d={PATHS.cart} size={19} style={{ opacity: 0.5, cursor: 'pointer' }} />
          </div>
        </div>
      </nav>

      {/* ══ HERO ════════════════════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(160deg,#0a0a0a 0%,#12100a 60%,#060606 100%)',
        borderBottom: '1px solid #141414',
        padding: '56px 40px 48px',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em',
          textTransform: 'uppercase', color: '#F5C518', marginBottom: '16px',
        }}>
          New Collection · 2026
        </p>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 700, lineHeight: 1.15,
          color: '#f5f5f5', margin: '0 auto 16px',
          letterSpacing: '-0.02em',
        }}>
          Discover the{' '}
          <span style={{ color: '#F5C518' }}>Collection</span>
        </h1>

        <p style={{
          fontSize: '13px', color: '#555', marginBottom: '28px',
          lineHeight: '1.7', maxWidth: '360px', margin: '0 auto 28px',
        }}>
          Curated pieces for those who demand the extraordinary.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#F5C518', color: '#000',
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em',
            textTransform: 'uppercase', padding: '12px 28px',
            borderRadius: '2px', border: 'none', cursor: 'pointer',
          }}>
            Shop Now
          </button>
          <button style={{
            display: 'inline-flex', alignItems: 'center',
            backgroundColor: 'transparent', color: '#f0f0f0',
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em',
            textTransform: 'uppercase', padding: '12px 28px',
            borderRadius: '2px', border: '1px solid #2a2a2a', cursor: 'pointer',
          }}>
            View Lookbook
          </button>
        </div>
      </div>

      {/* ══ PRODUCTS ════════════════════════════════════════════════ */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 40px 80px' }}>

        {/* toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '18px', height: '2px', backgroundColor: '#F5C518' }} />
            <span style={{
              fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.25em', textTransform: 'uppercase', color: '#555',
            }}>
              All Products
            </span>
          </div>
          {!loading && (
            <span style={{ fontSize: '10px', color: '#333', letterSpacing: '0.1em' }}>
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>

        {/* divider */}
        <div style={{ height: '1px', backgroundColor: '#111', marginBottom: '28px' }} />

        {/* grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
            : filtered.length === 0
              ? (
                <div style={{
                  gridColumn: '1/-1', textAlign: 'center',
                  padding: '80px 0', color: '#444', fontSize: '13px',
                }}>
                  No products found
                </div>
              )
              : filtered.map(p => <ProductCard key={p._id} product={p} />)
          }
        </div>
      </div>

      {/* ══ FOOTER ══════════════════════════════════════════════════ */}
      <footer style={{
        borderTop: '1px solid #111', backgroundColor: '#060606',
        padding: '20px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <span style={{
          fontSize: '10px', fontWeight: 900, letterSpacing: '0.25em',
          textTransform: 'uppercase', color: '#F5C518',
          border: '1px solid rgba(245,197,24,0.25)',
          padding: '2px 7px', borderRadius: '2px',
        }}>
          Snitch
        </span>
        <span style={{ fontSize: '10px', color: '#2a2a2a', letterSpacing: '0.1em' }}>
          © 2026 Snitch. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" style={{
              fontSize: '10px', color: '#2a2a2a',
              textDecoration: 'none', letterSpacing: '0.1em',
            }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}

export default Home