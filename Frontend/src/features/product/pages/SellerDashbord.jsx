import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useProduct } from '../hook/useProduct'
import { useSelector } from 'react-redux'

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

/* ── Google Fonts injection ─────────────────────────────────────── */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .snitch-search-input::placeholder { color: ${T.walnut}; opacity: 0.65; }
    .snitch-search-input:focus { outline: none; border-bottom-color: ${T.caramel} !important; }

    .snitch-chip-btn { cursor: pointer; transition: background 0.15s, color 0.15s; }
    .snitch-chip-btn:hover { opacity: 0.8; }

    .snitch-create-btn { cursor: pointer; transition: background 0.18s; }
    .snitch-create-btn:hover { background-color: ${T.walnut} !important; }
    .snitch-create-btn:active { transform: scale(0.97); }

    .snitch-card { cursor: pointer; transition: box-shadow 0.22s; }
    .snitch-card:hover { box-shadow: 0 4px 24px rgba(59,31,12,0.10); }
    .snitch-card:hover .snitch-card-top-border { transform: scaleX(1) !important; }
    .snitch-card:hover .snitch-card-overlay { opacity: 1 !important; }
    .snitch-card:hover .snitch-card-actions { opacity: 1 !important; }
    .snitch-card:hover .snitch-card-img { transform: scale(1.04); }

    .snitch-card-top-border { transition: transform 0.28s ease; transform-origin: left; }
    .snitch-card-overlay    { transition: opacity 0.28s ease; }
    .snitch-card-actions    { transition: opacity 0.28s ease; }
    .snitch-card-img        { transition: transform 0.6s ease; }

    .snitch-view-btn  { cursor: pointer; transition: opacity 0.15s; }
    .snitch-view-btn:hover  { opacity: 0.82; }
    .snitch-edit-btn  { cursor: pointer; transition: opacity 0.15s; }
    .snitch-edit-btn:hover  { opacity: 0.72; }

    .snitch-empty-btn { cursor: pointer; transition: background 0.18s; }
    .snitch-empty-btn:hover { background-color: ${T.walnut} !important; }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.45; }
    }
    .snitch-skeleton { animation: pulse 1.6s ease-in-out infinite; }
  `}</style>
)

/* ── SVG icon helper ─────────────────────────────────────────────── */
const Icon = ({ d, size = 18, color = 'currentColor', style: extraStyle = {}, ...rest }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8}
    strokeLinecap="round" strokeLinejoin="round"
    style={{ display: 'inline-block', flexShrink: 0, ...extraStyle }}
    {...rest}
  >
    <path d={d} />
  </svg>
)

const PATHS = {
  plus:   'M12 5v14M5 12h14',
  search: 'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
  img:    'M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z',
  eye:    'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  edit:   'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  box:    'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
}

/* ── Status badge ────────────────────────────────────────────────── */
const Badge = ({ inStock }) => (
  <span
    style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '8px',
      fontWeight: 700,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      padding: '2px 7px',
      borderRadius: '2px',
      color:           inStock ? '#16a34a' : '#dc2626',
      backgroundColor: inStock ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.07)',
      border: `1px solid ${inStock ? 'rgba(22,163,74,0.35)' : 'rgba(220,38,38,0.35)'}`,
    }}
  >
    {inStock ? 'Active' : 'Out of Stock'}
  </span>
)

/* ── Product card ────────────────────────────────────────────────── */
const ProductCard = ({ product, onClick }) => {
  const [err, setErr] = useState(false)
  const img     = product.images?.[0]?.url
  const inStock = product.stock !== 0

  return (
    <article
      className="snitch-card"
      style={{
        backgroundColor: T.white,
        border: `1px solid ${T.outline}`,
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
      onClick={onClick}
    >
      {/* ── Image ── */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
          aspectRatio: '3/4',
          backgroundColor: T.surface,
        }}
      >
        {/* caramel top border on hover */}
        <div
          className="snitch-card-top-border"
          style={{
            position: 'absolute',
            inset: '0 0 auto 0',
            height: '2px',
            backgroundColor: T.caramel,
            transform: 'scaleX(0)',
            zIndex: 4,
          }}
        />

        {img && !err ? (
          <img
            src={img}
            alt={product.title}
            className="snitch-card-img"
            onError={() => setErr(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div
            style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon d={PATHS.img} size={36} color={T.walnut} style={{ opacity: 0.18 }} />
          </div>
        )}

        {/* Status badge */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 3 }}>
          <Badge inStock={inStock} />
        </div>

        {/* Hover overlay */}
        <div
          className="snitch-card-overlay"
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(59,31,12,0.72) 0%, transparent 55%)',
            opacity: 0,
            zIndex: 2,
          }}
        />

        {/* Hover action buttons */}
        <div
          className="snitch-card-actions"
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            paddingBottom: '14px', gap: '8px',
            opacity: 0, zIndex: 3,
          }}
        >
          <button
            className="snitch-view-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '6px 12px',
              borderRadius: 0,
              backgroundColor: T.caramel,
              color: T.espresso,
              border: 'none',
            }}
          >
            <Icon d={PATHS.eye} size={11} color={T.espresso} /> View
          </button>
          <button
            className="snitch-edit-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '6px 12px',
              borderRadius: 0,
              backgroundColor: 'transparent',
              color: T.bg,
              border: `1px solid rgba(253,249,243,0.5)`,
            }}
          >
            <Icon d={PATHS.edit} size={11} color={T.bg} /> Edit
          </button>
        </div>
      </div>

      {/* ── Info ── */}
      <div style={{ padding: '12px 12px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h3
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px', fontWeight: 500,
            color: T.espresso,
            lineHeight: 1.3,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {product.title}
        </h3>

        <span
          style={{
            fontFamily: "'EB Garamond', serif",
            fontStyle: 'italic',
            fontSize: '16px',
            color: T.caramel,
            lineHeight: 1,
          }}
        >
          ₹{Number(product.price?.amount).toLocaleString('en-IN')}
        </span>
      </div>
    </article>
  )
}

/* ── Skeleton card ───────────────────────────────────────────────── */
const Skeleton = () => (
  <div
    className="snitch-skeleton"
    style={{
      backgroundColor: T.sand,
      border: `1px solid ${T.outline}`,
      borderRadius: 0,
      overflow: 'hidden',
    }}
  >
    <div style={{ aspectRatio: '3/4', backgroundColor: T.outline }} />
    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ height: '11px', backgroundColor: T.outline, width: '70%', borderRadius: '2px' }} />
      <div style={{ height: '14px', backgroundColor: T.outline, width: '40%', borderRadius: '2px' }} />
    </div>
  </div>
)

/* ── Empty state ─────────────────────────────────────────────────── */
const Empty = ({ onAdd }) => (
  <div
    style={{
      gridColumn: '1 / -1',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '80px 0', gap: '20px',
    }}
  >
    <div
      style={{
        width: '64px', height: '64px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: T.sand, border: `1px solid ${T.outline}`,
      }}
    >
      <Icon d={PATHS.box} size={28} color={T.walnut} style={{ opacity: 0.45 }} />
    </div>

    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
      <p
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: '20px', fontWeight: 400,
          color: T.espresso, lineHeight: 1.2,
        }}
      >
        No products listed yet
      </p>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '13px', color: T.walnut,
        }}
      >
        Add your first product to get started
      </p>
      <button
        className="snitch-empty-btn"
        onClick={onAdd}
        style={{
          marginTop: '10px',
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em',
          textTransform: 'uppercase',
          padding: '10px 22px',
          borderRadius: 0, border: 'none',
          backgroundColor: T.espresso,
          color: T.bg, cursor: 'pointer',
        }}
      >
        <Icon d={PATHS.plus} size={13} color={T.bg} />
        Create Product
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
    <div style={{ backgroundColor: T.bg, minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: T.espresso }}>
      <FontStyle />



      {/* ══ MAIN ════════════════════════════════════════════════════ */}
      <main
        style={{
          maxWidth: '1440px', margin: '0 auto',
          padding: '32px 64px 24px',
        }}
      >

        {/* ── Stats row ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          {/* Card 1 — Total Products */}
          <div
            style={{
              backgroundColor: T.sand,
              padding: '16px 24px',
              borderTop: `2px solid ${T.caramel}`,
              display: 'flex', alignItems: 'center', gap: '16px',
              flex: 1,
            }}
          >
            <Icon d={PATHS.layers} size={18} color={T.walnut} style={{ opacity: 0.5, flexShrink: 0 }} />
            <div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '9px', fontWeight: 500,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: T.faint, marginBottom: '4px',
                }}
              >
                Total Products
              </p>
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: '32px', fontWeight: 400,
                  color: T.espresso, lineHeight: 1,
                }}
              >
                {loading ? '–' : products.length}
              </p>
            </div>
          </div>

          {/* Card 2 — Out of Stock */}
          <div
            style={{
              backgroundColor: T.sand,
              padding: '16px 24px',
              borderTop: `2px solid ${T.outline}`,
              display: 'flex', alignItems: 'center', gap: '16px',
              flex: 1,
            }}
          >
            <Icon d={PATHS.layers} size={18} color={T.walnut} style={{ opacity: 0.5, flexShrink: 0 }} />
            <div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '9px', fontWeight: 500,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: T.faint, marginBottom: '4px',
                }}
              >
                Out of Stock
              </p>
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: '32px', fontWeight: 400,
                  color: T.walnut, lineHeight: 1,
                }}
              >
                {loading ? '–' : products.filter(p => p.stock === 0).length}
              </p>
            </div>
          </div>
        </div>

        {/* ── Section header ────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '16px',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          {/* Left: eyebrow + title */}
          <div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '10px', fontWeight: 500,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: T.caramel, marginBottom: '4px',
              }}
            >
              My Products
              {!loading && (
                <span style={{ marginLeft: '8px', fontWeight: 400, color: T.faint }}>
                  ({filtered.length})
                </span>
              )}
            </p>
            <h2
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: '22px', fontWeight: 400,
                color: T.espresso, lineHeight: 1,
              }}
            >
              Product Catalogue
            </h2>
          </div>

          {/* Right: Search + Create Product + filter chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative', width: '220px' }}>
              <span
                style={{
                  position: 'absolute', left: 0, top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex', alignItems: 'center',
                  pointerEvents: 'none',
                }}
              >
                <Icon d={PATHS.search} size={14} color={T.faint} style={{ opacity: 0.7 }} />
              </span>
              <input
                className="snitch-search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products…"
                style={{
                  width: '100%',
                  background: 'transparent',
                  paddingLeft: '22px',
                  paddingBottom: '4px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px',
                  color: T.espresso,
                  border: 'none',
                  borderBottom: `1px solid ${search ? T.caramel : T.outline}`,
                  transition: 'border-color 0.2s',
                }}
              />
            </div>

            {/* Filter chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {tabs.map(t => (
                <button
                  key={t}
                  className="snitch-chip-btn"
                  onClick={() => setFilter(t)}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '9px', fontWeight: 500,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    padding: '6px 12px',
                    borderRadius: 0,
                    backgroundColor: filter === t ? T.espresso : 'transparent',
                    color:           filter === t ? T.bg       : T.faint,
                    border:          filter === t ? `1px solid ${T.espresso}` : `1px solid ${T.outline}`,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Create Product Button */}
            <button
              className="snitch-create-btn"
              onClick={goCreate}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '8px 16px',
                borderRadius: 0, border: 'none',
                backgroundColor: T.espresso,
                color: T.bg,
              }}
            >
              <Icon d={PATHS.plus} size={13} color={T.bg} />
              Create Product
            </button>
          </div>
        </div>

        {/* Thin divider */}
        <div style={{ height: '1px', backgroundColor: T.sand, marginBottom: '20px' }} />

        {/* ── Product grid ──────────────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} />)
            : filtered.length === 0
              ? <Empty onAdd={goCreate} />
              : filtered.map(p => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    onClick={() => navigate(`/seller/product/${p._id}`)}
                  />
                ))
          }
        </div>

        {/* result count */}
        {!loading && filtered.length > 0 && (
          <p
            style={{
              marginTop: '40px', textAlign: 'center',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase',
              color: T.outline,
            }}
          >
            Showing {filtered.length} of {products.length} products
          </p>
        )}

        {/* ── Footer strip ──────────────────────────────────────── */}
        <div
          style={{
            borderTop: `1px solid ${T.outline}`,
            marginTop: '48px', paddingTop: '16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: '16px', fontWeight: 400,
              letterSpacing: '0.12em',
              color: T.espresso,
            }}
          >
            Snitch
          </span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '11px',
              color: T.faint,
            }}
          >
            © {new Date().getFullYear()} Snitch Menswear. All rights reserved.
          </span>
        </div>

      </main>
    </div>
  )
}

export default SellerDashbord