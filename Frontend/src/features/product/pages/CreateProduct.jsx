import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {useProduct} from '../hook/useProduct';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR'];

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
    images.forEach((img) => data.append("images", img.file));

    const response = await handleCreateNewProduct(data);

    if (response.success){
        navigate('/seller/dashboard')
    }

    console.log('Submit:',  formData, images);
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
  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };
  const onBrowse = () => fileInputRef.current?.click();
  const onFileChange = (e) => addFiles(e.target.files);

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-[#050505]">

      {/* ── Top Nav ── */}
      <nav className="flex-none flex items-center justify-between px-8 md:px-16 h-14 border-b border-[#1f1f1f] bg-[#050505]/90 backdrop-blur-md z-50">
        <button
          onClick={() => navigate('/')}
          className="font-headline-md text-xl text-primary-container tracking-tighter cursor-pointer"
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
        >
          SNITCH
        </button>
        <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest hidden sm:block">
          ADMIN&nbsp;/&nbsp;NEW PRODUCT
        </span>
        <button
          onClick={() => navigate(-1)}
          className="text-on-surface-variant hover:text-on-surface transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </nav>

      {/* ── Body ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* ══ LEFT COLUMN — Form ══ */}
        <div className="flex flex-col w-full lg:w-[55%] h-full overflow-y-auto scrollbar-hide bg-[#050505] border-r border-[#1f1f1f]">
          <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-10 max-w-2xl mx-auto w-full">

            {/* Heading */}
            <header className="mb-10">
              <p className="font-label-caps text-label-caps text-primary-container tracking-widest mb-2">
                NEW LISTING
              </p>
              <h1
                className="text-[clamp(28px,4vw,40px)] font-semibold text-on-surface leading-tight"
                style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.01em' }}
              >
                Create New Product
              </h1>
              <p className="font-label-md text-label-md text-on-surface-variant mt-2">
                Fill in the details below to publish a new item to the catalogue.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Title */}
              <div className="group relative">
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 tracking-widest transition-colors group-focus-within:text-primary-container">
                  TITLE
                </label>
                <input
                  id="product-title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="PRODUCT NAME"
                  required
                  className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container transition-all duration-300 font-body-md text-body-md"
                />
              </div>

              {/* Description */}
              <div className="group relative">
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 tracking-widest transition-colors group-focus-within:text-primary-container">
                  DESCRIPTION
                </label>
                <textarea
                  id="product-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="DESCRIBE THE PRODUCT"
                  rows={3}
                  className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container transition-all duration-300 font-body-md text-body-md resize-none"
                />
              </div>

              {/* Price row */}
              <div className="flex gap-6">
                {/* Price Amount */}
                <div className="group relative flex-1">
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 tracking-widest transition-colors group-focus-within:text-primary-container">
                    PRICE AMOUNT
                  </label>
                  <input
                    id="product-priceAmount"
                    name="priceAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.priceAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container transition-all duration-300 font-body-md text-body-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                {/* Currency */}
                <div className="group relative w-36">
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 tracking-widest transition-colors group-focus-within:text-primary-container">
                    CURRENCY
                  </label>
                  <select
                    id="product-priceCurrency"
                    name="priceCurrency"
                    value={formData.priceCurrency}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 text-on-surface focus:outline-none focus:border-primary-container transition-all duration-300 font-label-caps text-label-caps tracking-widest cursor-pointer appearance-none"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c} className="bg-surface-container text-on-surface">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 space-y-3">
                <button
                  id="publish-product-btn"
                  type="submit"
                  className="w-full bg-primary-container text-on-primary-container py-4 font-label-caps text-label-caps tracking-widest hover:bg-primary-fixed active:scale-[0.98] transition-all duration-200"
                >
                  PUBLISH PRODUCT
                </button>
                <button
                  id="save-draft-btn"
                  type="button"
                  className="w-full bg-transparent border border-outline text-on-surface-variant py-4 font-label-caps text-label-caps tracking-widest hover:border-on-surface hover:text-on-surface active:scale-[0.98] transition-all duration-200"
                >
                  SAVE AS DRAFT
                </button>
              </div>
            </form>

            {/* ── Mobile-only Image Upload ── */}
            <div className="lg:hidden mt-10 pb-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest">
                  PRODUCT IMAGES
                </span>
                <span className="font-label-caps text-label-caps text-on-primary-container bg-primary-container px-2 py-0.5 text-[10px] tracking-widest">
                  {images.length} / 7
                </span>
              </div>
              <div
                onClick={onBrowse}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-sm cursor-pointer transition-all duration-300 ${isDragging ? 'border-primary-container bg-primary-container/5' : 'border-outline hover:border-primary-container/50'}`}
              >
                <span className="material-symbols-outlined text-outline mb-2" style={{ fontSize: '28px' }}>cloud_upload</span>
                <p className="font-label-caps text-label-caps text-on-surface-variant tracking-widest text-xs">
                  TAP TO UPLOAD IMAGES
                </p>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {images.map((img, i) => (
                    <div key={img.id} className="relative aspect-square group">
                      <img src={img.preview} alt={`Preview ${i + 1}`} className="w-full h-full object-cover rounded-sm" />
                      <button onClick={() => removeImage(img.id)} className="absolute top-1 right-1 w-5 h-5 bg-black/70 flex items-center justify-center rounded-full">
                        <span className="material-symbols-outlined text-on-surface" style={{ fontSize: '12px' }}>close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══ RIGHT COLUMN — Image Upload ══ */}
        <div className="hidden lg:flex flex-col w-[45%] h-full bg-[#0d0d0d] px-10 xl:px-16 py-10 overflow-y-auto scrollbar-hide">
          <div className="flex items-center justify-between mb-6">
            <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest">
              PRODUCT IMAGES
            </span>
            <span className="font-label-caps text-label-caps text-on-primary-container bg-primary-container px-2 py-0.5 text-[10px] tracking-widest">
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
            className={`
              flex-1 flex flex-col items-center justify-center
              border-2 border-dashed rounded-sm cursor-pointer
              transition-all duration-300 select-none min-h-0
              ${isDragging
                ? 'border-primary-container bg-primary-container/5 shadow-[0_0_30px_0px_rgba(245,197,24,0.15)]'
                : 'border-outline hover:border-primary-container/50 hover:shadow-[0_0_20px_0px_rgba(245,197,24,0.08)]'
              }
            `}
          >
            {/* Upload Icon */}
            <div className={`mb-5 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
              <svg
                width="48" height="48" viewBox="0 0 48 48" fill="none"
                className={`transition-colors duration-300 ${isDragging ? 'text-primary-container' : 'text-outline'}`}
              >
                <circle cx="24" cy="24" r="23" stroke="currentColor" strokeWidth="1" />
                <path
                  d="M24 32V20M24 20L19 25M24 20L29 25"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                />
                <path
                  d="M17 34H31" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                />
              </svg>
            </div>

            <p
              className={`text-2xl font-semibold mb-2 transition-colors duration-300 ${isDragging ? 'text-primary-container' : 'text-on-surface'}`}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {isDragging ? 'Release to Upload' : 'Drag & Drop'}
            </p>
            <p className="font-label-md text-label-md text-on-surface-variant mb-1">
              or{' '}
              <span className="text-primary-container underline underline-offset-4 hover:text-primary-fixed transition-colors">
                click to browse files
              </span>
            </p>
            <p className="font-label-caps text-[10px] text-outline tracking-widest mt-1">
              PNG, JPG, WEBP — UP TO 10MB EACH
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={onFileChange}
            />
          </div>

          {/* Thumbnail Rows */}
          <div className="flex-none mt-6">
            {/* Row 1 — slots 1–3 */}
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => {
                const img = images[i];
                return img ? (
                  <div key={img.id} className="relative aspect-square group">
                    <img
                      src={img.preview}
                      alt={`Preview ${i + 1}`}
                      className="w-full h-full object-cover rounded-sm"
                    />
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/70 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black"
                    >
                      <span className="material-symbols-outlined text-on-surface" style={{ fontSize: '12px' }}>close</span>
                    </button>
                    {/* index badge */}
                    <span className="absolute bottom-1 left-1 font-label-caps text-[9px] text-on-primary-container bg-primary-container px-1 tracking-widest">
                      {i + 1}
                    </span>
                  </div>
                ) : (
                  <button
                    key={i}
                    onClick={onBrowse}
                    className="aspect-square border border-dashed border-outline bg-[#111] flex items-center justify-center rounded-sm hover:border-primary-container/50 transition-colors duration-200 group"
                  >
                    <span className="material-symbols-outlined text-outline group-hover:text-primary-container/50 transition-colors duration-200" style={{ fontSize: '20px' }}>
                      add_photo_alternate
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Row 2 — slots 4–6 */}
            {images.length > 3 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {Array.from({ length: 3 }).map((_, i) => {
                  const img = images[i + 3];
                  return img ? (
                    <div key={img.id} className="relative aspect-square group">
                      <img
                        src={img.preview}
                        alt={`Preview ${i + 4}`}
                        className="w-full h-full object-cover rounded-sm"
                      />
                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/70 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black"
                      >
                        <span className="material-symbols-outlined text-on-surface" style={{ fontSize: '12px' }}>close</span>
                      </button>
                      <span className="absolute bottom-1 left-1 font-label-caps text-[9px] text-on-primary-container bg-primary-container px-1 tracking-widest">
                        {i + 4}
                      </span>
                    </div>
                  ) : (
                    <button
                      key={i}
                      onClick={onBrowse}
                      className="aspect-square border border-dashed border-outline bg-[#111] flex items-center justify-center rounded-sm hover:border-primary-container/50 transition-colors duration-200 group"
                    >
                      <span className="material-symbols-outlined text-outline group-hover:text-primary-container/50 transition-colors duration-200" style={{ fontSize: '20px' }}>
                        add_photo_alternate
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          {/* Row 3 — slot 7 only */}
          {images.length > 6 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {[images[6]].map((img, i) =>
                img ? (
                  <div key={img.id} className="relative aspect-square group">
                    <img
                      src={img.preview}
                      alt={`Preview ${i + 7}`}
                      className="w-full h-full object-cover rounded-sm"
                    />
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/70 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black"
                    >
                      <span className="material-symbols-outlined text-on-surface" style={{ fontSize: '12px' }}>close</span>
                    </button>
                    <span className="absolute bottom-1 left-1 font-label-caps text-[9px] text-on-primary-container bg-primary-container px-1 tracking-widest">
                      7
                    </span>
                  </div>
                ) : (
                  <button
                    key={i}
                    onClick={onBrowse}
                    className="aspect-square border border-dashed border-outline bg-[#111] flex items-center justify-center rounded-sm hover:border-primary-container/50 transition-colors duration-200 group"
                  >
                    <span className="material-symbols-outlined text-outline group-hover:text-primary-container/50 transition-colors duration-200" style={{ fontSize: '20px' }}>
                      add_photo_alternate
                    </span>
                  </button>
                )
              )}
            </div>
          )}
          </div>{/* end thumbnail wrapper */}
        </div>

        {/* ══ MOBILE — Image upload section appended below form ══ */}
        {/* Shown only on smaller screens */}
        <div className="flex lg:hidden absolute bottom-0 left-0 right-0">
          {/* handled by scrollable left column on mobile */}
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
