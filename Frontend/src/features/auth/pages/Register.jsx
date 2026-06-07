import { useState } from 'react'
import { useAuth } from '../hook/useAuth'
import { useNavigate } from 'react-router'
import ContinueWithGoogle from '../components/ContinueWithGoogle'

/* ─── shared tokens ──────────────────────────────────────────────── */
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
const Field = ({ label, type = 'text', name, value, onChange, placeholder }) => {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{
        fontFamily: C.sans, fontSize: '10px', fontWeight: 600,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: focused ? C.caramel : C.faint,
        transition: 'color 0.2s',
      }}>
        {label}
      </label>
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
   REGISTER PAGE
═══════════════════════════════════════════════════════════════════ */
const Register = () => {
  const navigate = useNavigate()
  const { handleRegister } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '',
    contactNumber: '', isSeller: false,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { fullName, email, password, contactNumber, isSeller } = formData
      const user = await handleRegister({ fullName, email, password, contact: contactNumber, isSeller })
      if (user.role === 'seller') navigate('/seller/dashboard')
      else if (user.role === 'buyer') navigate('/')
    } catch (err) {
      console.log('Registration Error:', err.message)
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
        .auth-link:hover { color: ${C.espresso} !important; }
        .reg-scrollbar::-webkit-scrollbar { width: 4px; }
        .reg-scrollbar::-webkit-scrollbar-track { background: ${C.bg}; }
        .reg-scrollbar::-webkit-scrollbar-thumb { background: ${C.outline}; }
      `}</style>

      {/* ── LEFT: Narrow visual column (40%) ─────────────────────── */}
      <div style={{
        width: '40%', flexShrink: 0,
        position: 'relative', overflow: 'hidden',
      }}>
        <img
          src="/auth_register.png"
          alt="Snitch SS 2026 — Join the Collective"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(18,6,2,0.88) 0%, rgba(18,6,2,0.3) 50%, transparent 75%)',
        }} />

        {/* Bottom brand copy */}
        <div style={{ position: 'absolute', bottom: '48px', left: '44px', right: '44px' }}>
          <p style={{
            fontFamily: C.serif, fontStyle: 'italic',
            fontSize: '28px', fontWeight: 300,
            color: C.bg, lineHeight: 1.2,
            marginBottom: '16px',
          }}>
            Join the Collective.
          </p>

          <div style={{ width: '40px', height: '1px', backgroundColor: C.caramel, marginBottom: '14px' }} />

          <p style={{
            fontFamily: C.sans, fontSize: '10px', fontWeight: 500,
            letterSpacing: '0.26em', textTransform: 'uppercase',
            color: C.sand, marginBottom: '20px',
          }}>
            SS 2026 · Members Access
          </p>

          {/* Perks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              'Early access to drops',
              'Exclusive member pricing',
              'Private lookbook archive',
            ].map((perk) => (
              <p key={perk} style={{
                fontFamily: C.sans, fontSize: '11px', fontWeight: 300,
                color: C.sand, letterSpacing: '0.04em',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span style={{ color: C.caramel, fontSize: '10px' }}>✦</span>
                {perk}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form column (60%) ──────────────────────────────── */}
      <div
        className="reg-scrollbar"
        style={{
          flex: 1, background: C.bg,
          overflowY: 'auto',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{
          flex: 1,
          padding: '32px 68px',
          maxWidth: '540px', margin: '0 auto', width: '100%',
        }}>

          {/* Logo */}
          <p style={{
            fontFamily: C.serif,
            fontSize: '22px', fontWeight: 400,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: C.espresso, marginBottom: '24px',
          }}>
            Snitch
          </p>

          {/* Eyebrow */}
          <p style={{
            fontFamily: C.sans, fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.28em', textTransform: 'uppercase',
            color: C.caramel, marginBottom: '8px',
          }}>
            Create Account
          </p>

          {/* Headline */}
          <h1 style={{
            fontFamily: C.serif, fontStyle: 'italic',
            fontSize: '34px', fontWeight: 300, lineHeight: 1.15,
            color: C.espresso, marginBottom: '8px',
          }}>
            Begin your journey
          </h1>

          {/* Subtext */}
          <p style={{
            fontFamily: C.sans, fontSize: '13px', fontWeight: 300,
            lineHeight: 1.75, color: C.walnut,
            marginBottom: '24px',
          }}>
            Access exclusive drops, private archives, and early pre-orders.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Field
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Alexander Vance"
            />
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
            />
            <Field
              label="Contact Number"
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="+91 98765 43210"
            />

            {/* Seller checkbox */}
            <label style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              cursor: 'pointer', paddingTop: '4px',
            }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <input
                  type="checkbox"
                  id="isSeller"
                  name="isSeller"
                  checked={formData.isSeller}
                  onChange={handleChange}
                  style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                />
                <div style={{
                  width: '18px', height: '18px',
                  border: `1px solid ${formData.isSeller ? C.caramel : C.outline}`,
                  background: formData.isSeller ? C.caramel : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}>
                  {formData.isSeller && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke={C.bg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span style={{
                fontFamily: C.sans, fontSize: '13px', fontWeight: 400,
                color: C.espresso, userSelect: 'none',
              }}>
                Register as a Seller
              </span>
            </label>

            {/* CTA */}
            <button
              type="submit"
              disabled={loading}
              className="auth-submit"
              style={{
                marginTop: '4px',
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
              {loading ? 'Creating Account…' : 'Create Account'}
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

          {/* Sign in link */}
          <p style={{
            fontFamily: C.sans, fontSize: '13px', fontWeight: 300,
            color: C.walnut, marginTop: '20px', textAlign: 'center',
          }}>
            Already have an account?{' '}
            <a
              href="/login"
              className="auth-link"
              style={{
                color: C.caramel, textDecoration: 'underline',
                textUnderlineOffset: '3px', fontWeight: 400,
                transition: 'color 0.2s',
              }}
            >
              Sign in
            </a>
          </p>

          {/* Footer */}
          <div style={{
            borderTop: `1px solid ${C.outline}`,
            marginTop: '24px', paddingTop: '16px',
            display: 'flex', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '8px',
          }}>
            {['Privacy Policy', 'Terms of Service', 'Contact'].map((l) => (
              <a key={l} href="#" style={{
                fontFamily: C.sans, fontSize: '11px', color: C.faint,
                textDecoration: 'none', letterSpacing: '0.04em',
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
    </div>
  )
}

export default Register
