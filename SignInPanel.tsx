import { useGame } from '../store';
import { SIGNIN_REWARDS, MONTHLY_BONUS } from '../data';

export default function SignInPanel() {
  const { dispatch, player } = useGame();
  if (!player) return null;

  const today = new Date().toDateString();
  const claimedToday = player.signDate === today;
  const streak = player.signStreak;
  const cycleDay = ((streak - 1) % 7) + 1;  // which day in current 7-day cycle
  const nextRewardIdx = claimedToday ? (cycleDay % 7) : ((cycleDay - 1) % 7);
  const daysUntilMonthly = 30 - (streak % 30);

  return (
    <div style={{ padding:24, maxWidth:800, margin:'0 auto' }}>
      <h2 className="section-title">📅 每日签到 Daily Sign-In</h2>

      {/* Status */}
      <div className="card mb-5" style={{ padding:20 }}>
        <div className="flex items-center gap-4 flex-wrap">
          <div style={{ textAlign:'center' }}>
            <div className="font-display text-3xl font-black" style={{ color:'#c9901e' }}>{streak}</div>
            <div style={{ fontSize:'0.72rem', color:'#6878a0' }}>连续签到天数</div>
          </div>
          <div style={{ height:50, width:1, background:'#1a1e3a' }} />
          <div style={{ textAlign:'center' }}>
            <div className="font-display text-3xl font-black" style={{ color:'#38bdf8' }}>{player.signTotal}</div>
            <div style={{ fontSize:'0.72rem', color:'#6878a0' }}>累计签到</div>
          </div>
          <div style={{ height:50, width:1, background:'#1a1e3a' }} />
          <div style={{ textAlign:'center' }}>
            <div className="font-display text-3xl font-black" style={{ color:'#b06ef3' }}>{player.spirit}</div>
            <div style={{ fontSize:'0.72rem', color:'#6878a0' }}>当前灵石</div>
          </div>
          <div style={{ flex:1, textAlign:'right' }}>
            {claimedToday ? (
              <div style={{ color:'#4ade80', fontWeight:600 }}>✅ 今日已签到！</div>
            ) : (
              <button className="btn-gold" style={{ fontSize:'1rem', padding:'10px 24px' }} onClick={() => dispatch({ type:'CLAIM_SIGNIN' })}>
                📅 立即签到 Check In
              </button>
            )}
            <div style={{ fontSize:'0.7rem', color:'#5a6880', marginTop:4 }}>
              距月签奖励: {daysUntilMonthly} 天
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Cycle */}
      <div className="section-title">7天奖励周期 7-Day Reward Cycle</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:8, marginBottom:20 }}>
        {SIGNIN_REWARDS.map((r, i) => {
          const dayNum = i + 1;
          const isClaimed = claimedToday ? dayNum <= cycleDay : dayNum < cycleDay;
          const isToday   = !claimedToday && dayNum === cycleDay;
          const isFuture  = dayNum > cycleDay;

          return (
            <div
              key={i}
              className={`signin-day ${isClaimed ? 'claimed' : isToday ? 'today' : 'future'}`}
              style={{ minHeight:100, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4 }}
            >
              <div style={{ fontSize:'0.65rem', fontWeight:600, color: isToday ? '#c9901e' : isClaimed ? '#4ade80' : '#4a5880' }}>
                {r.label}
              </div>
              {isClaimed && <div style={{ fontSize:'1rem' }}>✅</div>}
              {(isToday || isFuture) && (
                <>
                  <div style={{ fontSize:'0.7rem', color:'#c9901e' }}>🪙 {r.gold.toLocaleString()}</div>
                  {r.diamond > 0 && <div style={{ fontSize:'0.7rem', color:'#38bdf8' }}>💠 {r.diamond}</div>}
                  {r.spirit > 0 && (
                    <div style={{ fontSize:'0.8rem', fontWeight:700, color:'#b06ef3' }}>🔮 {r.spirit}</div>
                  )}
                </>
              )}
              {isToday && !claimedToday && (
                <div style={{ fontSize:'0.6rem', background:'#c9901e', color:'#07080f', borderRadius:3, padding:'1px 4px', fontWeight:700 }}>
                  TODAY
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Monthly Bonus */}
      <div className="card" style={{ padding:20, border:'1px solid #c9901e44', background:'linear-gradient(135deg,#180e05,#0d0f1e)' }}>
        <div className="font-display text-sm font-bold mb-3" style={{ color:'#c9901e' }}>
          🎊 月签到特别奖励 Monthly Bonus (每30天连续签到)
        </div>
        <div className="flex gap-6 flex-wrap">
          <div style={{ textAlign:'center' }}>
            <div className="font-display text-xl font-bold" style={{ color:'#c9901e' }}>{MONTHLY_BONUS.gold.toLocaleString()}</div>
            <div style={{ fontSize:'0.7rem', color:'#6878a0' }}>🪙 金币</div>
          </div>
          <div style={{ textAlign:'center' }}>
            <div className="font-display text-xl font-bold" style={{ color:'#38bdf8' }}>{MONTHLY_BONUS.diamond.toLocaleString()}</div>
            <div style={{ fontSize:'0.7rem', color:'#6878a0' }}>💠 钻石</div>
          </div>
          <div style={{ textAlign:'center' }}>
            <div className="font-display text-xl font-bold shimmer-spirit">{MONTHLY_BONUS.spirit}</div>
            <div style={{ fontSize:'0.7rem', color:'#6878a0' }}>🔮 灵石</div>
          </div>
        </div>
        <div className="mt-3" style={{ fontSize:'0.75rem', color:'#5a6880' }}>
          进度: {streak % 30} / 30 天连续签到
          <div style={{ height:6, borderRadius:3, background:'#1a1e3a', overflow:'hidden', marginTop:6 }}>
            <div style={{ height:'100%', borderRadius:3, background:'linear-gradient(90deg,#7c3aed,#b06ef3)', width:`${((streak % 30) / 30) * 100}%`, transition:'width 0.5s' }} />
          </div>
        </div>
      </div>

      {/* Sign-in Tips */}
      <div className="card mt-4" style={{ padding:16 }}>
        <div className="section-title" style={{ fontSize:'0.85rem' }}>💡 签到说明 Sign-In Guide</div>
        <ul style={{ fontSize:'0.75rem', color:'#6878a0', lineHeight:1.8, paddingLeft:16 }}>
          <li>每天可以签到一次，奖励按7天为一周期循环</li>
          <li>第5天开始可获得<span style={{ color:'#b06ef3' }}>灵石</span>，第7天最多（10灵石）</li>
          <li>连续签到30天可获得丰厚的<span style={{ color:'#b06ef3' }}>月签到奖励</span>（50灵石）</li>
          <li>断签后重新计算连续天数（但累计总天数保留）</li>
          <li><span style={{ color:'#b06ef3' }}>灵石</span>是最稀有的货币，用于购买顶级符石和进行神圣抽奖</li>
          <li>100级以上通关特殊副本也可获得灵石</li>
        </ul>
      </div>
    </div>
  );
}
