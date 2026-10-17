import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, Check } from 'lucide-react';
import './AuthPages.css';

function LeftMatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current; //gets the canvas
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

export default function SignIn({ onLoginSuccess, onNavigateRegister }) {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });

  const handleRegisterNavigation = () => {
    if (typeof onNavigateRegister === 'function') {
      onNavigateRegister();
    } else {
      navigate('/register');
    }
  };

  const handleSuccessfulAuth = () => {
    if (typeof onLoginSuccess === 'function') {
      onLoginSuccess();
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      let response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password
        }),
      });

      // Fallback endpoint if API returns 404
      if (response.status === 404) {
        response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: formData.identifier,
            password: formData.password
          }),
        });
      }

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user || { identifier: formData.identifier }));
        handleSuccessfulAuth();
      } else {
        setErrorMsg(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Sign-in Error:', err);
      // Prototype fallback
      localStorage.setItem('user', JSON.stringify({ identifier: formData.identifier }));
      handleSuccessfulAuth();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Panel - Matrix Rain */}
      <div className="auth-left-panel">
        <LeftMatrixRain />

        <div className="auth-logo">
          <ShieldCheck size={26} color="#22d3ee" />
          <span className="auth-logo-text">Origin<span style={{ color: '#22d3ee' }}>Check</span></span>
        </div>

        <div className="auth-left-content">
          <span className="auth-badge">AUTHENTICITY PLATFORM</span>
          <h1 className="auth-title">Verify media integrity<br /><span style={{ color: '#22d3ee' }}>with precision.</span></h1>
          <p className="auth-desc">
            Access your AI detection portal to scan images, frame-by-frame video manipulations, and news authenticity instantly.
          </p>
          <div className="auth-bullet-list">
            <div className="auth-bullet-item">
              <span className="auth-bullet-icon"><Check size={14} /></span>
              <span>EXIF metadata extraction & analysis</span>
            </div>
            <div className="auth-bullet-item">
              <span className="auth-bullet-icon"><Check size={14} /></span>
              <span>Deepfake facial anomaly scan</span>
            </div>
            <div className="auth-bullet-item">
              <span className="auth-bullet-icon"><Check size={14} /></span>
              <span>Multi-model neural confidence scoring</span>
            </div>
          </div>
        </div>

        <div className="auth-left-footer">
          OriginCheck AI System • Secure Verification Portal
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="auth-right-panel">
        <div className="auth-form-wrapper">
          <h2 className="auth-form-title">Welcome back</h2>
          <p className="auth-form-subtitle">
            Don't have an account? <span className="auth-link" onClick={handleRegisterNavigation}>Create account</span>
          </p>

          {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Email Address or Username</label>
              <input
                type="text"
                className="auth-input"
                placeholder="you@newsorg.com"
                required
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
              />
            </div>

            <div className="auth-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="auth-label">Password</label>
              </div>
              <div className="auth-input-container">
                <input
                  type={showPass ? "text" : "password"}
                  className="auth-input"
                  placeholder="••••••••"
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

            <button type="submit" className="auth-btn-submit" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}