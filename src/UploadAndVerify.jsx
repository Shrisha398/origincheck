import React, { useState, useRef } from 'react';
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
  UploadCloud, 
  HelpCircle,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  Download 
} from 'lucide-react';

export default function UploadAndVerify() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  
  const fileInputRef = useRef(null);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, active: false },
    { label: 'Upload & Verify', icon: Upload, active: true },
    { label: 'Verification History', icon: History, active: false },
    { label: 'Reports', icon: FileBarChart, active: false },
    { label: 'Settings', icon: Settings, active: false },
  ];

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setReport(null);
      setError(null);
      uploadAndPredict(selectedFile);
    }
  };

  const uploadAndPredict = async (fileToUpload) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', fileToUpload);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Prediction failed');
      }
      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to the Flask server.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPdfReport = async () => {
    if (!report) return;
    setIsPdfGenerating(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });

      if (!response.ok) throw new Error('Failed to generate PDF report from server.');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Verification_Report_${report.filename || 'Analysis'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.message || 'Error generating PDF report.');
    } finally {
      setIsPdfGenerating(false);
    }
  };

  return (
    // Transparent backgrounds (bg-opacity) are used here so your matrix rain canvas can show through if rendered behind it.
    <div className="flex h-screen bg-[#030812]/90 text-white font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-[260px] bg-[#050e1d]/95 border-r border-[#1a2c47] p-5 flex flex-col justify-between shrink-0 backdrop-blur-md z-10">
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-[#00bcd4] font-bold text-lg">
              <ShieldCheck className="w-6 h-6" />
              <span>OriginCheck</span>
            </div>
            <button className="text-[#64748b] hover:text-white transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all w-full text-left ${
                    item.active
                      ? 'bg-[#0d2238] border border-[#00bcd4]/30 text-[#00bcd4]'
                      : 'text-[#94a3b8] hover:bg-[#0d2238]/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-[#1a2c47]">
          <div className="flex items-center gap-3 bg-[#0d2238]/60 p-3 rounded-xl border border-[#1a2c47]">
            <div className="w-9 h-9 rounded-full bg-[#00bcd4] text-[#030812] text-xs font-bold flex items-center justify-center shrink-0">
              RK
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-semibold truncate text-gray-200">Shrisha</span>
              <span className="text-[11px] text-[#64748b] truncate">Journalist</span>
            </div>
            <button className="text-[#64748b] hover:text-white transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col relative overflow-hidden z-10">
        
        {/* Top Header */}
        <header className="h-[72px] flex items-center justify-between px-8 border-b border-[#1a2c47] bg-[#050e1d]/80 backdrop-blur-md">
          <div className="flex items-center gap-2 bg-[#0d2238]/80 border border-[#1a2c47] px-4 py-2.5 rounded-lg w-[400px]">
            <Search className="w-4 h-4 text-[#64748b]" />
            <input
              type="text"
              placeholder="Search verifications, file names..."
              className="bg-transparent border-none outline-none text-sm text-white placeholder-[#64748b] w-full"
            />
          </div>

          <div className="flex items-center gap-5">
            <button className="relative p-2.5 bg-[#0d2238]/80 border border-[#1a2c47] rounded-full text-[#64748b] hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#ef4444] rounded-full border-2 border-[#050e1d]"></span>
            </button>
            <div className="flex items-center gap-2 bg-[#0d2238]/80 border border-[#1a2c47] pl-1.5 pr-4 py-1.5 rounded-full">
              <div className="w-7 h-7 rounded-full bg-[#00bcd4] text-[#030812] text-[10px] font-bold flex items-center justify-center">
                RK
              </div>
              <span className="font-medium text-sm text-gray-200">Shrisha</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto px-10 py-8">
          <div className="max-w-[950px]">
            
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-1.5 text-white">Upload & Verify</h1>
              <p className="text-sm text-[#94a3b8]">
                Upload images, videos, or news articles for AI analysis
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileSelect(e.target.files[0])}
              accept=".jpg,.jpeg,.png,.mp4,.avi,.mov"
              className="hidden"
            />

            {/* Drag & Drop Zone */}
            <div 
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-[#00bcd4] bg-[#071324]/60 backdrop-blur-sm hover:bg-[#071324]/80 rounded-xl p-14 flex flex-col items-center justify-center text-center mb-8 cursor-pointer transition-all duration-300"
            >
              {loading ? (
                <>
                  <Loader2 className="w-10 h-10 text-[#00bcd4] animate-spin mb-4" />
                  <h3 className="text-lg font-medium text-white mb-1">Processing Verification...</h3>
                  <p className="text-sm text-[#64748b]">Scanning file: {file?.name}</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 bg-[#0d2238] border border-[#1a2c47] rounded-xl flex items-center justify-center text-[#00bcd4] mb-5">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <h3 className="text-[17px] font-semibold text-white mb-2">
                    {file ? `Selected: ${file.name}` : 'Drop media file here or click to browse'}
                  </h3>
                  <p className="text-[13px] text-[#64748b] mb-1.5">
                    Supports JPG, JPEG, PNG, MP4, AVI, MOV, TXT, PDF
                  </p>
                  <p className="text-[12px] text-[#475569]">Max file size: 500MB</p>
                </>
              )}
            </div>

            {/* Analysis Methods Grid */}
            {!report && !error && !loading && (
              <div className="bg-[#071324]/80 backdrop-blur-sm border border-[#1a2c47] rounded-xl p-6 shadow-lg">
                <h2 className="text-[15px] font-semibold text-white mb-4">Supported Analysis Methods</h2>
                <div className="grid grid-cols-2 gap-4">
                  
                  <div className="bg-[#0f1d33] border border-[#1e3352] p-5 rounded-lg hover:border-[#00bcd4]/50 transition-colors">
                    <h4 className="text-[14px] font-semibold text-white mb-1.5">Metadata (EXIF) Analysis</h4>
                    <p className="text-[13px] text-[#64748b]">Extract hidden file metadata</p>
                  </div>
                  
                  <div className="bg-[#0f1d33] border border-[#1e3352] p-5 rounded-lg hover:border-[#00bcd4]/50 transition-colors">
                    <h4 className="text-[14px] font-semibold text-white mb-1.5">Error Level Analysis</h4>
                    <p className="text-[13px] text-[#64748b]">Detect image forgery patterns</p>
                  </div>
                  
                  <div className="bg-[#0f1d33] border border-[#1e3352] p-5 rounded-lg hover:border-[#00bcd4]/50 transition-colors">
                    <h4 className="text-[14px] font-semibold text-white mb-1.5">Video Frame Analysis</h4>
                    <p className="text-[13px] text-[#64748b]">Frame-by-frame deepfake scan</p>
                  </div>
                  
                  <div className="bg-[#0f1d33] border border-[#1e3352] p-5 rounded-lg hover:border-[#00bcd4]/50 transition-colors">
                    <h4 className="text-[14px] font-semibold text-white mb-1.5">AI Confidence Scoring</h4>
                    <p className="text-[13px] text-[#64748b]">Neural network authenticity score</p>
                  </div>

                </div>
              </div>
            )}
            
            {/* Report Result Container */}
            {report && (
              <div className="bg-[#071324]/80 backdrop-blur-sm border border-[#1a2c47] rounded-xl p-6 mb-8 shadow-lg">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#1a2c47]">
                  <div className="flex items-center gap-3">
                    {report.result.status === "PASS" ? (
                      <CheckCircle2 className="w-7 h-7 text-[#10b981]" />
                    ) : (
                      <AlertTriangle className="w-7 h-7 text-[#ef4444]" />
                    )}
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Verification Result: {report.result.label}
                      </h3>
                      <p className="text-[13px] text-[#64748b] flex items-center gap-2 mt-1">
                        <FileText className="w-3.5 h-3.5" />
                        {report.filename} • <span className="uppercase">{report.type}</span>
                      </p>
                    </div>
                  </div>

                  <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase ${
                    report.result.status === "PASS" 
                      ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30" 
                      : "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30"
                  }`}>
                    {report.result.status}
                  </span>
                </div>

                {/* Confidence Score Bar */}
                <div className="mb-6 bg-[#0f1d33] p-5 rounded-lg border border-[#1e3352]">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[#94a3b8] text-[13px] font-medium flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#00bcd4]" /> AI Model Confidence
                    </span>
                    <span className="text-white font-bold text-[15px]">
                      {report.result.confidence}%
                    </span>
                  </div>
                  <div className="w-full bg-[#050e1d] h-2.5 rounded-full overflow-hidden p-[2px] border border-[#1a2c47]">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        report.result.status === "PASS" ? "bg-[#00bcd4]" : "bg-[#ef4444]"
                      }`}
                      style={{ width: `${report.result.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={downloadPdfReport}
                    disabled={isPdfGenerating}
                    className="flex items-center gap-2 bg-[#00bcd4] hover:bg-[#00acc1] text-[#030812] font-semibold text-[13px] px-5 py-2.5 rounded-lg transition-all disabled:opacity-50"
                  >
                    {isPdfGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Download PDF Report</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error Container */}
            {error && (
              <div className="bg-[#3f1616]/40 backdrop-blur-sm border border-[#ef4444]/30 rounded-xl p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-[#ef4444] shrink-0" />
                <p className="text-[13px] text-red-200">{error}</p>
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
}