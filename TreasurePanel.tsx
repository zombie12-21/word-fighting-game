import { useState } from 'react';
import { useGame } from '../store';
import { TREASURE_DEFS, DIVINE_WEAPON_DEFS } from '../data';
import type { TreasureDef, TreasureItem, Grade } from '../types';

const Q_COLOR: Record<number, string> = { 1:'#9ca3af', 2:'#60a5fa', 3:'#c084fc', 4:'#f87171' };
const Q_LABEL: Record<number, string> = { 1:'一阶', 2:'二阶', 3:'三阶', 4:'四阶' };
const RUNE_COLOR = '#b06ef3';

function GradeBadge({ grade }: { grade: Grade }) {
  return (
    <span style={{
      fontSize:'0.6rem', fontWeight:700, padding:'1px 6px', borderRadius:3,
      border:`1px solid ${Q_COLOR[grade]}55`,
      color: Q_COLOR[grade], background:`${Q_COLOR[grade]}18`,
    }}>
      {Q_LABEL[grade]}
    </span>
  );
}

// Defs display card (unowned)
function DefCard({ def, type }: { def: TreasureDef; type: 'treasure' | 'divweapon' }) {
  const color = Q_COLOR[def.grade];
  const canGet = def.grade === 1;
  return (
    <div
      className="card"
      style={{ padding:14, border:`1px solid ${color}33`, background:`${color}08`, opacity: canGet ? 1 : 0.6 }}
    >
      <div className="flex items-start gap-3">
        <div style={{ fontSize:'2.2rem', lineHeight:1 }}>{def.icon}</div>
        <div style={{ flex:1 }}>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-display text-sm font-bold" style={{ color }}>{def.zh}</span>
            <GradeBadge grade={def.grade} />
          </div>
          <div style={{ fontSize:'0.65rem', color:'#5a6880', marginBottom:6 }}>{def.name} · {type === 'divweapon' ? '神兵' : '法宝'}</div>
          <div style={{ fontSize:'0.68rem', color:'#6878a0', marginBottom:6 }}>
            {Object.entries(def.stats).map(([k,v]) => v ? <span key={k} style={{ marginRight:8 }}>{k}:+{v}</span> : null)}
          </div>
          <div style={{ background:'#0a0c18', borderRadius:6, padding:'6px 8px', fontSize:'0.7rem', marginBottom:6 }}>
            <div style={{ color:'#c9901e', fontWeight:600, marginBottom:2 }}>⚡ {def.skillZh}</div>
            <div style={{ color:'#8090b0' }}>{def.skillDesc}</div>
          </div>
          <div className="flex items-center gap-2" style={{ fontSize:'0.68rem' }}>
            <span style={{ color: def.lvReq > 0 ? '#6878a0' : '#4ade80' }}>需要: Lv.{def.lvReq}</span>
            <span style={{ color:'#3a4060' }}>|</span>
            <span style={{ color:'#5a4080' }}>3 × 符石槽</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Owned instance card
function OwnedCard({
  item, isActive, type, onEquip, player
}: {
  item: TreasureItem;
  isActive: boolean;
  type: 'treasure' | 'divweapon';
  onEquip: () => void;
  player: any;
}) {
  const color = Q_COLOR[item.grade];
  return (
    <div
      className="card"
      style={{
        padding:14, border:`2px solid ${isActive ? '#c9901e' : color + '44'}`,
        background: isActive ? 'linear-gradient(135deg,#180e05,#0d0f1e)' : `${color}08`,
        cursor:'pointer', transition:'all 0.18s',
      }}
      onClick={onEquip}
    >
      <div className="flex items-start gap-3">
        <div style={{ fontSize:'2.2rem', lineHeight:1 }}>{item.icon}</div>
        <div style={{ flex:1 }}>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-display text-sm font-bold" style={{ color }}>{item.zh}</span>
            <GradeBadge grade={item.grade} />
            {isActive && <span style={{ fontSize:'0.6rem', background:'#1a0e00', color:'#c9901e', border:'1px solid #c9901e44', borderRadius:3, padding:'1px 5px' }}>已激活</span>}
          </div>

          <div style={{ fontSize:'0.68rem', color:'#6878a0', marginBottom:6 }}>
            {Object.entries(item.stats).map(([k,v]) => v ? <span key={k} style={{ marginRight:8 }}>{k}:+{v}</span> : null)}
          </div>

          <div style={{ background:'#0a0c18', borderRadius:6, padding:'6px 8px', fontSize:'0.7rem', marginBottom:8 }}>
            <div style={{ color:'#c9901e', fontWeight:600, marginBottom:2 }}>⚡ {item.skillZh}</div>
            <div style={{ color:'#8090b0' }}>{item.skillDesc}</div>
          </div>

          {/* Rune slots */}
          <div style={{ fontSize:'0.7rem', color:'#c9901e', marginBottom:4 }}>符文槽 Rune Slots</div>
          <div className="flex gap-2">
            {item.runes.map((r, i) => (
              <div
                key={i}
                className={`rune-socket ${r ? 'filled' : ''}`}
                style={{ width:36, height:36, fontSize:'1rem' }}
                title={r ? `${r.zh}: ${r.desc}` : '空符石槽'}
              >
                {r ? r.icon : i + 1}
              </div>
            ))}
          </div>

          <div style={{ marginTop:8, fontSize:'0.7rem', color: isActive ? '#c9901e' : '#5a6880' }}>
            {isActive ? '点击 → 卸下激活' : '点击 → 激活使用'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TreasurePanel() {
  const { player, dispatch } = useGame();
  const [activeTab, setActiveTab] = useState<'treasure' | 'divweapon'>('treasure');
  const [gradeFilter, setGradeFilter] = useState<Grade | 0>(0);

  if (!player) return null;

  const defs = activeTab === 'treasure' ? TREASURE_DEFS : DIVINE_WEAPON_DEFS;
  const owned = activeTab === 'treasure' ? player.treasures : player.divWeapons;
  const activeIid = activeTab === 'treasure' ? player.activeTreasure : player.activeDivWeapon;

  const filteredDefs = gradeFilter === 0 ? defs : defs.filter(d => d.grade === gradeFilter);

  // Check if player owns an item matching this def
  const ownedIds = new Set(owned.map(o => o.id));

  return (
    <div style={{ padding:24, maxWidth:900, margin:'0 auto' }}>
      <h2 className="section-title">💎 法宝 & 神兵 Magic Treasures & Divine Weapons</h2>

      <div className="card mb-4" style={{ padding:'10px 14px', fontSize:'0.75rem', color:'#8090b0' }}>
        法宝和神兵是特殊强化道具，可以激活使用（同时激活一件法宝和一件神兵）。
        <span style={{ color:'#c084fc' }}>可以镶嵌3个符石</span>并拥有特殊技能和效果。
        <span style={{ color:'#f87171' }}>高等级（3-4阶）需要100级以上才可使用。</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setActiveTab('treasure')}
          style={{
            padding:'8px 20px', borderRadius:8, fontFamily:'Cinzel,serif',
            background: activeTab === 'treasure' ? 'linear-gradient(135deg,#150d28,#1a1e3a)' : 'transparent',
            border: `1px solid ${activeTab === 'treasure' ? '#c084fc' : '#1a1e3a'}`,
            color: activeTab === 'treasure' ? '#c084fc' : '#6878a0',
          }}
        >
          🔮 法宝 ({player.treasures.length})
        </button>
        <button
          onClick={() => setActiveTab('divweapon')}
          style={{
            padding:'8px 20px', borderRadius:8, fontFamily:'Cinzel,serif',
            background: activeTab === 'divweapon' ? 'linear-gradient(135deg,#200a0a,#1a1e3a)' : 'transparent',
            border: `1px solid ${activeTab === 'divweapon' ? '#f87171' : '#1a1e3a'}`,
            color: activeTab === 'divweapon' ? '#f87171' : '#6878a0',
          }}
        >
          ⚔️ 神兵 ({player.divWeapons.length})
        </button>
      </div>

      {/* Grade filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {([0,1,2,3,4] as (Grade | 0)[]).map(g => (
          <button
            key={g}
            onClick={() => setGradeFilter(g)}
            style={{
              padding:'3px 12px', borderRadius:4, fontSize:'0.75rem',
              background: gradeFilter === g ? '#1a1e3a' : 'transparent',
              border: `1px solid ${gradeFilter === g ? '#c9901e' : '#1a1e3a'}`,
              color: g === 0 ? '#c9d0e8' : Q_COLOR[g as Grade],
            }}
          >
            {g === 0 ? '全部' : `${Q_LABEL[g as Grade]}`}
          </button>
        ))}
      </div>

      {/* Owned items */}
      {owned.length > 0 && (
        <div className="mb-6">
          <div className="section-title">已拥有 Owned</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:10 }}>
            {owned.map(item => (
              <OwnedCard
                key={item.iid}
                item={item}
                isActive={item.iid === activeIid}
                type={activeTab}
                onEquip={() => dispatch({ type: activeTab === 'treasure' ? 'EQUIP_TREASURE' : 'EQUIP_DIVWEAPON', iid: item.iid })}
                player={player}
              />
            ))}
          </div>
        </div>
      )}

      {/* All defs (reference) */}
      <div className="section-title">图鉴 Encyclopedia</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:10 }}>
        {filteredDefs.map(def => (
          <DefCard key={def.id} def={def} type={activeTab} />
        ))}
      </div>

      {/* How to obtain */}
      <div className="card mt-5" style={{ padding:16 }}>
        <div className="section-title" style={{ fontSize:'0.85rem' }}>📖 获取方式 How to Obtain</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:10, fontSize:'0.75rem', color:'#6878a0' }}>
          {[
            { grade:'一阶', color:Q_COLOR[1], how:'新手活动 / 神圣抽奖' },
            { grade:'二阶', color:Q_COLOR[2], how:'Lv.30+ 副本掉落 / 商店购买' },
            { grade:'三阶', color:Q_COLOR[3], how:'Lv.60+ 高难副本掉落' },
            { grade:'四阶', color:Q_COLOR[4], how:'Lv.100+ 特殊副本 / 神圣抽奖' },
          ].map(({ grade, color, how }) => (
            <div key={grade} style={{ background:'#0a0c18', borderRadius:6, padding:'8px 10px', border:`1px solid ${color}33` }}>
              <div style={{ color, fontWeight:700, marginBottom:2 }}>{grade}</div>
              <div>{how}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
