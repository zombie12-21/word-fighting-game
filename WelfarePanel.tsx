import { useGame } from '../store';
import { DAILY_TASKS, WEEKLY_TASKS } from '../data';

const VIP_PERKS = [
  { vip:0, name:'普通玩家', color:'#9ca3af', perks:['基础游戏功能'] },
  { vip:1, name:'VIP 1',   color:'#60a5fa', perks:['副本金币 +10%', '签到奖励 ×1.1'] },
  { vip:3, name:'VIP 3',   color:'#c084fc', perks:['副本金币 +20%', '每日签到灵石 +1', '背包 +50格'] },
  { vip:5, name:'VIP 5',   color:'#fb923c', perks:['副本金币 +30%', '每日灵石 +2', '技能书折扣 20%', '专属外观'] },
  { vip:8, name:'VIP 8',   color:'#fb923c', perks:['副本金币 +50%', '每日灵石 +3', '特殊副本难度 -10%'] },
  { vip:10,name:'VIP 10',  color:'#f87171', perks:['副本金币 ×2', '每日灵石 +5', '全商店九折', '专属称号', '特殊灵石副本'] },
];

export default function WelfarePanel() {
  const { player, dispatch } = useGame();
  if (!player) return null;

  const today = new Date().toDateString();
  const claimedSignin = player.signDate === today;

  function TaskRow({ task, done }: { task: typeof DAILY_TASKS[0]; done: boolean }) {
    return (
      <div
        className="card2"
        style={{
          padding:'10px 14px', display:'flex', alignItems:'center', gap:12,
          opacity: done ? 0.65 : 1,
        }}
      >
        <div style={{ flex:1 }}>
          <div style={{ fontSize:'0.82rem', fontWeight:600, color:'#c9d0e8' }}>{task.zh}</div>
          <div style={{ fontSize:'0.68rem', color:'#6878a0' }}>{task.name}</div>
          <div className="flex gap-3 mt-1" style={{ fontSize:'0.7rem' }}>
            {task.gold > 0 && <span style={{ color:'#c9901e' }}>🪙 {task.gold}</span>}
            {task.diamond > 0 && <span style={{ color:'#38bdf8' }}>💠 {task.diamond}</span>}
            {task.spirit > 0 && <span style={{ color:'#b06ef3' }}>🔮 {task.spirit}</span>}
          </div>
        </div>
        <button
          className={done ? 'btn-ghost' : 'btn-gold'}
          style={{ padding:'5px 12px', fontSize:'0.75rem', minWidth:60 }}
          disabled={done || !player!.dailyTasksDone.includes(task.id)}
          onClick={() => !done && dispatch({ type:'CLAIM_DAILY', taskId: task.id })}
        >
          {done ? '已领取 ✅' : player!.dailyTasksDone.includes(task.id) ? '领取 →' : '未完成'}
        </button>
      </div>
    );
  }

  function WeeklyRow({ task }: { task: typeof WEEKLY_TASKS[0] }) {
    const done = false; // Simplified
    return (
      <div className="card2" style={{ padding:'10px 14px', display:'flex', alignItems:'center', gap:12, opacity:0.7 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:'0.82rem', fontWeight:600, color:'#c9d0e8' }}>{task.zh}</div>
          <div style={{ fontSize:'0.68rem', color:'#6878a0' }}>{task.desc}</div>
          <div className="flex gap-3 mt-1" style={{ fontSize:'0.7rem' }}>
            {task.gold > 0 && <span style={{ color:'#c9901e' }}>🪙 {task.gold}</span>}
            {task.diamond > 0 && <span style={{ color:'#38bdf8' }}>💠 {task.diamond}</span>}
            {task.spirit > 0 && <span style={{ color:'#b06ef3' }}>🔮 {task.spirit}</span>}
          </div>
        </div>
        <button className="btn-ghost" disabled style={{ padding:'5px 12px', fontSize:'0.75rem', minWidth:60 }}>
          进行中
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding:24, maxWidth:900, margin:'0 auto' }}>
      <h2 className="section-title">🎁 福利中心 Welfare Center</h2>

      <div className="flex gap-5" style={{ flexWrap:'wrap' }}>
        {/* Daily Tasks */}
        <div style={{ flex:'1 1 360px' }}>
          <div className="section-title">📋 每日任务 Daily Tasks</div>
          <div className="flex flex-col gap-2 mb-6">
            {DAILY_TASKS.map(task => {
              const done = player!.dailyTasksDone.includes(task.id);
              return <TaskRow key={task.id} task={task} done={done} />;
            })}
          </div>

          {/* Weekly Tasks */}
          <div className="section-title">📆 周常任务 Weekly Tasks</div>
          <div className="flex flex-col gap-2 mb-6">
            {WEEKLY_TASKS.map(task => <WeeklyRow key={task.id} task={task} />)}
          </div>

          {/* Quick actions */}
          <div className="section-title">⚡ 快捷操作 Quick Actions</div>
          <div className="flex flex-col gap-2">
            <button
              className={claimedSignin ? 'btn-ghost' : 'btn-gold'}
              disabled={claimedSignin}
              onClick={() => dispatch({ type:'CLAIM_SIGNIN' })}
              style={{ fontSize:'0.85rem' }}
            >
              📅 {claimedSignin ? '今日已签到 ✅' : '每日签到 Daily Check-In'}
            </button>
            <button
              className="btn-ghost"
              onClick={() => dispatch({ type:'SET_TAB', tab:'dungeon' })}
              style={{ fontSize:'0.85rem' }}
            >
              ⚔️ 前往副本 Go to Dungeon
            </button>
            <button
              className="btn-ghost"
              onClick={() => dispatch({ type:'SET_TAB', tab:'gacha' })}
              style={{ fontSize:'0.85rem' }}
            >
              🎰 前往抽奖 Go to Gacha
            </button>
          </div>
        </div>

        {/* Right column */}
        <div style={{ flex:'1 1 280px' }}>
          {/* VIP System */}
          <div className="section-title">🌟 VIP系统 VIP System</div>
          <div className="card mb-4" style={{ padding:16 }}>
            <div className="flex items-center gap-3 mb-4">
              <div style={{
                width:50, height:50, borderRadius:'50%',
                background: player.vip > 0 ? 'linear-gradient(135deg,#c9901e,#f0c040)' : 'linear-gradient(135deg,#252a50,#1a1e3a)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'1.5rem',
              }}>
                {player.vip === 0 ? '👤' : '👑'}
              </div>
              <div>
                <div className="font-display text-sm font-bold" style={{ color:'#c9d0e8' }}>{player.name}</div>
                <div style={{ fontSize:'0.75rem', color: player.vip > 0 ? '#c9901e' : '#5a6880' }}>
                  {player.vip === 0 ? '普通玩家' : `VIP ${player.vip}`}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {VIP_PERKS.map(v => (
                <div
                  key={v.vip}
                  style={{
                    padding:'8px 10px', borderRadius:6, border:`1px solid ${v.color}44`,
                    background: player.vip >= v.vip ? `${v.color}12` : '#0a0c18',
                    opacity: player.vip >= v.vip ? 1 : 0.5,
                  }}
                >
                  <div style={{ fontSize:'0.75rem', fontWeight:700, color: v.color, marginBottom:3 }}>{v.name}</div>
                  {v.perks.map((p, i) => (
                    <div key={i} style={{ fontSize:'0.68rem', color:'#6878a0' }}>• {p}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Events */}
          <div className="section-title">🎉 限时活动 Events</div>
          <div className="flex flex-col gap-2">
            {[
              { name:'新手七日礼包', zh:'新手好礼', icon:'🎁', desc:'登录7天领取丰厚奖励', reward:'7日登录奖励', color:'#4ade80' },
              { name:'冒险家基金',  zh:'冒险基金', icon:'💰', desc:'通关副本累计获得额外奖励', reward:'副本金币×1.5', color:'#c9901e' },
              { name:'灵石双倍',   zh:'灵石双倍', icon:'🔮', desc:'特定时间段灵石获取翻倍', reward:'灵石×2', color:'#b06ef3' },
              { name:'符石大促',   zh:'符石折扣', icon:'⚡', desc:'全部符石九折优惠', reward:'符石-10%', color:'#60a5fa' },
            ].map(event => (
              <div
                key={event.name}
                className="card2"
                style={{ padding:'10px 12px', border:`1px solid ${event.color}33`, background:`${event.color}08` }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ fontSize:'1.4rem' }}>{event.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'0.78rem', fontWeight:600, color: event.color }}>{event.zh}</div>
                    <div style={{ fontSize:'0.65rem', color:'#5a6880' }}>{event.desc}</div>
                  </div>
                  <div style={{ fontSize:'0.68rem', color:'#4ade80', fontWeight:600 }}>{event.reward}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="card mt-4" style={{ padding:14 }}>
            <div className="section-title" style={{ fontSize:'0.82rem' }}>📊 账号统计</div>
            <div className="flex flex-col gap-2" style={{ fontSize:'0.75rem' }}>
              {[
                ['等级', `Lv.${player!.lvl}`],
                ['副本通关', `${Object.values(player!.cleared).reduce((a,b)=>a+b,0)} 次`],
                ['签到天数', `${player.signTotal} 天`],
                ['连续签到', `${player.signStreak} 天`],
                ['装备件数', `${player.bag.length + Object.keys(player.equip).length} 件`],
                ['学会技能', `${player.learnedSkills.length} 个`],
                ['拥有符石', `${player.runes.length} 枚`],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between" style={{ padding:'3px 0', borderBottom:'1px solid #1a1e3a' }}>
                  <span style={{ color:'#6878a0' }}>{label}</span>
                  <span style={{ color:'#c9d0e8', fontWeight:600 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
