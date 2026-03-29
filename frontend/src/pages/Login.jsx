import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { LogIn, Mail, Lock, Cpu, ArrowRight, ShieldCheck, User } from 'lucide-react';
import api from '../api/axios';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasAdmin, setHasAdmin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data } = await api.get('/auth/status');
        setHasAdmin(data.hasAdmin);
      } catch (err) {
        console.error('Failed to check auth status', err);
      }
    };
    checkStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!hasAdmin) {
      try {
        await api.post('/auth/register', {
          name: name || 'System Administrator',
          email: identifier,
          role: 'admin'
        });
        toast.success(`Admin created! Password sent to ${identifier}`, {
          style: {
            borderRadius: '16px',
            background: '#0f172a',
            color: '#fff',
            fontWeight: 'black',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }
        });
        setHasAdmin(true);
        setPassword('');
      } catch (err) {
        toast.error(err.response?.data?.error || 'Registration Failed');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const user = await login(identifier, password);
      toast.success(`Access Granted: Welcome ${user.name}`, {
        style: {
          borderRadius: '16px',
          background: '#0f172a',
          color: '#fff',
          fontWeight: 'black',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }
      });

      const params = new URLSearchParams(location.search);
      const redirect = params.get('redirect');

      if (redirect) {
        navigate(redirect);
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/student');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!identifier) return toast.error('Please enter your email or ID');
    
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgotpassword', { identifier });
      toast.success(data.message || 'Recovery email sent!', {
        style: {
          borderRadius: '16px',
          background: '#0f172a',
          color: '#fff',
          fontWeight: 'black',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }
      });
      setIsForgotPassword(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-2xl rotate-3">
              <Cpu size={26} />
            </div>
            <span className="text-3xl font-black tracking-tighter text-slate-900">
              Exam<span className="text-brand-600">Core</span>
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            {!hasAdmin ? 'Initial Setup' : isForgotPassword ? 'Recover Account' : 'Sign In'}
          </h1>
          <p className="text-slate-500 font-medium px-4">
            {!hasAdmin ? 'Create the first owner account for this system' : isForgotPassword ? 'Enter your ID or Email below to receive a temporary password.' : 'Please sign in to continue'}
          </p>
        </div>

        <div className="glass-premium p-10 rounded-[48px] shadow-2xl border-white/40">
          <form onSubmit={isForgotPassword ? handleForgotPasswordSubmit : handleSubmit} className="space-y-8">
            
            {!hasAdmin && (
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Administrator Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/50 border-2 border-slate-100 rounded-3xl py-4 pl-14 pr-5 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-600 focus:bg-white transition-all shadow-sm"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                {!hasAdmin ? 'Admin Email' : 'Email, Reg No, or Emp ID'}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type={!hasAdmin ? "email" : "text"}
                  required
                  className="w-full bg-white/50 border-2 border-slate-100 rounded-3xl py-4 pl-14 pr-5 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-600 focus:bg-white transition-all shadow-sm"
                  placeholder={!hasAdmin ? "name@institution.edu" : "Enter your ID or Email"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            {hasAdmin && !isForgotPassword && (
              <div className="space-y-3">
                <div className="flex justify-between items-center ml-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Password</label>
                  <button 
                    type="button" 
                    onClick={() => setIsForgotPassword(true)}
                    className="text-[10px] font-black text-brand-600 uppercase tracking-widest hover:text-brand-800 transition-colors focus:outline-none"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full bg-white/50 border-2 border-slate-100 rounded-3xl py-4 pl-14 pr-5 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-600 focus:bg-white transition-all shadow-sm"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-brand-600 transition-all active:scale-95 shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {!hasAdmin ? 'Create Account' : isForgotPassword ? 'Send Recovery Protocol' : 'Login'}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              {isForgotPassword && (
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="w-full py-4 text-slate-500 font-bold text-sm tracking-wide hover:text-slate-800 transition-colors"
                >
                  Return to Login
                </button>
              )}
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Secure Connection</span>
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Powered by ExamCore
        </p>
      </div>
    </div>
  );
};

export default Login;
