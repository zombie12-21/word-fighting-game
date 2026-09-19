import { useGame } from '../store';
import { SKILL_DEFS } from '../data';
import type { Slot, Stat } from '../types';

const SLOT_INFO: { slot: Slot; label: string; zh: string; pos: [number, number] }[] = [
  { slot:'helmet',   label:'Helmet',   zh:'头盔',  pos:[130, 0]   },
  { slot:'necklace', label:'Necklace', zh:'项链',  pos:[130, 80]  },
  { slot:'weapon',   label:'Weapon',   zh:'武器',  pos:[30,  80]  },
  { slot:'armor',    label:'Armor',    zh:'护甲',  pos:[130, 160] },
  { slot:'offhand',  label:'Offhand',  zh:'副手',  pos:[230, 80]  },
  { slot:'gloves',   label:'Gloves',   zh:'手套',  pos:[30,  160] },
  { slot:'boots',    label:'Boots',    zh:'靴子',  pos:[230, 160] },
  { slot:'belt',     label:'Belt',     zh:'腰带',  pos:[130, 240] },
  { slot:'ring1',    label:'Ring 1',   zh:'戒指1', pos:[30,  240] },
  { slot:'ring2',    label:'Ring 2',   zh:'戒指2', pos:[230, 240] },
];

const STAT_LABELS: Record<Stat, { label: string; zh: string; icon: string }> = {
  atk:     { label:'Attack',    zh:'攻击',   icon:'⚔️' },
  def:     { label:'Defense',   zh:'防御',   icon:'🛡️' },
  hp:      { label:'HP',        zh:'生命',   icon:'❤️' },
  spd:     { label:'Speed',     zh:'速度',   icon:'💨' },
  crit:    { label:'Crit Rate', zh:'暴击率', icon:'💥' },
  critDmg: { label:'Crit DMG',  zh:'暴击伤害',icon:'⚡' },
  dodge:   { label:'Dodge',     zh:'闪避',   icon:'🌬️' },
};

const Q_COLOR: Record<string, string> = {
  normal:'#9ca3af', magic:'#4ade80', rare:'#60a5fa', epic:'#c084fc', legendary:'#fb923c', divine:'#f87171',
};

export default function CharPanel() {
  const { player, calcStats, dispatch } = useGame();
  if (!player) return null;

  const total = calcStats(player);
  const expPct = Math.min(100, (player.exp / player.expNext) * 100);

  return (
    <div style={{ padding:24, maxWidth:900, margin:'0 auto' }}>
      <h2 className="section-title">👤 角色 Character</h2>

      <div className="flex gap-6" style={{ flexWrap:'wrap' }}>

        {/* ── Equipment Visual ── */}
        <div className="card" style={{ flex:'0 0 340px', padding:20 }}>
          <div className="font-display text-sm mb-4" style={{ color:'#c9901e' }}>装备栏 Equipment Slots</div>

          <div style={{ position:'relative', height:320 }}>
            {/* Character silhouette */}
            <div style={{
              position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)',
              width:60, height:100, borderRadius:30, border:'2px solid #252a50',
              background:'linear-gradient(180deg,#141830,#0d0f1e)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem',
            }}>🧙</div>

            {SLOT_INFO.map(({ slot, label, zh, pos }) => {
              const item = player.equip[slot];
              return (
                <div
                  key={slot}
                  className={`equip-slot ${item ? 'filled' : ''}`}
                  style={{
                    position:'absolute', left:pos[0], top:pos[1],
                    borderColor: item ? Q_COLOR[item.quality] : undefined,
                    background: item ? `${Q_COLOR[item.quality]}15` : undefined,
                  }}
                  title={item ? `${item.zh} (${item.name})\nClick to unequip` : `${zh} — empty`}
                  onClick={() => item && dispatch({ type:'UNEQUIP', slot })}
                >
                  {item ? item.icon : <span style={{ fontSize:'0.6rem', color:'#3a4060', lineHeight:1, textAlign:'center' }}>{zh}</span>}
                  {item && (
                    <div style={{
                      position:'absolute', bottom:-6, right:-6, fontSize:'0.55rem', fontWeight:700,
                      background:'#0a0c18', border:`1px solid ${Q_COLOR[item.quality]}`,
                      borderRadius:3, padding:'1px 3px', color: Q_COLOR[item.quality],
                    }}>
                      {item.lvReq}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* EXP bar */}
          <div className="mt-4">
            <div className="flex justify-between mb-1" style={{ fontSize:'0.72rem', color:'#6878a0' }}>
              <span>EXP: {player.exp.toLocaleString()} / {player.expNext.toLocaleString()}</span>
              <span>{expPct.toFixed(1)}%</span>
            </div>
            <div className="exp-bar">
              <div className="exp-fill" style={{ width:`${expPct}%` }} />
            </div>
          </div>

          {/* Active treasures */}
          {(player.activeTreasure || player.activeDivWeapon) && (
            <div className="mt-3 p-2 rounded-lg" style={{ background:'#0a0c18', border:'1px solid #1a1e3a' }}>
              <div style={{ fontSize:'0.7rem', color:'#c9901e', marginBottom:4 }}>⚡ 激活法宝/神兵</div>
              {player.activeTreasure && (() => {
                const t = player.treasures.find(t => t.iid === player.activeTreasure);
                return t ? <div className="text-xs" style={{ color:'#c084fc' }}>{t.icon} {t.zh} <span style={{ color:'#5a4080' }}>(法宝)</span></div> : null;
              })()}
              {player.activeDivWeapon && (() => {
                const w = player.divWeapons.find(w => w.iid === player.activeDivWeapon);
                return w ? <div className="text-xs mt-1" style={{ color:'#f87171' }}>{w.icon} {w.zh} <span style={{ color:'#6a2020' }}>(神兵)</span></div> : null;
              })()}
            </div>
          )}
        </div>

        {/* ── Stats ── */}
        <div style={{ flex:1, minWidth:240 }}>
          {/* Level & Name */}
          <div className="card mb-4" style={{ padding:16 }}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{
                width:50, height:50, borderRadius:'50%', fontSize:'1.5rem',
                background:'linear-gradient(135deg,#8a6510,#c9901e)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'#fff8e0', fontFamily:'Cinzel,serif', fontWeight:900,
              }}>
                {player.name[0].toUpperCase()}
              </div>
              <div>
                <div className="font-display text-lg font-bold" style={{ color:'#c9d0e8' }}>{player.name}</div>
                <div className="font-display text-sm" style={{ color:'#c9901e' }}>Level {player.lvl}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2" style={{ fontSize:'0.75rem', color:'#6878a0' }}>
              <div>🏆 副本通关: {Object.values(player.cleared).reduce((a,b)=>a+b,0)}</div>
              <div>📅 签到次数: {player.signTotal}</div>
              <div>🔮 灵石: <span style={{ color:'#a060e8', fontWeight:700 }}>{player.spirit}</span></div>
              <div>🌟 VIP: {player.vip === 0 ? '普通' : `VIP ${player.vip}`}</div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="card" style={{ padding:16 }}>
            <div className="font-display text-sm mb-3" style={{ color:'#c9901e' }}>属性 Stats</div>
            <div className="grid grid-cols-1 gap-2">
              {(Object.entries(STAT_LABELS) as [Stat, typeof STAT_LABELS[Stat]][]).map(([key, info]) => {
                const base = player.base[key] || 0;
                const tot  = total[key] || 0;
                const bonus = tot - base;
                const suffix = key === 'crit' || key === 'dodge' ? '%' : key === 'critDmg' ? '%' : '';
                return (
                  <div key={key} className="flex items-center justify-between" style={{ padding:'6px 10px', background:'#0a0c18', borderRadius:6 }}>
                    <span style={{ fontSize:'0.78rem', color:'#8090b0' }}>
                      {info.icon} {info.zh}
                    </span>
                    <span style={{ fontSize:'0.82rem', fontWeight:600, color:'#c9d0e8' }}>
                      {tot.toFixed(key === 'crit' || key === 'dodge' || key === 'critDmg' ? 1 : 0)}{suffix}
                      {bonus > 0 && <span style={{ color:'#4ade80', fontSize:'0.7rem' }}> +{bonus.toFixed(0)}</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Learned Skills */}
          {player.learnedSkills.length > 0 && (
            <div className="card mt-4" style={{ padding:16 }}>
              <div className="font-display text-sm mb-3" style={{ color:'#c9901e' }}>技能 Skills</div>
              <div className="flex flex-wrap gap-2">
                {player.learnedSkills.map(sid => {
                  const sk = SKILL_DEFS.find(s => s.id === sid);
                  return sk ? (
                    <div key={sid} style={{ padding:'4px 8px', background:'#0a0c18', borderRadius:6, border:'1px solid #252a50', fontSize:'0.75rem', color:'#c084fc' }}>
                      {sk.icon} {sk.zh}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
