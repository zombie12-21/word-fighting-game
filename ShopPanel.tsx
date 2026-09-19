import { useGame } from '../store';
import { RUNES, EQUIP_DEFS, SKILL_DEFS } from '../data';
import type { GameState } from '../types';

const SKILL_PRICES: Record<string, number> = {
  sk_fb:2000, sk_ia:2000, sk_ts:5000, sk_hl:5000, sk_bk:8000,
  sk_ss:8000, sk_mf:15000, sk_dr:15000, sk_ds:20000, sk_sb:30000,
  sk_tw:35000, sk_cb:50000, sk_bm:60000, sk_hw:100000,
};

const Q_COLOR: Record<string, string> = {
  normal:'#9ca3af', magic:'#4ade80', rare:'#60a5fa', epic:'#c084fc', legendary:'#fb923c', divine:'#f87171',
};
const Q_LABEL: Record<string, string> = {
  normal:'白', magic:'绿', rare:'蓝', epic:'紫', legendary:'橙', divine:'红',
};

const EQUIP_PRICE: Record<string, number> = {
  normal:1000, magic:3000, rare:8000, epic:20000, legendary:60000, divine:200000,
};
const EQUIP_CURRENCY: Record<string, string> = {
  normal:'gold', magic:'gold', rare:'gold', epic:'gold', legendary:'diamond', divine:'spirit',
};

export default function ShopPanel() {
  const { state, dispatch, player } = useGame();
  if (!player) return null;

  const tab = state.shopTab;

  const CurrencyIcon = ({ c }: { c: string }) =>
    c === 'gold' ? <>🪙</> : c === 'diamond' ? <>💠</> : <>🔮</>;
  const CurrencyColor = (c: string) =>
    c === 'gold' ? '#c9901e' : c === 'diamond' ? '#38bdf8' : '#b06ef3';

  function visitShop() {
    if (!player!.dailyTasksDone.includes('dt5')) {
      dispatch({ type:'CLAIM_DAILY', taskId: 'dt5' });
    }
  }

  return (
    <div style={{ padding:24, maxWidth:900, margin:'0 auto' }} onClick={visitShop}>
      <h2 className="section-title">🏪 商店 Shop</h2>

      {/* Balance */}
      <div className="card mb-4" style={{ padding:'10px 16px', display:'flex', gap:20, flexWrap:'wrap', fontSize:'0.8rem' }}>
        <span>🪙 <span style={{ color:'#c9901e' }}>{player!.gold.toLocaleString()}</span> 金币</span>
        <span>💠 <span style={{ color:'#38bdf8' }}>{player!.diamond.toLocaleString()}</span> 钻石</span>
        <span>🔮 <span style={{ color:'#b06ef3', fontWeight:700 }}>{player!.spirit}</span> 灵石</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(['runes','equip','skills'] as GameState['shopTab'][]).map(t => (
          <button
            key={t}
            onClick={() => dispatch({ type:'SET_SHOP_TAB', t })}
            style={{
              padding:'6px 16px', borderRadius:6, fontSize:'0.82rem', fontFamily:'Cinzel,serif',
              background: tab === t ? 'linear-gradient(135deg,#141830,#1a1e3a)' : 'transparent',
              border: `1px solid ${tab === t ? '#c9901e' : '#1a1e3a'}`,
              color: tab === t ? '#c9901e' : '#6878a0',
            }}
          >
            {t === 'runes' ? '💫 符石' : t === 'equip' ? '⚔️ 装备' : '📖 技能书'}
          </button>
        ))}
      </div>

      {/* ── Runes Tab ── */}
      {tab === 'runes' && (
        <div>
          <div className="card mb-3" style={{ padding:'10px 14px', fontSize:'0.75rem', color:'#8090b0' }}>
            🔮 用<span style={{ color:'#b06ef3', fontWeight:700 }}>灵石</span>购买符石，镶嵌到装备上增强战斗能力。
            灵石极其稀有——可通过每日签到和特殊副本（100级+）获得。
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:10 }}>
            {RUNES.map(r => {
              const canAfford = player!.spirit >= r.cost;
              return (
                <div key={r.id} className={`item-card qbg-${r.quality}`} style={{ borderColor:`${Q_COLOR[r.quality]}44` }}>
                  <div className="flex items-start gap-3">
                    <span style={{ fontSize:'1.8rem' }}>{r.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'0.78rem', fontWeight:700, color: Q_COLOR[r.quality] }}>{r.zh}</div>
                      <div style={{ fontSize:'0.65rem', color:'#5a6880' }}>{r.name}</div>
                      <div style={{ fontSize:'0.7rem', color:'#8090b0', margin:'4px 0' }}>{r.desc}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span style={{ fontSize:'0.75rem', color:'#b06ef3', fontWeight:700 }}>🔮 {r.cost} 灵石</span>
                        <button
                          className="btn-spirit"
                          style={{ padding:'4px 10px', fontSize:'0.72rem', opacity: canAfford ? 1 : 0.45 }}
                          disabled={!canAfford}
                          onClick={() => dispatch({ type:'BUY_RUNE', id: r.id })}
                        >
                          购买
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Equipment Tab ── */}
      {tab === 'equip' && (
        <div>
          <div className="card mb-3" style={{ padding:'10px 14px', fontSize:'0.75rem', color:'#8090b0' }}>
            直接从商店购买装备放入背包。传说级装备需要<span style={{ color:'#38bdf8' }}>钻石</span>，神圣级需要<span style={{ color:'#b06ef3' }}>灵石</span>。
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:10 }}>
            {EQUIP_DEFS.map(def => {
              const price = EQUIP_PRICE[def.quality];
              const currency = EQUIP_CURRENCY[def.quality];
              const bal = currency === 'gold' ? player!.gold : currency === 'diamond' ? player!.diamond : player!.spirit;
              const canAfford = bal >= price;
              const meetLvl = player!.lvl >= def.lvReq;
              const color = Q_COLOR[def.quality];

              return (
                <div key={def.id} className={`item-card qbg-${def.quality}`} style={{ borderColor:`${color}44` }}>
                  <div className="flex items-start gap-2 mb-2">
                    <span style={{ fontSize:'1.6rem' }}>{def.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'0.78rem', fontWeight:700, color }}>{def.zh}</div>
                      <div style={{ fontSize:'0.62rem', color:'#5a6880' }}>{def.name} · {def.slot}</div>
                      <div style={{ fontSize:'0.62rem', color: meetLvl ? '#4ade80' : '#f87171' }}>Lv.{def.lvReq} 需求</div>
                    </div>
                  </div>
                  <div style={{ fontSize:'0.68rem', color:'#6878a0', marginBottom:8 }}>
                    {Object.entries(def.stats).map(([k,v]) => v ? `${k}:+${v} ` : '').join('')}
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize:'0.75rem', color: CurrencyColor(currency), fontWeight:700 }}>
                      <CurrencyIcon c={currency} /> {price.toLocaleString()}
                    </span>
                    <button
                      className={currency === 'spirit' ? 'btn-spirit' : currency === 'diamond' ? 'btn-diamond' : 'btn-gold'}
                      style={{ padding:'4px 10px', fontSize:'0.72rem', opacity: canAfford && meetLvl ? 1 : 0.45 }}
                      disabled={!canAfford || !meetLvl}
                      onClick={() => dispatch({ type:'BUY_EQUIP', defId: def.id })}
                    >
                      购买
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Skills Tab ── */}
      {tab === 'skills' && (
        <div>
          <div className="card mb-3" style={{ padding:'10px 14px', fontSize:'0.75rem', color:'#8090b0' }}>
            购买技能书后，在角色面板中学习技能。战斗中可使用学会的技能（消耗MP）。
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:10 }}>
            {SKILL_DEFS.map(sk => {
              const price = SKILL_PRICES[sk.id] || 5000;
              const owned  = player.ownedSkills.includes(sk.id);
              const learned = player.learnedSkills.includes(sk.id);
              const meetLvl = player!.lvl >= sk.lvReq;
              const canBuy  = !owned && meetLvl && player!.gold >= price;

              return (
                <div key={sk.id} className="item-card" style={{ borderColor: learned ? '#4ade8044' : owned ? '#c084fc44' : '#1a1e3a', background: learned ? '#0a1808' : owned ? '#150d28' : '#0d0f1e' }}>
                  <div className="flex items-start gap-3">
                    <span style={{ fontSize:'2rem' }}>{sk.icon}</span>
                    <div style={{ flex:1 }}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span style={{ fontSize:'0.8rem', fontWeight:700, color: learned ? '#4ade80' : '#c9d0e8' }}>{sk.zh}</span>
                        <span style={{ fontSize:'0.62rem', color:'#5a6880' }}>{sk.name}</span>
                        {learned && <span style={{ fontSize:'0.6rem', background:'#0a2015', color:'#4ade80', border:'1px solid #16a34a44', borderRadius:3, padding:'1px 5px' }}>已学会</span>}
                        {owned && !learned && <span style={{ fontSize:'0.6rem', background:'#150d28', color:'#c084fc', border:'1px solid #7c3aed44', borderRadius:3, padding:'1px 5px' }}>已拥有</span>}
                      </div>
                      <div style={{ fontSize:'0.7rem', color:'#6878a0', margin:'3px 0' }}>{sk.desc}</div>
                      <div className="flex gap-3" style={{ fontSize:'0.68rem', color:'#5a6880' }}>
                        {sk.mp > 0 && <span>MP: {sk.mp}</span>}
                        <span>CD: {sk.cd}回合</span>
                        <span style={{ color: meetLvl ? '#4ade80' : '#f87171' }}>需要Lv.{sk.lvReq}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span style={{ fontSize:'0.75rem', color:'#c9901e', fontWeight:700 }}>🪙 {price.toLocaleString()}</span>
                        <div className="flex gap-1">
                          {owned && !learned && (
                            <button className="btn-spirit" style={{ padding:'3px 8px', fontSize:'0.7rem' }} onClick={() => dispatch({ type:'LEARN_SKILL', defId: sk.id })}>
                              学习
                            </button>
                          )}
                          {!owned && (
                            <button
                              className="btn-gold"
                              style={{ padding:'3px 8px', fontSize:'0.7rem', opacity: canBuy ? 1 : 0.45 }}
                              disabled={!canBuy}
                              onClick={() => dispatch({ type:'BUY_SKILL', defId: sk.id })}
                            >
                              购买
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
