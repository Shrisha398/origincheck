import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Eye, EyeOff, Check, ChevronDown } from 'lucide-react';
import './AuthPages.css';

function LeftMatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const words = ["AI", "VERIFY", "NEWS", "MEDIA", "SCAN", "IMAGE", "VIDEO", "HASH", "REAL", "0101", "1010"];
    const colors = ["#083344", "#0e7490", "#06b6d4", "#22d3ee", "#67e8f9"];
    const fontSize = 16;
    let columns = 0;
    let drops = [];

    const resize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * (canvas.height / fontSize));
    };

    resize();
    window.addEventListener('resize', resize);

    let lastTime = 0;
    const interval = 45;

    const draw = (currentTime) => {
      animationId = requestAnimationFrame(draw);
      if (currentTime - lastTime < interval) return;
      lastTime = currentTime;

      ctx.fillStyle = "rgba(4, 13, 26, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px Consolas, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = words[Math.floor(Math.random() * words.length)];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    animationId = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="auth-matrix-canvas" />;
}

export default function Register({ onNavigateLogin, onNavigateHome }) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Custom Dropdown Open/Close State
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Roles available for registration
  const roleOptions = [
    "Journalist",
    "Fact-Checker",
    "News Agency",
    "Researcher",
    "Media Organization",
    "Other"
  ];

  // Full Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organization: '',
    role: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsRoleOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectRole = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    setIsRoleOpen(false);
    setErrorMsg('');
  };

  // Submit Handler -> Navigates directly to SignIn view on success
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.role) {
      setErrorMsg('Please select a role.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          organization: formData.organization,
          role: formData.role,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to SignIn view
        if (typeof onNavigateLogin === 'function') {
          onNavigateLogin();
        }
      } else {
        setErrorMsg(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration Error:', err);
      // Fallback redirect for local testing/prototyping
      if (typeof onNavigateLogin === 'function') {
        onNavigateLogin();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Panel - Matrix Rain */}
      <div className="auth-left-panel">
        <LeftMatrixRain />

        <div className="auth-logo" onClick={onNavigateHome} style={{ cursor: 'pointer' }}>
          <ShieldCheck size={26} color="#22d3ee" />
          <span className="auth-logo-text">Origin<span style={{ color: '#22d3ee' }}>Check</span></span>
        </div>

        <div className="auth-left-content">
          <span className="auth-badge">JOIN THE VERIFICATION NETWORK</span>
          <h1 className="auth-title">Stop fake news<br /><span style={{ color: '#22d3ee' }}>before it spreads.</span></h1>
          <p className="auth-desc">
            Join hundreds of media professionals using OriginCheck to verify images, videos, and news articles before they reach the public.
          </p>
          <div className="auth-bullet-list">
            <div className="auth-bullet-item">
              <span className="auth-bullet-icon"><Check size={14} /></span>
              <span>Free for journalists & fact-checkers</span>
            </div>
            <div className="auth-bullet-item">
              <span className="auth-bullet-icon"><Check size={14} /></span>
              <span>Unlimited media uploads</span>
            </div>
            <div className="auth-bullet-item">
              <span className="auth-bullet-icon"><Check size={14} /></span>
              <span>Downloadable PDF verification reports</span>
            </div>
            <div className="auth-bullet-item">
              <span className="auth-bullet-icon"><Check size={14} /></span>
              <span>Secure encrypted file storage</span>
            </div>
          </div>
        </div>

        <div className="auth-left-footer">
          Backed by AI research from leading media institutions.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="auth-right-panel">
        <div className="auth-form-wrapper">
          <h2 className="auth-form-title">Create your account</h2>
          <p className="auth-form-subtitle">
            Already have an account? <span className="auth-link" onClick={onNavigateLogin}>Sign in</span>
          </p>

          {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <input
                type="text"
                className="auth-input"
                placeholder="First and last name"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <input
                type="email"
                className="auth-input"
                placeholder="you@newsorg.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Organization</label>
              <input
                type="text"
                className="auth-input"
                placeholder="Your organisation name"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              />
            </div>

            {/* Custom Dropdown */}
            <div className="auth-field" ref={dropdownRef}>
              <label className="auth-label">Role</label>
              <div className="custom-dropdown-container">
                <button
                  type="button"
                  className={`custom-dropdown-trigger ${isRoleOpen ? 'open' : ''}`}
                  onClick={() => setIsRoleOpen(!isRoleOpen)}
                >
                  <span className={formData.role ? 'selected-text' : 'placeholder-text'}>
                    {formData.role || 'Select role'}
                  </span>
                  <ChevronDown size={16} className={`dropdown-arrow ${isRoleOpen ? 'rotated' : ''}`} />
                </button>

                {isRoleOpen && (
                  <div className="custom-dropdown-menu">
                    <div className="custom-dropdown-item placeholder-item">
                      Select role
                    </div>
                    {roleOptions.map((role, idx) => (
                      <div
                        key={idx}
                        className={`custom-dropdown-item ${formData.role === role ? 'selected' : ''}`}
                        onClick={() => handleSelectRole(role)}
                      >
                        {role}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-container">
                <input
                  type={showPass ? "text" : "password"}
                  className="auth-input"
                  placeholder="Min. 8 characters"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Confirm Password</label>
              <div className="auth-input-container">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  className="auth-input"
                  placeholder="Re-enter password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                >
                  {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-checkbox-row">
              <input
                type="checkbox"
                id="terms"
                required
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
              />
              <label htmlFor="terms">
                I agree to OriginCheck's <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
              </label>
            </div>

            <button type="submit" className="auth-btn-submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}