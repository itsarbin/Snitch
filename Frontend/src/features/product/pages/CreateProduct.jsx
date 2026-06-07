import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useProduct } from '../hook/useProduct';

/* ─────────── Design tokens ─────────── */
const C = {
  bg:        '#fdf9f3',
  espresso:  '#3b1f0c',
  walnut:    '#7b4a2d',
  caramel:   '#c17a3f',
  sand:      '#e8d5b7',
  outline:   '#d4c3ba',
  faint:     '#82746d',
  cream:     '#fdf9f3',
};

const F = {
  serif:  "'EB Garamond', Georgia, serif",
  sans:   "'DM Sans', system-ui, sans-serif",
};

/* ─────────── Constants ─────────── */
const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR'];

/* ─────────── Helper: hover-state wrapper ─────────── */
// We use a tiny React pattern: store hover key in a state map
// so we can swap inline styles on hover without CSS classes.

const CreateProduct = () => {
  const navigate = useNavigate();
  const { handleCreateNewProduct } = useProduct();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
  });

  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  /* hover states */
  const [hov, setHov] = useState({});
  const onMouseEnter = (k) => setHov((p) => ({ ...p, [k]: true }));
  const onMouseLeave = (k) => setHov((p) => ({ ...p, [k]: false }));

  /* focus states for inputs */
  const [foc, setFoc] = useState({});
  const onFocus = (k) => setFoc((p) => ({ ...p, [k]: true }));
  const onBlur  = (k) => setFoc((p) => ({ ...p, [k]: false }));

  /* ────────── Form handlers ────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('priceAmount', formData.priceAmount);
    data.append('priceCurrency', formData.priceCurrency);
    images.forEach((img) => data.append('images', img.file));

    const response = await handleCreateNewProduct(data);

    if (response.success) {
      navigate('/seller/dashboard');
    }

    console.log('Submit:', formData, images);
  };

  /* ────────── Image helpers ────────── */
  const addFiles = useCallback((files) => {
    const incoming = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => ({ file: f, preview: URL.createObjectURL(f), id: crypto.randomUUID() }));
    setImages((prev) => [...prev, ...incoming].slice(0, 7));
  }, []);

  const removeImage = (id) => {
    setImages((prev) => {
      const next = prev.filter((img) => img.id !== id);
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return next;
    });
  };

  /* ────────── Drag & drop ────────── */
  const onDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };
  const onBrowse     = () => fileInputRef.current?.click();
  const onFileChange = (e) => addFiles(e.target.files);

  /* ────────── Inline style helpers ────────── */
  const inputStyle = (key) => ({
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${foc[key] ? C.caramel : C.outline}`,
    outline: 'none',
    fontFamily: F.sans,
    fontSize: '14px',
    color: C.espresso,
    padding: '8px 0',
    transition: 'border-color 0.2s',
  });

  const labelStyle = {
    display: 'block',
    fontFamily: F.sans,
    fontSize: '10px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: C.caramel,
    marginBottom: '6px',
  };

  /* ────────── Thumbnail slot renderer ────────── */
  const renderSlot = (img, slotIndex) => {
    const removeKey = `remove-${slotIndex}`;
    if (img) {
      return (
        <div
          key={img.id}
          style={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden' }}
        >
          <img
            src={img.preview}
            alt={`Preview ${slotIndex + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* Remove button */}
          <button
            onClick={() => removeImage(img.id)}
            onMouseEnter={() => onMouseEnter(removeKey)}
            onMouseLeave={() => onMouseLeave(removeKey)}
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '20px',
              height: '20px',
              background: hov[removeKey] ? 'rgba(59,31,12,1)' : 'rgba(59,31,12,0.80)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              transition: 'background 0.15s',
            }}
          >
            {/* ✕ icon */}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1L9 9M9 1L1 9" stroke={C.cream} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          {/* Index badge */}
          <span
            style={{
              position: 'absolute',
              bottom: '6px',
              left: '6px',
              fontFamily: F.sans,
              fontSize: '9px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: C.espresso,
              background: C.caramel,
              padding: '1px 6px',
            }}
          >
            {slotIndex + 1}
          </span>
        </div>
      );
    }
    const emptyKey = `empty-${slotIndex}`;
    return (
      <button
        key={`empty-${slotIndex}`}
        onClick={onBrowse}
        onMouseEnter={() => onMouseEnter(emptyKey)}
        onMouseLeave={() => onMouseLeave(emptyKey)}
        style={{
          aspectRatio: '1 / 1',
          border: `1px dashed ${hov[emptyKey] ? C.caramel : C.outline}`,
          background: '#f1ede7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}
      >
        {/* + icon */}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4V16M4 10H16" stroke={C.caramel} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    );
  };

  /* ═══════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════ */
  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
        ::placeholder { color: ${C.outline}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.outline}; border-radius: 2px; }
      `}</style>

      {/* ── Root ── */}
      <div
        style={{
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: C.bg,
          fontFamily: F.sans,
        }}
      >
        {/* ══ NAVBAR ══ */}
        <nav
          style={{
            height: '56px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 48px',
            borderBottom: `1px solid ${C.outline}`,
            background: C.bg,
          }}
        >
          {/* Left: Brand */}
          <span
            style={{
              fontFamily: F.serif,
              fontSize: '20px',
              fontWeight: 400,
              color: C.espresso,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              userSelect: 'none',
            }}
          >
            Snitch
          </span>

          {/* Center: Breadcrumb */}
          <span
            style={{
              fontFamily: F.sans,
              fontSize: '10px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ color: C.caramel }}>New Listing</span>
            <span style={{ color: C.espresso }}>{' / Create Product'}</span>
          </span>

          {/* Right: Close */}
          <button
            id="close-create-product"
            onClick={() => navigate(-1)}
            onMouseEnter={() => onMouseEnter('close')}
            onMouseLeave={() => onMouseLeave('close')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: hov['close'] ? C.walnut : C.espresso,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              transition: 'color 0.2s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 2L14 14M14 2L2 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </nav>

        {/* ══ BODY ══ */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

          {/* ── LEFT COLUMN (Form) ── */}
          <div
            style={{
              width: '55%',
              height: '100%',
              overflowY: 'auto',
              background: C.bg,
              borderRight: `1px solid ${C.outline}`,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '40px 64px',
                maxWidth: '540px',
                margin: '0 auto',
                width: '100%',
                minHeight: '100%',
              }}
            >
              {/* Eyebrow */}
              <p
                style={{
                  fontFamily: F.sans,
                  fontSize: '10px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: C.caramel,
                  marginBottom: '8px',
                }}
              >
                New Listing
              </p>

              {/* H1 */}
              <h1
                style={{
                  fontFamily: F.serif,
                  fontStyle: 'italic',
                  fontSize: '38px',
                  fontWeight: 300,
                  color: C.espresso,
                  lineHeight: 1.2,
                  marginBottom: '8px',
                }}
              >
                Create New Product
              </h1>

              {/* Subtext */}
              <p
                style={{
                  fontFamily: F.sans,
                  fontSize: '13px',
                  color: C.walnut,
                  marginBottom: '36px',
                  lineHeight: 1.6,
                }}
              >
                Fill in the details below to publish a new item to the catalogue.
              </p>

              {/* ── Form ── */}
              <form
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
              >
                {/* Title */}
                <div>
                  <label htmlFor="product-title" style={labelStyle}>Title</label>
                  <input
                    id="product-title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Product name"
                    required
                    style={inputStyle('title')}
                    onFocus={() => onFocus('title')}
                    onBlur={() => onBlur('title')}
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="product-description" style={labelStyle}>Description</label>
                  <textarea
                    id="product-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the product"
                    rows={3}
                    style={{ ...inputStyle('description'), resize: 'none' }}
                    onFocus={() => onFocus('description')}
                    onBlur={() => onBlur('description')}
                  />
                </div>

                {/* Price row */}
                <div style={{ display: 'flex', gap: '16px' }}>
                  {/* Price Amount */}
                  <div style={{ flex: 1 }}>
                    <label htmlFor="product-priceAmount" style={labelStyle}>Price Amount</label>
                    <input
                      id="product-priceAmount"
                      name="priceAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.priceAmount}
                      onChange={handleChange}
                      placeholder="0.00"
                      style={inputStyle('priceAmount')}
                      onFocus={() => onFocus('priceAmount')}
                      onBlur={() => onBlur('priceAmount')}
                    />
                  </div>

                  {/* Currency */}
                  <div style={{ width: '120px' }}>
                    <label htmlFor="product-priceCurrency" style={labelStyle}>Currency</label>
                    <select
                      id="product-priceCurrency"
                      name="priceCurrency"
                      value={formData.priceCurrency}
                      onChange={handleChange}
                      style={{
                        ...inputStyle('priceCurrency'),
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        cursor: 'pointer',
                        fontSize: '13px',
                      }}
                      onFocus={() => onFocus('priceCurrency')}
                      onBlur={() => onBlur('priceCurrency')}
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c} style={{ background: C.bg, color: C.espresso }}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* CTA */}
                <div
                  style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  {/* Publish */}
                  <button
                    id="publish-product-btn"
                    type="submit"
                    onMouseEnter={() => onMouseEnter('publish')}
                    onMouseLeave={() => onMouseLeave('publish')}
                    style={{
                      width: '100%',
                      background: hov['publish'] ? C.walnut : C.espresso,
                      color: C.cream,
                      border: 'none',
                      fontFamily: F.sans,
                      fontSize: '11px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.18em',
                      padding: '14px',
                      cursor: 'pointer',
                      borderRadius: 0,
                      transition: 'background 0.2s',
                    }}
                  >
                    Publish Product
                  </button>

                  {/* Save as Draft */}
                  <button
                    id="save-draft-btn"
                    type="button"
                    onMouseEnter={() => onMouseEnter('draft')}
                    onMouseLeave={() => onMouseLeave('draft')}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: `1px solid ${hov['draft'] ? C.caramel : C.outline}`,
                      color: hov['draft'] ? C.caramel : C.walnut,
                      fontFamily: F.sans,
                      fontSize: '11px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.18em',
                      padding: '14px',
                      cursor: 'pointer',
                      borderRadius: 0,
                      transition: 'border-color 0.2s, color 0.2s',
                    }}
                  >
                    Save as Draft
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ── RIGHT COLUMN (Image Upload) ── */}
          <div
            style={{
              width: '45%',
              height: '100%',
              overflowY: 'auto',
              background: C.sand,
              borderLeft: `1px solid ${C.outline}`,
              padding: '40px',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: F.sans,
                  fontSize: '10px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: C.caramel,
                }}
              >
                Product Images
              </span>
              <span
                style={{
                  background: C.espresso,
                  color: C.cream,
                  fontFamily: F.sans,
                  fontSize: '9px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  padding: '3px 8px',
                }}
              >
                {images.length} / 7
              </span>
            </div>

            {/* Drop Zone */}
            <div
              id="image-drop-zone"
              onClick={onBrowse}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              style={{
                flex: '1 0 280px',
                minHeight: '280px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px dashed ${isDragging ? C.espresso : C.outline}`,
                background: C.bg,
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                padding: '32px 24px',
                userSelect: 'none',
                gap: '8px',
              }}
            >
              {/* Upload SVG */}
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                style={{ color: isDragging ? C.caramel : C.walnut, transition: 'color 0.2s', marginBottom: '8px' }}
              >
                <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1" />
                <path
                  d="M20 27V17M20 17L15 22M20 17L25 22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13 29H27"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>

              {/* Main label */}
              <p
                style={{
                  fontFamily: F.serif,
                  fontStyle: 'italic',
                  fontSize: '24px',
                  fontWeight: 300,
                  color: C.espresso,
                  lineHeight: 1,
                }}
              >
                {isDragging ? 'Release to Upload' : 'Drag & Drop'}
              </p>

              {/* Sub-label */}
              <p style={{ fontFamily: F.sans, fontSize: '13px', color: C.walnut }}>
                {'or '}
                <span
                  style={{
                    color: C.caramel,
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                  }}
                >
                  click to browse
                </span>
              </p>

              {/* Format hint */}
              <p
                style={{
                  fontFamily: F.sans,
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: C.faint,
                  marginTop: '4px',
                }}
              >
                PNG, JPG, WEBP — UP TO 10MB
              </p>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={onFileChange}
              />
            </div>

            {/* Thumbnail Grid */}
            <div style={{ marginTop: '20px', flexShrink: 0 }}>
              {/* Row 1 — slots 1–3 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {Array.from({ length: 3 }).map((_, i) => renderSlot(images[i], i))}
              </div>

              {/* Row 2 — slots 4–6 (shown when > 3 images) */}
              {images.length > 3 && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                    marginTop: '12px',
                  }}
                >
                  {Array.from({ length: 3 }).map((_, i) => renderSlot(images[i + 3], i + 3))}
                </div>
              )}

              {/* Row 3 — slot 7 (shown when > 6 images) */}
              {images.length > 6 && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                    marginTop: '12px',
                  }}
                >
                  {renderSlot(images[6], 6)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProduct;
