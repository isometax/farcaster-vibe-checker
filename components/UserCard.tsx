
import React, { useState } from 'react';
import { FarcasterUser, AnalysisResult } from '../types';
import { analyzeUserVibe } from '../services/geminiService';

interface UserCardProps {
  user: FarcasterUser;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVibeCheck = async () => {
    setLoading(true);
    const result = await analyzeUserVibe(user);
    setAnalysis(result);
    setLoading(false);
  };

  const getVibeColor = (vibe?: string) => {
    switch (vibe) {
      case 'cool': return 'text-emerald-400';
      case 'spam': return 'text-rose-400';
      case 'inactive': return 'text-amber-400';
      case 'high-value': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row items-center gap-4 transition-all hover:border-purple-500/50">
      <img 
        src={user.pfp_url || `https://picsum.photos/seed/${user.username}/100/100`} 
        alt={user.username}
        className="w-16 h-16 rounded-full border-2 border-purple-500/20"
      />
      <div className="flex-1 text-center md:text-left">
        <h3 className="font-bold text-lg">@{user.username}</h3>
        <p className="text-gray-400 text-sm line-clamp-1">{user.bio || 'Biyografi yok'}</p>
        
        {analysis && (
          <div className="mt-2 p-2 rounded bg-black/30 border border-white/5 text-xs">
            <span className={`font-bold uppercase ${getVibeColor(analysis.vibe)}`}>
              {analysis.vibe}:
            </span> {analysis.reason}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button 
          onClick={handleVibeCheck}
          disabled={loading}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? 'Analiz ediliyor...' : 'Vibe Check ✨'}
        </button>
        <a 
          href={`https://warpcast.com/${user.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-500/30 rounded-lg text-xs font-semibold text-center transition-all"
        >
          Takipten Çık
        </a>
      </div>
    </div>
  );
};

export default UserCard;
