import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, UserPlus, AlertCircle, Zap, Eye, EyeOff } from 'lucide-react';
import { register } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { networkErrorMessage } from '../utils/apiErrors';
import PageWrapper from '../components/layout/PageWrapper';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Please enter your name.');
    if (!form.email.trim()) return setError('Please enter your email.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setError('');
    setLoading(true);
    try {
      const data = await register(form.name.trim(), form.email.trim(), form.password);
      setAuth(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;
      if (msg) setError(msg);
      else if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED' || !err.response)
        setError(networkErrorMessage());
      else if (status === 503)
        setError('The server is temporarily unavailable. Make sure the API is running on port 5001 and try again.');
      else setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="flex items-center justify-center px-4 py-14">
      <div className="w-full max-w-sm space-y-6">

        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto bg-[#FFD700]">
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>
          <h1 className="text-xl font-black text-[#111111]">Create account</h1>
          <p className="text-[#888888] text-xs">Start your adaptive learning journey today</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card space-y-4">

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-[#888888] font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#CCCCCC] pointer-events-none" />
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  autoComplete="name" required placeholder="Your name"
                  className="input-field pl-9" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#888888] font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#CCCCCC] pointer-events-none" />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  autoComplete="email" required placeholder="you@example.com"
                  className="input-field pl-9" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#888888] font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#CCCCCC] pointer-events-none" />
                <input type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                  autoComplete="new-password" required placeholder="Min. 6 characters"
                  className="input-field pl-9 pr-9" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#CCCCCC] hover:text-[#888888] transition-colors">
                  {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {form.password && (
                <div className="flex gap-1 mt-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                      style={{ background: form.password.length >= i * 2 ? (form.password.length >= 8 ? '#22C55E' : '#FF6500') : '#E8E5E0' }} />
                  ))}
                </div>
              )}
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.97 }}
              className="btn-primary w-full justify-center py-2.5 mt-1 disabled:opacity-60">
              {loading
                ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                : <><UserPlus className="w-3.5 h-3.5" /> Create Account</>}
            </motion.button>
          </form>

          <p className="text-center text-[#888888] text-xs">
            Already have an account?{' '}
            <Link to="/login" className="text-[#FF6500] hover:text-[#FF8333] font-semibold transition-colors">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
