import { useState } from 'react';
import { useGame } from '../store';
import type { EquipItem, Slot, Stat } from '../types';
import { EQUIP_DEFS } from '../data';

const Q_COLOR: Record<string, string> = {
  normal:'#9ca3af', magic:'#4ade80', rare:'#60a5fa', epic:'#c084fc', legendary:'#fb923c', divine:'#f87171',
};
const Q_LABEL: Record<string, string> = {
  normal:'普通', magic:'魔法', rare:'稀有', epic:'史诗', legendary:'传说', divine:'神圣',
};

const STAT_ICONS: Record<string, string> = {
  atk:'⚔️', def:'🛡️', hp:'❤️', spd:'💨', crit:'💥', critDmg:'⚡', dodge:'🌬️',
};

function ItemCard({ item, selected, onClick }: { item: EquipItem; selected: boolean; onClick: () => void }) {
  const color = Q_COLOR[item.quality];
  return (
    <div
      className={`item-card qbg-${item.quality}`}
      style={{ borderColor: selected ? '#c9901e' : `${color}44`, cursor:'pointer' }}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <div style={{ fontSize:'1.8rem', lineHeight:1 }}>{item.icon}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:'0.78rem', fontWeight:700, color, lineHeight:1.3, wordBreak:'break-word' }}>{item.zh}</div>
          <div style={{ fontSize:'0.65rem', color:'#5a6880' }}>{item.name}</div>
          <div style={{ fontSize:'0.62rem', color:'#5a6880' }}>Lv.{item.lvReq} 需求</div>
        </div>
      </div>
      {/* Runes */}
      <div className="flex gap-1 mt-2">
        {item.runes.map((r, i) => (
          <div key={i} className={`rune-socket ${r ? 'filled' : ''}`} style={{ fontSize:'0.8rem' }} title={r ? r.zh : '空符石槽'}>
            {r ? r.icon : '○'}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InvPanel() {
  const { player, dispatch } = useGame();
  const [selected, setSelected] = useState<EquipItem | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [socketTarget, setSocketTarget] = useState<{ iid: string; slot: 0 | 1 } | null>(null);

  if (!player) return null;

  const slots: Slot[] = ['weapon','offhand','helmet','armor','gloves','boots','belt','ring1','ring2','necklace'];
  const filtered = filter === 'all' ? player.bag : player.bag.filter(i => i.quality === filter || i.slot === filter);

  function StatRow({ stat, val }: { stat: string; val: number }) {
    return (
      <div className="flex justify-between items-center" style={{ fontSize:'0.75rem', padding:'3px 0' }}>
        <span style={{ color:'#6878a0' }}>{STAT_ICONS[stat]} {stat}</span>
        <span style={{ color:'#c9d0e8', fontWeight:600 }}>{val > 0 ? `+${val}` : val}</span>
      </div>
    );
  }

  const isEquipped = (item: EquipItem) => Object.values(player.equip).some(e => e?.iid === item.iid);

  return (
    <div style={{ padding:24, maxWidth:900, margin:'0 auto' }}>
      <h2 className="section-title">🎒 背包 Inventory ({player.bag.length} items)</h2>

      <div className="flex gap-6" style={{ flexWrap:'wrap' }}>

        {/* ── Item Grid ── */}
        <div style={{ flex:1, minWidth:280 }}>
          {/* Filter */}
          <div className="flex gap-2 flex-wrap mb-3">
            {['all','normal','magic','rare','epic','legendary','divine'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding:'3px 10px', borderRadius:4, fontSize:'0.72rem',
                  background: filter === f ? '#1a1e3a' : 'transparent',
                  border: `1px solid ${filter === f ? '#c9901e' : '#1a1e3a'}`,
                  color: f === 'all' ? '#c9d0e8' : (Q_COLOR[f] || '#c9d0e8'),
                }}
              >
                {f === 'all' ? '全部' : Q_LABEL[f] || f}
              </button>
            ))}
          </div>

          {player.bag.length === 0 ? (
            <div className="card" style={{ padding:32, textAlign:'center', color:'#3a4060' }}>
              <div style={{ fontSize:'3rem', marginBottom:8 }}>🎒</div>
              <div>背包是空的 Bag is empty</div>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(130px,1fr))', gap:8 }}>
              {filtered.map(item => (
                <ItemCard
                  key={item.iid}
                  item={item}
                  selected={selected?.iid === item.iid}
                  onClick={() => setSelected(selected?.iid === item.iid ? null : item)}
                />
              ))}
            </div>
          )}

          {/* Rune inventory */}
          {player.runes.length > 0 && (
            <div className="mt-6">
              <div className="section-title">符石背包 Rune Bag ({player.runes.length})</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px,1fr))', gap:8 }}>
                {player.runes.map((r, idx) => (
                  <div
                    key={idx}
                    className={`item-card qbg-${r.quality}`}
                    style={{ borderColor:`${Q_COLOR[r.quality]}44`, cursor: socketTarget ? 'pointer' : 'default' }}
                    onClick={() => {
                      if (socketTarget) {
                        dispatch({ type:'SOCKET_RUNE', targetIid: socketTarget.iid, slot: socketTarget.slot, runeIdx: idx, targetType:'equip' });
                        setSocketTarget(null);
                      }
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <span style={{ fontSize:'1.4rem' }}>{r.icon}</span>
                      <div>
                        <div style={{ fontSize:'0.75rem', fontWeight:700, color: Q_COLOR[r.quality] }}>{r.zh}</div>
                        <div style={{ fontSize:'0.65rem', color:'#6878a0' }}>{r.desc}</div>
                        {socketTarget && <div style={{ fontSize:'0.65rem', color:'#c9901e', marginTop:4 }}>点击镶嵌 →</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Item Detail ── */}
        {selected && (
          <div className="card animate-fadein" style={{ width:240, padding:16, alignSelf:'flex-start', position:'sticky', top:24 }}>
            <div className={`q-${selected.quality} font-display text-base font-bold mb-1`}>{selected.zh}</div>
            <div style={{ fontSize:'0.7rem', color:'#5a6880', marginBottom:8 }}>{selected.name} · {selected.slot}</div>
            <div style={{ fontSize:'0.72rem', color:'#8090b0', marginBottom:8 }}>
              需要等级: {selected.lvReq} | 品质: <span className={`q-${selected.quality}`}>{Q_LABEL[selected.quality]}</span>
            </div>

            {/* Stats */}
            <div className="card2 p-2 mb-3">
              {Object.entries(selected.stats).map(([k, v]) => v ? <StatRow key={k} stat={k} val={v} /> : null)}
            </div>

            {/* Rune slots */}
            <div className="mb-3">
              <div style={{ fontSize:'0.72rem', color:'#c9901e', marginBottom:6 }}>符文槽 Rune Slots</div>
              {selected.runes.map((r, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <div className={`rune-socket ${r ? 'filled' : ''}`} style={{ flexShrink:0 }}>
                    {r ? r.icon : i + 1}
                  </div>
                  {r ? (
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'0.7rem', color: Q_COLOR[r.quality], fontWeight:600 }}>{r.zh}</div>
                      <div style={{ fontSize:'0.62rem', color:'#5a6880' }}>{r.desc}</div>
                      <button
                        onClick={() => dispatch({ type:'REMOVE_RUNE', targetIid: selected.iid, slot: i as 0|1, targetType:'equip' })}
                        style={{ fontSize:'0.62rem', color:'#f87171', background:'none', border:'none', padding:0, marginTop:2, cursor:'pointer' }}
                      >
                        移除 Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize:'0.7rem', color:'#3a4060' }}>Empty slot</div>
                      {player.runes.length > 0 && (
                        <button
                          onClick={() => setSocketTarget(socketTarget?.iid === selected.iid && socketTarget.slot === i ? null : { iid: selected.iid, slot: i as 0|1 })}
                          style={{
                            fontSize:'0.62rem', color:'#b06ef3', background:'none', border:'none', padding:0, marginTop:2, cursor:'pointer',
                            textDecoration: socketTarget?.iid === selected.iid && socketTarget.slot === i ? 'underline' : 'none',
                          }}
                        >
                          {socketTarget?.iid === selected.iid && socketTarget.slot === i ? '选择符石...' : '镶嵌符石'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {isEquipped(selected) ? (
                <button className="btn-ghost text-sm" onClick={() => { dispatch({ type:'UNEQUIP', slot: selected.slot }); }}>
                  卸下 Unequip
                </button>
              ) : (
                <button className="btn-gold text-sm" onClick={() => { dispatch({ type:'EQUIP', item: selected }); }}>
                  装备 Equip
                </button>
              )}
              <button
                className="btn-red text-sm"
                onClick={() => { dispatch({ type:'DISCARD', iid: selected.iid }); setSelected(null); }}
              >
                丢弃 Discard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
