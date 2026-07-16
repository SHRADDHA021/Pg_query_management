import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services';
import {
  Home, User, Lock, Eye, EyeOff, Phone,
  MapPin, AlertCircle, CheckCircle2, ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    name: '', username: '', password: '', confirmPassword: '',
    phone: '', address: '', emergencyContact: '', age: ''
  });

  const handleChange = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const validate = () => {
    if (!form.name.trim()) return 'Full name is required.';
    if (!form.username.trim()) return 'Username is required.';
    if (form.username.length < 4) return 'Username must be at least 4 characters.';
    if (!form.password) return 'Password is required.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    if (form.phone && !/^\d{10}$/.test(form.phone)) return 'Phone must be exactly 10 digits.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      await authService.register({
        name: form.name.trim(),
        username: form.username.trim(),
        password: form.password,
        phone: form.phone || null,
        address: form.address || null,
        emergencyContact: form.emergencyContact || null,
        age: form.age ? parseInt(form.age) : null
      });
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-10rem', left: '-10rem', width: '28rem', height: '28rem', background: 'rgba(5,150,105,0.10)', borderRadius: '9999px', filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', bottom: '-10rem', right: '-10rem', width: '28rem', height: '28rem', background: 'rgba(245,158,11,0.08)', borderRadius: '9999px', filter: 'blur(80px)' }} />
        </div>
        <div style={{ position: 'relative', width: '100%', maxWidth: '480px', textAlign: 'center', animation: 'fadeIn 0.4s ease' }}>
          <div style={{
            width: '5rem', height: '5rem', borderRadius: '9999px',
            background: 'rgba(5,150,105,0.15)', border: '2px solid rgba(5,150,105,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <CheckCircle2 style={{ width: '2.5rem', height: '2.5rem', color: '#34d399' }} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
            Registration Successful! 🎉
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginBottom: '0.5rem', lineHeight: 1.6 }}>
            Your account has been created and is <strong style={{ color: '#fbbf24' }}>pending admin approval</strong>.
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            The hostel admin will review your registration, assign you a room, and enable your login. You'll be able to sign in once verified.
          </p>
          <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Registered as:</p>
            <p style={{ color: '#fff', fontWeight: 700 }}>{form.name}</p>
            <p style={{ color: '#f59e0b', fontFamily: 'monospace', fontSize: '0.875rem' }}>@{form.username}</p>
          </div>
          <button onClick={() => navigate('/login')} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10rem', right: '-10rem', width: '28rem', height: '28rem', background: 'rgba(245,158,11,0.10)', borderRadius: '9999px', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-10rem', left: '-10rem', width: '28rem', height: '28rem', background: 'rgba(99,102,241,0.07)', borderRadius: '9999px', filter: 'blur(80px)' }} />
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: '560px', animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '4rem', height: '4rem',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            borderRadius: '1rem', marginBottom: '1rem',
            boxShadow: '0 8px 25px rgba(245,158,11,0.30)'
          }}>
            <Home style={{ width: '2rem', height: '2rem', color: '#000' }} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem' }}>
            Student Registration
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Create your account — admin will verify and assign your room.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(220,38,38,0.10)', border: '1px solid rgba(220,38,38,0.30)',
              borderRadius: '0.75rem', padding: '0.75rem', marginBottom: '1.25rem',
              color: '#f87171', fontSize: '0.875rem'
            }}>
              <AlertCircle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Name + Username */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <User style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#6b7280' }} />
                  <input
                    className="input-field" style={{ paddingLeft: '2.5rem' }}
                    placeholder="Your full name"
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Username / Login ID *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: '0.875rem', fontFamily: 'monospace' }}>@</span>
                  <input
                    className="input-field" style={{ paddingLeft: '2rem' }}
                    placeholder="e.g. john123"
                    value={form.username}
                    onChange={e => handleChange('username', e.target.value.replace(/\s/g, '').toLowerCase())}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password + Confirm */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#6b7280' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="input-field" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={e => handleChange('password', e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
                    {showPass ? <EyeOff style={{ width: '1rem', height: '1rem' }} /> : <Eye style={{ width: '1rem', height: '1rem' }} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="form-label">Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#6b7280' }} />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className="input-field" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={e => handleChange('confirmPassword', e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
                    {showConfirm ? <EyeOff style={{ width: '1rem', height: '1rem' }} /> : <Eye style={{ width: '1rem', height: '1rem' }} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Phone + Age */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#6b7280' }} />
                  <input
                    className="input-field" style={{ paddingLeft: '2.5rem' }}
                    placeholder="10-digit mobile no."
                    maxLength={10}
                    value={form.phone}
                    onChange={e => handleChange('phone', e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Age</label>
                <input
                  type="number" className="input-field"
                  placeholder="Your age" min={15} max={60}
                  value={form.age}
                  onChange={e => handleChange('age', e.target.value)}
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="form-label">Emergency Contact Number</label>
              <input
                className="input-field"
                placeholder="Parent / Guardian phone"
                value={form.emergencyContact}
                onChange={e => handleChange('emergencyContact', e.target.value)}
              />
            </div>

            {/* Address */}
            <div>
              <label className="form-label">Permanent Address</label>
              <div style={{ position: 'relative' }}>
                <MapPin style={{ position: 'absolute', left: '0.75rem', top: '0.875rem', width: '1rem', height: '1rem', color: '#6b7280' }} />
                <textarea
                  className="input-field" style={{ paddingLeft: '2.5rem', minHeight: '80px', resize: 'vertical' }}
                  placeholder="Your home address"
                  value={form.address}
                  onChange={e => handleChange('address', e.target.value)}
                />
              </div>
            </div>

            {/* Info box */}
            <div style={{
              background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.20)',
              borderRadius: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.8rem',
              color: '#d97706', display: 'flex', gap: '0.5rem', alignItems: 'flex-start'
            }}>
              <AlertCircle style={{ width: '1rem', height: '1rem', flexShrink: 0, marginTop: '0.1rem' }} />
              <span>Your account will be <strong>PENDING</strong> until the admin verifies it and assigns you a room. You cannot login until approved.</span>
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span className="spinner" style={{ width: '1rem', height: '1rem' }} />
                  Registering...
                </span>
              ) : 'Register Account'}
            </button>
          </form>

          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              color: '#9ca3af', fontSize: '0.875rem', textDecoration: 'none'
            }}>
              <ArrowLeft style={{ width: '0.875rem', height: '0.875rem' }} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
