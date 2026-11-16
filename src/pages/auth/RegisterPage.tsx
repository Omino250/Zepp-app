import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useZepp } from '../../context/ZeppContext';
import { ZeppLogo } from '../../components/common/ZeppLogo';

export const RegisterPage: React.FC = () => {
  const { registerDemoUser, settings, setTheme } = useZepp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+254 ');
  const [dob, setDob] = useState('');
  const [country, setCountry] = useState('Kenya');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState(false);

  const getStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score += 1;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1;
    if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score += 1;
    return score;
  };

  const strength = getStrength(password);
  const strengthLabel =
    password.length === 0
      ? 'Enter at least 8 characters'
      : strength === 1
        ? 'Weak — add uppercase & numbers'
        : strength === 2
          ? 'Good — add a symbol for extra strength'
          : 'Strong password';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !email.trim() || !phone.trim() || !dob) {
      setError('Please complete all required registration fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!acceptedTerms) {
      setError('Please accept the Terms and Privacy Policy to continue.');
      return;
    }
    setError('');
    registerDemoUser({ name, username, email, phone, country });
    setCreated(true);
    window.setTimeout(() => {
      navigate('/onboarding');
    }, 800);
  };

  return (
    <div className="min-h-screen zepp-ambient-canvas relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        onClick={() => setTheme(settings.theme === 'light' ? 'dark' : 'light')}
        aria-label="Toggle appearance"
        className="fixed top-5 right-5 z-20 w-11 h-11 rounded-2xl zepp-glass flex items-center justify-center text-[#142443] dark:text-[#DCEAFF]"
      >
        {settings.theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>

      <div className="relative z-10 w-full max-w-xl zepp-glass rounded-[34px] p-6 sm:p-9 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1769E8] dark:text-[#60A5FA] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
          <span className="text-[11px] font-medium text-[#71819C] dark:text-[#A6B6D0]">
            Simulated Registration
          </span>
        </div>

        <div className="flex items-center gap-4">
          <ZeppLogo variant="full" size="sm" />
          <div>
            <h1 className="font-display text-2xl font-extrabold text-[#142443] dark:text-[#F0F5FF]">
              Create your Zepp account
            </h1>
            <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] mt-0.5">
              Connect, discover creators, explore businesses, and book events.
            </p>
          </div>
        </div>

        {created ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#20A574] mx-auto" />
            <h2 className="text-lg font-bold text-[#142443] dark:text-[#F0F5FF]">
              Account Created
            </h2>
            <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
              Preparing your onboarding choices...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#142443] dark:text-[#DCEAFF] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kamau Njoroge"
                  className="w-full zepp-neu-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#142443] dark:text-[#DCEAFF] mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. kamau.n"
                  className="w-full zepp-neu-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#142443] dark:text-[#DCEAFF] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kamau@example.ke"
                  className="w-full zepp-neu-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#142443] dark:text-[#DCEAFF] mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 712 000 000"
                  className="w-full zepp-neu-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#142443] dark:text-[#DCEAFF] mb-1.5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full zepp-neu-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#142443] dark:text-[#DCEAFF] mb-1.5">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full zepp-neu-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
                >
                  <option value="Kenya">Kenya</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="International">Other / International</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#142443] dark:text-[#DCEAFF] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full zepp-neu-input rounded-xl pl-3.5 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label="Toggle password visibility"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71819C]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#142443] dark:text-[#DCEAFF] mb-1.5">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full zepp-neu-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
                />
              </div>
            </div>

            {/* Password strength bar */}
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-1.5 h-1.5">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`rounded-full transition-colors ${
                      strength >= step
                        ? strength === 1
                          ? 'bg-[#E55353]'
                          : strength === 2
                            ? 'bg-[#EBAA43]'
                            : 'bg-[#20A574]'
                        : 'bg-[#DCEAFF] dark:bg-blue-400/15'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-[#71819C] dark:text-[#A6B6D0]">{strengthLabel}</p>
            </div>

            <label className="flex items-start gap-2.5 text-xs text-[#1C2B45] dark:text-[#DCEAFF] cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 accent-[#1769E8] w-4 h-4"
              />
              <span>
                I agree to Zepp’s Terms of Service and Privacy Policy. Note: passwords are never persisted in local demonstration storage.
              </span>
            </label>

            {error && (
              <p className="text-xs font-medium text-[#E55353]" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl zepp-btn-primary text-sm font-bold"
            >
              Create Account & Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
