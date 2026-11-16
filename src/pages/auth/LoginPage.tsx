import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Eye, EyeOff, Lock, Moon, Sun, User } from 'lucide-react';
import { useZepp } from '../../context/ZeppContext';
import { ZeppLogo } from '../../components/common/ZeppLogo';
import { Modal } from '../../components/common/Modal';

export const LoginPage: React.FC = () => {
  const { loginDemo, loginWithGoogleDemo, settings, setTheme, pushToast } = useZepp();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('wanjiku.k');
  const [password, setPassword] = useState('zepp-demo-2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Enter your demonstration username/email and password to continue.');
      return;
    }
    setError('');
    loginDemo(identifier, rememberMe);
    navigate('/home');
  };

  const handleQuickDemo = (username: string) => {
    loginDemo(username, true);
    navigate('/home');
  };

  const handleGoogleDemo = () => {
    loginWithGoogleDemo();
    navigate('/home');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setForgotOpen(false);
    setResetEmail('');
    pushToast('Password reset flow simulated for demonstration.', 'info');
  };

  return (
    <div className="min-h-screen zepp-ambient-canvas relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {/* Curved abstract decorative glass shapes inspired by reference */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-36 -left-36 w-[440px] h-[440px] rounded-full border-[18px] border-white/60 dark:border-blue-400/10 bg-gradient-to-br from-[#DCEAFF]/80 to-transparent dark:from-[#1769E8]/20 shadow-inner"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-24 w-64 h-64 rounded-full bg-gradient-to-bl from-[#287BFA]/20 to-[#DCEAFF]/50 dark:from-[#287BFA]/20 dark:to-transparent blur-sm"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-28 w-[420px] h-[420px] rounded-full border-[16px] border-white/65 dark:border-blue-300/10 bg-gradient-to-tl from-[#DCEAFF]/70 to-transparent dark:from-[#1769E8]/15"
      />

      {/* Top-right Appearance Toggle */}
      <button
        type="button"
        onClick={() => setTheme(settings.theme === 'light' ? 'dark' : 'light')}
        aria-label="Toggle light and dark appearance"
        className="fixed top-5 right-5 z-20 w-11 h-11 rounded-2xl zepp-glass flex items-center justify-center text-[#142443] dark:text-[#DCEAFF] hover:scale-105 transition-transform"
      >
        {settings.theme === 'light' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </button>

      {/* Main Frosted Login Container */}
      <div className="relative z-10 w-full max-w-[430px] zepp-glass rounded-[34px] p-7 sm:p-9 space-y-6">
        {/* Official Zepp Logo */}
        <div className="flex flex-col items-center text-center">
          <ZeppLogo variant="full" size="lg" className="mb-5" />
          <h1 className="font-display text-2xl sm:text-[28px] font-extrabold tracking-tight text-[#142443] dark:text-[#F0F5FF]">
            Welcome Back
          </h1>
          <p className="text-sm text-[#71819C] dark:text-[#A6B6D0] mt-1 tracking-wide">
            Sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-identifier" className="sr-only">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-[18px] h-[18px] text-[#71819C] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Username or Email"
                className="w-full zepp-neu-input rounded-2xl pl-11 pr-4 py-3.5 text-sm text-[#142443] dark:text-white placeholder:text-[#98A6BA] focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <Lock className="w-[18px] h-[18px] text-[#71819C] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full zepp-neu-input rounded-2xl pl-11 pr-12 py-3.5 text-sm text-[#142443] dark:text-white placeholder:text-[#98A6BA] focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-xl text-[#71819C] hover:text-[#1769E8] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium text-[#E55353] px-1" role="alert">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between gap-2 text-xs pt-0.5">
            <button
              type="button"
              onClick={() => setRememberMe((v) => !v)}
              className="flex items-center gap-2 text-[#1C2B45] dark:text-[#DCEAFF] font-medium"
            >
              <span
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  rememberMe
                    ? 'bg-[#1769E8] text-white shadow-sm'
                    : 'bg-white/80 dark:bg-[#0D1930] border border-[#98A6BA]/50'
                }`}
              >
                {rememberMe && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </span>
              Remember Me
            </button>

            <button
              type="button"
              onClick={() => setForgotOpen(true)}
              className="font-semibold text-[#1769E8] dark:text-[#60A5FA] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-full zepp-btn-primary text-sm font-bold flex items-center justify-between"
          >
            <span className="w-7" aria-hidden="true" />
            <span>Login</span>
            <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 text-[11px] font-semibold tracking-widest text-[#71819C] dark:text-[#A6B6D0]">
          <div className="h-px flex-1 bg-[#DCEAFF] dark:bg-blue-400/20" />
          <span>OR CONTINUE WITH</span>
          <div className="h-px flex-1 bg-[#DCEAFF] dark:bg-blue-400/20" />
        </div>

        {/* Google Demo & Quick StakeHolder Role Presets */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleDemo}
            className="w-full py-3 px-4 rounded-2xl zepp-btn-secondary text-xs font-bold flex items-center justify-center gap-2.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
              />
            </svg>
            Continue with Google (Demo)
          </button>

          <div className="pt-1">
            <p className="text-[11px] text-center text-[#71819C] dark:text-[#A6B6D0] mb-2">
              Quick Demo Persona Sign-In
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('wanjiku.k')}
                className="py-2 px-2 rounded-xl zepp-glass-subtle text-[11px] font-semibold text-[#142443] dark:text-[#DCEAFF] hover:border-[#1769E8]/50 transition-colors truncate"
              >
                Personal
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('nairobi.frames')}
                className="py-2 px-2 rounded-xl zepp-glass-subtle text-[11px] font-semibold text-[#142443] dark:text-[#DCEAFF] hover:border-[#1769E8]/50 transition-colors truncate"
              >
                Creator
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('kilimani.roast')}
                className="py-2 px-2 rounded-xl zepp-glass-subtle text-[11px] font-semibold text-[#142443] dark:text-[#DCEAFF] hover:border-[#1769E8]/50 transition-colors truncate"
              >
                Business
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-3 pt-1">
          <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
            New to Zepp?{' '}
            <Link
              to="/register"
              className="font-bold text-[#1769E8] dark:text-[#60A5FA] hover:underline"
            >
              Create an account
            </Link>
          </p>
          <p className="text-[10px] font-semibold tracking-[0.2em] text-[#71819C] dark:text-[#A6B6D0]">
            CONNECT · DISCOVER · EXPERIENCE
          </p>
          <p className="text-[11px] text-[#98A6BA] leading-snug">
            Simulated demonstration login. Designed for future Firebase Authentication integration.
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        title="Reset Demonstration Password"
        subtitle="Simulated recovery notice"
        maxWidthClass="max-w-sm"
      >
        <form onSubmit={handleResetSubmit} className="space-y-4">
          <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] leading-relaxed">
            In production, Zepp sends a secure reset link via Firebase Authentication. Enter an email to test the demonstration flow.
          </p>
          <input
            type="email"
            required
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder="you@example.ke"
            className="w-full zepp-neu-input rounded-xl px-3.5 py-2.5 text-sm text-[#142443] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setForgotOpen(false)}
              className="px-4 py-2 rounded-xl zepp-btn-secondary text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl zepp-btn-primary text-xs font-semibold"
            >
              Send Demo Link
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
