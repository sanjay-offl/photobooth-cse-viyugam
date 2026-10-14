'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Settings {
  eventTitle: string;
  institutionName: string;
  eventDate: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  retentionHours: number;
  maxPhotoSizeMb: number;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length >= 4) {
      setAuthed(true);
      loadSettings(password);
    }
  };

  const loadSettings = async (pwd: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings', {
        headers: { Authorization: `Bearer ${pwd}` },
      });
      if (res.ok) {
        setSettings(await res.json());
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMsg('✅ Settings saved successfully!');
      } else {
        const err = await res.json();
        setMsg(`❌ ${err.error || 'Failed to save'}`);
      }
    } catch {
      setMsg('❌ Network error');
    }
    setSaving(false);
    setTimeout(() => setMsg(''), 4000);
  };

  const Field = ({ label, field, type = 'text', min, max }: { label: string; field: keyof Settings; type?: string; min?: number; max?: number }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[#FF6500] text-xs font-rajdhani font-bold uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={String(settings?.[field] ?? '')}
        min={min}
        max={max}
        onChange={(e) => setSettings((s) => s ? { ...s, [field]: type === 'number' ? Number(e.target.value) : e.target.value } : s)}
        className="bg-neutral-900 border border-neutral-700 text-white px-3 py-2 rounded-lg focus:border-[#FF6500] focus:outline-none transition-colors text-sm font-inter"
      />
    </div>
  );

  if (!authed) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] halftone-bg flex flex-col items-center justify-center px-4">
        <motion.div className="retro-card p-8 max-w-sm w-full flex flex-col gap-6"
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="text-center">
            <h1 className="text-4xl font-bebas font-black tracking-wide text-white">ADMIN</h1>
            <p className="text-neutral-400 text-xs font-rajdhani font-bold tracking-widest uppercase mt-1">VIYUGAM 2K26 SETTINGS</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#FF6500] text-xs font-rajdhani font-bold uppercase tracking-wider" htmlFor="admin-password">Admin Password</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="bg-neutral-900 border border-neutral-700 text-white px-3 py-2 rounded-lg focus:border-[#FF6500] focus:outline-none transition-colors font-inter text-sm"
                autoComplete="current-password"
              />
              <p className="text-xs text-neutral-500 font-rajdhani">Set ADMIN_SECRET in .env.local</p>
            </div>
            <button type="submit" className="btn-retro w-full" id="admin-login-btn">
              🔐 Login
            </button>
          </form>
          <Link href="/" className="text-center text-xs text-neutral-500 hover:text-[#FF6500] font-rajdhani font-bold tracking-wider">← Back to Booth</Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] halftone-bg px-4 py-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-[#FF6500] text-sm font-rajdhani font-bold hover:underline">← BOOTH</Link>
          <h1 className="text-3xl font-bebas font-black tracking-wider text-white">ADMIN CONFIG</h1>
          <div className="w-16" />
        </div>

        {loading ? (
          <div className="text-center text-[#FF6500] font-rajdhani font-bold py-12 text-lg">Loading settings…</div>
        ) : settings ? (
          <motion.div className="flex flex-col gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Event Branding */}
            <div className="retro-card p-6 flex flex-col gap-4">
              <h2 className="text-[#FF6500] font-bebas text-xl tracking-wide">
                EVENT BRANDING
              </h2>
              <Field label="Event Title" field="eventTitle" />
              <Field label="Institution Name" field="institutionName" />
              <Field label="Event Date" field="eventDate" />
              <Field label="Tagline" field="tagline" />
            </div>

            {/* Colors */}
            <div className="retro-card p-6 flex flex-col gap-4">
              <h2 className="text-[#FF6500] font-bebas text-xl tracking-wide">
                BRAND COLORS
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#FF6500] text-xs font-rajdhani font-bold uppercase tracking-wider">Primary Color</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={settings.primaryColor}
                      onChange={(e) => setSettings((s) => s ? { ...s, primaryColor: e.target.value } : s)}
                      className="w-10 h-10 rounded border border-neutral-700 cursor-pointer bg-transparent" />
                    <span className="text-neutral-300 text-sm font-mono">{settings.primaryColor}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#FF6500] text-xs font-rajdhani font-bold uppercase tracking-wider">Secondary Color</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={settings.secondaryColor}
                      onChange={(e) => setSettings((s) => s ? { ...s, secondaryColor: e.target.value } : s)}
                      className="w-10 h-10 rounded border border-neutral-700 cursor-pointer bg-transparent" />
                    <span className="text-neutral-300 text-sm font-mono">{settings.secondaryColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Storage Settings */}
            <div className="retro-card p-6 flex flex-col gap-4">
              <h2 className="text-[#FF6500] font-bebas text-xl tracking-wide">
                STORAGE & LIMITS
              </h2>
              <Field label="Photo Retention (hours)" field="retentionHours" type="number" min={1} max={168} />
              <Field label="Max Photo Size (MB)" field="maxPhotoSizeMb" type="number" min={1} max={50} />
            </div>

            {/* Firebase Status */}
            <div className="retro-card p-4 flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">
                {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅' : '⚠️'}
              </span>
              <div>
                <p className="text-[#FF6500] font-bold font-rajdhani text-sm">Firebase Status</p>
                <p className="text-gray-400 text-xs mt-1">
                  {process.env.NEXT_PUBLIC_FIREBASE_API_KEY
                    ? 'Firebase is configured. Cloud storage enabled.'
                    : 'Firebase not configured. Running in local mode. QR sharing disabled. Set environment variables in .env.local to enable cloud storage.'}
                </p>
              </div>
            </div>

            {msg && (
              <motion.p className="text-center font-bold py-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {msg}
              </motion.p>
            )}

            <motion.button onClick={handleSave} disabled={saving} className="btn-retro w-full text-lg py-4" id="save-settings-btn"
              whileTap={{ scale: 0.97 }}>
              {saving ? '⏳ Saving…' : '💾 SAVE SETTINGS'}
            </motion.button>
          </motion.div>
        ) : (
          <div className="text-center text-red-400 py-12">
            <p>Failed to load settings. Check your password or ADMIN_SECRET env variable.</p>
            <button onClick={() => { setAuthed(false); setPassword(''); }} className="btn-retro-outline mt-4">
              Try Again
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
