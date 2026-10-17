import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Upload 
} from 'lucide-react';
import './UserDashboard.css';

export default function UserDashboard({ onVerifyClick }) {
  const [stats, setStats] = useState({
    totalVerifications: 0,
    authenticMedia: 0,
    aiGenerated: 0,
    pendingReviews: 0,
    imagesVerified: 0,
    videosAnalyzed: 0,
    articlesChecked: 0,
    overallAccuracy: '0.0'
  });
  const [trends, setTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const canvasRef = useRef(null);

  // Matrix Rain Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const words = ["AI", "VERIFY", "SCAN", "IMAGE", "VIDEO", "REAL", "FAKE", "0101", "1010"];
    const colors = ["#4E7FD6", "#5D92E6", "#70A6F5", "#84B6FF", "#9CC7FF"];
    const fontSize = 16;
    let columns = 0;
    let drops = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(0).map(() => Math.random() * (canvas.height / fontSize));
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.fillStyle = "rgba(3, 10, 22, 0.1)";
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

  // Fetch metrics dynamically from backend API
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to load dashboard stats');

        const data = await response.json();
        setStats(data.summary);
        setTrends(data.trends);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Calculate percentage width for progress bars
  const maxCategoryCount = Math.max(
    stats.imagesVerified, 
    stats.videosAnalyzed, 
    stats.articlesChecked, 
    1
  );

  return (
    <div className="user-dashboard-wrapper">
      <canvas ref={canvasRef} className="matrix-canvas-bg" />

      <div className="dashboard-content">
        {/* Top Bar */}
        <div className="overview-header">
          <div>
            <h1>Overview</h1>
            <p className="subtitle">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} — Your media verification summary
            </p>
          </div>
          <button className="verify-btn" onClick={onVerifyClick} type="button">
            <Upload size={18} />
            <span>Verify New Media</span>
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon blue"><Shield size={20} /></div>
                <span className="badge positive" style={{ transform: 'translateX(-8px)' }}></span>
            </div>
              <h2>{isLoading ? '...' : stats.totalVerifications.toLocaleString()}</h2>
              <p>Total Verifications</p>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon green"><CheckCircle size={20} /></div>
                <span className="badge positive" style={{ transform: 'translateX(-8px)' }}></span>
            </div>
            <h2>{isLoading ? '...' : stats.authenticMedia.toLocaleString()}</h2>
            <p>Authentic Media</p>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon red"><AlertTriangle size={20} /></div>
                <span className="badge negative" style={{ transform: 'translateX(-8px)' }}></span>
            </div>
            <h2>{isLoading ? '...' : stats.aiGenerated.toLocaleString()}</h2>
            <p>AI-Generated Detected</p>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="analytics-grid">
          {/* Verification Trends */}
          <div className="analytics-card">
            <div className="card-header">
              <div>
                <h3>Verification Trends</h3>
                <p>Authentic vs. AI-generated — last 6 months</p>
              </div>
              <TrendingUp className="trend-icon" size={20} />
            </div>
            <div className="trend-bars-container">
              {trends.length > 0 ? trends.map((item, idx) => (
                <div key={idx} className="trend-bar-column">
                  <div className="bar-wrapper">
                    <div 
                      className="bar authentic" 
                      style={{ height: `${Math.min(item.authentic * 10, 100)}%` }} 
                      title={`Authentic: ${item.authentic}`}
                    />
                    <div 
                      className="bar ai" 
                      style={{ height: `${Math.min(item.aiGenerated * 10, 100)}%` }} 
                      title={`AI-Generated: ${item.aiGenerated}`}
                    />
                  </div>
                  <span className="month-label">{item.month}</span>
                </div>
              )) : (
                <div className="no-data-placeholder">
                  <p>No verification history recorded yet. Upload a file to populate trends.</p>
                </div>
              )}
            </div>
            <div className="legend">
              <span className="legend-item"><span className="dot green" /> Authentic</span>
              <span className="legend-item"><span className="dot red" /> AI-Generated</span>
            </div>
          </div>

          {/* Detection Breakdown */}
          <div className="analytics-card breakdown-card">
            <h3>Detection Breakdown</h3>

            <div className="breakdown-list">
              <div className="breakdown-item">
                <div className="breakdown-info">
                  <span>Images Verified</span>
                  <span className="count">{stats.imagesVerified.toLocaleString()}</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill cyan" 
                    style={{ width: `${(stats.imagesVerified / maxCategoryCount) * 100}%` }} 
                  />
                </div>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-info">
                  <span>Videos Analyzed</span>
                  <span className="count">{stats.videosAnalyzed.toLocaleString()}</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill purple" 
                    style={{ width: `${(stats.videosAnalyzed / maxCategoryCount) * 100}%` }} 
                  />
                </div>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-info">
                  <span>Articles Checked</span>
                  <span className="count">{stats.articlesChecked.toLocaleString()}</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill orange" 
                    style={{ width: `${(stats.articlesChecked / maxCategoryCount) * 100}%` }} 
                  />
                </div>
              </div>
            </div>

            <div className="accuracy-box">
              <span className="accuracy-title">Overall Accuracy</span>
              <span className="accuracy-score">{stats.overallAccuracy}%</span>
              <span className="accuracy-subtitle">Across all media types</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}