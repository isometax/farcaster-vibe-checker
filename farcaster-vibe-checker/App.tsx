
import React, { useState, useCallback } from 'react';
import { Search, UserMinus, ShieldCheck, Ghost, Zap, BarChart3, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FarcasterUser, AppStatus } from './types';
import UserCard from './components/UserCard';
import { fetchPublicFarcasterData } from './services/geminiService';

const MOCK_NON_FOLLOWERS: FarcasterUser[] = [
  { fid: 1, username: 'vitalik.eth', display_name: 'Vitalik', pfp_url: 'https://picsum.photos/seed/vitalik/100/100', bio: 'Ethereum things.', follower_count: 500000, following_count: 100 },
  { fid: 2, username: 'derek', display_name: 'Derek', pfp_url: 'https://picsum.photos/seed/derek/100/100', bio: 'Building Farcaster.', follower_count: 10000, following_count: 500 },
  { fid: 3, username: 'spammer123', display_name: 'Botty', pfp_url: 'https://picsum.photos/seed/bot/100/100', bio: 'Follow for crypto gains! 🚀🚀🚀', follower_count: 2, following_count: 5000 },
  { fid: 4, username: 'inactive_user', display_name: 'Lazy Ghost', pfp_url: 'https://picsum.photos/seed/ghost/100/100', bio: '', follower_count: 10, following_count: 10 },
  { fid: 5, username: 'danromero', display_name: 'Dan', pfp_url: 'https://picsum.photos/seed/dan/100/100', bio: 'Vibe lord.', follower_count: 25000, following_count: 800 },
];

const App: React.FC = () => {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [results, setResults] = useState<FarcasterUser[]>([]);
  const [searchSummary, setSearchSummary] = useState('');

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setStatus(AppStatus.LOADING);
    
    try {
      // Step 1: Search for user data using Gemini's search capabilities
      const searchData = await fetchPublicFarcasterData(username);
      setSearchSummary(searchData.text);
      
      // Step 2: In a real app, we'd fetch via Neynar here. 
      // For this prototype, we simulate finding results after a 2-second delay.
      setTimeout(() => {
        setResults(MOCK_NON_FOLLOWERS);
        setStatus(AppStatus.COMPLETED);
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setStatus(AppStatus.ERROR);
    }
  }, [username]);

  const chartData = [
    { name: 'Takip Ettiklerin', value: 842 },
    { name: 'Seni Takip Edenler', value: 710 },
    { name: 'Geri Takip Etmeyenler', value: 132 },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <header className="mb-12 text-center">
        <div className="inline-block p-3 rounded-full bg-farcaster-purple/20 mb-4">
          <Zap className="w-8 h-8 farcaster-purple" />
        </div>
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Farcaster Follow Manager</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Profilini analiz et, seni geri takip etmeyenleri bul ve Gemini yapay zekası ile kimlerin "vibe" sahibi olduğunu keşfet.
        </p>
      </header>

      {/* Search Section */}
      <section className="glass-panel p-6 rounded-3xl mb-8 shadow-2xl">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Farcaster Kullanıcı Adı (örn: dwr.eth)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <button 
            type="submit"
            disabled={status === AppStatus.LOADING}
            className="bg-farcaster-purple hover:bg-purple-600 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {status === AppStatus.LOADING ? (
              <span className="animate-pulse">Tarama Yapılıyor...</span>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Hesabı Analiz Et
              </>
            )}
          </button>
        </form>
      </section>

      {status === AppStatus.LOADING && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-lg text-gray-400 italic">"Google Arama" ve Gemini verileri birleştiriliyor...</p>
        </div>
      )}

      {status === AppStatus.COMPLETED && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-panel p-6 rounded-3xl h-64">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 farcaster-purple" />
                <h2 className="font-bold text-lg">Takip İstatistikleri</h2>
              </div>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 2 ? '#f43f5e' : '#8a63d2'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="glass-panel p-6 rounded-3xl flex flex-col justify-center items-center text-center">
              <Ghost className="w-12 h-12 text-gray-500 mb-4" />
              <div className="text-4xl font-black text-rose-500 mb-1">{results.length}</div>
              <p className="text-gray-400 font-medium">Seni Geri Takip Etmeyen</p>
              <p className="text-xs text-gray-500 mt-2">Bu hesaplar senin takip listende ama onlar seni takip etmiyor.</p>
            </div>
          </div>

          {/* Search Grounding Info */}
          {searchSummary && (
            <div className="glass-panel p-4 rounded-2xl bg-blue-500/5 border-blue-500/20 flex gap-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300 italic">
                <strong>Yapay Zeka Özeti:</strong> {searchSummary.slice(0, 300)}...
              </div>
            </div>
          )}

          {/* Results List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <UserMinus className="w-6 h-6 text-rose-500" />
                Takipçisi Olmadığın Kişiler
              </h2>
              <span className="text-sm text-gray-500">{results.length} hesap bulundu</span>
            </div>
            <div className="space-y-4">
              {results.map((user) => (
                <UserCard key={user.fid} user={user} />
              ))}
            </div>
          </div>
        </div>
      )}

      {status === AppStatus.IDLE && (
        <div className="mt-12 text-center text-gray-500 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-white/5 bg-white/2 transition-transform hover:scale-105">
              <h3 className="font-bold text-white mb-2">Hızlı Tespit</h3>
              <p className="text-sm">Takip ettiğin ama seni takip etmeyen hayalet hesapları anında bul.</p>
            </div>
            <div className="p-6 rounded-2xl border border-white/5 bg-white/2 transition-transform hover:scale-105">
              <h3 className="font-bold text-white mb-2">Vibe Analizi</h3>
              <p className="text-sm">Gemini AI ile profilleri analiz et; bot mu yoksa takip etmeye değer biri mi öğren.</p>
            </div>
            <div className="p-6 rounded-2xl border border-white/5 bg-white/2 transition-transform hover:scale-105">
              <h3 className="font-bold text-white mb-2">Kolay Aksiyon</h3>
              <p className="text-sm">Warpcast üzerinden tek tıkla takibi bırakma sayfasına yönlen.</p>
            </div>
          </div>
          <p className="text-xs mt-8">Not: Farcaster protokolü gizlilik odaklı olduğu için veriler bazen 1-2 dakika gecikmeli güncellenebilir.</p>
        </div>
      )}

      {/* Footer Disclaimer */}
      <footer className="mt-20 py-8 border-t border-white/5 text-center text-gray-600 text-xs">
        <p>© 2024 Farcaster Vibe Tool. Tüm hakları ve veriler Farcaster protokolüne aittir.</p>
        <p className="mt-1">Bu uygulama analiz için Google Gemini 3 modelini kullanmaktadır.</p>
      </footer>
    </div>
  );
};

export default App;
