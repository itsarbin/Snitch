import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
import ContinueWithGoogle from '../components/ContinueWithGoogle'

/* ─── shared tokens (same as Home) ─────────────────────────────── */
const C = {
  bg:       '#fdf9f3',
  surface:  '#f1ede7',
  sand:     '#e8d5b7',
  outline:  '#d4c3ba',
  espresso: '#3b1f0c',
  walnut:   '#7b4a2d',
  caramel:  '#c17a3f',
  muted:    '#50443e',
  faint:    '#82746d',
  serif:    "'EB Garamond', Georgia, serif",
  sans:     "'DM Sans', system-ui, sans-serif",
}

/* ─── reusable form field ────────────────────────────────────────── */
const Field = ({ label, type = 'text', name, value, onChange, placeholder, right }) => {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{
          fontFamily: C.sans, fontSize: '10px', fontWeight: 600,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: focused ? C.caramel : C.faint,
          transition: 'color 0.2s',
        }}>
          {label}
        </label>
        {right}
      </div>
      <input
        type={type} name={name} value={value}
        onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          fontFamily: C.sans, fontSize: '14px', fontWeight: 300,
          letterSpacing: '0.03em', color: C.espresso,
          background: 'transparent', border: 'none', outline: 'none',
          borderBottom: `1px solid ${focused ? C.caramel : C.outline}`,
          padding: '8px 0 10px',
          transition: 'border-color 0.25s',
          width: '100%',
        }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════════════════════════════ */
const Login = () => {
  const navigate = useNavigate()
  const { handleLogin } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { email, password } = formData
      const user = await handleLogin({ email, password })
      if (user.role === 'seller') navigate('/seller/dashboard')
      else if (user.role === 'buyer') navigate('/')
    } catch (error) {
      console.error('Login error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden', fontFamily: C.sans }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: ${C.outline}; }
        .auth-submit:hover { background: ${C.walnut} !important; transform: translateY(-1px); }
        .auth-submit:active { transform: translateY(0); }
        .auth-ghost:hover { background: ${C.espresso} !important; color: ${C.bg} !important; }
        .auth-link:hover { color: ${C.espresso} !important; }
      `}</style>

      {/* ── LEFT: Visual column ───────────────────────────────────── */}
      <div style={{
        width: '50%', flexShrink: 0, position: 'relative', overflow: 'hidden',
      }}>
        <img
          src="/auth_login.png"
          alt="Snitch SS 2026 Collection"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
        {/* Dark gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(20,8,2,0.82) 0%, rgba(20,8,2,0.2) 45%, transparent 70%)',
        }} />

        {/* Bottom brand copy */}
        <div style={{ position: 'absolute', bottom: '52px', left: '52px', right: '52px' }}>
          <p style={{
            fontFamily: C.serif, fontStyle: 'italic',
            fontSize: '32px', fontWeight: 300,
            color: C.bg, lineHeight: 1.2,
            marginBottom: '18px',
          }}>
            The Art of Dressing Well.
          </p>
          <div style={{ width: '48px', height: '1px', backgroundColor: C.caramel, marginBottom: '14px' }} />
          <p style={{
            fontFamily: C.sans, fontSize: '10px', fontWeight: 500,
            letterSpacing: '0.28em', textTransform: 'uppercase',
            color: C.sand,
          }}>
            SS 2026 Collection
          </p>
        </div>
      </div>

      {/* ── RIGHT: Form column ────────────────────────────────────── */}
      <div style={{
        flex: 1, background: C.bg,
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px 72px',
          maxWidth: '560px', margin: '0 auto', width: '100%',
        }}>

          {/* Logo */}
          <p style={{
            fontFamily: C.serif,
            fontSize: '24px', fontWeight: 400,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: C.espresso, marginBottom: '48px',
          }}>
            Snitch
          </p>

          {/* Eyebrow */}
          <p style={{
            fontFamily: C.sans, fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.28em', textTransform: 'uppercase',
            color: C.caramel, marginBottom: '12px',
          }}>
            Welcome Back
          </p>

          {/* Headline */}
          <h1 style={{
            fontFamily: C.serif, fontStyle: 'italic',
            fontSize: '44px', fontWeight: 300, lineHeight: 1.15,
            color: C.espresso, marginBottom: '12px',
          }}>
            Sign in to your account
          </h1>

          {/* Subtext */}
          <p style={{
            fontFamily: C.sans, fontSize: '13px', fontWeight: 300,
            lineHeight: 1.75, color: C.walnut,
            marginBottom: '44px',
          }}>
            Access your orders, wishlist, and exclusive member drops.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <Field
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />

            <Field
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              right={
                <a href="#" style={{
                  fontFamily: C.sans, fontSize: '11px', fontWeight: 400,
                  color: C.caramel, textDecoration: 'none',
                  letterSpacing: '0.03em',
                  transition: 'opacity 0.2s',
                }}>
                  Forgot password?
                </a>
              }
            />

            {/* CTA */}
            <button
              type="submit"
              disabled={loading}
              className="auth-submit"
              style={{
                marginTop: '8px',
                fontFamily: C.sans, fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                background: C.espresso, color: C.bg,
                border: 'none', padding: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'background 0.25s, transform 0.2s',
                width: '100%',
              }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            {/* OR divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1, height: '1px', background: C.sand }} />
              <span style={{
                fontFamily: C.sans, fontSize: '10px', fontWeight: 500,
                letterSpacing: '0.2em', color: C.faint,
              }}>
                OR
              </span>
              <div style={{ flex: 1, height: '1px', background: C.sand }} />
            </div>

            {/* Google */}
            <ContinueWithGoogle />
          </form>

          {/* Register link */}
          <p style={{
            fontFamily: C.sans, fontSize: '13px', fontWeight: 300,
            color: C.walnut, marginTop: '36px', textAlign: 'center',
          }}>
            Don't have an account?{' '}
            <a
              href="/register"
              className="auth-link"
              style={{
                color: C.caramel, textDecoration: 'underline',
                textUnderlineOffset: '3px', fontWeight: 400,
                transition: 'color 0.2s',
              }}
            >
              Create one
            </a>
          </p>
        </div>

        {/* Footer strip */}
        <div style={{
          borderTop: `1px solid ${C.outline}`,
          padding: '16px 72px',
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
        }}>
          {['Privacy Policy', 'Terms of Service', 'Contact'].map((l) => (
            <a key={l} href="#" style={{
              fontFamily: C.sans, fontSize: '11px', color: C.faint,
              textDecoration: 'none', letterSpacing: '0.04em',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = C.walnut}
            onMouseLeave={e => e.target.style.color = C.faint}
            >
              {l}
            </a>
          ))}
          <span style={{ fontFamily: C.sans, fontSize: '11px', color: C.faint, letterSpacing: '0.04em' }}>
            © 2026 Snitch
          </span>
        </div>
      </div>
    </div>
  )
}

export default Login