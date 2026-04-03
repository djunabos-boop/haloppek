import React, { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, Copy, ShieldCheck, Zap, Lock, RefreshCw, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const App = () => {
  const [password, setPassword] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [stats, setStats] = useState({
    score: 0,
    entropy: 0,
    crackTimeStr: 'Instan',
    length: 0,
    complexity: 0,
    hasLower: false,
    hasUpper: false,
    hasNum: false,
    hasSym: false,
    label: 'LEMAH',
    color: 'bg-red-500'
  });
  const [copied, setCopied] = useState(false);
  const [lastGenerated, setLastGenerated] = useState('');

  // The "Real" Password Strength Engine
  const analyzePassword = useCallback((pwd) => {
    const length = pwd.length;
    if (length === 0) {
      return {
        score: 0, entropy: 0, crackTimeStr: '-', length: 0, complexity: 0,
        hasLower: false, hasUpper: false, hasNum: false, hasSym: false,
        label: '-', color: 'bg-slate-700'
      };
    }

    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNum = /[0-9]/.test(pwd);
    const hasSym = /[^a-zA-Z0-9]/.test(pwd);

    let complexity = 0;
    let poolSize = 0;

    if (hasLower) { complexity++; poolSize += 26; }
    if (hasUpper) { complexity++; poolSize += 26; }
    if (hasNum) { complexity++; poolSize += 10; }
    if (hasSym) { complexity++; poolSize += 32; }

    // Deduct entropy for highly repetitive patterns (e.g., "aaaaaaa")
    const uniqueChars = new Set(pwd).size;
    const repetitionPenalty = length > uniqueChars ? (length - uniqueChars) * 0.6 : 0;
    const effectiveLength = Math.max(1, length - repetitionPenalty);

    // Calculate Information Entropy (E = L * log2(N))
    const entropy = poolSize > 0 ? effectiveLength * Math.log2(poolSize) : 0;

    // Estimate Crack Time (Assuming modern hardware doing 10 Billion guesses/second)
    const guessesPerSecond = 10000000000;
    const totalGuesses = Math.pow(2, entropy);
    const secondsToCrack = totalGuesses / guessesPerSecond;

    let crackTimeStr = '';
    if (secondsToCrack < 1) crackTimeStr = 'Instan 🚨';
    else if (secondsToCrack < 60) crackTimeStr = `${Math.round(secondsToCrack)} Detik`;
    else if (secondsToCrack < 3600) crackTimeStr = `${Math.round(secondsToCrack / 60)} Menit`;
    else if (secondsToCrack < 86400) crackTimeStr = `${Math.round(secondsToCrack / 3600)} Jam`;
    else if (secondsToCrack < 31536000) crackTimeStr = `${Math.round(secondsToCrack / 86400)} Hari`;
    else if (secondsToCrack < 3153600000) crackTimeStr = `${Math.round(secondsToCrack / 31536000)} Tahun`;
    else crackTimeStr = '> Ratusan Abad 🗿';

    // Scoring (0-4) based on Entropy bits
    let score = 0;
    let label = 'LEMAH';
    let color = 'bg-red-500';

    if (entropy > 80) { score = 4; label = 'SUPER'; color = 'bg-purple-500'; }
    else if (entropy > 60) { score = 3; label = 'KUAT'; color = 'bg-emerald-500'; }
    else if (entropy > 35) { score = 2; label = 'SEDANG'; color = 'bg-amber-500'; }
    else if (entropy > 0) { score = 1; label = 'LEMAH'; color = 'bg-rose-500'; }

    return {
      score, entropy, crackTimeStr, length, complexity,
      hasLower, hasUpper, hasNum, hasSym, label, color
    };
  }, []);

  useEffect(() => {
    setStats(analyzePassword(password));
  }, [password, analyzePassword]);

  const generateQuick = (type) => {
    const lowers = 'abcdefghijklmnopqrstuvwxyz';
    const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    let chars = '';
    let len = 0;

    switch(type) {
      case 'mudah':
        chars = lowers + numbers;
        len = 8;
        break;
      case 'sedang':
        chars = lowers + uppers + numbers;
        len = 12;
        break;
      case 'kuat':
        chars = lowers + uppers + numbers + symbols;
        len = 16;
        break;
      case 'super':
        chars = lowers + uppers + numbers + symbols;
        len = 24;
        break;
      default:
        chars = lowers;
        len = 8;
    }

    let result = '';
    // Ensure at least one of each required type if possible, but keep it random
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setPassword(result);
    setLastGenerated(result);
  };

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 font-sans p-4 md:p-8 flex justify-center items-start">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Section */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-8 text-center backdrop-blur-sm shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-cyan-500/20 blur-[50px] rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-500/20 blur-[40px] rounded-full"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">
              <span className="text-cyan-400">Pass</span>
              <span className="text-purple-400">Checker</span>
            </h1>
            <p className="text-slate-400 italic text-sm mb-4">"Password lu beneran aman apa mitos doang?"</p>
            <span className="px-3 py-1 bg-slate-800 text-xs font-semibold rounded-full border border-slate-700/50 text-slate-300">
              v2.0 • Offline Entropy Engine
            </span>
          </div>
        </div>

        {/* Main Checker Section */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4 text-cyan-400 font-bold">
            <Search className="w-5 h-5" />
            <h2>AUDIT PASSWORD</h2>
          </div>

          <div className="relative mb-6 group">
            <input
              type={isRevealed ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ketik password disini..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-2xl py-4 pl-4 pr-14 text-lg text-white placeholder-slate-600 outline-none transition-all focus:shadow-[0_0_15px_rgba(34,211,238,0.1)]"
            />
            <button 
              onClick={() => setIsRevealed(!isRevealed)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {isRevealed ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Strength Bar */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-xs font-bold text-slate-500 px-1">
              <span className={stats.score >= 1 ? 'text-rose-500' : ''}>LEMAH</span>
              <span className={stats.score >= 2 ? 'text-amber-500' : ''}>SEDANG</span>
              <span className={stats.score >= 3 ? 'text-emerald-500' : ''}>KUAT</span>
              <span className={stats.score >= 4 ? 'text-purple-500' : ''}>SUPER</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex gap-1">
              <div className={`h-full flex-1 rounded-l-full transition-all duration-500 ${stats.score >= 1 ? stats.color : 'bg-transparent'}`}></div>
              <div className={`h-full flex-1 transition-all duration-500 ${stats.score >= 2 ? stats.color : 'bg-transparent'}`}></div>
              <div className={`h-full flex-1 transition-all duration-500 ${stats.score >= 3 ? stats.color : 'bg-transparent'}`}></div>
              <div className={`h-full flex-1 rounded-r-full transition-all duration-500 ${stats.score >= 4 ? stats.color : 'bg-transparent'}`}></div>
            </div>
            <div className="text-center pt-2">
              <span className={`text-sm font-black uppercase tracking-widest ${password ? stats.color.replace('bg-', 'text-') : 'text-slate-600'}`}>
                {stats.label}
              </span>
            </div>
          </div>

          {/* Crack Time Est */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-center justify-center gap-3 mb-6">
            {stats.score < 2 ? <AlertTriangle className="w-5 h-5 text-rose-500" /> : <ShieldCheck className="w-5 h-5 text-emerald-500" />}
            <div className="text-sm">
              <span className="text-slate-400">Estimasi waktu bobol: </span>
              <span className="font-bold text-white ml-1">{stats.crackTimeStr}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-xs text-slate-500 font-bold mb-1">PANJANG</div>
              <div className="text-2xl font-black text-cyan-400">{stats.length}</div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-xs text-slate-500 font-bold mb-1">KOMPLEKSITAS</div>
              <div className="text-2xl font-black text-cyan-400">{stats.complexity}<span className="text-slate-600 text-lg">/4</span></div>
            </div>
          </div>

          {/* Criteria Badges */}
          <div className="grid grid-cols-4 gap-2">
            <Badge active={stats.hasLower} label="a-z" />
            <Badge active={stats.hasUpper} label="A-Z" />
            <Badge active={stats.hasNum} label="0-9" />
            <Badge active={stats.hasSym} label="!@#" />
          </div>
        </div>

        {/* Generator Section */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4 text-purple-400 font-bold">
            <Zap className="w-5 h-5" />
            <h2>AUTO GENERATOR</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            <GenBtn label="Mudah" color="hover:border-rose-500 text-rose-400" onClick={() => generateQuick('mudah')} />
            <GenBtn label="Sedang" color="hover:border-amber-500 text-amber-400" onClick={() => generateQuick('sedang')} />
            <GenBtn label="Kuat" color="hover:border-emerald-500 text-emerald-400" onClick={() => generateQuick('kuat')} />
            <GenBtn label="Super" color="hover:border-purple-500 text-purple-400" onClick={() => generateQuick('super')} />
          </div>

          <button 
            onClick={handleCopy}
            disabled={!password}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              !password 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                : copied 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
          >
            {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? 'BERHASIL DICOPY!' : 'COPY PASSWORD SAAT INI'}
          </button>
        </div>

      </div>
    </div>
  );
};

// Sub-components for cleaner code
const Badge = ({ active, label }) => (
  <div className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold border transition-colors ${
    active 
      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
      : 'bg-slate-950 border-slate-800 text-slate-600'
  }`}>
    {label}
    {active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3 opacity-50" />}
  </div>
);

const GenBtn = ({ label, color, onClick }) => (
  <button 
    onClick={onClick}
    className={`bg-slate-950 border border-slate-800 rounded-xl py-3 text-xs font-bold transition-all ${color} hover:bg-slate-900 flex flex-col items-center justify-center gap-1 active:scale-95`}
  >
    <RefreshCw className="w-4 h-4 mb-1 opacity-70" />
    {label}
  </button>
);

export default App;
