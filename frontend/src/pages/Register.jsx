import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, ArrowRight, User, Mail, Lock, GraduationCap, BookOpen } from 'lucide-react';
import authService from '../services/authService';

const InputField = ({
  name,
  label,
  type = 'text',
  icon: Icon,
  placeholder,
  required = false,
  hint,
  value,
  onChange,
  error,
  showPassword,
  onTogglePassword,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
        <Icon size={16} />
      </div>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-gray-50 focus:bg-white transition-colors outline-none focus:ring-2 ${
          error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-400'
        }`}
      />
      {name === 'password' && (
        <button type="button" onClick={onTogglePassword} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
    {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    collegeName: '',
    department: '',
    yearOfStudy: '',
    bio: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) newErrors.fullName = 'Full name must be at least 2 characters';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email address';
    if (!form.password || form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.yearOfStudy && (Number(form.yearOfStudy) < 1 || Number(form.yearOfStudy) > 10)) newErrors.yearOfStudy = 'Year of study must be between 1 and 10';
    if (form.bio && form.bio.length > 1000) newErrors.bio = 'Bio must be under 1000 characters';
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setLoading(true);
    setApiError('');
    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        collegeName: form.collegeName.trim() || undefined,
        department: form.department.trim() || undefined,
        yearOfStudy: form.yearOfStudy ? Number(form.yearOfStudy) : undefined,
        bio: form.bio.trim() || undefined,
      };
      await authService.register(payload);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.response
        ? err.response.data?.message || err.response.data?.error || 'Registration failed. Please try again.'
        : 'Cannot reach the SkillSwap server. Start the Spring Boot backend on port 8080, then try again.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SkillSwap!</h2>
          <p className="text-gray-500">Your account has been created. Redirecting to login…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SkillSwap</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create Your Account</h1>
          <p className="text-gray-500 mt-2">Join thousands of students exchanging skills</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 text-sm mb-5">{apiError}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <InputField name="fullName" label="Full Name" icon={User} placeholder="Your full name" required value={form.fullName} onChange={handleChange} error={errors.fullName} />
              <InputField name="email" label="Email Address" type="email" icon={Mail} placeholder="you@college.edu" required value={form.email} onChange={handleChange} error={errors.email} />
            </div>

            <InputField
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              placeholder="Min. 6 characters"
              required
              hint="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <InputField name="collegeName" label="College Name" icon={GraduationCap} placeholder="Your college" value={form.collegeName} onChange={handleChange} error={errors.collegeName} />
              <InputField name="department" label="Department" icon={BookOpen} placeholder="e.g. Computer Science" value={form.department} onChange={handleChange} error={errors.department} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Year of Study</label>
              <select
                name="yearOfStudy"
                value={form.yearOfStudy}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-gray-50 focus:bg-white transition-colors outline-none focus:ring-2 ${
                  errors.yearOfStudy ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-400'
                }`}
              >
                <option value="">Select year</option>
                {[1, 2, 3, 4, 5].map((y) => <option key={y} value={y}>Year {y}</option>)}
              </select>
              {errors.yearOfStudy && <p className="text-xs text-red-500 mt-1">{errors.yearOfStudy}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell other students about yourself…"
                rows={3}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-gray-50 focus:bg-white transition-colors outline-none focus:ring-2 resize-none ${
                  errors.bio ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-400'
                }`}
              />
              <div className="flex justify-between mt-1">
                {errors.bio && <p className="text-xs text-red-500">{errors.bio}</p>}
                <span className="text-xs text-gray-400 ml-auto">{form.bio.length}/1000</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

