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
      <label className="text-yellow-400 text-sm font-bold uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={String(settings?.[field] ?? '')}
        min={min}
        max={max}
        onChange={(e) => setSettings((s) => s ? { ...s, [field]: type === 'number' ? Number(e.target.value) : e.target.value } : s)}
        className="bg-gray-900 border-2 border-gray-700 text-white px-3 py-2 rounded-lg focus:border-yellow-400 focus:outline-none transition-colors text-sm"
      />
    </div>
  );

  if (!authed) {
    return (
      <main className="min-h-screen bg-black halftone-bg flex flex-col items-center justify-center px-4">
        <motion.div className="retro-card p-8 max-w-sm w-full flex flex-col gap-6"
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="text-center">
            <h1 className="retro-heading text-4xl">ADMIN</h1>
            <p className="text-gray-400 text-sm mt-2">Event Configuration</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-yellow-400 text-sm font-bold" htmlFor="admin-password">Admin Password</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="bg-gray-900 border-2 border-gray-700 text-white px-3 py-2 rounded-lg focus:border-yellow-400 focus:outline-none transition-colors"
                autoComplete="current-password"
              />
              <p className="text-xs text-gray-600">Set ADMIN_SECRET in .env.local</p>
            </div>
            <button type="submit" className="btn-retro w-full" id="admin-login-btn">
              🔐 Login
            </button>
          </form>
          <Link href="/" className="text-center text-xs text-gray-600 hover:text-gray-400">← Back to Booth</Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black halftone-bg px-4 py-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-yellow-400 text-sm font-bold hover:text-yellow-300">← BOOTH</Link>
          <h1 className="retro-heading text-3xl">ADMIN</h1>
          <div className="w-16" />
        </div>

        {loading ? (
          <div className="text-center text-yellow-400 py-12">Loading settings…</div>
        ) : settings ? (
          <motion.div className="flex flex-col gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Event Branding */}
            <div className="retro-card p-6 flex flex-col gap-4">
              <h2 className="text-yellow-400 font-black text-lg" style={{ fontFamily: "'Anton', sans-serif" }}>
                EVENT BRANDING
              </h2>
              <Field label="Event Title" field="eventTitle" />
              <Field label="Institution Name" field="institutionName" />
              <Field label="Event Date" field="eventDate" />
              <Field label="Tagline" field="tagline" />
            </div>

            {/* Colors */}
            <div className="retro-card p-6 flex flex-col gap-4">
              <h2 className="text-yellow-400 font-black text-lg" style={{ fontFamily: "'Anton', sans-serif" }}>
                COLORS
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-yellow-400 text-sm font-bold uppercase tracking-wider">Primary Color</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={settings.primaryColor}
                      onChange={(e) => setSettings((s) => s ? { ...s, primaryColor: e.target.value } : s)}
                      className="w-10 h-10 rounded border-2 border-gray-700 cursor-pointer bg-transparent" />
                    <span className="text-gray-300 text-sm font-mono">{settings.primaryColor}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-yellow-400 text-sm font-bold uppercase tracking-wider">Secondary Color</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={settings.secondaryColor}
                      onChange={(e) => setSettings((s) => s ? { ...s, secondaryColor: e.target.value } : s)}
                      className="w-10 h-10 rounded border-2 border-gray-700 cursor-pointer bg-transparent" />
                    <span className="text-gray-300 text-sm font-mono">{settings.secondaryColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Storage Settings */}
            <div className="retro-card p-6 flex flex-col gap-4">
              <h2 className="text-yellow-400 font-black text-lg" style={{ fontFamily: "'Anton', sans-serif" }}>
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
                <p className="text-yellow-400 font-bold text-sm">Firebase Status</p>
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
