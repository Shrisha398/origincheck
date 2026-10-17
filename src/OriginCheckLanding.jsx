import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Zap, 
  Download, 
  Lock, 
  Check, 
  ChevronDown, 
  ArrowRight,
  Activity
} from 'lucide-react';
import './OriginCheckLanding.css';

function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const words = [
      "AI", "VERIFY", "NEWS", "MEDIA", "SCAN", "IMAGE",
      "VIDEO", "AUDIO", "HASH", "REAL", "FAKE", "CNN",
      "ML", "OCR", "AUTH", "TRUE", "BLOCK", "CHAIN",
      "0101", "1010", "1100", "0011"
    ];

    const colors = [
      "#083344",
      "#0e7490",
      "#06b6d4",
      "#22d3ee",
      "#67e8f9",
      "#a5f3fc"
    ];

    const fontSize = 18; //text size
    let columns = 0;
    let drops = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize); //calculates how many columns can fit across the screen
      drops = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * (canvas.height / fontSize); //randomly chooses the words to display from the words array
      }
    };

    resize();
    window.addEventListener('resize', resize);

    let lastTime = 0;
    const interval = 45;

    const draw = (currentTime) => {
      animationFrameId = requestAnimationFrame(draw);
      if (currentTime - lastTime < interval) return;
      lastTime = currentTime;

      ctx.fillStyle = "rgba(3, 7, 18, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px Consolas, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = words[Math.floor(Math.random() * words.length)];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize); //write this text on the canvas at this position

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="ocl-matrix-canvas" />;
}

export default function OriginCheckLanding({ onNavigateRegister, onNavigateLogin }) {
  const [openFaq, setOpenFaq] = useState(null); //This remembers which FAQ question is currently open
  
  // Safe hook declaration outside of conditionals
  const reactRouterNavigate = useNavigate();

  const handleRegisterRedirect = () => { //handles redirection to register page
    if (onNavigateRegister) {
      onNavigateRegister();
    } else if (reactRouterNavigate) {
      reactRouterNavigate('/register');
    } else {
      window.location.href = '/register';
    }
  };

  const handleSignInRedirect = () => { // handles for sign in page
    if (onNavigateLogin) {
      onNavigateLogin();
    } else if (reactRouterNavigate) {
      reactRouterNavigate('/signin');
    } else {
      window.location.href = '/signin';
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index); 
  };

  const capabilities = [
    {
      icon: <ImageIcon className="ocl-cyan-text" size={24} />,
      title: "Image Forgery Detection",
      description: "Error Level Analysis (ELA) and metadata inspection reveal manipulated or AI-generated images with pixel-level precision."
    },
    {
      icon: <Video className="ocl-cyan-text" size={24} />,
      title: "Deepfake Video Analysis",
      description: "Frame-by-frame neural network scanning detects deepfakes, face swaps, and synthetic video generation artifacts."
    },
    {
      icon: <FileText className="ocl-cyan-text" size={24} />,
      title: "News Article Verification",
      description: "AI language models cross-reference articles against trusted sources to flag misleading, fabricated, or AI-written content."
    },
    {
      icon: <Zap className="ocl-cyan-text" size={24} />,
      title: "Instant AI Confidence Score",
      description: "Every analysis returns a clear percentage confidence score so journalists can make fast, informed publishing decisions."
    },
    {
      icon: <Download className="ocl-cyan-text" size={24} />,
      title: "Downloadable PDF Reports",
      description: "Generate detailed verification reports with evidence, metadata, and findings — ready to attach to any editorial workflow."
    },
    {
      icon: <Lock className="ocl-cyan-text" size={24} />,
      title: "Secure & Private",
      description: "All uploaded media is encrypted in transit and at rest. Files are never shared with third parties or used for training."
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Upload Your Media",
      description: "Drag and drop an image, video, or paste a news article URL. Supports JPG, PNG, MP4, AVI, MOV, and text."
    },
    {
      step: "02",
      title: "AI Forensic Analysis",
      description: "Our AI runs metadata extraction, Error Level Analysis, deep neural scanning, and source cross-referencing simultaneously."
    },
    {
      step: "03",
      title: "Review the Verdict",
      description: "Get a clear Authentic or AI-Generated verdict with a confidence score, detailed breakdown, and downloadable report."
    }
  ];

  const faqs = [
    {
      q: "Who is OriginCheck built for?",
      a: "OriginCheck is specifically tailored for journalists, fact-checking organizations, newsrooms, and digital forensics investigators needing reliable media verification."
    },
    {
      q: "What file types are supported?",
      a: "We support common image formats (JPG, PNG, WEBP), video formats (MP4, AVI, MOV), text files, and direct article URLs."
    },
    {
      q: "How accurate is the detection?",
      a: "Our multi-layered AI models achieve over 80%-85% accuracy across standard benchmarks, constantly updated to catch new deepfake and generative AI models."
    },
    {
      q: "Is my uploaded content kept private?",
      a: "Yes. All uploads are end-to-end encrypted, processed in secure sandboxes, and automatically deleted. We never store or train models on user uploads."
    },
    {
      q: "Can I download the verification report?",
      a: "Yes! Every completed scan offers a full PDF audit report containing metadata logs, frame analysis, and shareable verification badges."
    }
  ];

  return (
    <div className="ocl-container">
      {/* Background Matrix Rain */}
      <MatrixRain />

      {/* Navigation */}
      <nav className="ocl-nav">
        <div className="ocl-logo-container">
          <div className="ocl-logo-icon">
            <ShieldCheck className="ocl-cyan-text" size={24} />
          </div>
          <span className="ocl-logo-text">
            Origin<span className="ocl-cyan-text">Check</span>
          </span>
        </div>

        <div className="ocl-nav-links">
          <a href="#features">Features</a> 
          <a href="#how-it-works">How It Works</a>
          <a href="#faq">FAQ</a>
        </div>

        <div className="ocl-nav-actions">
          <button className="ocl-btn-secondary" onClick={handleSignInRedirect} type="button">
            Sign In
          </button>
          <button className="ocl-btn-primary" onClick={handleRegisterRedirect} type="button">
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="ocl-hero">
        <div className="ocl-badge">
          <span className="ocl-pulse-dot" />
          <span>AI MEDIA VERIFICATION SYSTEM</span>
        </div>

        <h1 className="ocl-hero-title">
          Stop fake news <br />
          <span className="ocl-cyan-text">before it spreads.</span>
        </h1>

        <p className="ocl-hero-desc">
          OriginCheck uses advanced AI and digital forensics to verify the authenticity of images, videos, and news articles — in seconds. Built for journalists, fact-checkers, and media organizations.
        </p>

        <div className="ocl-hero-buttons">
          <button className="ocl-btn-primary" onClick={handleRegisterRedirect} type="button">
            <span>Start Verifying for Free</span>
            <ArrowRight size={16} />
          </button>
          <button className="ocl-btn-secondary" onClick={handleSignInRedirect} type="button">
            Sign In to Dashboard
          </button>
        </div>

        <div className="ocl-hero-features">
          <div className="ocl-feature-item">
            <Check className="ocl-cyan-text" size={16} />
            <span>No credit card required</span>
          </div>
          <div className="ocl-feature-item">
            <Check className="ocl-cyan-text" size={16} />
            <span>Free for journalists</span>
          </div>
          <div className="ocl-feature-item">
            <Check className="ocl-cyan-text" size={16} />
            <span>Secure encrypted uploads</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="ocl-section">
        <div className="ocl-section-header">
          <span className="ocl-badge">CAPABILITIES</span>
          <h2 className="ocl-section-title">
            Everything you need to verify <br />
            <span className="ocl-cyan-text">digital media with confidence.</span>
          </h2>
        </div>

        <div className="ocl-grid-3">
          {capabilities.map((item, idx) => (
            <div key={idx} className="ocl-card">
              <div className="ocl-card-icon">{item.icon}</div>
              <h3 className="ocl-card-title">{item.title}</h3>
              <p className="ocl-card-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="ocl-section">
        <div className="ocl-section-header">
          <span className="ocl-badge">HOW IT WORKS</span>
          <h2 className="ocl-section-title">Three steps to the truth.</h2>
        </div>

        <div className="ocl-grid-3">
          {steps.map((step, idx) => (
            <div key={idx} className="ocl-step-card">
              <div className="ocl-step-number">{step.step}</div>
              <h3 className="ocl-card-title">{step.title}</h3>
              <p className="ocl-card-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="ocl-section">
        <div className="ocl-section-header">
          <span className="ocl-badge">FAQ</span>
          <h2 className="ocl-section-title">Common questions.</h2>
        </div>

        <div className="ocl-faq-container">
          {faqs.map((faq, idx) => (
            <div key={idx} className="ocl-faq-item">
              <button onClick={() => toggleFaq(idx)} className="ocl-faq-question" type="button">
                <span>{faq.q}</span>
                <ChevronDown className={`ocl-cyan-text ocl-faq-icon ${openFaq === idx ? 'rotated' : ''}`} size={20} />
              </button>
              {openFaq === idx && (
                <div className="ocl-faq-answer">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="ocl-section">
        <div className="ocl-cta-box">
          <h2 className="ocl-cta-title">Ready to verify the truth?</h2>
          <p className="ocl-cta-desc">
            Join journalists and fact-checkers already using OriginCheck to stop misinformation before it reaches the public.
          </p>
          <div className="ocl-hero-buttons" style={{ marginBottom: 0 }}>
            <button className="ocl-btn-primary" onClick={handleRegisterRedirect} type="button">
              <span>Create Free Account</span>
              <ArrowRight size={16} />
            </button>
            <button className="ocl-btn-secondary" onClick={handleSignInRedirect} type="button">
              Already have an account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ocl-footer">
        <div className="ocl-footer-left">
          <ShieldCheck className="ocl-cyan-text" size={16} />
          <span>© 2026 OriginCheck — AI Media Verification System</span>
        </div>
        
      </footer>
    </div>
  );
}