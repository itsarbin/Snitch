import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useProduct } from '../hook/useProduct'
import { useNavigate } from 'react-router'

/* ─── Google Fonts ──────────────────────────────────────────────── */
const FontInjector = () => {
  useEffect(() => {
    if (document.getElementById('snitch-fonts')) return
    const link = document.createElement('link')
    link.id = 'snitch-fonts'
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap'
    document.head.appendChild(link)
  }, [])
  return null
}

/* ─── Design tokens ─────────────────────────────────────────────── */
const C = {
  bg:          '#fdf9f3',   // warm cream canvas
  bgAlt:       '#f7f3ed',   // slightly deeper cream
  surface:     '#f1ede7',   // card/section surfaces
  surfaceHigh: '#ebe8e2',   // elevated surface
  sand:        '#e8d5b7',   // sand — footer bg, chips
  outline:     '#d4c3ba',   // subtle borders
  outlineDark: 'rgba(59,31,12,0.12)', // espresso at low opacity

  espresso:    '#3b1f0c',   // primary text + CTAs
  walnut:      '#7b4a2d',   // secondary text
  caramel:     '#c17a3f',   // accent / interactive
  caramelLight:'#e09f65',   // hover state

  onSurface:   '#1c1c18',
  muted:       '#50443e',
  faint:       '#82746d',

  serif:   "'EB Garamond', Georgia, serif",
  sans:    "'DM Sans', system-ui, sans-serif",
}

/* ─── SVG Icon helper ───────────────────────────────────────────── */
const Icon = ({ d, size = 20, style = {} }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
    style={style}
  >
    <path d={d} />
  </svg>
)
const IC = {
  search: 'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
  bag:    'M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z',
  arrow:  'M5 12h14M12 5l7 7-7 7',
  img:    'M21 15.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 15.5v-11A2.5 2.5 0 0 1 5.5 2h13A2.5 2.5 0 0 1 21 4.5zM8.5 10l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z',
}

/* ─── Skeleton ──────────────────────────────────────────────────── */
const CardSkeleton = () => (
  <div style={{ background: C.surface, overflow: 'hidden' }}>
    <style>{`@keyframes skel{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    <div style={{ aspectRatio: '2/3', background: C.surfaceHigh, animation: 'skel 1.6s ease-in-out infinite' }} />
    <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '8px', animation: 'skel 1.6s ease-in-out infinite' }}>
      <div style={{ height: '10px', width: '45%', background: C.outline }} />
      <div style={{ height: '14px', width: '75%', background: C.outline }} />
      <div style={{ height: '12px', width: '30%', background: C.sand, marginTop: '4px' }} />
    </div>
  </div>
)

/* ─── Product Card ──────────────────────────────────────────────── */
const ProductCard = ({ product, onClick }) => {
  const [hovered, setHovered] = useState(false)
  const [imgErr, setImgErr]   = useState(false)
  const img = product.images?.[0]?.url

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
    >
      {/* Image */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        aspectRatio: '2/3', flexShrink: 0,
        background: C.surface,
      }}>
        {img && !imgErr ? (
          <img
            src={img} alt={product.title}
            onError={() => setImgErr(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.surface }}>
            <Icon d={IC.img} size={40} style={{ color: C.outline, opacity: 0.6 }} />
          </div>
        )}

        {/* bottom gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(59,31,12,0.55) 0%, transparent 50%)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.35s ease',
          pointerEvents: 'none',
        }} />

        {/* Caramel top line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: C.caramel,
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.4s ease',
        }} />

        {/* Add to Bag CTA */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '16px',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}>
          <button style={{
            width: '100%',
            fontFamily: C.sans, fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            background: C.espresso, color: C.bg,
            border: 'none', padding: '11px 0',
            cursor: 'pointer',
          }}>
            Add to Bag
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ paddingTop: '14px', paddingBottom: '4px' }}>
        <p style={{
          fontFamily: C.sans, fontSize: '9px', fontWeight: 500,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: C.faint, marginBottom: '5px',
        }}>
          {product.category || 'Snitch'}
        </p>
        <h3 style={{
          fontFamily: C.serif,
          fontSize: '18px', fontWeight: 400, lineHeight: 1.25,
          color: C.espresso, margin: '0 0 8px',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {product.title}
        </h3>
        <p style={{
          fontFamily: C.serif, fontStyle: 'italic',
          fontSize: '16px', fontWeight: 400,
          color: C.caramel,
        }}>
          ₹{Number(product.price?.amount).toLocaleString('en-IN')}
        </p>
      </div>
    </article>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════════════ */
const FILTERS = ['All', 'New', 'Tops', 'Bottoms', 'Outerwear']
const MARQUEE_ITEMS = ['Free Shipping on Orders ₹999+', '·', 'New Arrivals Every Friday', '·', 'Premium Fabrics', '·', 'Curated Menswear', '·', 'Exclusive Members Drop', '·']

const Home = () => {
  const navigate = useNavigate()
  const { handleFetchAllProducts } = useProduct()
  const allProducts = useSelector((s) => s.product.allProducts)

  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      await handleFetchAllProducts().catch(() => {})
      setLoading(false)
    })()
  }, [])

  const products = allProducts || []
  const filtered = search.trim()
    ? products.filter(
        (p) =>
          p.title?.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase())
      )
    : products

  return (
    <div style={{ background: C.bg, fontFamily: C.sans, color: C.onSurface, minHeight: '100vh' }}>
      <FontInjector />

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0) }
          to   { transform: translateX(-50%) }
        }
        .snitch-nav-link {
          font-family: ${C.sans};
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${C.walnut};
          text-decoration: none;
          padding-bottom: 2px;
          border-bottom: 1px solid transparent;
          transition: color 0.2s, border-color 0.2s;
        }
        .snitch-nav-link:hover {
          color: ${C.espresso};
          border-bottom-color: ${C.caramel};
        }
        .snitch-cta-primary {
          font-family: ${C.sans};
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          background: ${C.espresso};
          color: ${C.bg};
          border: none;
          padding: 15px 36px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          transition: background 0.25s, transform 0.2s;
        }
        .snitch-cta-primary:hover {
          background: ${C.walnut};
          transform: translateY(-1px);
        }
        .snitch-cta-ghost {
          font-family: ${C.sans};
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          background: transparent;
          color: ${C.espresso};
          border: 1px solid ${C.espresso};
          padding: 15px 36px;
          cursor: pointer;
          transition: background 0.25s, color 0.25s;
        }
        .snitch-cta-ghost:hover {
          background: ${C.espresso};
          color: ${C.bg};
        }
        .snitch-chip {
          font-family: ${C.sans};
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 8px 20px;
          border: 1px solid ${C.outline};
          background: transparent;
          color: ${C.muted};
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .snitch-chip:hover {
          border-color: ${C.walnut};
          color: ${C.espresso};
        }
        .snitch-chip.active {
          background: ${C.espresso};
          color: ${C.bg};
          border-color: ${C.espresso};
        }
        .snitch-footer-link {
          font-family: ${C.sans};
          font-size: 13px;
          font-weight: 400;
          color: ${C.walnut};
          text-decoration: none;
          transition: color 0.2s;
        }
        .snitch-footer-link:hover {
          color: ${C.espresso};
        }
      `}</style>



      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section style={{
        maxWidth: '1440px', margin: '0 auto',
        padding: '80px 64px 80px',
        display: 'grid',
        gridTemplateColumns: '1fr 0.65fr',
        gap: '64px',
        alignItems: 'center',
        minHeight: '520px',
      }}>

        {/* Left — Copy */}
        <div>
          {/* Eyebrow */}
          <p style={{
            fontFamily: C.sans, fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: C.caramel, marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <span style={{ width: '32px', height: '1px', background: C.caramel, display: 'inline-block', flexShrink: 0 }} />
            New Collection · 2026
          </p>

          {/* Headline */}
          <h1 style={{
            fontFamily: C.serif,
            fontSize: 'clamp(3.2rem, 5.5vw, 5.5rem)',
            fontWeight: 300, lineHeight: 1.08,
            color: C.espresso,
            margin: '0 0 8px',
            letterSpacing: '-0.01em',
          }}>
            Dressed for the
          </h1>
          <h1 style={{
            fontFamily: C.serif,
            fontSize: 'clamp(3.2rem, 5.5vw, 5.5rem)',
            fontWeight: 300, lineHeight: 1.08,
            fontStyle: 'italic',
            color: C.walnut,
            margin: '0 0 32px',
            letterSpacing: '-0.01em',
          }}>
            Extraordinary
          </h1>

          {/* Tagline */}
          <p style={{
            fontFamily: C.sans, fontSize: '15px', fontWeight: 300,
            lineHeight: 1.8, color: C.walnut,
            maxWidth: '420px', marginBottom: '44px',
            letterSpacing: '0.02em',
          }}>
            Curated apparel for those who move through the world with quiet confidence and uncommon style.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button
              className="snitch-cta-primary"
              onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Shop the Collection
              <Icon d={IC.arrow} size={13} />
            </button>
            <button className="snitch-cta-ghost">View Lookbook</button>
          </div>
        </div>

        {/* Right — Hero Image */}
        <div style={{
          aspectRatio: '3/4',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <img
            src="/hero_model.png"
            alt="Snitch Summer Collection 2026"
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'top center',
              display: 'block',
            }}
          />

          {/* decorative corner lines */}
          <div style={{ position: 'absolute', top: '20px', left: '20px', width: '32px', height: '32px', borderTop: `1.5px solid ${C.caramel}`, borderLeft: `1.5px solid ${C.caramel}` }} />
          <div style={{ position: 'absolute', top: '20px', right: '20px', width: '32px', height: '32px', borderTop: `1.5px solid ${C.caramel}`, borderRight: `1.5px solid ${C.caramel}` }} />
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '32px', height: '32px', borderBottom: `1.5px solid ${C.caramel}`, borderLeft: `1.5px solid ${C.caramel}` }} />
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '32px', height: '32px', borderBottom: `1.5px solid ${C.caramel}`, borderRight: `1.5px solid ${C.caramel}` }} />

          {/* bottom label overlay */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '40px 24px 24px',
            background: 'linear-gradient(to top, rgba(59,31,12,0.75) 0%, transparent 100%)',
          }}>
            <p style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '22px', fontWeight: 300, color: C.bg, margin: '0 0 4px' }}>
              The Summer Edit
            </p>
            <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: C.sand }}>
              Collection 2026
            </p>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE STRIP ═════════════════════════════════════════════ */}
      <div style={{
        overflow: 'hidden',
        borderTop: `1px solid ${C.sand}`,
        borderBottom: `1px solid ${C.sand}`,
        background: C.bgAlt,
        padding: '13px 0',
      }}>
        <div style={{
          display: 'flex', whiteSpace: 'nowrap',
          animation: 'marquee-scroll 32s linear infinite',
          width: 'max-content',
        }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{
              fontFamily: C.sans,
              fontSize: '10px', fontWeight: 500,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: item === '·' ? C.caramel : C.walnut,
              padding: '0 16px',
            }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══ PRODUCTS ══════════════════════════════════════════════════ */}
      <section id="products-section" style={{
        maxWidth: '1440px', margin: '0 auto',
        padding: '80px 64px 120px',
      }}>

        {/* Section header */}
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between',
          paddingBottom: '32px',
          borderBottom: `1px solid ${C.outlineDark}`,
          marginBottom: '40px',
        }}>
          <div>
            <p style={{
              fontFamily: C.sans, fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: C.caramel, marginBottom: '10px',
            }}>
              The Edit
            </p>
            <h2 style={{
              fontFamily: C.serif,
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              fontWeight: 400, lineHeight: 1.15,
              color: C.espresso, margin: 0,
            }}>
              All Products
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Icon
                d={IC.search} size={14}
                style={{
                  position: 'absolute', left: 0,
                  color: searchFocused ? C.caramel : C.faint,
                  transition: 'color 0.2s',
                  pointerEvents: 'none',
                }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search products…"
                style={{
                  fontFamily: C.sans, fontSize: '12px', letterSpacing: '0.05em',
                  color: C.espresso,
                  background: 'transparent', border: 'none', outline: 'none',
                  borderBottom: `1px solid ${searchFocused || search ? C.caramel : C.outline}`,
                  paddingLeft: '22px', paddingBottom: '3px',
                  width: '170px',
                  transition: 'border-color 0.25s',
                }}
              />
            </div>

            {!loading && (
              <p style={{
                fontFamily: C.sans, fontSize: '12px',
                color: C.faint, letterSpacing: '0.08em',
              }}>
                {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
              </p>
            )}
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '48px' }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`snitch-chip${activeFilter === f ? ' active' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '40px 32px',
        }}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
            : filtered.length === 0
              ? (
                <div style={{
                  gridColumn: '1/-1', textAlign: 'center',
                  padding: '120px 0',
                }}>
                  <Icon d={IC.bag} size={40} style={{ color: C.outline, margin: '0 auto 20px', display: 'block' }} />
                  <p style={{ fontFamily: C.serif, fontSize: '24px', fontWeight: 400, color: C.muted }}>No products found</p>
                  <p style={{ fontFamily: C.sans, fontSize: '12px', color: C.faint, letterSpacing: '0.08em', marginTop: '8px' }}>
                    Try a different search term
                  </p>
                </div>
              )
              : filtered.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    onClick={() => navigate(`/product/${p._id}`)}
                  />
                ))
          }
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════════ */}
      <footer style={{ background: C.sand, borderTop: `1px solid ${C.outline}` }}>

        {/* Top columns */}
        <div style={{
          maxWidth: '1440px', margin: '0 auto',
          padding: '64px 64px 48px',
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr',
          gap: '48px',
        }}>

          {/* Brand */}
          <div>
            <span style={{
              fontFamily: C.serif,
              fontSize: '28px', fontWeight: 400,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: C.espresso, display: 'block', marginBottom: '16px',
            }}>
              Snitch
            </span>
            <p style={{
              fontFamily: C.sans, fontSize: '13px', fontWeight: 300,
              lineHeight: 1.85, color: C.walnut,
              maxWidth: '240px',
            }}>
              Premium apparel crafted for the modern individual. Quiet luxury, extraordinary fit.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <p style={{
              fontFamily: C.sans, fontSize: '9px', fontWeight: 600,
              letterSpacing: '0.28em', textTransform: 'uppercase',
              color: C.caramel, marginBottom: '24px',
            }}>
              Navigate
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {['Collections', 'New Arrivals', 'Lookbook', 'About Us'].map((l) => (
                <a key={l} href="#" className="snitch-footer-link">{l}</a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <p style={{
              fontFamily: C.sans, fontSize: '9px', fontWeight: 600,
              letterSpacing: '0.28em', textTransform: 'uppercase',
              color: C.caramel, marginBottom: '24px',
            }}>
              Legal
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {['Privacy Policy', 'Terms of Service', 'Contact Us'].map((l) => (
                <a key={l} href="#" className="snitch-footer-link">{l}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: `1px solid ${C.outline}`,
          maxWidth: '1440px', margin: '0 auto',
          padding: '20px 64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: C.sans, fontSize: '11px', color: C.walnut, letterSpacing: '0.06em' }}>
            © 2026 Snitch. All rights reserved.
          </span>
          <span style={{ fontFamily: C.sans, fontSize: '11px', color: C.faint, letterSpacing: '0.06em' }}>
            Crafted with precision.
          </span>
        </div>
      </footer>
    </div>
  )
}

export default Home