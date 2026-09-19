import { useRef, useEffect } from 'react';
import { useGame } from '../store';
import { DUNGEONS, SKILL_DEFS } from '../data';
import type { DungeonDef } from '../types';

function HpBar({ val, max, color }: { val: number; max: number; color: string }) {
  const pct = Math.max(0, Math.min(100, (val / max) * 100));
  return (
    <div style={{ height:10, borderRadius:5, background:'#1a1e3a', overflow:'hidden', flex:1 }}>
      <div style={{ height:'100%', borderRadius:5, background:color, width:`${pct}%`, transition:'width 0.3s' }} />
    </div>
  );
}

function MpBar({ val, max }: { val: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (val / max) * 100));
  return (
    <div style={{ height:6, borderRadius:3, background:'#1a1e3a', overflow:'hidden', flex:1 }}>
      <div style={{ height:'100%', borderRadius:3, background:'linear-gradient(90deg,#1e40af,#60a5fa)', width:`${pct}%`, transition:'width 0.3s' }} />
    </div>
  );
}

export default function DungeonPanel() {
  const { state, dispatch, player, calcStats } = useGame();
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [state.battle?.log.length]);

  if (!player) return null;
  const stats = calcStats(player);

  // ── Battle screen ──
  if (state.battle) {
    const b = state.battle;
    const monster = b.dungeon.monsters[Math.min(b.wave, b.dungeon.monsters.length - 1)];
    const learnedSkills = player.learnedSkills.map(id => SKILL_DEFS.find(s => s.id === id)).filter(Boolean) as typeof SKILL_DEFS;

    return (
      <div style={{ padding:24, maxWidth:800, margin:'0 auto' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title" style={{ marginBottom:0 }}>⚔️ {b.dungeon.zh}</h2>
          <span style={{ fontSize:'0.75rem', color:'#5a6880' }}>Turn {b.turn + 1} · Wave {b.wave + 1}/{b.dungeon.monsters.length}</span>
        </div>

        {/* Combatants */}
        <div className="flex gap-4 mb-4" style={{ flexWrap:'wrap' }}>
          {/* Player */}
          <div className="card" style={{ flex:1, minWidth:200, padding:14 }}>
            <div className="flex items-center gap-2 mb-2">
              <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#1e40af,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>🧙</div>
              <div>
                <div style={{ fontSize:'0.82rem', fontWeight:600, color:'#c9d0e8' }}>{player.name}</div>
                <div style={{ fontSize:'0.7rem', color:'#60a5fa' }}>Lv.{player!.lvl}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <span style={{ fontSize:'0.65rem', color:'#5a6880', width:30 }}>HP</span>
              <HpBar val={b.pHp} max={b.pHpMax} color={b.pHp / b.pHpMax > 0.6 ? '#22c55e' : b.pHp / b.pHpMax > 0.3 ? '#f59e0b' : '#ef4444'} />
              <span style={{ fontSize:'0.65rem', color:'#c9d0e8', width:80, textAlign:'right' }}>{b.pHp}/{b.pHpMax}</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize:'0.65rem', color:'#5a6880', width:30 }}>MP</span>
              <MpBar val={b.pMp} max={b.pMpMax} />
              <span style={{ fontSize:'0.65rem', color:'#60a5fa', width:80, textAlign:'right' }}>{b.pMp}/{b.pMpMax}</span>
            </div>
            {b.buffTurns > 0 && <div style={{ fontSize:'0.65rem', color:'#fb923c', marginTop:4 }}>🔥 攻击+{b.buffAtk}% ({b.buffTurns}回合)</div>}
            {b.shieldTurns > 0 && <div style={{ fontSize:'0.65rem', color:'#60a5fa', marginTop:2 }}>🛡️ 减伤{b.shieldPct}% ({b.shieldTurns}回合)</div>}
          </div>

          <div style={{ display:'flex', alignItems:'center', fontSize:'1.5rem', color:'#5a6880' }}>VS</div>

          {/* Monster */}
          <div className="card" style={{ flex:1, minWidth:200, padding:14 }}>
            <div className="flex items-center gap-2 mb-2">
              <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#7a1010,#ef4444)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>{monster.icon}</div>
              <div>
                <div style={{ fontSize:'0.82rem', fontWeight:600, color:'#c9d0e8' }}>{monster.zh}</div>
                <div style={{ fontSize:'0.7rem', color:'#f87171' }}>Lv.{monster.lvl} | ATK:{monster.atk} DEF:{monster.def}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize:'0.65rem', color:'#5a6880', width:30 }}>HP</span>
              <HpBar val={b.mHp} max={b.mHpMax} color="#ef4444" />
              <span style={{ fontSize:'0.65rem', color:'#f87171', width:80, textAlign:'right' }}>{b.mHp}/{b.mHpMax}</span>
            </div>
            {b.mPoisonTurns > 0 && <div style={{ fontSize:'0.65rem', color:'#4ade80', marginTop:4 }}>☠️ 中毒 ({b.mPoisonTurns}回合)</div>}
            {b.mStunTurns > 0 && <div style={{ fontSize:'0.65rem', color:'#fbbf24', marginTop:2 }}>⚡ 眩晕 ({b.mStunTurns}回合)</div>}
            {b.mBurnTurns > 0 && <div style={{ fontSize:'0.65rem', color:'#fb923c', marginTop:2 }}>🔥 燃烧 ({b.mBurnTurns}回合)</div>}
          </div>
        </div>

        {/* Battle Log */}
        <div
          ref={logRef}
          className="card"
          style={{ height:200, overflowY:'auto', padding:12, marginBottom:12, fontFamily:'monospace', fontSize:'0.78rem', lineHeight:1.6 }}
        >
          {b.log.map((line, i) => (
            <div key={i} className={`log-${line.cls}`}>{line.text}</div>
          ))}
          {b.over && (
            <div style={{ marginTop:8, padding:8, textAlign:'center', fontFamily:'Cinzel,serif', fontSize:'1rem', color: b.win ? '#4ade80' : '#f87171' }}>
              {b.win ? '🏆 VICTORY! 胜利！' : '💀 DEFEAT... 失败'}
            </div>
          )}
        </div>

        {/* Actions */}
        {!b.over ? (
          <div>
            <div className="flex gap-2 flex-wrap mb-2">
              <button className="btn-gold" onClick={() => dispatch({ type:'BATTLE_TURN' })}>
                ⚔️ Attack 攻击
              </button>
              <button className="btn-red" onClick={() => dispatch({ type:'FLEE' })}>
                🏃 Flee 撤退
              </button>
            </div>

            {/* Skill buttons */}
            {learnedSkills.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {learnedSkills.map(sk => {
                  const onCD = (b.skillCooldowns[sk.id] || 0) > 0;
                  const noMp = b.pMp < sk.mp;
                  return (
                    <button
                      key={sk.id}
                      className="btn-spirit text-xs"
                      style={{ padding:'6px 12px', opacity: onCD || noMp ? 0.5 : 1 }}
                      disabled={onCD || noMp}
                      onClick={() => dispatch({ type:'USE_SKILL', skillId: sk.id })}
                      title={`${sk.desc}\nMP: ${sk.mp} | CD: ${sk.cd} turns\n${noMp ? 'MP不足' : onCD ? `冷却中 ${b.skillCooldowns[sk.id]} 回合` : ''}`}
                    >
                      {sk.icon} {sk.zh} {onCD ? `(CD:${b.skillCooldowns[sk.id]})` : `MP:${sk.mp}`}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <button className="btn-gold" onClick={() => dispatch({ type:'CLOSE_BATTLE' })}>
            {b.win ? '✅ Claim Rewards 领取奖励' : '💀 Leave 离开'}
          </button>
        )}
      </div>
    );
  }

  // ── Dungeon list ──
  const normal = DUNGEONS.filter(d => !d.special);
  const special = DUNGEONS.filter(d => d.special);

  function DungeonCard({ d }: { d: DungeonDef }) {
    const p = player!!;
    const locked = p.lvl < d.lvReq;
    const maxMon = Math.max(...d.monsters.map(m => m.lvl));
    const tooHigh = maxMon > p.lvl + 5;
    const cantEnter = locked || tooHigh;

    return (
      <div
        className={`dungeon-card ${cantEnter ? 'locked' : ''} ${d.special ? 'special' : ''}`}
        onClick={() => !cantEnter && dispatch({ type:'START_BATTLE', dungeon: d })}
      >
        <div className="flex items-start gap-3">
          <div style={{ fontSize:'2.2rem', lineHeight:1 }}>{d.icon}</div>
          <div style={{ flex:1 }}>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display text-sm font-bold" style={{ color: d.special ? '#c9901e' : '#c9d0e8' }}>{d.zh}</span>
              <span style={{ fontSize:'0.65rem', color:'#5a6880' }}>{d.name}</span>
              {d.special && <span style={{ fontSize:'0.6rem', background:'#2a1500', color:'#c9901e', border:'1px solid #c9901e44', borderRadius:3, padding:'1px 5px' }}>特殊</span>}
            </div>
            <div style={{ fontSize:'0.72rem', color:'#6878a0', margin:'3px 0', lineHeight:1.4 }}>{d.desc}</div>
            <div className="flex gap-3 flex-wrap" style={{ fontSize:'0.7rem' }}>
              <span style={{ color:'#c9901e' }}>🪙 {d.goldRange[0].toLocaleString()}-{d.goldRange[1].toLocaleString()}</span>
              <span style={{ color:'#818cf8' }}>⭐ {d.expRange[0].toLocaleString()}exp</span>
              {d.diamondReward > 0 && <span style={{ color:'#38bdf8' }}>💠 {d.diamondReward}</span>}
              {d.spiritReward > 0 && <span style={{ color:'#b06ef3', fontWeight:700 }}>🔮 {d.spiritReward} 灵石</span>}
            </div>
          </div>
          <div style={{ textAlign:'right', flexShrink:0 }}>
            <div style={{ fontSize:'0.7rem', color: locked ? '#f87171' : '#4ade80', marginBottom:2 }}>
              {locked ? `🔒 需要Lv.${d.lvReq}` : `✅ Lv.${d.lvReq}`}
            </div>
            <div style={{ fontSize:'0.65rem', color:'#5a6880' }}>
              怪物: Lv.{Math.min(...d.monsters.map(m=>m.lvl))}-{maxMon}
            </div>
            {tooHigh && !locked && (
              <div style={{ fontSize:'0.62rem', color:'#f87171' }}>等级差过大!</div>
            )}
            <div style={{ fontSize:'0.65rem', color:'#3a4060', marginTop:2 }}>
              通关: {player!.cleared[d.id] || 0}次
            </div>
          </div>
        </div>
        <div className="flex gap-1 mt-2" style={{ fontSize:'0.7rem', color:'#5a6880' }}>
          {d.monsters.map((m, i) => (
            <span key={i} style={{ background:'#0a0c18', border:'1px solid #1a1e3a', borderRadius:4, padding:'1px 6px' }}>
              {m.icon} {m.zh} Lv.{m.lvl}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding:24, maxWidth:900, margin:'0 auto' }}>
      <h2 className="section-title">⚔️ 副本 Dungeons</h2>

      <div className="card mb-4" style={{ padding:'10px 16px', display:'flex', gap:16, flexWrap:'wrap', fontSize:'0.78rem' }}>
        <span style={{ color:'#8090b0' }}>当前等级: <strong style={{ color:'#c9d0e8' }}>Lv.{player!.lvl}</strong></span>
        <span style={{ color:'#8090b0' }}>可挑战: 最高怪物 <strong style={{ color:'#4ade80' }}>Lv.{player!.lvl + 5}</strong></span>
        <span style={{ color:'#8090b0' }}>总计: <strong style={{ color:'#c9d0e8' }}>{Object.values(player!.cleared).reduce((a,b)=>a+b,0)} 次通关</strong></span>
        <span style={{ color:'#f87171', fontSize:'0.72rem' }}>⚠️ 不能挑战比你等级高5级以上的副本！</span>
      </div>

      <div className="section-title mt-4">普通副本 Normal Dungeons</div>
      <div className="flex flex-col gap-3 mb-6">
        {normal.map(d => <DungeonCard key={d.id} d={d} />)}
      </div>

      <div className="section-title">🌟 特殊副本 Special Dungeons (Lv.100+ required)</div>
      <div className="card mb-3" style={{ padding:'10px 14px', fontSize:'0.75rem', color:'#8090b0' }}>
        🔮 特殊副本需要100级以上才能解锁。通关可获得大量<span style={{ color:'#b06ef3', fontWeight:700 }}>灵石</span>和稀有装备！
      </div>
      <div className="flex flex-col gap-3">
        {special.map(d => <DungeonCard key={d.id} d={d} />)}
      </div>
    </div>
  );
}
