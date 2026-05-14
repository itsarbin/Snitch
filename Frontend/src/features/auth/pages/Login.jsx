import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hook/useAuth';

const Login = () => {
  const navigate = useNavigate()
  const {handleLogin} = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e)=>{
    e.preventDefault()
    try {
      const {email,password} = formData
      const response = await handleLogin({email,password})
      if(response && response.success){
        navigate('/')
      } else {
        console.error('Login failed:', response?.message || 'Unknown error')
      }
    } catch (error) {
      console.error('Login error:', error.message)
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
          <img alt="High-fashion urban editorial" className="w-full h-full object-cover grayscale brightness-75 contrast-125" src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="absolute bottom-xl left-margin-desktop">
            <p className="font-headline-sm text-headline-sm text-primary-container mb-xs">THE ARCHIVE</p>
            <p className="font-label-caps text-label-caps text-on-surface tracking-[0.3em]">FW24 LOGIN</p>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="w-full lg:w-1/2 h-full flex flex-col bg-surface overflow-y-auto scrollbar-hide px-margin-mobile md:px-margin-desktop">
          <div className="flex-grow flex flex-col justify-center max-w-[480px] mx-auto w-full py-md">
            <header className="mb-md">
              <h1 className="font-display-lg text-display-lg-mobile md:text-headline-md mb-xs text-on-surface">Welcome Back.</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Sign in to access your exclusive drops.</p>
            </header>

            <form className="space-y-md" onSubmit={handleSubmit}>
              <div className="group relative">
                <label className="font-label-caps text-label-caps text-on-surface-variant mb-xs block transition-colors group-focus-within:text-primary-container">Email Address</label>
                <input className="w-full bg-transparent border-0 border-b border-outline py-sm px-0 focus:ring-0 focus:border-primary-container text-on-surface placeholder:text-outline transition-all duration-300" name="email" placeholder="AVANCE@STUDIO.COM" type="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="group relative">
                <label className="font-label-caps text-label-caps text-on-surface-variant mb-xs block transition-colors group-focus-within:text-primary-container">Password</label>
                <input className="w-full bg-transparent border-0 border-b border-outline py-sm px-0 focus:ring-0 focus:border-primary-container text-on-surface placeholder:text-outline transition-all duration-300" name="password" placeholder="••••••••••••" type="password" value={formData.password} onChange={handleChange} />
              </div>

              <div className="pt-sm pb-md"></div>

              <button className="w-full bg-primary-container text-on-primary-container py-md font-label-caps text-label-caps hover:bg-primary-fixed transition-colors active:scale-[0.98] duration-200" type="submit">
                SIGN IN
              </button>

              <div className="flex items-center gap-sm my-md">
                <div className="flex-1 h-px bg-outline-variant"></div>
                <span className="font-label-caps text-label-caps text-on-surface-variant">OR</span>
                <div className="flex-1 h-px bg-outline-variant"></div>
              </div>

              <button className="w-full bg-transparent border border-outline text-on-surface py-md font-label-caps text-label-caps hover:border-primary-container hover:text-primary-container transition-colors active:scale-[0.98] duration-200 flex items-center justify-center gap-sm" type="button">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                CONTINUE WITH GOOGLE
              </button>
            </form>

            <div className="mt-lg text-center">
              <p className="font-label-md text-label-md text-on-surface-variant">
                DON'T HAVE AN ACCOUNT? <a className="text-primary-container hover:underline underline-offset-4 ml-xs" href="/register">REGISTER</a>
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

export default Login;