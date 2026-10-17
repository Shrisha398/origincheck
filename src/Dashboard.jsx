import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import UserDashboard from './UserDashboard';
import UploadAndVerify from './UploadAndVerify';
import VerificationHistory from './VerificationHistory';
import { 
  ShieldCheck, 
  Menu, 
  LayoutDashboard, 
  Upload, 
  History, 
  FileBarChart, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  HelpCircle,
  CheckCircle,
  Crop 
} from 'lucide-react';

// --- PURE REACT RESIZER COMPONENT (NO BACKEND NEEDED) ---
const ImageResizer = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDownloadUrl(null); 
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);

    const reader = new FileReader();
    
    // Read the file into memory in the browser
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        // Create an invisible canvas exactly 224x224
        const canvas = document.createElement('canvas');
        canvas.width = 224;
        canvas.height = 224;
        const ctx = canvas.getContext('2d');

        // Draw and squash/stretch the image onto the 224x224 canvas
        ctx.drawImage(img, 0, 0, 224, 224);

        // Convert the canvas drawing back into a downloadable JPEG file
        canvas.toBlob((blob) => {
          const url = window.URL.createObjectURL(blob);
          setDownloadUrl(url);
          setIsUploading(false);
        }, 'image/jpeg', 0.85); // 0.85 represents 85% quality compression
      };
      
      img.src = event.target.result;
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
        Resize Image (224x224)
      </h2>
      <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
        Instant client-side resizing. No server required.
      </p>

      <div style={{
        border: '2px dashed #374151',
        borderRadius: '0.75rem',
        backgroundColor: 'rgba(13, 20, 36, 0.7)',
        padding: '4rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'border-color 0.3s'
      }}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 20 }}
        />
        
        <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.75rem', backgroundColor: '#112236', border: '1px solid #164e63', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', zIndex: 10 }}>
          <Crop color="#22d3ee" size={24} />
        </div>
        
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem', zIndex: 10 }}>
          {file ? file.name : "Drop media file here or click to browse"}
        </h3>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem', zIndex: 10 }}>
          Supports JPG, PNG, WEBP, BMP
        </p>
        
        {file && !downloadUrl && (
          <button 
            onClick={(e) => { e.stopPropagation(); handleUpload(); }}
            disabled={isUploading}
            style={{ 
              zIndex: 30, 
              backgroundColor: '#0891b2', 
              color: 'white', 
              padding: '0.5rem 1.5rem', 
              borderRadius: '0.375rem', 
              fontWeight: '500',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              border: 'none'
            }}
          >
            {isUploading ? "Processing..." : "Process Image"}
          </button>
        )}

        {downloadUrl && (
          <div style={{ zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80' }}>
              <CheckCircle size={18} />
              <span>Success! Image optimized to 224x224.</span>
            </div>
            <a 
              href={downloadUrl} 
              download={`224x224_${file.name.split('.')[0]}.jpg`}
              style={{ backgroundColor: '#16a34a', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '0.375rem', fontWeight: '500', textDecoration: 'none' }}
            >
              Download Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD COMPONENT ---
export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState({ name: '', role: '' });
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const canvasRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return '';
    const cleanName = name.replace(/\s+/g, '');
    return cleanName.slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingUser(true);
        const token = localStorage.getItem('token');

        if (!token) return;

        const response = await fetch('http://localhost:5000/api/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch user profile');

        const data = await response.json();
        setUser({ name: data.fullName, role: data.role });

      } catch (error) {
        console.error('Failed to load user profile:', error);
        setUser({ name: 'User', role: 'Member' });
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const words = [
      "AI", "VERIFY", "NEWS", "MEDIA", "SCAN", "IMAGE", 
      "VIDEO", "AUDIO", "HASH", "REAL", "FAKE", "CNN", 
      "ML", "OCR", "AUTH", "TRUE", "BLOCK", "CHAIN", 
      "0101", "1010", "1100", "0011"
    ];

    const colors = [
      "#4E7FD6", "#5D92E6", "#70A6F5", "#84B6FF", 
      "#9CC7FF", "#B8D9FF", "#D4EAFF"
    ];

    const fontSize = 18;
    let columns = 0;
    let drops = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * (canvas.height / fontSize);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.fillStyle = "rgba(3, 10, 22, 0.08)";
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

    const intervalId = setInterval(draw, 45);

    return () => {
      window.removeEventListener('resize', resize);
      clearInterval(intervalId);
    };
  }, []);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Upload & Verify', icon: Upload },
    { label: 'Verification History', icon: History },
    { label: 'Reports', icon: FileBarChart },
    { label: 'Resize Image', icon: Crop },
    { label: 'Settings', icon: Settings },
  ];

  return (
    <div className="dashboard-container">
      <canvas ref={canvasRef} className="matrix-canvas" />

      <div className="dashboard-content-layer">
        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="logo">
              <ShieldCheck className="logo-icon" />
              <span className="logo-text">OriginCheck</span>
            </div>
            <button className="menu-toggle" type="button">
              <Menu className="icon" />
            </button>
          </div>

          <nav className="nav-menu">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveTab(item.label)}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="icon" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="avatar">
                {isLoadingUser ? '...' : getInitials(user.name)}
              </div>
              <div className="user-info">
                <span className="user-name">
                  {isLoadingUser ? 'Loading...' : user.name}
                </span>
                <span className="user-role">
                  {isLoadingUser ? '' : user.role}
                </span>
              </div>
              <LogOut 
                className="logout-icon" 
                onClick={() => navigate('/OriginCheckLanding')} 
                style={{ cursor: 'pointer' }} 
              />
            </div>
          </div>
        </aside>

        <div className="main-wrapper">
          <header className="top-header">
            <div className="search-bar">
              <Search className="search-icon" />
              <input type="text" placeholder="Search verifications, file names..." />
            </div>

            <div className="header-actions">
              <button className="icon-btn" type="button">
                <Bell className="icon" />
                <span className="badge"></span>
              </button>
              <div className="header-user">
                <div className="avatar small">
                  {isLoadingUser ? '...' : getInitials(user.name)}
                </div>
                <span>{isLoadingUser ? 'Loading...' : user.name}</span>
              </div>
            </div>
          </header>

          <main className="content-area">
            {activeTab === 'Dashboard' ? (
              <UserDashboard onVerifyClick={() => setActiveTab('Upload & Verify')} />
            ) : activeTab === 'Upload & Verify' ? (
              <UploadAndVerify />
            ) : activeTab === 'Verification History' ? (
              <VerificationHistory />
            ) : activeTab === 'Resize Image' ? (
              <ImageResizer />
            ) : (
              <div className="page-header">
                <h1>{activeTab}</h1>
                <p>Content for {activeTab} section.</p>
              </div>
            )}
          </main>

          <button className="help-btn" aria-label="Help" type="button">
            <HelpCircle className="help-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}