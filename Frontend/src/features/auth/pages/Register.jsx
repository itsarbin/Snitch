import { useState } from 'react';
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router';
import ContinueWithGoogle from '../components/ContinueWithGoogle';

const Register = () => {
  const navigate = useNavigate()
  const { handleRegister } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    contactNumber: '',
    isSeller: false,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {

      const { fullName, email, password, contactNumber, isSeller } = formData
      const response = await handleRegister({ fullName, email, password, contact: contactNumber, isSeller })
      if (response && response.success) {
        navigate('/')

      } else {
        console.log('Registration failed:', response?.message || 'Unknown error')
      }
    } catch (err) {
      console.log('Registration Error:', err.message)
    }
  }


  return (
    <>
      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-md max-w-container-max mx-auto bg-surface-dim/90 backdrop-blur-md">
        <div className="font-display-lg text-display-lg-mobile md:text-headline-md tracking-tighter text-primary-container">SNITCH</div>
        <div className="hidden md:flex items-center gap-xl">
          <a className="font-label-caps text-label-caps text-on-surface hover:text-primary-container transition-colors duration-300" href="#">Collections</a>
          <a className="font-label-caps text-label-caps text-on-surface hover:text-primary-container transition-colors duration-300" href="#">New Arrivals</a>
          <a className="font-label-caps text-label-caps text-on-surface hover:text-primary-container transition-colors duration-300" href="#">Archive</a>
          <a className="font-label-caps text-label-caps text-on-surface hover:text-primary-container transition-colors duration-300" href="#">Journal</a>
        </div>
        <div className="flex items-center gap-lg">
          <button className="active:scale-95 transition-transform duration-200">
            <span className="material-symbols-outlined text-on-surface hover:text-primary-container transition-all duration-300">search</span>
          </button>
          <button className="active:scale-95 transition-transform duration-200">
            <span className="material-symbols-outlined text-on-surface hover:text-primary-container transition-all duration-300">shopping_bag</span>
          </button>
        </div>
      </nav>

      {/* Main Content: Registration Split Screen */}
      <main className="flex h-screen w-full pt-[72px]">
        {/* Left Photography Column */}
        <div className="hidden lg:block w-1/2 h-full relative overflow-hidden">
          <img alt="High-fashion urban editorial" className="w-full h-full object-cover grayscale brightness-75 contrast-125" src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="absolute bottom-xl left-margin-desktop">
            <p className="font-headline-sm text-headline-sm text-primary-container mb-xs">THE ARCHIVE</p>
            <p className="font-label-caps text-label-caps text-on-surface tracking-[0.3em]">FW24 REGISTRATION OPEN</p>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="w-full lg:w-1/2 h-full flex flex-col bg-surface overflow-y-auto scrollbar-hide px-margin-mobile md:px-margin-desktop">
          <div className="flex-grow flex flex-col justify-center max-w-[480px] mx-auto w-full py-md">
            <header className="mb-md">
              <h1 className="font-display-lg text-display-lg-mobile md:text-headline-md mb-xs text-on-surface">Join the Collective.</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Access exclusive drops, private archives, and early pre-orders.</p>
            </header>

            <form className="space-y-md" onSubmit={handleSubmit}>
              <div className="group relative">
                <label className="font-label-caps text-label-caps text-on-surface-variant mb-xs block transition-colors group-focus-within:text-primary-container">Full Name</label>
                <input className="w-full bg-transparent border-0 border-b border-outline py-sm px-0 focus:ring-0 focus:border-primary-container text-on-surface placeholder:text-outline transition-all duration-300" name="fullName" placeholder="ALEXANDER VANCE" type="text" value={formData.fullName} onChange={handleChange} />
              </div>
              <div className="group relative">
                <label className="font-label-caps text-label-caps text-on-surface-variant mb-xs block transition-colors group-focus-within:text-primary-container">Email Address</label>
                <input className="w-full bg-transparent border-0 border-b border-outline py-sm px-0 focus:ring-0 focus:border-primary-container text-on-surface placeholder:text-outline transition-all duration-300" name="email" placeholder="AVANCE@STUDIO.COM" type="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="group relative">
                <label className="font-label-caps text-label-caps text-on-surface-variant mb-xs block transition-colors group-focus-within:text-primary-container">Password</label>
                <input className="w-full bg-transparent border-0 border-b border-outline py-sm px-0 focus:ring-0 focus:border-primary-container text-on-surface placeholder:text-outline transition-all duration-300" name="password" placeholder="••••••••••••" type="password" value={formData.password} onChange={handleChange} />
              </div>
              <div className="group relative">
                <label className="font-label-caps text-label-caps text-on-surface-variant mb-xs block transition-colors group-focus-within:text-primary-container">Contact Number</label>
                <input className="w-full bg-transparent border-0 border-b border-outline py-sm px-0 focus:ring-0 focus:border-primary-container text-on-surface placeholder:text-outline transition-all duration-300" name="contactNumber" placeholder="+44 7700 900000" type="tel" value={formData.contactNumber} onChange={handleChange} />
              </div>

              <div className="flex items-center gap-md py-sm">
                <div className="relative flex items-center">
                  <input className="peer h-5 w-5 appearance-none border border-outline bg-transparent transition-all checked:bg-primary-container checked:border-primary-container cursor-pointer rounded-xs" id="seller" name="isSeller" type="checkbox" checked={formData.isSeller} onChange={handleChange} />
                  <span className="material-symbols-outlined absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-surface-container-lowest text-sm left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
                </div>
                <label className="font-label-md text-label-md text-on-surface cursor-pointer select-none" htmlFor="seller">Register as Seller</label>
              </div>

              <button className="w-full bg-primary-container text-on-primary-container py-md font-label-caps text-label-caps hover:bg-primary-fixed transition-colors active:scale-[0.98] duration-200" type="submit">
                REGISTER
              </button>

              <div className="flex items-center gap-sm my-md">
                <div className="flex-1 h-px bg-outline-variant"></div>
                <span className="font-label-caps text-label-caps text-on-surface-variant">OR</span>
                <div className="flex-1 h-px bg-outline-variant"></div>
              </div>

            <ContinueWithGoogle />
            </form>

            <div className="mt-lg text-center">
              <p className="font-label-md text-label-md text-on-surface-variant">
                ALREADY HAVE AN ACCOUNT? <a className="text-primary-container hover:underline underline-offset-4 ml-xs" href="/login">SIGN IN</a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <footer className="w-full py-md flex flex-col md:flex-row justify-between items-center gap-gutter border-t border-outline-variant mt-auto">
            <div className="font-headline-sm text-headline-sm text-on-surface">SNITCH</div>
            <div className="flex gap-lg flex-wrap justify-center">
              <a className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors duration-300" href="#">Privacy Policy</a>
              <a className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors duration-300" href="#">Terms of Service</a>
              <a className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors duration-300" href="#">Shipping &amp; returns</a>
              <a className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors duration-300" href="#">Contact</a>
            </div>
            <div className="font-label-md text-label-md text-on-surface-variant">© 2024 SNITCH CLOTHING. ALL RIGHTS RESERVED.</div>
          </footer>
        </div>
      </main>
    </>
  );
};

export default Register;
