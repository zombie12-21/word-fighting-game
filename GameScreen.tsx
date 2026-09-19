import { useGame } from './store';
import CharPanel from './panels/CharPanel';
import InvPanel from './panels/InvPanel';
import DungeonPanel from './panels/DungeonPanel';
import ShopPanel from './panels/ShopPanel';
import SignInPanel from './panels/SignInPanel';
import GachaPanel from './panels/GachaPanel';
import TreasurePanel from './panels/TreasurePanel';
import WelfarePanel from './panels/WelfarePanel';
import type { TabId } from './types';

const TABS: { id: TabId; icon: string; label: string; zh: string }[] = [
  { id:'char',     icon:'👤', label:'Character', zh:'角色'    },
  { id:'inv',      icon:'🎒', label:'Inventory',  zh:'背包'    },
  { id:'dungeon',  icon:'⚔️', label:'Dungeon',    zh:'副本'    },
  { id:'shop',     icon:'🏪', label:'Shop',       zh:'商店'    },
  { id:'signin',   icon:'📅', label:'Sign-In',    zh:'签到'    },
  { id:'gacha',    icon:'🎰', label:'Gacha',       zh:'抽奖'    },
  { id:'treasure', icon:'💎', label:'Treasures',  zh:'法宝神兵' },
  { id:'welfare',  icon:'🎁', label:'Welfare',    zh:'福利'    },
];

function HpBar({ val, max }: { val: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (val / max) * 100));
  return (
    <div className="hp-bar" style={{ width: 80 }}>
      <div className={`hp-fill ${pct > 60 ? 'high' : pct > 30 ? 'mid' : 'low'}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function ExpBar({ exp, next }: { exp: number; next: number }) {
  const pct = Math.min(100, (exp / next) * 100);
  return (
    <div className="exp-bar" style={{ width: 80 }}>
      <div className="exp-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function GameScreen() {
  const { state, dispatch, player, calcStats } = useGame();
  if (!player) return null;

  const stats = calcStats(player);

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#07080f' }}>
      {/* ── Sidebar ── */}
      <div style={{ width:190, minHeight:'100vh', background:'#0a0b18', borderRight:'1px solid #1a1e3a', display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh' }}>
        {/* Logo */}
        <div style={{ padding:'16px 12px', borderBottom:'1px solid #1a1e3a' }}>
          <div className="font-display text-center" style={{ color:'#c9901e', fontSize:'1.1rem', fontWeight:900, letterSpacing:'0.05em' }}>⚔️ 龙之传说</div>
        </div>

        {/* Player mini-card */}
        <div style={{ padding:'12px', borderBottom:'1px solid #1a1e3a' }}>
          <div className="flex items-center gap-2 mb-2">
            <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#8a6510,#c9901e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', fontWeight:700, color:'#fff8e0', fontFamily:'Cinzel,serif' }}>
              {player.name[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:'0.8rem', fontWeight:600, color:'#c9d0e8' }}>{player.name}</div>
              <div style={{ fontSize:'0.7rem', color:'#c9901e', fontFamily:'Cinzel,serif' }}>Lv.{player.lvl}</div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span style={{ fontSize:'0.6rem', color:'#5a6880' }}>HP</span>
              <HpBar val={stats.hp} max={stats.hp} />
            </div>
            <div className="flex items-center justify-between">
              <span style={{ fontSize:'0.6rem', color:'#5a6880' }}>EXP</span>
              <ExpBar exp={player.exp} next={player.expNext} />
            </div>
          </div>
        </div>

        {/* Currency */}
        <div style={{ padding:'10px 12px', borderBottom:'1px solid #1a1e3a', display:'flex', flexDirection:'column', gap:4 }}>
          <div className="flex items-center gap-1.5">
            <span>🪙</span>
            <span style={{ fontSize:'0.72rem', color:'#c9901e' }}>{player.gold.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>💠</span>
            <span style={{ fontSize:'0.72rem', color:'#38bdf8' }}>{player.diamond.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🔮</span>
            <span style={{ fontSize:'0.72rem', color:'#a060e8', fontWeight:700 }}>{player.spirit}</span>
            <span style={{ fontSize:'0.6rem', color:'#5a4080' }}>灵石</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, overflowY:'auto', padding:'6px 0' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => dispatch({ type:'SET_TAB', tab: tab.id })}
              className={`nav-item w-full text-left flex items-center gap-2.5 px-4 py-2.5 ${state.tab === tab.id ? 'active' : ''}`}
              style={{ fontSize:'0.82rem', background:'transparent', border:'none' }}
            >
              <span style={{ fontSize:'1rem', minWidth:20 }}>{tab.icon}</span>
              <div>
                <div style={{ fontWeight: state.tab === tab.id ? 600 : 400 }}>{tab.zh}</div>
                <div style={{ fontSize:'0.65rem', opacity:0.6 }}>{tab.label}</div>
              </div>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={() => dispatch({ type:'LOGOUT' })}
          className="btn-ghost m-3 text-xs"
          style={{ padding:'8px' }}
        >
          🚪 Logout 登出
        </button>
      </div>

      {/* ── Main Content ── */}
      <div style={{ flex:1, overflowY:'auto', minHeight:'100vh' }}>
        {state.tab === 'char'     && <CharPanel />}
        {state.tab === 'inv'      && <InvPanel />}
        {state.tab === 'dungeon'  && <DungeonPanel />}
        {state.tab === 'shop'     && <ShopPanel />}
        {state.tab === 'signin'   && <SignInPanel />}
        {state.tab === 'gacha'    && <GachaPanel />}
        {state.tab === 'treasure' && <TreasurePanel />}
        {state.tab === 'welfare'  && <WelfarePanel />}
      </div>

      {/* ── Toast ── */}
      {state.toast && (
        <div className={`toast toast-${state.toast.kind === 'rare' ? 'rare' : state.toast.kind}`}>
          {state.toast.msg}
        </div>
      )}
    </div>
  );
}
