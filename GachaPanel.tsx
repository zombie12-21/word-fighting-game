import { useState } from 'react';
import { useGame } from '../store';
import { GACHA_POOLS } from '../data';
import type { EquipItem } from '../types';

const Q_COLOR: Record<string, string> = {
  normal:'#9ca3af', magic:'#4ade80', rare:'#60a5fa', epic:'#c084fc', legendary:'#fb923c', divine:'#f87171',
};
const Q_LABEL: Record<string, string> = {
  normal:'白·普通', magic:'绿·魔法', rare:'蓝·稀有', epic:'紫·史诗', legendary:'橙·传说', divine:'红·神圣',
};

type PoolKey = keyof typeof GACHA_POOLS;

export default function GachaPanel() {
  const { state, player, dispatch } = useGame();
  const [lastPull, setLastPull] = useState<EquipItem[]>([]);
  const [activePool, setActivePool] = useState<PoolKey>('basic');

  if (!player) return null;

  const pool = GACHA_POOLS[activePool];
  const pity = player.gachaPity[activePool] || 0;
  const balance = activePool === 'basic' ? player.gold : activePool === 'advanced' ? player.diamond : player.spirit;
  const currencyLabel = activePool === 'basic' ? '金币' : activePool === 'advanced' ? '钻石' : '灵石';
  const currencyIcon  = activePool === 'basic' ? '🪙' : activePool === 'advanced' ? '💠' : '🔮';

  function doPull(count: 1 | 10) {
    const cost = pool.cost * count;
    if (balance < cost) return;
    // Get items from bag before
    const bagBefore = new Set((player!.bag || []).map(i => i.iid));
    dispatch({ type:'GACHA', pool: activePool, count });
    // After dispatch, find new items (async via state update)
    // For demo purposes, show from current state (next render)
  }

  // Show recently gained items
  const newItems = player.bag.slice(-10).filter(i => i);

  const pools: { key: PoolKey; icon: string; label: string }[] = [
    { key:'basic',    icon:'🎁', label:'普通抽奖' },
    { key:'advanced', icon:'💫', label:'高级抽奖' },
    { key:'divine',   icon:'⚜️', label:'神圣抽奖' },
  ];

  return (
    <div style={{ padding:24, maxWidth:900, margin:'0 auto' }}>
      <h2 className="section-title">🎰 抽奖 Gacha</h2>

      {/* Pool selector */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {pools.map(p => (
          <button
            key={p.key}
            onClick={() => setActivePool(p.key)}
            style={{
              flex:'1 1 180px', padding:'14px 12px', borderRadius:10, cursor:'pointer',
              border: `2px solid ${activePool === p.key ? '#c9901e' : '#1a1e3a'}`,
              background: activePool === p.key ? 'linear-gradient(135deg,#180e05,#0d0f1e)' : '#0d0f1e',
              transition:'all 0.18s',
            }}
          >
            <div style={{ fontSize:'2rem', marginBottom:4 }}>{p.icon}</div>
            <div className="font-display text-sm font-bold" style={{ color: activePool === p.key ? '#c9901e' : '#c9d0e8' }}>{p.label}</div>
            <div style={{ fontSize:'0.72rem', color:'#6878a0', marginTop:2 }}>{GACHA_POOLS[p.key].desc}</div>
            <div style={{ fontSize:'0.75rem', marginTop:6, color: p.key === 'basic' ? '#c9901e' : p.key === 'advanced' ? '#38bdf8' : '#b06ef3', fontWeight:700 }}>
              {p.key === 'basic' ? '🪙' : p.key === 'advanced' ? '💠' : '🔮'} {GACHA_POOLS[p.key].cost} / 抽
            </div>
          </button>
        ))}
      </div>

      {/* Active pool detail */}
      <div className="card mb-5" style={{ padding:20 }}>
        <div className="flex items-start gap-6 flex-wrap">
          <div style={{ flex:1, minWidth:220 }}>
            <div className="font-display text-base font-bold mb-2" style={{ color:'#c9901e' }}>{pool.icon} {pool.name} · {pool.zh}</div>
            <div style={{ fontSize:'0.8rem', color:'#8090b0', marginBottom:12 }}>{pool.desc}</div>

            {/* Rates */}
            <div style={{ fontSize:'0.75rem', marginBottom:12 }}>
              <div style={{ color:'#c9901e', fontWeight:600, marginBottom:4 }}>概率 Drop Rates</div>
              {pool.divinePct > 0 && <div className="flex justify-between"><span className="q-divine">红·神圣</span><span>{pool.divinePct}%</span></div>}
              {pool.legendaryPct > 0 && <div className="flex justify-between"><span className="q-legendary">橙·传说</span><span>{pool.legendaryPct}%</span></div>}
              {pool.epicPct > 0 && <div className="flex justify-between"><span className="q-epic">紫·史诗</span><span>{pool.epicPct}%</span></div>}
              {pool.rarePct > 0 && <div className="flex justify-between"><span className="q-rare">蓝·稀有</span><span>{pool.rarePct}%</span></div>}
              <div className="flex justify-between" style={{ color:'#6878a0' }}><span>其余·普通/魔法</span><span>其余</span></div>
            </div>

            <div style={{ fontSize:'0.75rem', color:'#b06ef3', marginBottom:8 }}>
              ✨ 保底: 每 {pool.pityAt} 抽必得高品质装备 (当前: {pity}/{pool.pityAt})
            </div>
            <div style={{ height:6, borderRadius:3, background:'#1a1e3a', overflow:'hidden', width:200, marginBottom:12 }}>
              <div style={{ height:'100%', borderRadius:3, background:'linear-gradient(90deg,#7c3aed,#b06ef3)', width:`${(pity / pool.pityAt) * 100}%` }} />
            </div>
          </div>

          {/* Pull buttons */}
          <div style={{ display:'flex', flexDirection:'column', gap:12, alignItems:'center' }}>
            <div style={{ fontSize:'0.78rem', color:'#6878a0', textAlign:'center' }}>
              余额: {currencyIcon} <span style={{ fontWeight:700, color: balance < pool.cost ? '#f87171' : '#c9d0e8' }}>{balance.toLocaleString()}</span> {currencyLabel}
            </div>

            <button
              className={activePool === 'divine' ? 'btn-spirit' : activePool === 'advanced' ? 'btn-diamond' : 'btn-gold'}
              style={{ padding:'12px 28px', fontSize:'0.9rem', minWidth:160 }}
              disabled={balance < pool.cost}
              onClick={() => doPull(1)}
            >
              {currencyIcon} ×1 抽 ({pool.cost.toLocaleString()})
            </button>

            <button
              className={activePool === 'divine' ? 'btn-spirit' : activePool === 'advanced' ? 'btn-diamond' : 'btn-gold'}
              style={{ padding:'12px 28px', fontSize:'0.9rem', minWidth:160 }}
              disabled={balance < pool.cost * 10}
              onClick={() => doPull(10)}
            >
              {currencyIcon} ×10 连抽 ({(pool.cost * 10).toLocaleString()})
            </button>

            <div style={{ fontSize:'0.68rem', color:'#3a4060', textAlign:'center' }}>
              10连抽更推荐
            </div>
          </div>
        </div>
      </div>

      {/* Recent pulls from bag */}
      {newItems.length > 0 && (
        <div>
          <div className="section-title">最近获得 Recent Items</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:8 }}>
            {newItems.slice().reverse().map((item, i) => {
              const color = Q_COLOR[item.quality];
              return (
                <div
                  key={i}
                  className="gacha-card animate-popin"
                  style={{
                    borderColor: color,
                    background: `linear-gradient(135deg, ${color}18, #0d0f1e)`,
                    animationDelay: `${i * 0.05}s`,
                    opacity: 0,
                    animationFillMode: 'forwards',
                  }}
                >
                  <div style={{ fontSize:'2rem', marginBottom:4 }}>{item.icon}</div>
                  <div style={{ fontSize:'0.72rem', fontWeight:700, color }}>{item.zh}</div>
                  <div style={{ fontSize:'0.6rem', color:'#5a6880' }}>{Q_LABEL[item.quality]}</div>
                  <div style={{ fontSize:'0.6rem', color:'#4a5880', marginTop:2 }}>Lv.{item.lvReq}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card mt-5" style={{ padding:16 }}>
        <div className="section-title" style={{ fontSize:'0.85rem' }}>💡 抽奖说明</div>
        <ul style={{ fontSize:'0.75rem', color:'#6878a0', lineHeight:1.8, paddingLeft:16 }}>
          <li>普通抽奖消耗<span style={{ color:'#c9901e' }}>金币</span>，可在副本中获得</li>
          <li>高级抽奖消耗<span style={{ color:'#38bdf8' }}>钻石</span>，通关高难度副本可获得</li>
          <li>神圣抽奖消耗<span style={{ color:'#b06ef3' }}>灵石</span>，可获得最强神圣级装备</li>
          <li>每个抽奖池有独立的保底计数，到达阈值时必出高级物品</li>
          <li>获得的装备会自动进入背包，在背包中可装备或添加符石</li>
        </ul>
      </div>
    </div>
  );
}
