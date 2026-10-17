import React, { useState, useEffect, useRef } from 'react';
import { Upload, Home, History, FileText, Settings, Bell, Search, LogOut, CheckCircle } from 'lucide-react';

const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01'.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array.from({ length: columns }).fill(1);
    
    const draw = () => {
      // Dark transparent background to create the fading trail effect
      ctx.fillStyle = 'rgba(10, 15, 25, 0.05)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Cyan matrix rain (matching the dashboard's accent color)
      ctx.fillStyle = '#0CA5E9'; 
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    
    const interval = setInterval(draw, 33);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none opacity-20 z-0"
    />
  );
};

export default function ResizerDashboard() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDownloadUrl(null); // Reset previous downloads
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send to Python Flask backend
      const response = await fetch('http://localhost:5000/api/resize', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Receive the resized image as a Blob
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setDownloadUrl(url);
      } else {
        alert("Error resizing image.");
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert("Failed to connect to backend. Is Python running?");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-gray-300 font-sans flex relative overflow-hidden">
      <MatrixRain />
      
      {/* Sidebar - z-10 keeps it above matrix rain */}
      <aside className="w-64 bg-[#0a101d] border-r border-gray-800 flex flex-col z-10">
        <div className="p-6 flex items-center gap-3 border-b border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-[#112236] border border-cyan-800 flex items-center justify-center">
             <span className="text-cyan-400 font-bold">O</span>
          </div>
          <h1 className="text-xl font-bold text-white">Origin<span className="text-cyan-400">Check</span></h1>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#111a2a] transition">
            <Home size={18} /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#0c1f30] text-cyan-400 border border-cyan-900 transition">
            <Upload size={18} /> Upload & Resize
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#111a2a] transition">
            <History size={18} /> Verification History
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#111a2a] transition">
            <FileText size={18} /> Reports
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#111a2a] transition">
            <Settings size={18} /> Settings
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white text-xs font-bold">
              RK
            </div>
            <div>
              <p className="text-sm text-white font-medium">Riddhi Koli</p>
              <p className="text-xs text-gray-500">Journalist</p>
            </div>
            <LogOut size={16} className="ml-auto text-gray-500 cursor-pointer hover:text-white" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col z-10">
        {/* Top Nav */}
        <header className="h-16 border-b border-gray-800 px-8 flex items-center justify-between bg-[#0a101d]/80 backdrop-blur-sm">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search verifications, file names..." 
              className="w-full bg-[#111a2a] border border-gray-700 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-700 text-white"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full bg-[#111a2a] flex items-center justify-center text-gray-400 border border-gray-700">
              <Bell size={16} />
            </button>
            <div className="flex items-center gap-2 bg-[#111a2a] rounded-full pl-1 pr-3 py-1 border border-gray-700">
              <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-white text-xs font-bold">RK</div>
              <span className="text-sm text-white font-medium">Riddhi Koli</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 max-w-5xl">
          <h2 className="text-2xl font-bold text-white mb-2">Upload & Resize to 224x224</h2>
          <p className="text-gray-400 text-sm mb-8">Upload images for AI analysis and automatic strict resizing.</p>

          {/* Upload Box */}
          <div className="border-2 border-dashed border-gray-700 rounded-xl bg-[#0d1424] p-12 flex flex-col items-center justify-center hover:border-cyan-800 transition-colors relative overflow-hidden">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            
            <div className="w-14 h-14 rounded-xl bg-[#112236] border border-cyan-900 flex items-center justify-center mb-4 z-10">
              <Upload className="text-cyan-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 z-10">
              {file ? file.name : "Drop media file here or click to browse"}
            </h3>
            <p className="text-gray-500 text-sm mb-6 z-10">Supports JPG, PNG, WEBP, BMP</p>
            
            {file && !downloadUrl && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                disabled={isUploading}
                className="z-30 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-md font-medium transition"
              >
                {isUploading ? "Processing..." : "Process Image"}
              </button>
            )}

            {downloadUrl && (
              <div className="z-30 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle size={18} />
                  <span>Success! Image optimized to 224x224.</span>
                </div>
                <a 
                  href={downloadUrl} 
                  download={`224x224_${file.name}`}
                  className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-md font-medium transition"
                >
                  Download Image
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}