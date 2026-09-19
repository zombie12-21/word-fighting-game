export type Quality = 'normal' | 'magic' | 'rare' | 'epic' | 'legendary' | 'divine';
export type Slot = 'weapon' | 'offhand' | 'helmet' | 'armor' | 'gloves' | 'boots' | 'belt' | 'ring1' | 'ring2' | 'necklace';
export type Stat = 'atk' | 'def' | 'hp' | 'spd' | 'crit' | 'critDmg' | 'dodge';
export type TabId = 'char' | 'inv' | 'dungeon' | 'shop' | 'signin' | 'gacha' | 'treasure' | 'welfare';
export type Grade = 1 | 2 | 3 | 4;
export type RuneType = 'heavyStrike' | 'vampiric' | 'evasion' | 'critical' | 'thorns' | 'ironWall' | 'berserk' | 'poison' | 'arcane' | 'swift' | 'spiritBane' | 'divineFury' | 'divineShield';

export interface Rune {
  id: string;
  name: string;
  zh: string;
  desc: string;
  type: RuneType;
  chance: number;
  value: number;
  quality: Quality;
  icon: string;
  cost: number;
}

export interface EquipDef {
  id: string;
  name: string;
  zh: string;
  slot: Slot;
  quality: Quality;
  lvReq: number;
  stats: Partial<Record<Stat, number>>;
  icon: string;
}

export interface EquipItem extends EquipDef {
  iid: string;
  runes: [Rune | null, Rune | null];
}

export interface TreasureDef {
  id: string;
  name: string;
  zh: string;
  grade: Grade;
  isWeapon: boolean;
  lvReq: number;
  stats: Partial<Record<Stat, number>>;
  skill: string;
  skillZh: string;
  skillDesc: string;
  icon: string;
}

export interface TreasureItem extends TreasureDef {
  iid: string;
  runes: [Rune | null, Rune | null, Rune | null];
}

export interface SkillDef {
  id: string;
  name: string;
  zh: string;
  desc: string;
  dmgMult: number;
  healPct: number;
  effect: 'none' | 'stun' | 'burn' | 'freeze' | 'poison' | 'buff' | 'shield';
  effectVal: number;
  mp: number;
  cd: number;
  lvReq: number;
  icon: string;
}

export interface MonsterDef {
  id: string;
  name: string;
  zh: string;
  lvl: number;
  hp: number;
  atk: number;
  def: number;
  icon: string;
}

export interface DungeonDef {
  id: string;
  name: string;
  zh: string;
  lvReq: number;
  monsters: MonsterDef[];
  special: boolean;
  desc: string;
  goldRange: [number, number];
  expRange: [number, number];
  spiritReward: number;
  diamondReward: number;
  icon: string;
}

export interface BattleLog {
  text: string;
  cls: 'player' | 'enemy' | 'sys' | 'reward' | 'crit' | 'heal';
}

export interface BattleState {
  dungeon: DungeonDef;
  wave: number;
  pHp: number; pHpMax: number;
  pMp: number; pMpMax: number;
  mHp: number; mHpMax: number;
  mPoisonTurns: number; mPoisonDmg: number;
  mStunTurns: number;
  mBurnTurns: number; mBurnDmg: number;
  skillCooldowns: Record<string, number>;
  buffAtk: number; buffTurns: number;
  shieldPct: number; shieldTurns: number;
  log: BattleLog[];
  over: boolean;
  win: boolean;
  turn: number;
  gold: number; exp: number; diamond: number; spirit: number;
}

export interface Player {
  name: string;
  lvl: number;
  exp: number;
  expNext: number;
  base: Record<Stat, number>;
  gold: number;
  diamond: number;
  spirit: number;
  equip: Partial<Record<Slot, EquipItem>>;
  bag: EquipItem[];
  runes: Rune[];
  ownedSkills: string[];
  learnedSkills: string[];
  skillCooldowns: Record<string, number>;
  treasures: TreasureItem[];
  divWeapons: TreasureItem[];
  activeTreasure: string | null;
  activeDivWeapon: string | null;
  signDate: string | null;
  signStreak: number;
  signTotal: number;
  cleared: Record<string, number>;
  vip: number;
  gachaPity: Record<string, number>;
  dailyTasksDone: string[];
  lastDailyReset: string | null;
}

export interface GameState {
  accounts: Record<string, { pw: string; p: Player }>;
  user: string | null;
  tab: TabId;
  battle: BattleState | null;
  toast: { msg: string; kind: 'ok' | 'err' | 'info' | 'rare' } | null;
  shopTab: 'runes' | 'equip' | 'skills';
}
