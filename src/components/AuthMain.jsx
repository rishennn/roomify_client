import { useState } from 'react';
import { Home, Mail, KeyRound, User, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function InputField({ label, id, name, type, placeholder, icon: Icon, minLength }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
          <Icon className="w-4 h-4" />
        </div>
        <input 
          type={type} 
          id={id}
          name={name}
          placeholder={placeholder}
          minLength={minLength}
          className="w-full bg-[#101625] border border-slate-800/80 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
          required
        />
      </div>
    </div>
  );
}

export default function AuthMain() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    if (!isSignIn) {
      if (!data.username || data.username.trim().length < 3) {
        setError('Username must be at least 3 characters long');
        return;
      }
      
      if (!data.password || data.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
    }
    
    const endpoint = isSignIn ? '/auth/signin' : '/auth/signup';
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      setError(errorMessage);
    }
  };

  const handleSwitchMode = (mode) => {
    setIsSignIn(mode);
    setError('');
  };

  return (
    <div className="w-full md:w-1/2 min-h-screen bg-[#080c14] flex items-center justify-center p-6 lg:p-12 selection:bg-blue-500/30">
      <div className="w-full max-w-[420px] bg-[#0b111e] p-8 md:p-9 rounded-2xl border border-slate-800/80 shadow-2xl shadow-black/40 flex flex-col items-center transition-all duration-300">
        
        <div className="w-12 h-12 bg-[#131c2e] rounded-xl border border-slate-800 flex items-center justify-center p-2.5 mb-5 shadow-inner group">
          <Home className="w-6 h-6 text-blue-500 transition-transform group-hover:scale-110" strokeWidth={2.5} />
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight text-center mb-1">
          {isSignIn ? 'Sign in' : 'Create an Account'}
        </h1>
        
        <p className="text-xs text-slate-400 text-center mb-6 max-w-[260px] leading-relaxed">
          {isSignIn 
            ? 'Sign in to access your saved interior design canvases.' 
            : 'Start blueprinting your dream layout today.'
          }
        </p>

        {error && (
          <div className="w-full flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold p-3.5 rounded-xl mb-4 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          {!isSignIn && (
            <InputField 
              label="Username"
              id="username"
              name="username"
              type="text"
              placeholder="e.g. John Doe"
              icon={User}
              minLength={3}
            />
          )}

          <InputField 
            label="Email Address"
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            icon={Mail}
          />

          <InputField 
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            icon={KeyRound}
            minLength={6}
          />

          <button 
            type="submit" 
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-extrabold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99] shadow-lg shadow-blue-500/10 mt-2 text-sm"
          >
            {isSignIn ? (
              <>
                <LogIn className="w-4 h-4" strokeWidth={2.5} />
                Sign In
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" strokeWidth={2.5} />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 font-medium">
          {isSignIn ? (
            <>
              Don’t have an account?{' '}
              <button 
                onClick={() => handleSwitchMode(false)}
                className="font-bold text-blue-500 hover:text-blue-400 transition-colors hover:underline focus:outline-none"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button 
                onClick={() => handleSwitchMode(true)}
                className="font-bold text-blue-500 hover:text-blue-400 transition-colors hover:underline focus:outline-none"
              >
                Log in
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}