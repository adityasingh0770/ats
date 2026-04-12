import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { getProfile, updateProfile } from '../services/quizService';
import PageWrapper from '../components/layout/PageWrapper';
import { FullPageLoader } from '../components/ui/LoadingSpinner';
import {
  User, Mail, Lock, CheckCircle, AlertCircle, PenLine,
  Shield, Target, Lightbulb, Library, CalendarDays,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, setAuth, token } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setForm(f => ({ ...f, name: data.name }));
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); setSuccess('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (form.newPassword && form.newPassword !== form.confirmPassword)
      return setError('New passwords do not match.');
    setSaving(true);
    try {
      const payload = {};
      if (form.name.trim() && form.name.trim() !== profile.name) payload.name = form.name.trim();
      if (form.newPassword) { payload.currentPassword = form.currentPassword; payload.newPassword = form.newPassword; }
      if (Object.keys(payload).length === 0) { setSaving(false); return setEditing(false); }
      const res = await updateProfile(payload);
      setProfile(p => ({ ...p, name: res.name }));
      setAuth(token, { ...user, name: res.name });
      setSuccess('Profile updated successfully!');
      setEditing(false);
      setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <FullPageLoader text="Loading profile..." />;

  const initials = profile?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const joinDate  = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—';
  const isGuestProfile = !!profile?.isGuestUser;

  const stats = [
    { icon: Target,    label: 'Accuracy',   value: profile?.stats?.accuracy ? `${profile.stats.accuracy}%` : '—', color: '#F43F5E' },
    { icon: PenLine,   label: 'Attempts',   value: profile?.stats?.attempts ?? '0',                                 color: '#FF6500' },
    { icon: Lightbulb, label: 'Hints Used', value: profile?.stats?.hintsUsed ?? '0',                               color: '#F59E0B' },
    { icon: Library,   label: 'Sessions',   value: profile?.stats?.totalSessions ?? '0',                           color: '#3B82F6' },
  ];

  return (
    <PageWrapper>
      <div className="max-w-xl mx-auto px-4 py-8 space-y-4">

        {/* Avatar + name */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFD700] flex items-center justify-center text-black font-black text-xl shrink-0 shadow-md">
            {initials}
          </div>
          <div>
            <h1 className="text-xl font-black text-[#111111]">{profile?.name}</h1>
            <p className="text-[#888888] text-xs flex items-center gap-1.5 mt-0.5">
              <CalendarDays className="w-3 h-3" /> Joined {joinDate}
            </p>
          </div>
          {!editing && (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { setEditing(true); setSuccess(''); setError(''); }}
              className="btn-secondary ml-auto flex items-center gap-1.5 text-xs">
              <PenLine className="w-3.5 h-3.5" /> Edit
            </motion.button>
          )}
        </motion.div>

        {/* Info card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="card space-y-3">
          <div className="text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider">Account Info</div>
          <div className="space-y-2">
            {[
              { icon: User,   label: 'Full Name', value: profile?.name },
              {
                icon: Mail,
                label: isGuestProfile ? 'Profile' : 'Email',
                value: isGuestProfile ? 'Practice profile on this browser (local storage)' : profile?.email,
              },
              { icon: Shield, label: 'Grade',     value: `Grade ${profile?.grade || 8}` },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#F8F6F3] border border-[#E8E5E0]">
                  <Icon className="w-3.5 h-3.5 text-[#CCCCCC] shrink-0" />
                  <div>
                    <div className="text-xs text-[#AAAAAA]">{item.label}</div>
                    <div className="text-sm text-[#111111] font-medium">{item.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="grid grid-cols-4 gap-2">
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card text-center py-3 space-y-1">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center mx-auto" style={{ background: `${s.color}15` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                </div>
                <div className="text-sm font-black text-[#111111]">{s.value}</div>
                <div className="text-[10px] text-[#AAAAAA]">{s.label}</div>
              </div>
            );
          })}
        </motion.div>

        {/* Notifications */}
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs">
              <CheckCircle className="w-4 h-4 shrink-0" /> {success}
            </motion.div>
          )}
          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit form */}
        <AnimatePresence>
          {editing && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              className="card border-orange-200 bg-orange-50 space-y-4">
              <div className="text-xs font-semibold text-[#888888] uppercase tracking-wider">Edit Profile</div>
              <form onSubmit={handleSave} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-[#888888]">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#CCCCCC]" />
                    <input type="text" name="name" value={form.name} onChange={handleChange}
                      placeholder="Your name" className="input-field pl-9" />
                  </div>
                </div>
                {!isGuestProfile && (
                  <div className="border-t border-[#E8E5E0] pt-3">
                    <div className="text-xs text-[#888888] mb-2.5 flex items-center gap-1.5">
                      <Lock className="w-3 h-3" /> Change Password <span className="text-[#CCCCCC]">(optional)</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { name: 'currentPassword', placeholder: 'Current password' },
                        { name: 'newPassword',     placeholder: 'New password (min. 6 chars)' },
                        { name: 'confirmPassword', placeholder: 'Confirm new password' },
                      ].map(f => (
                        <div key={f.name} className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#CCCCCC]" />
                          <input type="password" name={f.name} value={form[f.name]} onChange={handleChange}
                            placeholder={f.placeholder} className="input-field pl-9" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  <motion.button type="button" whileTap={{ scale: 0.97 }}
                    onClick={() => { setEditing(false); setError(''); setSuccess(''); }}
                    className="flex-1 btn-secondary">Cancel</motion.button>
                  <motion.button type="submit" disabled={saving}
                    whileHover={{ scale: saving ? 1 : 1.02 }} whileTap={{ scale: 0.97 }}
                    className="flex-1 btn-primary justify-center disabled:opacity-60">
                    {saving
                      ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                      : <><CheckCircle className="w-3.5 h-3.5" /> Save Changes</>}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
