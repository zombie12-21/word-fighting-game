import { useState } from 'react';
import { useGame } from './store';

export default function AuthScreen() {
  const { dispatch } = useGame();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState('');
  const [pw, setPw] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === 'login') dispatch({ type: 'LOGIN', user, pw });
    else dispatch({ type: 'REGISTER', user, pw });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: 'radial-gradient(ellipse at 50% 0%, #1a0a30 0%, #07080f 60%)' }}>
      {/* Title */}
      <div className="mb-10 text-center animate-fadein">
        <div className="text-6xl mb-3 animate-float">⚔️</div>
        <h1 className="font-display text-4xl font-black mb-1" style={{ color: '#c9901e', textShadow: '0 0 40px #c9901e88' }}>
          龙之传说
        </h1>
        <p className="font-display text-xl" style={{ color: '#a060e8', letterSpacing: '0.15em' }}>
          LEGEND OF THE DRAGON
        </p>
        <p className="text-sm mt-2" style={{ color: '#6878a0' }}>
          An epic RPG adventure awaits — forge your legend
        </p>
      </div>

      {/* Form */}
      <div className="card animate-fadein" style={{ width: 380, padding: 32 }}>
        {/* Tabs */}
        <div className="flex mb-6 rounded-lg overflow-hidden" style={{ background: '#0a0c18', border: '1px solid #1a1e3a' }}>
          {(['login', 'register'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-2.5 font-display text-sm font-semibold transition-all"
              style={{
                background: mode === m ? 'linear-gradient(135deg, #141830, #1a1e3a)' : 'transparent',
                color: mode === m ? '#c9901e' : '#6878a0',
                borderBottom: mode === m ? '2px solid #c9901e' : '2px solid transparent',
              }}
            >
              {m === 'login' ? '登录 Sign In' : '注册 Register'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#8090b0' }}>
              {mode === 'login' ? 'Username 用户名' : 'Choose Username 创建用户名'}
            </label>
            <input
              value={user} onChange={e => setUser(e.target.value)}
              placeholder={mode === 'login' ? 'Enter your username' : 'Create a username (min 2 chars)'}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#8090b0' }}>
              Password 密码
            </label>
            <input
              type="password" value={pw} onChange={e => setPw(e.target.value)}
              placeholder={mode === 'login' ? 'Enter your password' : 'Create password (min 4 chars)'}
              style={{ width: '100%' }}
            />
          </div>

          <button type="submit" className="btn-gold mt-2" style={{ fontSize: '1rem', padding: '12px' }}>
            {mode === 'login' ? '🚀 Sign In 进入游戏' : '⚔️ Register 注册'}
          </button>
        </form>

        {mode === 'register' && (
          <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: '#0a1020', border: '1px solid #1a2040', color: '#6878a0' }}>
            <p className="font-semibold mb-1" style={{ color: '#c9901e' }}>🎁 新手礼包</p>
            <p>• 5,000 金币 Gold</p>
            <p>• 100 钻石 Diamonds</p>
            <p>• 史诗级冒险 Begins!</p>
          </div>
        )}
      </div>

      {/* Decorative */}
      <div className="mt-8 flex gap-6 animate-fadein" style={{ color: '#2a2e50', fontSize: '1.8rem' }}>
        {'🗡️⚔️🛡️🔮🏹🪄🐉✨'.split('').map((icon, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.2}s`, opacity: 0.3 + Math.sin(i) * 0.2 }}>{icon}</span>
        ))}
      </div>
    </div>
  );
}
