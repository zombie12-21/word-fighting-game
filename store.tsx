import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { GameState, Player, TabId, EquipItem, TreasureItem, Rune, Slot, BattleState, DungeonDef, SkillDef } from './types';
import { EQUIP_DEFS, RUNES, SKILL_DEFS, TREASURE_DEFS, DIVINE_WEAPON_DEFS, DUNGEONS, SIGNIN_REWARDS, MONTHLY_BONUS, GACHA_POOLS, uid } from './data';

// ─── INITIAL STATE ────────────────────────────────────────────────────────────
function newPlayer(name: string): Player {
  return {
    name, lvl:1, exp:0, expNext:100,
    base: { atk:30, def:15, hp:500, spd:10, crit:5, critDmg:150, dodge:3 },
    gold:5000, diamond:100, spirit:0,
    equip:{}, bag:[], runes:[],
    ownedSkills:[], learnedSkills:[], skillCooldowns:{},
    treasures:[], divWeapons:[],
    activeTreasure:null, activeDivWeapon:null,
    signDate:null, signStreak:0, signTotal:0,
    cleared:{}, vip:0, gachaPity:{},
    dailyTasksDone:[], lastDailyReset:null,
  };
}

const INIT: GameState = {
  accounts:{}, user:null, tab:'char', battle:null, toast:null, shopTab:'runes',
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function calcStats(p: Player): Record<string, number> {
  const s = { ...p.base };
  for (const item of Object.values(p.equip)) {
    if (!item) continue;
    for (const [k, v] of Object.entries(item.stats)) {
      s[k as keyof typeof s] = (s[k as keyof typeof s] || 0) + (v || 0);
    }
  }
  const actT = p.treasures.find(t => t.iid === p.activeTreasure);
  if (actT) for (const [k, v] of Object.entries(actT.stats)) s[k as keyof typeof s] = (s[k as keyof typeof s] || 0) + (v || 0);
  const actDW = p.divWeapons.find(w => w.iid === p.activeDivWeapon);
  if (actDW) for (const [k, v] of Object.entries(actDW.stats)) s[k as keyof typeof s] = (s[k as keyof typeof s] || 0) + (v || 0);
  return s;
}

function allRunes(p: Player): Rune[] {
  const out: Rune[] = [];
  for (const item of Object.values(p.equip)) {
    if (!item) continue;
    item.runes.forEach(r => { if (r) out.push(r); });
  }
  return out;
}

function rand(min: number, max: number) { return min + Math.random() * (max - min); }

// ─── BATTLE SIMULATION ────────────────────────────────────────────────────────
function doBattleTurn(state: GameState): GameState {
  if (!state.battle || state.battle.over) return state;
  const b = { ...state.battle };
  const p = state.accounts[state.user!].p;
  const stats = calcStats(p);
  const runes = allRunes(p);
  const monster = b.dungeon.monsters[b.wave];
  const log = [...b.log];

  const push = (text: string, cls: typeof b.log[0]['cls']) => log.push({ text, cls });

  // ── Poison tick ──
  if (b.mPoisonTurns > 0) {
    const poisonDmg = Math.round(b.mHpMax * b.mPoisonDmg / 100);
    b.mHp = Math.max(0, b.mHp - poisonDmg);
    b.mPoisonTurns--;
    push(`☠️ 中毒！${monster.zh} 受到 ${poisonDmg} 点毒伤`, 'player');
  }

  // ── Burn tick ──
  if (b.mBurnTurns > 0) {
    const burnDmg = Math.round(b.mHpMax * b.mBurnDmg / 100);
    b.mHp = Math.max(0, b.mHp - burnDmg);
    b.mBurnTurns--;
    push(`🔥 燃烧！${monster.zh} 受到 ${burnDmg} 点火焰伤害`, 'player');
  }

  // ── Buff tick ──
  if (b.buffTurns > 0) b.buffTurns--;
  if (b.shieldTurns > 0) b.shieldTurns--;

  // ── Player attacks ──
  if (!b.over && b.mHp > 0) {
    let dmg = Math.max(1, stats.atk * (b.buffTurns > 0 ? 1 + b.buffAtk / 100 : 1) - monster.def * 0.5);
    dmg *= rand(0.85, 1.15);

    let isCrit = false;
    let label = '';

    // Heavy strike rune
    const hs = runes.find(r => r.type === 'heavyStrike');
    if (hs && Math.random() * 100 < hs.chance) {
      dmg = dmg * hs.value / 100;
      label += '⚡重击! ';
    }

    // Critical rune
    const crR = runes.find(r => r.type === 'critical');
    if (crR && Math.random() * 100 < crR.chance) {
      dmg = dmg * crR.value / 100;
      isCrit = true; label += '💥暴击! ';
    } else if (Math.random() * 100 < (stats.crit || 5)) {
      dmg = dmg * (stats.critDmg || 150) / 100;
      isCrit = true; label += '💥暴击! ';
    }

    // Berserk rune (below 50% HP)
    const bkR = runes.find(r => r.type === 'berserk');
    if (bkR && b.pHp < b.pHpMax * 0.5) {
      dmg *= 1 + bkR.value / 100;
      label += '🔥狂暴! ';
    }

    // Divine Fury rune
    const dfR = runes.find(r => r.type === 'divineFury');
    if (dfR && Math.random() * 100 < dfR.chance) {
      dmg = dmg * dfR.value / 100;
      isCrit = true; label += '⚜️神怒! ';
    }

    // Spirit Bane rune (ignore defense)
    const sbR = runes.find(r => r.type === 'spiritBane');
    if (sbR && Math.random() * 100 < sbR.chance) {
      dmg = Math.max(1, stats.atk * (b.buffTurns > 0 ? 1 + b.buffAtk / 100 : 1) - monster.def * (1 - sbR.value / 100) * 0.5) * rand(0.85, 1.15);
      label += '🔮灵伤! ';
    }

    dmg = Math.round(dmg);
    b.mHp = Math.max(0, b.mHp - dmg);
    push(`${label}你对 ${monster.zh} 造成 ${dmg} 伤害${isCrit ? ' (暴击)' : ''}`, isCrit ? 'crit' : 'player');

    // Vampiric heal
    const vpR = runes.find(r => r.type === 'vampiric');
    if (vpR && dmg > 0) {
      const heal = Math.round(dmg * vpR.value / 100);
      b.pHp = Math.min(b.pHpMax, b.pHp + heal);
      push(`🩸吸血恢复 ${heal} 点生命`, 'heal');
    }

    // Poison rune
    const pzR = runes.find(r => r.type === 'poison');
    if (pzR && Math.random() * 100 < pzR.chance && b.mPoisonTurns === 0) {
      b.mPoisonTurns = 3;
      b.mPoisonDmg = pzR.value;
      push(`☠️ 成功中毒！持续3回合`, 'player');
    }
  }

  // ── Check monster death ──
  if (b.mHp <= 0 && !b.over) {
    push(`✅ ${monster.zh} 已被击败！`, 'sys');
    b.wave++;

    if (b.wave >= b.dungeon.monsters.length) {
      // Victory!
      const gold = Math.round(rand(b.dungeon.goldRange[0], b.dungeon.goldRange[1]));
      const exp  = Math.round(rand(b.dungeon.expRange[0], b.dungeon.expRange[1]));
      b.gold    += gold;
      b.exp     += exp;
      b.diamond += b.dungeon.diamondReward;
      b.spirit  += b.dungeon.spiritReward;
      b.over = true;
      b.win  = true;
      push(`🏆 副本通关！`, 'sys');
      push(`🎁 获得: ${gold} 金币, ${exp} 经验${b.dungeon.diamondReward ? `, ${b.dungeon.diamondReward} 钻石` : ''}${b.dungeon.spiritReward ? `, ${b.dungeon.spiritReward} 灵石` : ''}`, 'reward');

      // Apply to player
      const accounts = { ...state.accounts };
      let np = { ...accounts[state.user!].p };
      np.gold    += b.gold;
      np.diamond += b.diamond;
      np.spirit  += b.spirit;
      np.exp     += b.exp;
      np.cleared  = { ...np.cleared, [b.dungeon.id]: (np.cleared[b.dungeon.id] || 0) + 1 };

      // Level ups
      while (np.exp >= np.expNext) {
        np.exp    -= np.expNext;
        np.lvl++;
        np.expNext = Math.round(np.expNext * 1.18 + np.lvl * 60);
        np.base    = {
          atk:     np.base.atk     + 5 + Math.floor(np.lvl / 10),
          def:     np.base.def     + 3 + Math.floor(np.lvl / 15),
          hp:      np.base.hp      + 50 + np.lvl * 3,
          spd:     Math.min(100, np.base.spd + 0.5),
          crit:    Math.min(50,  np.base.crit + 0.2),
          critDmg: Math.min(300, np.base.critDmg + 0.5),
          dodge:   Math.min(40,  np.base.dodge + 0.1),
        };
        push(`🎉 等级提升到 ${np.lvl}！`, 'reward');
      }

      accounts[state.user!] = { ...accounts[state.user!], p: np };
      b.log = log.slice(-25);
      return { ...state, accounts, battle: b, toast: { msg: '副本通关！', kind: 'ok' } };
    } else {
      const next = b.dungeon.monsters[b.wave];
      b.mHp = next.hp; b.mHpMax = next.hp;
      b.mPoisonTurns = 0; b.mPoisonDmg = 0;
      b.mBurnTurns = 0; b.mBurnDmg = 0;
      b.mStunTurns = 0;
      push(`⚔️ 新敌人：${next.zh} (Lv.${next.lvl}) HP:${next.hp}`, 'sys');
    }
  }

  // ── Monster attacks player (if not stunned) ──
  if (!b.over && b.mHp > 0) {
    if (b.mStunTurns > 0) {
      b.mStunTurns--;
      push(`⚡ ${monster.zh} 被眩晕，无法行动！`, 'sys');
    } else {
      const cur = b.dungeon.monsters[b.wave] || monster;
      const evR = runes.find(r => r.type === 'evasion');
      const dodged = (evR && Math.random() * 100 < evR.chance) || Math.random() * 100 < (stats.dodge || 3);

      if (dodged) {
        push(`💨 闪避！躲开了 ${cur.zh} 的攻击！`, 'player');
      } else {
        let mDmg = Math.max(1, cur.atk - stats.def * 0.5) * rand(0.85, 1.15);
        const iwR = runes.find(r => r.type === 'ironWall');
        if (iwR) mDmg *= 1 - iwR.value / 100;
        if (b.shieldTurns > 0) mDmg *= 1 - b.shieldPct / 100;
        mDmg = Math.round(mDmg);

        // Divine Shield rune (block lethal blow once)
        const dsR = runes.find(r => r.type === 'divineShield');
        if (dsR && b.pHp - mDmg <= 0 && Math.random() < 0.7) {
          push(`🌟 神盾发动！格挡了致命一击！`, 'crit');
          mDmg = 0;
        }

        b.pHp = Math.max(0, b.pHp - mDmg);
        push(`${cur.zh} 对你造成 ${mDmg} 伤害`, 'enemy');

        // Thorns rune
        const thR = runes.find(r => r.type === 'thorns');
        if (thR && mDmg > 0) {
          const reflected = Math.round(mDmg * thR.value / 100);
          b.mHp = Math.max(0, b.mHp - reflected);
          push(`🌵 荆棘反弹 ${reflected} 伤害`, 'player');
        }
      }
    }
  }

  // ── Check player death ──
  if (b.pHp <= 0) {
    b.over = true; b.win = false;
    push('💀 你已阵亡... 副本失败！', 'sys');
  }

  b.turn++;
  b.log = log.slice(-25);
  return { ...state, battle: b };
}

type GachaPool = { name:string; zh:string; cost:number; currency:'gold'|'diamond'|'spirit'; desc:string; icon:string; ids:string[]; rarePct:number; epicPct:number; legendaryPct:number; divinePct:number; pityAt:number };

// Gacha draw
function gachaDraw(pool: GachaPool, count: number, pity: number): { items: EquipItem[]; newPity: number } {
  const items: EquipItem[] = [];
  let p = pity;

  for (let i = 0; i < count; i++) {
    p++;
    let id: string;
    const roll = Math.random() * 100;
    const isGuarantee = p >= pool.pityAt;

    const def = EQUIP_DEFS.find(d => d.id === pool.ids[0])!;
    let quality = def.quality;

    if (isGuarantee || roll < pool.divinePct) {
      // Pick divine
      const opts = pool.ids.filter(id => { const d = EQUIP_DEFS.find(e => e.id === id); return d?.quality === 'divine'; });
      id = opts.length ? opts[Math.floor(Math.random() * opts.length)] : pool.ids[Math.floor(Math.random() * pool.ids.length)];
      if (isGuarantee) p = 0;
    } else if (roll < pool.divinePct + pool.legendaryPct) {
      const opts = pool.ids.filter(id => { const d = EQUIP_DEFS.find(e => e.id === id); return d?.quality === 'legendary'; });
      id = opts.length ? opts[Math.floor(Math.random() * opts.length)] : pool.ids[Math.floor(Math.random() * pool.ids.length)];
    } else if (roll < pool.divinePct + pool.legendaryPct + pool.epicPct) {
      const opts = pool.ids.filter(id => { const d = EQUIP_DEFS.find(e => e.id === id); return d?.quality === 'epic'; });
      id = opts.length ? opts[Math.floor(Math.random() * opts.length)] : pool.ids[Math.floor(Math.random() * pool.ids.length)];
    } else if (roll < pool.divinePct + pool.legendaryPct + pool.epicPct + pool.rarePct) {
      const opts = pool.ids.filter(id => { const d = EQUIP_DEFS.find(e => e.id === id); return d?.quality === 'rare'; });
      id = opts.length ? opts[Math.floor(Math.random() * opts.length)] : pool.ids[Math.floor(Math.random() * pool.ids.length)];
    } else {
      id = pool.ids[Math.floor(Math.random() * pool.ids.length)];
    }

    const def2 = EQUIP_DEFS.find(d => d.id === id);
    if (def2) items.push({ ...def2, iid: uid(), runes: [null, null] });
  }

  return { items, newPity: p };
}

// ─── ACTIONS ─────────────────────────────────────────────────────────────────
type Action =
  | { type: 'LOGIN'; user: string; pw: string }
  | { type: 'REGISTER'; user: string; pw: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_TAB'; tab: TabId }
  | { type: 'SET_SHOP_TAB'; t: GameState['shopTab'] }
  | { type: 'EQUIP'; item: EquipItem }
  | { type: 'UNEQUIP'; slot: Slot }
  | { type: 'DISCARD'; iid: string }
  | { type: 'BUY_RUNE'; id: string }
  | { type: 'SOCKET_RUNE'; targetIid: string; slot: 0 | 1; runeIdx: number; targetType: 'equip' | 'treasure' | 'divweapon' }
  | { type: 'REMOVE_RUNE'; targetIid: string; slot: 0 | 1 | 2; targetType: 'equip' | 'treasure' | 'divweapon' }
  | { type: 'BUY_EQUIP'; defId: string }
  | { type: 'BUY_SKILL'; defId: string }
  | { type: 'LEARN_SKILL'; defId: string }
  | { type: 'CLAIM_SIGNIN' }
  | { type: 'START_BATTLE'; dungeon: DungeonDef }
  | { type: 'BATTLE_TURN' }
  | { type: 'USE_SKILL'; skillId: string }
  | { type: 'FLEE' }
  | { type: 'CLOSE_BATTLE' }
  | { type: 'GACHA'; pool: keyof typeof GACHA_POOLS; count: 1 | 10 }
  | { type: 'EQUIP_TREASURE'; iid: string }
  | { type: 'EQUIP_DIVWEAPON'; iid: string }
  | { type: 'CLAIM_DAILY'; taskId: string }
  | { type: 'DISMISS_TOAST' };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {

    case 'LOGIN': {
      const acc = state.accounts[action.user];
      if (!acc) return { ...state, toast: { msg: '账号不存在', kind: 'err' } };
      if (acc.pw !== action.pw) return { ...state, toast: { msg: '密码错误', kind: 'err' } };
      return { ...state, user: action.user, tab: 'char', toast: { msg: `欢迎回来，${action.user}！`, kind: 'ok' } };
    }

    case 'REGISTER': {
      if (state.accounts[action.user]) return { ...state, toast: { msg: '用户名已存在', kind: 'err' } };
      if (action.pw.length < 4) return { ...state, toast: { msg: '密码至少4位', kind: 'err' } };
      if (action.user.length < 2) return { ...state, toast: { msg: '用户名至少2位', kind: 'err' } };
      const p = newPlayer(action.user);
      return {
        ...state,
        accounts: { ...state.accounts, [action.user]: { pw: action.pw, p } },
        user: action.user, tab: 'char',
        toast: { msg: `欢迎，${action.user}！冒险开始！`, kind: 'rare' },
      };
    }

    case 'LOGOUT':
      return { ...state, user: null, battle: null };

    case 'SET_TAB':
      return { ...state, tab: action.tab };

    case 'SET_SHOP_TAB':
      return { ...state, shopTab: action.t };

    case 'EQUIP': {
      const accs = { ...state.accounts };
      let np = { ...accs[state.user!].p };
      const item = action.item;
      if (item.lvReq > np.lvl) return { ...state, toast: { msg: `需要 ${item.lvReq} 级才能装备`, kind: 'err' } };
      const old = np.equip[item.slot];
      np.bag = np.bag.filter(i => i.iid !== item.iid);
      if (old) np.bag = [...np.bag, old];
      np.equip = { ...np.equip, [item.slot]: item };
      accs[state.user!] = { ...accs[state.user!], p: np };
      return { ...state, accounts: accs, toast: { msg: `装备了 ${item.zh}`, kind: 'ok' } };
    }

    case 'UNEQUIP': {
      const accs = { ...state.accounts };
      let np = { ...accs[state.user!].p };
      const item = np.equip[action.slot];
      if (!item) return state;
      np.equip = { ...np.equip }; delete np.equip[action.slot];
      np.bag = [...np.bag, item];
      accs[state.user!] = { ...accs[state.user!], p: np };
      return { ...state, accounts: accs };
    }

    case 'DISCARD': {
      const accs = { ...state.accounts };
      let np = { ...accs[state.user!].p };
      np.bag = np.bag.filter(i => i.iid !== action.iid);
      accs[state.user!] = { ...accs[state.user!], p: np };
      return { ...state, accounts: accs };
    }

    case 'BUY_RUNE': {
      const rune = RUNES.find(r => r.id === action.id);
      if (!rune) return state;
      const accs = { ...state.accounts };
      let np = { ...accs[state.user!].p };
      if (np.spirit < rune.cost) return { ...state, toast: { msg: `灵石不足 (需要 ${rune.cost})`, kind: 'err' } };
      np.spirit -= rune.cost;
      np.runes = [...np.runes, { ...rune }];
      accs[state.user!] = { ...accs[state.user!], p: np };
      return { ...state, accounts: accs, toast: { msg: `购买了 ${rune.zh}！`, kind: rune.quality === 'divine' ? 'rare' : 'ok' } };
    }

    case 'SOCKET_RUNE': {
      const accs = { ...state.accounts };
      let np = { ...accs[state.user!].p };
      const rune = np.runes[action.runeIdx];
      if (!rune) return state;

      if (action.targetType === 'equip') {
        const inBag = np.bag.find(i => i.iid === action.targetIid);
        const inEquip = Object.values(np.equip).find(i => i?.iid === action.targetIid);
        const target = inBag || inEquip;
        if (!target) return state;
        const newRunes: [Rune | null, Rune | null] = [target.runes[0], target.runes[1]];
        newRunes[action.slot] = rune;
        const updated = { ...target, runes: newRunes };
        if (inBag) np.bag = np.bag.map(i => i.iid === action.targetIid ? updated : i);
        else np.equip = { ...np.equip, [target.slot]: updated };
      } else if (action.targetType === 'treasure') {
        const t = np.treasures.find(t => t.iid === action.targetIid);
        if (!t) return state;
        const newR: [Rune | null, Rune | null, Rune | null] = [t.runes[0], t.runes[1], t.runes[2]];
        newR[action.slot] = rune;
        np.treasures = np.treasures.map(t => t.iid === action.targetIid ? { ...t, runes: newR } : t);
      } else {
        const dw = np.divWeapons.find(w => w.iid === action.targetIid);
        if (!dw) return state;
        const newR: [Rune | null, Rune | null, Rune | null] = [dw.runes[0], dw.runes[1], dw.runes[2]];
        newR[action.slot] = rune;
        np.divWeapons = np.divWeapons.map(w => w.iid === action.targetIid ? { ...w, runes: newR } : w);
      }

      np.runes = np.runes.filter((_, i) => i !== action.runeIdx);
      accs[state.user!] = { ...accs[state.user!], p: np };
      return { ...state, accounts: accs, toast: { msg: `镶嵌了 ${rune.zh}！`, kind: 'ok' } };
    }

    case 'REMOVE_RUNE': {
      const accs = { ...state.accounts };
      let np = { ...accs[state.user!].p };

      if (action.targetType === 'equip') {
        const inBag = np.bag.find(i => i.iid === action.targetIid);
        const inEquip = Object.values(np.equip).find(i => i?.iid === action.targetIid);
        const target = inBag || inEquip;
        if (!target) return state;
        const equipSlot = action.slot as 0 | 1;
        const rune = target.runes[equipSlot];
        if (!rune) return state;
        const newRunes: [Rune | null, Rune | null] = [target.runes[0], target.runes[1]];
        newRunes[equipSlot] = null;
        const updated = { ...target, runes: newRunes };
        if (inBag) np.bag = np.bag.map(i => i.iid === action.targetIid ? updated : i);
        else np.equip = { ...np.equip, [target.slot]: updated };
        np.runes = [...np.runes, rune];
      }

      accs[state.user!] = { ...accs[state.user!], p: np };
      return { ...state, accounts: accs };
    }

    case 'BUY_EQUIP': {
      const def = EQUIP_DEFS.find(d => d.id === action.defId);
      if (!def) return state;
      const accs = { ...state.accounts };
      let np = { ...accs[state.user!].p };
      const price = equipPrice(def.quality);
      const currency = equipCurrency(def.quality);
      if (currency === 'gold' && np.gold < price) return { ...state, toast: { msg: '金币不足', kind: 'err' } };
      if (currency === 'diamond' && np.diamond < price) return { ...state, toast: { msg: '钻石不足', kind: 'err' } };
      if (currency === 'spirit' && np.spirit < price) return { ...state, toast: { msg: '灵石不足', kind: 'err' } };
      if (currency === 'gold') np.gold -= price;
      else if (currency === 'diamond') np.diamond -= price;
      else np.spirit -= price;
      const item: EquipItem = { ...def, iid: uid(), runes: [null, null] };
      np.bag = [...np.bag, item];
      accs[state.user!] = { ...accs[state.user!], p: np };
      return { ...state, accounts: accs, toast: { msg: `购买了 ${def.zh}！`, kind: def.quality === 'divine' ? 'rare' : 'ok' } };
    }

    case 'BUY_SKILL': {
      const def = SKILL_DEFS.find(s => s.id === action.defId);
      if (!def) return state;
      const accs = { ...state.accounts };
      let np = { ...accs[state.user!].p };
      const SKILL_PRICES: Record<string, number> = {
        sk_fb:2000,sk_ia:2000,sk_ts:5000,sk_hl:5000,sk_bk:8000,
        sk_ss:8000,sk_mf:15000,sk_dr:15000,sk_ds:20000,sk_sb:30000,
        sk_tw:35000,sk_cb:50000,sk_bm:60000,sk_hw:100000,
      };
      const price = SKILL_PRICES[def.id] || 5000;
      if (np.lvl < def.lvReq) return { ...state, toast: { msg: `需要 ${def.lvReq} 级`, kind: 'err' } };
      if (np.gold < price) return { ...state, toast: { msg: '金币不足', kind: 'err' } };
      if (np.ownedSkills.includes(def.id)) return { ...state, toast: { msg: '已拥有此技能书', kind: 'err' } };
      np.gold -= price;
      np.ownedSkills = [...np.ownedSkills, def.id];
      accs[state.user!] = { ...accs[state.user!], p: np };
      return { ...state, accounts: accs, toast: { msg: `购买了《${def.zh}》！`, kind: 'ok' } };
    }

    case 'LEARN_SKILL': {
      const accs = { ...state.accounts };
      let np = { ...accs[state.user!].p };
      if (!np.ownedSkills.includes(action.defId)) return { ...state, toast: { msg: '未拥有此技能书', kind: 'err' } };
      if (np.learnedSkills.includes(action.defId)) return { ...state, toast: { msg: '已学会此技能', kind: 'err' } };
      np.learnedSkills = [...np.learnedSkills, action.defId];
      accs[state.user!] = { ...accs[state.user!], p: np };
      const def = SKILL_DEFS.find(s => s.id === action.defId);
      return { ...state, accounts: accs, toast: { msg: `学会了 ${def?.zh || '技能'}！`, kind: 'rare' } };
    }

    case 'CLAIM_SIGNIN': {
      const today = new Date().toDateString();
      const accs = { ...state.accounts };
      let np = { ...accs[state.user!].p };
      if (np.signDate === today) return { ...state, toast: { msg: '今日已签到！明日再来', kind: 'err' } };
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const streak = np.signDate === yesterday ? np.signStreak + 1 : 1;
      const idx = (streak - 1) % 7;
      const reward = SIGNIN_REWARDS[idx];
      np.gold    += reward.gold;
      np.diamond += reward.diamond;
      np.spirit  += reward.spirit;
      np.signDate  = today;
      np.signStreak = streak;
      np.signTotal++;
      let extra = '';
      if (streak % 30 === 0) {
        np.gold    += MONTHLY_BONUS.gold;
        np.diamond += MONTHLY_BONUS.diamond;
        np.spirit  += MONTHLY_BONUS.spirit;
        extra = ' + 🎊月签到特别奖励！';
      }
      // Mark daily task
      if (!np.dailyTasksDone.includes('dt4')) np.dailyTasksDone = [...np.dailyTasksDone, 'dt4'];
      accs[state.user!] = { ...accs[state.user!], p: np };
      const msg = `✅ 签到成功！+${reward.gold}金 +${reward.diamond}钻${reward.spirit ? ` +${reward.spirit}灵石` : ''}${extra}`;
      return { ...state, accounts: accs, toast: { msg, kind: reward.spirit > 0 ? 'rare' : 'ok' } };
    }

    case 'START_BATTLE': {
      const p = state.accounts[state.user!].p;
      const d = action.dungeon;
      if (p.lvl < d.lvReq) return { ...state, toast: { msg: `需要 ${d.lvReq} 级才能进入！`, kind: 'err' } };
      const maxMonsterLvl = Math.max(...d.monsters.map(m => m.lvl));
      if (maxMonsterLvl > p.lvl + 5) return { ...state, toast: { msg: `怪物等级过高！至少需要 ${maxMonsterLvl - 5} 级`, kind: 'err' } };
      const stats = calcStats(p);
      const first = d.monsters[0];
      const battle: BattleState = {
        dungeon: d, wave:0,
        pHp: stats.hp, pHpMax: stats.hp,
        pMp: 100, pMpMax: 100,
        mHp: first.hp, mHpMax: first.hp,
        mPoisonTurns:0, mPoisonDmg:0, mBurnTurns:0, mBurnDmg:0, mStunTurns:0,
        skillCooldowns:{}, buffAtk:0, buffTurns:0, shieldPct:0, shieldTurns:0,
        log:[
          { text:`⚔️ 进入副本：${d.zh}`, cls:'sys' },
          { text:`首波敌人：${first.zh} (Lv.${first.lvl})  HP: ${first.hp}`, cls:'sys' },
        ],
        over:false, win:false, turn:0,
        gold:0, exp:0, diamond:0, spirit:0,
      };
      return { ...state, battle, tab:'dungeon' };
    }

    case 'BATTLE_TURN':
      return doBattleTurn(state);

    case 'USE_SKILL': {
      if (!state.battle || state.battle.over) return state;
      const skillDef = SKILL_DEFS.find(s => s.id === action.skillId);
      if (!skillDef) return state;
      const b = { ...state.battle };
      const p = state.accounts[state.user!].p;
      const stats = calcStats(p);
      const log = [...b.log];
      const push = (text: string, cls: typeof b.log[0]['cls']) => log.push({ text, cls });

      const onCD = (b.skillCooldowns[skillDef.id] || 0) > 0;
      if (onCD) return { ...state, toast: { msg: `${skillDef.zh} 冷却中`, kind: 'err' } };
      if (b.pMp < skillDef.mp) return { ...state, toast: { msg: `法力不足 (需要 ${skillDef.mp})`, kind: 'err' } };

      b.pMp = Math.max(0, b.pMp - skillDef.mp);
      b.skillCooldowns = { ...b.skillCooldowns, [skillDef.id]: skillDef.cd };
      const monster = b.dungeon.monsters[b.wave];

      // Arcane rune bonus
      const allR = allRunes(p);
      const amR = allR.find(r => r.type === 'arcane');
      const arcaneBonus = amR ? 1 + amR.value / 100 : 1;

      if (skillDef.dmgMult > 0) {
        let dmg = Math.max(1, stats.atk - monster.def * 0.3) * skillDef.dmgMult * arcaneBonus * rand(0.9, 1.1);
        dmg = Math.round(dmg);
        b.mHp = Math.max(0, b.mHp - dmg);
        push(`${skillDef.icon} 使用了 ${skillDef.zh}！造成 ${dmg} 伤害！`, 'crit');

        // Blood Moon self-damage
        if (skillDef.id === 'sk_bm') {
          const selfDmg = Math.round(b.pHpMax * 0.2);
          b.pHp = Math.max(1, b.pHp - selfDmg);
          push(`🌕 血月代价：失去 ${selfDmg} HP`, 'enemy');
        }
        if (skillDef.healPct > 0) {
          const heal = Math.round(dmg * skillDef.healPct / 100);
          b.pHp = Math.min(b.pHpMax, b.pHp + heal);
          push(`💚 吸收了 ${heal} HP`, 'heal');
        }
      }

      if (skillDef.healPct > 0 && skillDef.dmgMult === 0) {
        const heal = Math.round(b.pHpMax * skillDef.healPct / 100);
        b.pHp = Math.min(b.pHpMax, b.pHp + heal);
        push(`${skillDef.icon} ${skillDef.zh}！恢复 ${heal} HP`, 'heal');
      }

      if (skillDef.effect === 'buff') {
        b.buffAtk = skillDef.effectVal;
        b.buffTurns = 3;
        push(`${skillDef.icon} ${skillDef.zh}！攻击力 +${skillDef.effectVal}% (3回合)`, 'crit');
      }

      if (skillDef.effect === 'shield') {
        b.shieldPct = skillDef.effectVal;
        b.shieldTurns = 3;
        push(`${skillDef.icon} ${skillDef.zh}！减伤 ${skillDef.effectVal}% (3回合)`, 'crit');
      }

      if (skillDef.effect === 'stun' && Math.random() < 0.4) {
        b.mStunTurns = skillDef.effectVal;
        push(`⚡ ${monster.zh} 被眩晕！(${skillDef.effectVal}回合)`, 'sys');
      }

      if (skillDef.effect === 'burn') {
        b.mBurnTurns = 3; b.mBurnDmg = skillDef.effectVal;
        push(`🔥 ${monster.zh} 点燃！(3回合, ${skillDef.effectVal}%/回合)`, 'player');
      }

      if (skillDef.effect === 'freeze') {
        b.mStunTurns = 1;
        push(`❄️ ${monster.zh} 冻结1回合！`, 'player');
      }

      if (skillDef.effect === 'poison') {
        b.mPoisonTurns = 3; b.mPoisonDmg = 15;
        push(`☠️ ${monster.zh} 中毒！(3回合)`, 'player');
      }

      // Death check
      if (b.mHp <= 0 && !b.over) {
        push(`✅ ${monster.zh} 被技能击败！`, 'sys');
        b.wave++;
        if (b.wave >= b.dungeon.monsters.length) {
          const gold   = Math.round(rand(b.dungeon.goldRange[0], b.dungeon.goldRange[1]));
          const exp    = Math.round(rand(b.dungeon.expRange[0], b.dungeon.expRange[1]));
          b.gold    += gold; b.exp += exp;
          b.diamond += b.dungeon.diamondReward;
          b.spirit  += b.dungeon.spiritReward;
          b.over = true; b.win = true;
          push(`🏆 副本通关！`, 'sys');
          push(`🎁 获得: ${gold} 金币, ${exp} 经验${b.dungeon.diamondReward ? `, ${b.dungeon.diamondReward} 钻石` : ''}${b.dungeon.spiritReward ? `, ${b.dungeon.spiritReward} 灵石` : ''}`, 'reward');

          const accs2 = { ...state.accounts };
          let np2 = { ...accs2[state.user!].p };
          np2.gold += b.gold; np2.diamond += b.diamond; np2.spirit += b.spirit; np2.exp += b.exp;
          np2.cleared = { ...np2.cleared, [b.dungeon.id]: (np2.cleared[b.dungeon.id] || 0) + 1 };
          while (np2.exp >= np2.expNext) {
            np2.exp -= np2.expNext; np2.lvl++;
            np2.expNext = Math.round(np2.expNext * 1.18 + np2.lvl * 60);
            push(`🎉 等级提升到 ${np2.lvl}！`, 'reward');
          }
          accs2[state.user!] = { ...accs2[state.user!], p: np2 };
          b.log = log.slice(-25);
          return { ...state, accounts: accs2, battle: b };
        } else {
          const next = b.dungeon.monsters[b.wave];
          b.mHp = next.hp; b.mHpMax = next.hp;
          b.mPoisonTurns = 0; b.mStunTurns = 0; b.mBurnTurns = 0;
          push(`⚔️ 新敌人：${next.zh} (Lv.${next.lvl})`, 'sys');
        }
      }

      // Reduce all cooldowns by 1 after skill use turn
      const newCDs: Record<string, number> = {};
      for (const [k, v] of Object.entries(b.skillCooldowns)) {
        if (v > 1) newCDs[k] = v - 1;
      }
      b.skillCooldowns = newCDs;

      // MP regen per turn
      b.pMp = Math.min(b.pMpMax, b.pMp + 15);

      b.turn++;
      b.log = log.slice(-25);
      return { ...state, battle: b };
    }

    case 'FLEE':
      return { ...state, battle: null, toast: { msg: '已撤退！', kind: 'info' } };

    case 'CLOSE_BATTLE': {
      if (!state.battle?.over) return state;
      const b = state.battle;
      if (b.win) {
        // Mark dungeon clear daily task
        const accs = { ...state.accounts };
        let np = { ...accs[state.user!].p };
        if (!np.dailyTasksDone.includes('dt2')) np.dailyTasksDone = [...np.dailyTasksDone, 'dt2'];
        const clears = Object.values(np.cleared).reduce((a, b) => a + b, 0);
        if (clears >= 3 && !np.dailyTasksDone.includes('dt3')) np.dailyTasksDone = [...np.dailyTasksDone, 'dt3'];
        accs[state.user!] = { ...accs[state.user!], p: np };
        return { ...state, accounts: accs, battle: null };
      }
      return { ...state, battle: null };
    }

    case 'GACHA': {
      const pool = GACHA_POOLS[action.pool];
      const accs = { ...state.accounts };
      let np = { ...accs[state.user!].p };
      const cost = pool.cost * action.count;

      if (pool.currency === 'gold' && np.gold < cost) return { ...state, toast: { msg: '金币不足', kind: 'err' } };
      if (pool.currency === 'diamond' && np.diamond < cost) return { ...state, toast: { msg: '钻石不足', kind: 'err' } };
      if (pool.currency === 'spirit' && np.spirit < cost) return { ...state, toast: { msg: '灵石不足', kind: 'err' } };

      if (pool.currency === 'gold') np.gold -= cost;
      else if (pool.currency === 'diamond') np.diamond -= cost;
      else np.spirit -= cost;

      const pity = np.gachaPity[action.pool] || 0;
      const { items, newPity } = gachaDraw(pool as GachaPool, action.count, pity);
      np.gachaPity = { ...np.gachaPity, [action.pool]: newPity };
      np.bag = [...np.bag, ...items];

      accs[state.user!] = { ...accs[state.user!], p: np };
      const hasLegendary = items.some(i => i.quality === 'legendary' || i.quality === 'divine');
      return {
        ...state, accounts: accs,
        toast: { msg: `抽到了 ${items.length} 件装备！${hasLegendary ? '✨恭喜获得稀有装备！' : ''}`, kind: hasLegendary ? 'rare' : 'ok' },
      };
    }

    case 'EQUIP_TREASURE': {
      const accs = { ...state.accounts };
      let np = { ...accs[state.user!].p };
      const t = np.treasures.find(t => t.iid === action.iid);
      if (!t) return state;
      if (np.lvl < t.lvReq) return { ...state, toast: { msg: `需要 ${t.lvReq} 级`, kind: 'err' } };
      np.activeTreasure = np.activeTreasure === action.iid ? null : action.iid;
      accs[state.user!] = { ...accs[state.user!], p: np };
      return { ...state, accounts: accs, toast: { msg: np.activeTreasure ? `装备了 ${t.zh}` : `卸下了 ${t.zh}`, kind: 'ok' } };
    }

    case 'EQUIP_DIVWEAPON': {
      const accs = { ...state.accounts };
      let np = { ...accs[state.user!].p };
      const w = np.divWeapons.find(w => w.iid === action.iid);
      if (!w) return state;
      if (np.lvl < w.lvReq) return { ...state, toast: { msg: `需要 ${w.lvReq} 级`, kind: 'err' } };
      np.activeDivWeapon = np.activeDivWeapon === action.iid ? null : action.iid;
      accs[state.user!] = { ...accs[state.user!], p: np };
      return { ...state, accounts: accs, toast: { msg: np.activeDivWeapon ? `装备了 ${w.zh}` : `卸下了 ${w.zh}`, kind: 'ok' } };
    }

    case 'CLAIM_DAILY': {
      const accs = { ...state.accounts };
      let np = { ...accs[state.user!].p };
      if (np.dailyTasksDone.includes(action.taskId)) return { ...state, toast: { msg: '已领取', kind: 'err' } };
      const DAILY_TASKS = [
        { id:'dt1',gold:500,diamond:0,spirit:0,zh:'今日登录' },
        { id:'dt2',gold:1000,diamond:2,spirit:0,zh:'通关1个副本' },
        { id:'dt3',gold:3000,diamond:5,spirit:0,zh:'通关3个副本' },
        { id:'dt4',gold:500,diamond:0,spirit:0,zh:'每日签到' },
        { id:'dt5',gold:200,diamond:1,spirit:0,zh:'逛商店' },
      ];
      const task = DAILY_TASKS.find(t => t.id === action.taskId);
      if (!task) return state;
      np.gold += task.gold;
      np.diamond += task.diamond;
      np.spirit += task.spirit;
      np.dailyTasksDone = [...np.dailyTasksDone, action.taskId];
      accs[state.user!] = { ...accs[state.user!], p: np };
      return { ...state, accounts: accs, toast: { msg: `领取了 ${task.zh} 奖励！`, kind: 'ok' } };
    }

    case 'DISMISS_TOAST':
      return { ...state, toast: null };

    default:
      return state;
  }
}

function equipPrice(q: string): number {
  const map: Record<string, number> = { normal:1000, magic:3000, rare:8000, epic:20000, legendary:60000, divine:200000 };
  return map[q] || 1000;
}
function equipCurrency(q: string): 'gold' | 'diamond' | 'spirit' {
  if (q === 'divine') return 'spirit';
  if (q === 'legendary') return 'diamond';
  return 'gold';
}

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
const Ctx = createContext<{ state: GameState; dispatch: React.Dispatch<Action>; player: Player | null; calcStats: (p: Player) => Record<string, number> } | null>(null);

const STORAGE_KEY = 'rpg_save_v3';

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INIT, () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved) as GameState;
    } catch {}
    return INIT;
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(() => dispatch({ type: 'DISMISS_TOAST' }), 4000);
    return () => clearTimeout(t);
  }, [state.toast]);

  const player = state.user ? state.accounts[state.user]?.p ?? null : null;

  return (
    <Ctx.Provider value={{ state, dispatch, player, calcStats }}>
      {children}
    </Ctx.Provider>
  );
}

export function useGame() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}
