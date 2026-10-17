import React, { useEffect, useState } from 'react';
import { 
  FileImage, 
  Video, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  Download 
} from 'lucide-react';

export default function VerificationHistory() {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/verifications')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch verification history');
        return res.json();
      })
      .then((data) => {
        setVerifications(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getMediaIcon = (type) => {
    if (type === 'Video') return <Video className="w-4 h-4 text-[#7f97b4]" />;
    if (type === 'Article') return <FileText className="w-4 h-4 text-[#7f97b4]" />;
    return <FileImage className="w-4 h-4 text-[#7f97b4]" />;
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Verification History</h1>
        <p className="text-xs text-[#7f97b4]">All past verifications sorted by date</p>
      </div>

      <div className="bg-[#051124] border border-[#12335c] rounded-xl p-6 shadow-2xl">
        <h2 className="text-sm font-semibold mb-6">All Verifications</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="text-[#59789e] border-b border-[#102b4d]">
                <th className="py-3 px-3 font-semibold">ID</th>
                <th className="py-3 px-3 font-semibold">File Name</th>
                <th className="py-3 px-3 font-semibold">Type</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold">Confidence</th>
                <th className="py-3 px-3 font-semibold">Reported By</th>
                <th className="py-3 px-3 font-semibold">Date</th>
                <th className="py-3 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0c223d]">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-[#7f97b4]">
                    Loading records from database...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-red-400">
                    {error}
                  </td>
                </tr>
              ) : verifications.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-[#7f97b4]">
                    No verifications found in database.
                  </td>
                </tr>
              ) : (
                verifications.map((item) => (
                  <tr key={item.id} className="hover:bg-[#091b33] transition-colors">
                    {/* ID */}
                    <td className="py-3.5 px-3 font-mono text-[#00bcd4] font-medium">
                      {item.id}
                    </td>

                    {/* File Name */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2 max-w-[200px] truncate">
                        {getMediaIcon(item.media_type)}
                        <span className="truncate" title={item.file_name}>{item.file_name}</span>
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td className="py-3.5 px-3">
                      <span className="bg-[#0b2749] text-[#4ea8de] px-2 py-0.5 rounded text-[11px] font-medium">
                        {item.media_type}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3">
                      {item.status === 'Authentic' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#113326] text-[#4ade80] border border-[#19533c]">
                          <CheckCircle2 className="w-3 h-3" /> Authentic
                        </span>
                      )}
                      {item.status === 'AI-Generated' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#36151c] text-[#f87171] border border-[#59222c]">
                          <AlertTriangle className="w-3 h-3" /> AI-Generated
                        </span>
                      )}
                      {item.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#362711] text-[#fbbf24] border border-[#573f1a]">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                      {item.status === 'Processing' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#0d2a45] text-[#38bdf8] border border-[#154673]">
                          <RefreshCw className="w-3 h-3 animate-spin" /> Processing
                        </span>
                      )}
                    </td>

                    {/* Confidence Score */}
                    <td className="py-3.5 px-3 font-semibold">
                      {item.confidence_score !== null ? (
                        <span className={item.status === 'Authentic' ? 'text-[#4ade80]' : 'text-[#f87171]'}>
                          {item.confidence_score}%
                        </span>
                      ) : (
                        <span className="text-[#4f6a8a]">—</span>
                      )}
                    </td>

                    {/* Reported By */}
                    <td className="py-3.5 px-3 text-[#c2d5ec]">{item.reported_by}</td>

                    {/* Date */}
                    <td className="py-3.5 px-3 text-[#7f97b4]">{item.created_at}</td>

                    {/* Action Button */}
                    <td className="py-3.5 px-3 text-right">
                      {item.status !== 'Pending' && item.status !== 'Processing' && (
                        <button
                          className="inline-flex items-center gap-1 bg-[#0b2444] hover:bg-[#00bcd4] text-[#00bcd4] hover:text-[#030a16] border border-[#164273] px-2.5 py-1 rounded text-[11px] font-semibold transition-all"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}