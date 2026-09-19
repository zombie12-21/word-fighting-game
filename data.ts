import type { Rune, EquipDef, TreasureDef, SkillDef, DungeonDef, MonsterDef } from './types';

let _uid = 0;
export function uid(): string { return `i${Date.now()}${++_uid}`; }

// ─── QUALITY LABELS ───────────────────────────────────────────────────────────
export const QUALITY_LABEL: Record<string, string> = {
  normal: '白', magic: '绿', rare: '蓝', epic: '紫', legendary: '橙', divine: '红',
};

// ─── RUNES ────────────────────────────────────────────────────────────────────
export const RUNES: Rune[] = [
  { id:'hs1', name:'Heavy Strike I',   zh:'重击符·白', desc:'25% chance: deal 150% damage',             type:'heavyStrike', chance:25,  value:150, quality:'normal',    icon:'⚡', cost:3   },
  { id:'hs2', name:'Heavy Strike II',  zh:'重击符·绿', desc:'25% chance: deal 175% damage',             type:'heavyStrike', chance:25,  value:175, quality:'magic',     icon:'⚡', cost:8   },
  { id:'hs3', name:'Heavy Strike III', zh:'重击符·蓝', desc:'30% chance: deal 200% damage',             type:'heavyStrike', chance:30,  value:200, quality:'rare',      icon:'⚡', cost:20  },
  { id:'hs4', name:'Heavy Strike IV',  zh:'重击符·紫', desc:'35% chance: deal 220% damage',             type:'heavyStrike', chance:35,  value:220, quality:'epic',      icon:'⚡', cost:55  },
  { id:'hs5', name:'Heavy Strike V',   zh:'重击符·橙', desc:'40% chance: deal 250% damage',             type:'heavyStrike', chance:40,  value:250, quality:'legendary', icon:'⚡', cost:130 },

  { id:'vp1', name:'Vampiric I',       zh:'吸血符·白', desc:'Heal 5% of damage dealt',                  type:'vampiric',    chance:100, value:5,   quality:'normal',    icon:'🩸', cost:4   },
  { id:'vp2', name:'Vampiric II',      zh:'吸血符·绿', desc:'Heal 8% of damage dealt',                  type:'vampiric',    chance:100, value:8,   quality:'magic',     icon:'🩸', cost:10  },
  { id:'vp3', name:'Vampiric III',     zh:'吸血符·蓝', desc:'Heal 12% of damage dealt',                 type:'vampiric',    chance:100, value:12,  quality:'rare',      icon:'🩸', cost:26  },
  { id:'vp4', name:'Vampiric IV',      zh:'吸血符·紫', desc:'Heal 18% of damage dealt',                 type:'vampiric',    chance:100, value:18,  quality:'epic',      icon:'🩸', cost:65  },
  { id:'vp5', name:'Vampiric V',       zh:'吸血符·橙', desc:'Heal 25% of damage dealt',                 type:'vampiric',    chance:100, value:25,  quality:'legendary', icon:'🩸', cost:160 },

  { id:'ev1', name:'Evasion I',        zh:'闪避符·白', desc:'15% chance to dodge attacks',              type:'evasion',     chance:15,  value:0,   quality:'normal',    icon:'💨', cost:3   },
  { id:'ev2', name:'Evasion II',       zh:'闪避符·绿', desc:'20% chance to dodge attacks',              type:'evasion',     chance:20,  value:0,   quality:'magic',     icon:'💨', cost:8   },
  { id:'ev3', name:'Evasion III',      zh:'闪避符·蓝', desc:'25% chance to dodge attacks',              type:'evasion',     chance:25,  value:0,   quality:'rare',      icon:'💨', cost:22  },
  { id:'ev4', name:'Evasion IV',       zh:'闪避符·紫', desc:'30% chance to dodge attacks',              type:'evasion',     chance:30,  value:0,   quality:'epic',      icon:'💨', cost:58  },

  { id:'cr1', name:'Critical I',       zh:'暴击符·白', desc:'20% chance for 200% damage',               type:'critical',    chance:20,  value:200, quality:'normal',    icon:'💥', cost:5   },
  { id:'cr2', name:'Critical II',      zh:'暴击符·绿', desc:'25% chance for 220% damage',               type:'critical',    chance:25,  value:220, quality:'magic',     icon:'💥', cost:12  },
  { id:'cr3', name:'Critical III',     zh:'暴击符·蓝', desc:'30% chance for 240% damage',               type:'critical',    chance:30,  value:240, quality:'rare',      icon:'💥', cost:32  },
  { id:'cr4', name:'Critical IV',      zh:'暴击符·紫', desc:'35% chance for 260% damage',               type:'critical',    chance:35,  value:260, quality:'epic',      icon:'💥', cost:75  },
  { id:'cr5', name:'Critical V',       zh:'暴击符·橙', desc:'40% chance for 300% damage',               type:'critical',    chance:40,  value:300, quality:'legendary', icon:'💥', cost:170 },

  { id:'th1', name:'Thorns I',         zh:'荆棘符·白', desc:'Reflect 20% of damage taken',              type:'thorns',      chance:100, value:20,  quality:'normal',    icon:'🌵', cost:4   },
  { id:'th2', name:'Thorns II',        zh:'荆棘符·绿', desc:'Reflect 30% of damage taken',              type:'thorns',      chance:100, value:30,  quality:'magic',     icon:'🌵', cost:10  },
  { id:'th3', name:'Thorns III',       zh:'荆棘符·蓝', desc:'Reflect 40% of damage taken',              type:'thorns',      chance:100, value:40,  quality:'rare',      icon:'🌵', cost:28  },
  { id:'th4', name:'Thorns IV',        zh:'荆棘符·紫', desc:'Reflect 55% of damage taken',              type:'thorns',      chance:100, value:55,  quality:'epic',      icon:'🌵', cost:70  },

  { id:'fw1', name:'Iron Wall I',      zh:'铁壁符·白', desc:'Reduce 10% incoming damage',               type:'ironWall',    chance:100, value:10,  quality:'normal',    icon:'🛡️', cost:4   },
  { id:'fw2', name:'Iron Wall II',     zh:'铁壁符·绿', desc:'Reduce 15% incoming damage',               type:'ironWall',    chance:100, value:15,  quality:'magic',     icon:'🛡️', cost:10  },
  { id:'fw3', name:'Iron Wall III',    zh:'铁壁符·蓝', desc:'Reduce 20% incoming damage',               type:'ironWall',    chance:100, value:20,  quality:'rare',      icon:'🛡️', cost:26  },
  { id:'fw4', name:'Iron Wall IV',     zh:'铁壁符·紫', desc:'Reduce 25% incoming damage',               type:'ironWall',    chance:100, value:25,  quality:'epic',      icon:'🛡️', cost:65  },

  { id:'bk1', name:'Berserk I',        zh:'狂暴符·白', desc:'Below 50% HP: deal +30% damage',           type:'berserk',     chance:100, value:30,  quality:'normal',    icon:'🔥', cost:5   },
  { id:'bk2', name:'Berserk II',       zh:'狂暴符·绿', desc:'Below 50% HP: deal +50% damage',           type:'berserk',     chance:100, value:50,  quality:'magic',     icon:'🔥', cost:12  },
  { id:'bk3', name:'Berserk III',      zh:'狂暴符·蓝', desc:'Below 50% HP: deal +70% damage',           type:'berserk',     chance:100, value:70,  quality:'rare',      icon:'🔥', cost:30  },
  { id:'bk4', name:'Berserk IV',       zh:'狂暴符·紫', desc:'Below 50% HP: deal +100% damage',          type:'berserk',     chance:100, value:100, quality:'epic',      icon:'🔥', cost:78  },

  { id:'pz1', name:'Poison I',         zh:'剧毒符·白', desc:'20% chance: poison 3 turns (15% dmg/turn)',type:'poison',      chance:20,  value:15,  quality:'normal',    icon:'☠️', cost:4   },
  { id:'pz2', name:'Poison II',        zh:'剧毒符·绿', desc:'25% chance: poison 4 turns (25% dmg/turn)',type:'poison',      chance:25,  value:25,  quality:'magic',     icon:'☠️', cost:10  },
  { id:'pz3', name:'Poison III',       zh:'剧毒符·蓝', desc:'30% chance: poison 4 turns (40% dmg/turn)',type:'poison',      chance:30,  value:40,  quality:'rare',      icon:'☠️', cost:28  },

  { id:'am1', name:'Arcane I',         zh:'秘法符·白', desc:'+10% skill damage',                        type:'arcane',      chance:100, value:10,  quality:'normal',    icon:'✨', cost:5   },
  { id:'am2', name:'Arcane II',        zh:'秘法符·绿', desc:'+15% skill damage',                        type:'arcane',      chance:100, value:15,  quality:'magic',     icon:'✨', cost:12  },
  { id:'am3', name:'Arcane III',       zh:'秘法符·蓝', desc:'+20% skill damage',                        type:'arcane',      chance:100, value:20,  quality:'rare',      icon:'✨', cost:32  },
  { id:'am4', name:'Arcane IV',        zh:'秘法符·紫', desc:'+30% skill damage',                        type:'arcane',      chance:100, value:30,  quality:'epic',      icon:'✨', cost:80  },
  { id:'am5', name:'Arcane V',         zh:'秘法符·橙', desc:'+45% skill damage',                        type:'arcane',      chance:100, value:45,  quality:'legendary', icon:'✨', cost:190 },

  { id:'sw1', name:'Swift I',          zh:'迅捷符·白', desc:'+10% attack; +5% dodge',                   type:'swift',       chance:100, value:10,  quality:'normal',    icon:'💫', cost:4   },
  { id:'sw2', name:'Swift II',         zh:'迅捷符·绿', desc:'+15% attack; +8% dodge',                   type:'swift',       chance:100, value:15,  quality:'magic',     icon:'💫', cost:10  },
  { id:'sw3', name:'Swift III',        zh:'迅捷符·蓝', desc:'+20% attack; +12% dodge',                  type:'swift',       chance:100, value:20,  quality:'rare',      icon:'💫', cost:28  },
  { id:'sw4', name:'Swift IV',         zh:'迅捷符·紫', desc:'+28% attack; +18% dodge',                  type:'swift',       chance:100, value:28,  quality:'epic',      icon:'💫', cost:68  },

  { id:'sb1', name:'Spirit Bane I',    zh:'灵伤符·蓝', desc:'20% chance: ignore 50% defense',           type:'spiritBane',  chance:20,  value:50,  quality:'rare',      icon:'🔮', cost:38  },
  { id:'sb2', name:'Spirit Bane II',   zh:'灵伤符·紫', desc:'25% chance: ignore 65% defense',           type:'spiritBane',  chance:25,  value:65,  quality:'epic',      icon:'🔮', cost:88  },
  { id:'sb3', name:'Spirit Bane III',  zh:'灵伤符·橙', desc:'30% chance: ignore 80% defense',           type:'spiritBane',  chance:30,  value:80,  quality:'legendary', icon:'🔮', cost:210 },

  { id:'df1', name:'Divine Fury',      zh:'神怒符·红', desc:'8% chance: deal 400% damage',              type:'divineFury',  chance:8,   value:400, quality:'divine',    icon:'⚜️', cost:500 },
  { id:'ds1', name:'Divine Shield',    zh:'神盾符·红', desc:'Once per battle: negate lethal blow',      type:'divineShield',chance:1,   value:0,   quality:'divine',    icon:'🌟', cost:600 },
];

// ─── EQUIPMENT DEFINITIONS ────────────────────────────────────────────────────
export const EQUIP_DEFS: EquipDef[] = [
  // Weapons
  { id:'w_iron',    zh:'铁剑',      name:'Iron Sword',      slot:'weapon',  quality:'normal',    lvReq:1,   stats:{atk:15, spd:2},                              icon:'🗡️' },
  { id:'w_axe',     zh:'战斧',      name:'Battle Axe',      slot:'weapon',  quality:'normal',    lvReq:5,   stats:{atk:22, def:3},                              icon:'🪓' },
  { id:'w_bow',     zh:'疾风弓',    name:'Wind Bow',        slot:'weapon',  quality:'magic',     lvReq:12,  stats:{atk:45, spd:10},                             icon:'🏹' },
  { id:'w_steel',   zh:'钢剑',      name:'Steel Sword',     slot:'weapon',  quality:'magic',     lvReq:10,  stats:{atk:40, spd:3, crit:3},                      icon:'🗡️' },
  { id:'w_dagger',  zh:'暗影匕首',  name:'Shadow Dagger',   slot:'weapon',  quality:'rare',      lvReq:20,  stats:{atk:70, spd:12, dodge:8, crit:5},            icon:'🗡️' },
  { id:'w_staff',   zh:'秘法法杖',  name:'Arcane Staff',    slot:'weapon',  quality:'rare',      lvReq:22,  stats:{atk:85, spd:4, hp:100},                      icon:'🔮' },
  { id:'w_flame',   zh:'烈焰刃',    name:'Flame Blade',     slot:'weapon',  quality:'rare',      lvReq:25,  stats:{atk:90, spd:5, crit:5, critDmg:20},          icon:'🗡️' },
  { id:'w_thunder', zh:'雷霆剑',    name:'Thunder Sword',   slot:'weapon',  quality:'epic',      lvReq:45,  stats:{atk:180,spd:8, crit:8, critDmg:35},          icon:'⚔️' },
  { id:'w_hammer',  zh:'雷锤',      name:'Thunder Hammer',  slot:'weapon',  quality:'epic',      lvReq:50,  stats:{atk:200,def:20,crit:5},                      icon:'🔨' },
  { id:'w_scepter', zh:'夺魂权杖',  name:'Soul Scepter',    slot:'weapon',  quality:'legendary', lvReq:75,  stats:{atk:380,hp:500,critDmg:60},                  icon:'🔮' },
  { id:'w_dragon',  zh:'屠龙刀',    name:'Dragon Blade',    slot:'weapon',  quality:'legendary', lvReq:70,  stats:{atk:350,spd:12,crit:12,critDmg:55},          icon:'⚔️' },
  { id:'w_chaos',   zh:'混沌之刃',  name:'Chaos Sword',     slot:'weapon',  quality:'legendary', lvReq:90,  stats:{atk:500,spd:15,crit:15,critDmg:70},          icon:'⚔️' },
  { id:'w_heaven',  zh:'天刃',      name:"Heaven's Edge",   slot:'weapon',  quality:'divine',    lvReq:100, stats:{atk:800,spd:20,crit:20,critDmg:100},         icon:'⚔️' },
  // Offhand
  { id:'o_buckler', zh:'小圆盾',    name:'Buckler',         slot:'offhand', quality:'normal',    lvReq:1,   stats:{def:12,hp:50},                               icon:'🛡️' },
  { id:'o_shield',  zh:'塔盾',      name:'Tower Shield',    slot:'offhand', quality:'magic',     lvReq:10,  stats:{def:35,hp:200},                              icon:'🛡️' },
  { id:'o_iron',    zh:'铁盾',      name:'Iron Shield',     slot:'offhand', quality:'rare',      lvReq:25,  stats:{def:80,hp:500,dodge:5},                      icon:'🛡️' },
  { id:'o_knight',  zh:'骑士盾',    name:'Knight Shield',   slot:'offhand', quality:'epic',      lvReq:45,  stats:{def:160,hp:1000,dodge:8},                    icon:'🛡️' },
  { id:'o_dragon',  zh:'龙盾',      name:'Dragon Shield',   slot:'offhand', quality:'legendary', lvReq:70,  stats:{def:300,hp:2000,dodge:10,atk:50},            icon:'🛡️' },
  { id:'o_divine',  zh:'天命神盾',  name:'Celestial Aegis', slot:'offhand', quality:'divine',    lvReq:100, stats:{def:550,hp:3500,dodge:15,atk:100},           icon:'🛡️' },
  // Helmet
  { id:'h_iron',    zh:'铁盔',      name:'Iron Helm',       slot:'helmet',  quality:'normal',    lvReq:1,   stats:{def:8,hp:60},                                icon:'⛑️' },
  { id:'h_steel',   zh:'钢盔',      name:'Steel Helm',      slot:'helmet',  quality:'magic',     lvReq:10,  stats:{def:22,hp:150},                              icon:'⛑️' },
  { id:'h_mage',    zh:'秘法冠',    name:'Arcane Crown',    slot:'helmet',  quality:'rare',      lvReq:25,  stats:{def:45,hp:280,critDmg:10},                   icon:'👑' },
  { id:'h_knight',  zh:'骑士头盔',  name:'Knight Helm',     slot:'helmet',  quality:'epic',      lvReq:45,  stats:{def:95,hp:600},                              icon:'⛑️' },
  { id:'h_dragon',  zh:'龙冠',      name:'Dragon Crown',    slot:'helmet',  quality:'legendary', lvReq:70,  stats:{def:180,hp:1200,crit:8},                     icon:'👑' },
  { id:'h_divine',  zh:'天命光环',  name:'Halo of Heaven',  slot:'helmet',  quality:'divine',    lvReq:100, stats:{def:320,hp:2500,crit:12,critDmg:40},        icon:'👑' },
  // Armor
  { id:'a_cloth',   zh:'粗布长袍',  name:'Cloth Robe',      slot:'armor',   quality:'normal',    lvReq:1,   stats:{def:10,hp:80},                               icon:'👘' },
  { id:'a_leather', zh:'皮甲',      name:'Leather Armor',   slot:'armor',   quality:'magic',     lvReq:8,   stats:{def:28,hp:200,dodge:3},                      icon:'🥋' },
  { id:'a_chain',   zh:'锁子甲',    name:'Chain Mail',      slot:'armor',   quality:'rare',      lvReq:20,  stats:{def:65,hp:450},                              icon:'🥋' },
  { id:'a_mage',    zh:'法师长袍',  name:'Mage Robe',       slot:'armor',   quality:'rare',      lvReq:18,  stats:{def:40,hp:300,critDmg:15},                   icon:'👘' },
  { id:'a_plate',   zh:'板甲',      name:'Plate Armor',     slot:'armor',   quality:'epic',      lvReq:40,  stats:{def:130,hp:900,spd:-2},                      icon:'🛡️' },
  { id:'a_shadow',  zh:'暗影披风',  name:'Shadow Cloak',    slot:'armor',   quality:'epic',      lvReq:42,  stats:{def:100,dodge:12,spd:8},                     icon:'🥷' },
  { id:'a_dragon',  zh:'龙鳞甲',    name:'Dragon Scale',    slot:'armor',   quality:'legendary', lvReq:65,  stats:{def:250,hp:1800,crit:3},                     icon:'🛡️' },
  { id:'a_divine',  zh:'神圣板甲',  name:'Divine Plate',    slot:'armor',   quality:'divine',    lvReq:100, stats:{def:450,hp:3500,spd:5},                      icon:'🛡️' },
  // Gloves
  { id:'g_cloth',   zh:'布手缚',    name:'Cloth Wraps',     slot:'gloves',  quality:'normal',    lvReq:1,   stats:{atk:5},                                      icon:'🧤' },
  { id:'g_leather', zh:'皮手套',    name:'Leather Gloves',  slot:'gloves',  quality:'magic',     lvReq:9,   stats:{atk:18,crit:3},                              icon:'🧤' },
  { id:'g_iron',    zh:'铁手甲',    name:'Iron Gauntlets',  slot:'gloves',  quality:'rare',      lvReq:24,  stats:{atk:42,def:20,crit:5},                       icon:'🥊' },
  { id:'g_battle',  zh:'战斗拳甲',  name:'Battle Gauntlets',slot:'gloves',  quality:'epic',      lvReq:42,  stats:{atk:85,crit:8,critDmg:25},                   icon:'🥊' },
  { id:'g_dragon',  zh:'龙爪',      name:'Dragon Claws',    slot:'gloves',  quality:'legendary', lvReq:68,  stats:{atk:160,crit:12,critDmg:45},                 icon:'🐉' },
  { id:'g_divine',  zh:"天命之手",  name:"Heaven's Grasp",  slot:'gloves',  quality:'divine',    lvReq:100, stats:{atk:280,crit:18,critDmg:70},                 icon:'✋' },
  // Boots
  { id:'b_leather', zh:'皮靴',      name:'Leather Boots',   slot:'boots',   quality:'normal',    lvReq:1,   stats:{spd:5,dodge:2},                              icon:'👢' },
  { id:'b_iron',    zh:'铁靴',      name:'Iron Boots',      slot:'boots',   quality:'magic',     lvReq:8,   stats:{def:15,spd:3,dodge:3},                       icon:'👢' },
  { id:'b_swift',   zh:'疾风靴',    name:'Swift Boots',     slot:'boots',   quality:'rare',      lvReq:22,  stats:{spd:20,dodge:10},                            icon:'👢' },
  { id:'b_knight',  zh:'骑士护胫',  name:'Knight Greaves',  slot:'boots',   quality:'epic',      lvReq:40,  stats:{def:80,spd:8,hp:400},                        icon:'👢' },
  { id:'b_shadow',  zh:'暗影步',    name:'Shadow Steps',    slot:'boots',   quality:'legendary', lvReq:65,  stats:{spd:25,dodge:18,atk:30},                     icon:'👢' },
  { id:'b_divine',  zh:'天界之翼',  name:'Wings of Heaven', slot:'boots',   quality:'divine',    lvReq:100, stats:{spd:35,dodge:25,atk:80,def:120},             icon:'🪶' },
  // Belt
  { id:'bl_rope',   zh:'绳腰带',    name:'Rope Belt',       slot:'belt',    quality:'normal',    lvReq:1,   stats:{hp:50},                                      icon:'🎗️' },
  { id:'bl_leather',zh:'皮腰带',    name:'Leather Belt',    slot:'belt',    quality:'magic',     lvReq:8,   stats:{hp:180,def:10},                              icon:'🎗️' },
  { id:'bl_iron',   zh:'铁腰带',    name:'Iron Belt',       slot:'belt',    quality:'rare',      lvReq:22,  stats:{hp:400,def:25},                              icon:'🎗️' },
  { id:'bl_knight', zh:'骑士腰甲',  name:'Knight Sash',     slot:'belt',    quality:'epic',      lvReq:40,  stats:{hp:800,def:50,atk:20},                       icon:'🎗️' },
  { id:'bl_dragon', zh:'龙鳞腰带',  name:'Dragon Sash',     slot:'belt',    quality:'legendary', lvReq:65,  stats:{hp:1500,def:90,atk:50},                      icon:'🎗️' },
  // Rings
  { id:'r_copper',  zh:'铜戒指',    name:'Copper Ring',     slot:'ring1',   quality:'normal',    lvReq:1,   stats:{atk:8},                                      icon:'💍' },
  { id:'r_silver',  zh:'银戒指',    name:'Silver Ring',     slot:'ring1',   quality:'magic',     lvReq:10,  stats:{atk:20,crit:2},                              icon:'💍' },
  { id:'r_gold',    zh:'金戒指',    name:'Gold Ring',       slot:'ring1',   quality:'rare',      lvReq:25,  stats:{atk:45,crit:5,critDmg:15},                   icon:'💍' },
  { id:'r_ruby',    zh:'红宝石戒指',name:'Ruby Ring',        slot:'ring1',   quality:'epic',      lvReq:45,  stats:{atk:90,crit:8,critDmg:30,hp:300},            icon:'💍' },
  { id:'r_dragon',  zh:'龙晶戒指',  name:'Dragon Ring',     slot:'ring1',   quality:'legendary', lvReq:70,  stats:{atk:170,crit:12,critDmg:55,hp:600},          icon:'💎' },
  { id:'r_divine',  zh:'永恒之戒',  name:'Eternity Ring',   slot:'ring1',   quality:'divine',    lvReq:100, stats:{atk:300,crit:18,critDmg:80,hp:1000},         icon:'💎' },
  { id:'r2_copper', zh:'铜指环',    name:'Copper Band',     slot:'ring2',   quality:'normal',    lvReq:1,   stats:{def:8},                                      icon:'💍' },
  { id:'r2_jade',   zh:'翡翠戒指',  name:'Jade Ring',       slot:'ring2',   quality:'rare',      lvReq:25,  stats:{def:45,hp:300,dodge:5},                      icon:'💍' },
  { id:'r2_sapph',  zh:'蓝宝石指环',name:'Sapphire Ring',   slot:'ring2',   quality:'epic',      lvReq:45,  stats:{def:90,hp:700,dodge:8},                      icon:'💍' },
  { id:'r2_divine', zh:'誓盟之戒',  name:'Oath Ring',       slot:'ring2',   quality:'divine',    lvReq:100, stats:{def:250,hp:1800,dodge:15,spd:10},            icon:'💎' },
  // Necklace
  { id:'n_stone',   zh:'石头吊坠',  name:'Stone Pendant',   slot:'necklace',quality:'normal',    lvReq:1,   stats:{hp:100},                                     icon:'📿' },
  { id:'n_silver',  zh:'银项链',    name:'Silver Pendant',  slot:'necklace',quality:'magic',     lvReq:10,  stats:{hp:250,def:12},                              icon:'📿' },
  { id:'n_topaz',   zh:'黄玉项链',  name:'Topaz Necklace',  slot:'necklace',quality:'rare',      lvReq:25,  stats:{hp:550,def:30,atk:25},                       icon:'📿' },
  { id:'n_emerald', zh:'祖母绿项链',name:'Emerald Necklace',slot:'necklace',quality:'epic',      lvReq:45,  stats:{hp:1100,def:60,atk:55},                      icon:'💎' },
  { id:'n_dragon',  zh:'龙牙项坠',  name:'Dragon Fang',     slot:'necklace',quality:'legendary', lvReq:70,  stats:{hp:2000,def:110,atk:100},                    icon:'🐉' },
  { id:'n_divine',  zh:'灵魂宝石',  name:'Soul Gem',        slot:'necklace',quality:'divine',    lvReq:100, stats:{hp:3500,def:200,atk:180,critDmg:50},         icon:'💎' },
];

// ─── MAGIC TREASURES ─────────────────────────────────────────────────────────
export const TREASURE_DEFS: TreasureDef[] = [
  { id:'t_dp',  zh:'龙珠',      name:'Dragon Pearl',      grade:1, isWeapon:false, lvReq:1,   stats:{atk:20,hp:200},              skill:'Dragon Pulse',    skillZh:'龙脉冲',    skillDesc:'Dragon energy: 120% damage to all enemies',                 icon:'🔮' },
  { id:'t_pt',  zh:'凤泪',      name:'Phoenix Tear',      grade:1, isWeapon:false, lvReq:1,   stats:{hp:300,def:15},              skill:'Phoenix Bloom',   skillZh:'凤凰绽放',  skillDesc:'Heal 15% HP; 10% chance of full revival',                   icon:'🔥' },
  { id:'t_ms',  zh:'月华石',    name:'Moonstone',         grade:1, isWeapon:false, lvReq:5,   stats:{spd:10,dodge:5},             skill:'Moonbeam',        skillZh:'月华照',    skillDesc:'20% dodge chance for next 3 attacks',                       icon:'🌙' },
  { id:'t_to',  zh:'雷珠',      name:'Thunder Orb',       grade:2, isWeapon:false, lvReq:30,  stats:{atk:60,crit:5},              skill:'Chain Lightning',  skillZh:'连锁雷击', skillDesc:'150% damage; 40% chain to another enemy',                   icon:'⚡' },
  { id:'t_ic',  zh:'冰晶',      name:'Ice Crystal',       grade:2, isWeapon:false, lvReq:30,  stats:{def:50,hp:600},              skill:'Frost Nova',      skillZh:'寒冰爆破',  skillDesc:'Freeze enemy 1 turn; deal 130% damage',                     icon:'❄️' },
  { id:'t_sc',  zh:'日晶核',    name:'Sun Core',          grade:2, isWeapon:false, lvReq:35,  stats:{atk:70,critDmg:30},          skill:'Solar Flare',     skillZh:'日炎爆',    skillDesc:'Burn enemy 5 turns: 20% damage/turn',                       icon:'☀️' },
  { id:'t_he',  zh:'天眼',      name:"Heaven's Eye",      grade:3, isWeapon:false, lvReq:60,  stats:{crit:10,critDmg:50},         skill:'All-Seeing',      skillZh:'天目洞察',  skillDesc:'Cannot miss; +50% crit damage for 3 turns',                 icon:'👁️' },
  { id:'t_sf',  zh:'星碎',      name:'Star Fragment',     grade:3, isWeapon:false, lvReq:65,  stats:{atk:120,hp:1000},            skill:'Meteor Fall',     skillZh:'陨星坠落',  skillDesc:'200% damage; 30% stun 2 turns',                             icon:'⭐' },
  { id:'t_sc2', zh:'魂晶',      name:'Soul Crystal',      grade:3, isWeapon:false, lvReq:70,  stats:{hp:1500,def:100,atk:80},     skill:'Soul Link',       skillZh:'灵魂链接',  skillDesc:'Heal 20% HP; absorb 25% max HP as shield',                  icon:'💎' },
  { id:'t_dc',  zh:'神核',      name:'Divine Core',       grade:4, isWeapon:false, lvReq:100, stats:{atk:200,def:150,hp:2500,crit:15}, skill:'Divine Explosion', skillZh:'神圣爆炸', skillDesc:'300% damage ignoring all defense',              icon:'✨' },
  { id:'t_cg',  zh:'混沌宝石',  name:'Chaos Gem',         grade:4, isWeapon:false, lvReq:100, stats:{atk:180,hp:3000,critDmg:80}, skill:'Chaos Rupture',   skillZh:'混沌裂变',  skillDesc:'Destroy 50% enemy defense; deal 250% chaos damage',         icon:'🌀' },
];

// ─── DIVINE WEAPONS ───────────────────────────────────────────────────────────
export const DIVINE_WEAPON_DEFS: TreasureDef[] = [
  { id:'dw_sc',  zh:'天斩刀',    name:'Sky Cleaver',     grade:1, isWeapon:true, lvReq:1,   stats:{atk:40,crit:5},                  skill:'Sky Slash',        skillZh:'天斩',      skillDesc:'140% damage with +15% pierce',                         icon:'⚔️' },
  { id:'dw_sl',  zh:'风暴枪',    name:'Storm Lance',     grade:1, isWeapon:true, lvReq:5,   stats:{atk:35,spd:8},                   skill:'Storm Pierce',     skillZh:'风暴穿刺',  skillDesc:'130% damage; ignore 20% defense',                      icon:'🗡️' },
  { id:'dw_se',  zh:'暗刃',      name:'Shadow Edge',     grade:1, isWeapon:true, lvReq:5,   stats:{atk:30,dodge:8,spd:10},          skill:'Shadow Rend',      skillZh:'暗影撕裂',  skillDesc:'+15% dodge; next attack 145% damage',                  icon:'🗡️' },
  { id:'dw_fe',  zh:'霜刃',      name:'Frost Edge',      grade:2, isWeapon:true, lvReq:35,  stats:{atk:100,critDmg:40},             skill:'Frost Strike',     skillZh:'冰刃斩',    skillDesc:'Freeze enemy 1 turn; 160% damage',                     icon:'❄️' },
  { id:'dw_th',  zh:'雷锤',      name:'Thunder Hammer',  grade:2, isWeapon:true, lvReq:40,  stats:{atk:120,def:40},                 skill:'Thunder Smash',    skillZh:'雷霆一击',  skillDesc:'Stun 1 turn; 170% damage; 30% chain',                  icon:'⚡' },
  { id:'dw_br',  zh:'血刃镰',    name:'Blood Reaper',    grade:2, isWeapon:true, lvReq:38,  stats:{atk:110,crit:8,critDmg:35},      skill:'Blood Harvest',    skillZh:'血收割',    skillDesc:'Steal 20% HP; 155% damage',                            icon:'🩸' },
  { id:'dw_ds',  zh:'龙魂剑',    name:'Dragon Soul',     grade:3, isWeapon:true, lvReq:70,  stats:{atk:220,crit:12,critDmg:60},     skill:'Dragon Spirit',    skillZh:'龙魂附体',  skillDesc:'+80% attack 3 turns; bypass 40% defense',              icon:'🐉' },
  { id:'dw_sr',  zh:'夺魂镰',    name:'Soul Reaper',     grade:3, isWeapon:true, lvReq:75,  stats:{atk:200,hp:1000,critDmg:70},     skill:'Soul Harvest',     skillZh:'收割灵魂',  skillDesc:'200% damage; heal 30% of damage dealt',                icon:'☠️' },
  { id:'dw_vb',  zh:'虚空刃',    name:'Void Blade',      grade:3, isWeapon:true, lvReq:80,  stats:{atk:210,spd:15,dodge:12},        skill:'Void Slash',       skillZh:'虚空斩',    skillDesc:'Ignore all defense; 190% damage; cannot miss',         icon:'🌌' },
  { id:'dw_hw',  zh:'天命之剑',  name:"Heaven's Will",   grade:4, isWeapon:true, lvReq:100, stats:{atk:400,crit:20,critDmg:100,spd:25}, skill:"Heaven's Judgment", skillZh:'天命裁决', skillDesc:'350% damage; stun 2 turns; ignores all effects',    icon:'⚜️' },
  { id:'dw_cb',  zh:'混沌破',    name:'Chaos Breaker',   grade:4, isWeapon:true, lvReq:100, stats:{atk:380,def:200,hp:2000,critDmg:90}, skill:'Chaos Annihilation', skillZh:'混沌湮灭', skillDesc:'300% damage to all; -50% enemy stats 3 turns',    icon:'🌀' },
];

// ─── SKILL BOOKS ─────────────────────────────────────────────────────────────
export const SKILL_DEFS: SkillDef[] = [
  { id:'sk_fb',  zh:'火球术',     name:'Fireball',        desc:'Blazing fireball — 180% fire damage; chance to burn 3 turns',      dmgMult:1.8, healPct:0,  effect:'burn',   effectVal:10, mp:20, cd:2, lvReq:1,  icon:'🔥' },
  { id:'sk_ia',  zh:'冰箭术',     name:'Ice Arrow',       desc:'Ice arrow — 160% damage; freeze enemy 1 turn',                     dmgMult:1.6, healPct:0,  effect:'freeze', effectVal:1,  mp:18, cd:2, lvReq:1,  icon:'❄️' },
  { id:'sk_ts',  zh:'雷击术',     name:'Thunder Strike',  desc:'Lightning — 200% damage; 30% chance to stun',                      dmgMult:2.0, healPct:0,  effect:'stun',   effectVal:1,  mp:30, cd:3, lvReq:5,  icon:'⚡' },
  { id:'sk_hl',  zh:'圣光术',     name:'Holy Light',      desc:'Divine heal — restore 30% of max HP',                              dmgMult:0,   healPct:30, effect:'none',   effectVal:0,  mp:25, cd:3, lvReq:5,  icon:'✨' },
  { id:'sk_bk',  zh:'狂战士',     name:'Berserker',       desc:'Rage: +100% attack for 3 turns, −30% defense',                    dmgMult:0,   healPct:0,  effect:'buff',   effectVal:100,mp:35, cd:5, lvReq:10, icon:'😤' },
  { id:'sk_ss',  zh:'暗影步',     name:'Shadow Step',     desc:'170% damage; guaranteed dodge for 2 turns',                        dmgMult:1.7, healPct:0,  effect:'shield', effectVal:0,  mp:28, cd:3, lvReq:10, icon:'🥷' },
  { id:'sk_mf',  zh:'陨石坠落',   name:'Meteor Fall',     desc:'Meteor — 250% damage',                                             dmgMult:2.5, healPct:0,  effect:'none',   effectVal:0,  mp:50, cd:5, lvReq:20, icon:'☄️' },
  { id:'sk_dr',  zh:'龙吼',       name:'Dragon Roar',     desc:'220% damage; reduce enemy attack 30% for 2 turns',                 dmgMult:2.2, healPct:0,  effect:'none',   effectVal:0,  mp:45, cd:4, lvReq:20, icon:'🐉' },
  { id:'sk_ds',  zh:'神盾',       name:'Divine Shield',   desc:'Absorb 50% damage for 3 turns',                                    dmgMult:0,   healPct:0,  effect:'shield', effectVal:50, mp:40, cd:5, lvReq:30, icon:'🛡️' },
  { id:'sk_sb',  zh:'灵魂爆破',   name:'Soul Burst',      desc:'280% damage ignoring 30% defense',                                 dmgMult:2.8, healPct:0,  effect:'none',   effectVal:0,  mp:60, cd:5, lvReq:35, icon:'💥' },
  { id:'sk_tw',  zh:'时间扭曲',   name:'Time Warp',       desc:'2 bonus attacks this turn (130% damage each)',                     dmgMult:1.3, healPct:0,  effect:'none',   effectVal:0,  mp:55, cd:4, lvReq:40, icon:'⏰' },
  { id:'sk_cb',  zh:'混沌爆炸',   name:'Chaos Blast',     desc:'320% damage; 40% chance to stun 2 turns',                         dmgMult:3.2, healPct:0,  effect:'stun',   effectVal:2,  mp:70, cd:6, lvReq:50, icon:'🌀' },
  { id:'sk_bm',  zh:'血月',       name:'Blood Moon',      desc:'Sacrifice 20% HP: deal 350% damage; heal 50% of damage',          dmgMult:3.5, healPct:50, effect:'none',   effectVal:0,  mp:0,  cd:7, lvReq:60, icon:'🌕' },
  { id:'sk_hw',  zh:'天降神罚',   name:"Heaven's Wrath",  desc:'Ultimate: 400% damage ignoring all defense',                      dmgMult:4.0, healPct:0,  effect:'none',   effectVal:0,  mp:100,cd:8, lvReq:70, icon:'⚜️' },
];

// Skill book shop prices (gold)
export const SKILL_PRICES: Record<string, number> = {
  sk_fb:2000, sk_ia:2000, sk_ts:5000, sk_hl:5000, sk_bk:8000,
  sk_ss:8000, sk_mf:15000, sk_dr:15000, sk_ds:20000, sk_sb:30000,
  sk_tw:35000, sk_cb:50000, sk_bm:60000, sk_hw:100000,
};

// ─── DUNGEONS ─────────────────────────────────────────────────────────────────
function m(id:string,zh:string,name:string,lvl:number,hp:number,atk:number,def:number,icon:string): MonsterDef {
  return { id, name, zh, lvl, hp, atk, def, icon };
}

export const DUNGEONS: DungeonDef[] = [
  {
    id:'d1', zh:'翠绿森林',  name:'Green Forest',    lvReq:1,  special:false, spiritReward:0, diamondReward:0,
    desc:'A peaceful forest with weak monsters — perfect for beginners.',
    goldRange:[50,150], expRange:[80,150], icon:'🌲',
    monsters:[ m('wolf','森林狼','Forest Wolf',2,120,18,5,'🐺'), m('boar','野猪','Wild Boar',3,180,25,8,'🐗'), m('bear','森熊','Forest Bear',5,300,35,12,'🐻') ],
  },
  {
    id:'d2', zh:'黑暗洞穴',  name:'Dark Cave',       lvReq:5,  special:false, spiritReward:0, diamondReward:0,
    desc:'Bats and creatures lurk in the dark.',
    goldRange:[120,300], expRange:[150,250], icon:'🦇',
    monsters:[ m('bat','巨型蝙蝠','Giant Bat',6,200,30,8,'🦇'), m('spider','洞穴蜘蛛','Cave Spider',8,280,42,12,'🕷️'), m('golem','石头傀儡','Stone Golem',10,500,60,25,'🗿') ],
  },
  {
    id:'d3', zh:'盗贼营地',  name:'Bandit Camp',     lvReq:10, special:false, spiritReward:0, diamondReward:0,
    desc:'Ruthless outlaws guard stolen treasure.',
    goldRange:[200,500], expRange:[250,400], icon:'🏕️',
    monsters:[ m('scout','盗贼斥候','Bandit Scout',11,350,55,18,'🗡️'), m('warrior','盗贼战士','Bandit Warrior',13,500,75,25,'⚔️'), m('chief','盗贼头目','Bandit Chief',15,800,100,35,'👹') ],
  },
  {
    id:'d4', zh:'废弃城市',  name:'Ruined City',     lvReq:18, special:false, spiritReward:0, diamondReward:0,
    desc:'An ancient city fallen to the undead.',
    goldRange:[400,900], expRange:[400,650], icon:'🏚️',
    monsters:[ m('zombie','僵尸战士','Zombie Warrior',19,600,90,30,'🧟'), m('ske','骷髅法师','Skeleton Mage',21,500,120,20,'💀'), m('lich','不死领主','Undead Lord',23,1200,150,45,'☠️') ],
  },
  {
    id:'d5', zh:'沙漠神殿',  name:'Desert Temple',   lvReq:28, special:false, spiritReward:0, diamondReward:0,
    desc:'Ancient guardians protect sacred secrets.',
    goldRange:[700,1500], expRange:[650,1000], icon:'🏛️',
    monsters:[ m('jackal','豺狼战士','Jackal Warrior',30,1000,140,50,'🐺'), m('mummy','诅咒木乃伊','Cursed Mummy',32,1200,160,60,'🧟'), m('sphinx','沙漠狮身人','Sand Sphinx',35,2000,200,80,'🦁') ],
  },
  {
    id:'d6', zh:'冰封峡谷',  name:'Frozen Valley',   lvReq:38, special:false, spiritReward:0, diamondReward:0,
    desc:'Deadly ice monsters haunt this frozen wasteland.',
    goldRange:[1200,2500], expRange:[1000,1500], icon:'❄️',
    monsters:[ m('iwolf','冰狼','Ice Wolf',40,1800,200,70,'🐺'), m('igolem','冰傀儡','Ice Golem',43,2500,250,100,'🗿'), m('drake','霜龙','Frost Drake',45,4000,320,130,'🐲') ],
  },
  {
    id:'d7', zh:'火山顶峰',  name:'Volcano Peak',    lvReq:50, special:false, spiritReward:0, diamondReward:2,
    desc:'Creatures of fire and lava rule this volcanic peak.',
    goldRange:[2000,4000], expRange:[1500,2500], icon:'🌋',
    monsters:[ m('fdemon','火焰恶魔','Fire Demon',52,3000,350,120,'😈'), m('magma','岩浆巨人','Magma Giant',55,4500,420,150,'🔥'), m('fdragon','烈焰神龙','Fire Dragon',58,7000,550,200,'🐉') ],
  },
  {
    id:'d8', zh:'暗影领域',  name:'Shadow Realm',    lvReq:62, special:false, spiritReward:0, diamondReward:4,
    desc:'A realm where darkness reigns and shadows come alive.',
    goldRange:[3000,6000], expRange:[2000,3500], icon:'🌑',
    monsters:[ m('sknight','暗影骑士','Shadow Knight',64,5000,500,180,'🗡️'), m('wraith','暗影幽灵','Dark Wraith',67,6000,600,200,'👻'), m('sking','暗影霸主','Shadow Overlord',70,10000,800,280,'👾') ],
  },
  {
    id:'d9', zh:'恶魔宫殿',  name:"Demon's Palace",  lvReq:75, special:false, spiritReward:0, diamondReward:8,
    desc:"The demon king's fortress. Extreme danger awaits.",
    goldRange:[5000,10000], expRange:[3000,5000], icon:'🏰',
    monsters:[ m('dguard','恶魔卫兵','Demon Guard',77,8000,700,250,'😈'), m('dwarlord','恶魔战将','Demon Warlord',80,12000,900,320,'👿'), m('dking','恶魔之王','Demon King',85,20000,1200,450,'👿') ],
  },
  {
    id:'d10', zh:'巨龙巢穴', name:"Dragon's Lair",   lvReq:88, special:false, spiritReward:0, diamondReward:12,
    desc:'The ancient dragon sleeps atop mountains of treasure.',
    goldRange:[8000,15000], expRange:[5000,8000], icon:'🐉',
    monsters:[ m('edrake','远古龙','Elder Drake',90,15000,1000,380,'🐲'), m('wyrm','古老蛟龙','Ancient Wyrm',93,20000,1200,450,'🐲'), m('adragon','古龙','Ancient Dragon',95,35000,1600,600,'🐉') ],
  },
  // ── Special Dungeons (Lv 100+) ──
  {
    id:'sp1', zh:'天界之门', name:'Heaven Gates',    lvReq:100, special:true, spiritReward:3, diamondReward:20,
    desc:'🌟 SPECIAL — The divine realm beyond mortal comprehension. Drops Spirit Stones.',
    goldRange:[15000,30000], expRange:[10000,18000], icon:'⚜️',
    monsters:[ m('cguard','天界守卫','Celestial Guardian',102,30000,1500,600,'⚜️'), m('seraph','天使战士','Seraphim Warrior',106,45000,2000,800,'😇'), m('arch','大天使','Archangel',110,70000,2800,1100,'⚜️') ],
  },
  {
    id:'sp2', zh:'混沌裂缝', name:'Chaos Rift',      lvReq:105, special:true, spiritReward:5, diamondReward:30,
    desc:'🌟 SPECIAL — A rift in reality filled with chaotic entities.',
    goldRange:[20000,40000], expRange:[15000,25000], icon:'🌀',
    monsters:[ m('cspawn','混沌生物','Chaos Spawn',107,40000,2000,750,'🌀'), m('clord','混沌领主','Chaos Lord',112,60000,2500,950,'🌀'), m('cgod','混沌之神','Chaos God',118,100000,3500,1500,'🌀') ],
  },
  {
    id:'sp3', zh:'神之试炼', name:"God's Trial",     lvReq:120, special:true, spiritReward:10, diamondReward:50,
    desc:'🌟 SPECIAL — Face the trials of the gods. Best Spirit Stone source.',
    goldRange:[30000,60000], expRange:[25000,40000], icon:'⚡',
    monsters:[ m('gwarrior','神之战士','God Warrior',122,80000,3000,1200,'⚡'), m('gchamp','神之勇士','God Champion',128,120000,4000,1800,'⚡'), m('gavatar','神之化身','God Avatar',135,200000,6000,3000,'✨') ],
  },
];

// ─── SIGN-IN REWARDS ─────────────────────────────────────────────────────────
export const SIGNIN_REWARDS = [
  { day:1, gold:500,   diamond:0,   spirit:0,  label:'Day 1' },
  { day:2, gold:1000,  diamond:5,   spirit:0,  label:'Day 2' },
  { day:3, gold:2000,  diamond:10,  spirit:0,  label:'Day 3' },
  { day:4, gold:5000,  diamond:20,  spirit:0,  label:'Day 4' },
  { day:5, gold:10000, diamond:50,  spirit:1,  label:'Day 5' },
  { day:6, gold:20000, diamond:100, spirit:3,  label:'Day 6' },
  { day:7, gold:50000, diamond:200, spirit:10, label:'Day 7 ✨' },
];

export const MONTHLY_BONUS = { gold:200000, diamond:5000, spirit:50 };

// ─── GACHA POOLS ─────────────────────────────────────────────────────────────
export const GACHA_POOLS = {
  basic: {
    name:'Basic Draw', zh:'普通抽奖', cost:1000, currency:'gold' as const,
    desc:'Gold draw — Common to Rare gear', icon:'🎁',
    ids: ['w_iron','w_axe','w_bow','w_steel','a_cloth','a_leather','h_iron','h_steel','b_leather','b_iron','g_cloth','g_leather','bl_rope','bl_leather','r_copper','r_silver','r2_copper','n_stone','n_silver','o_buckler','o_shield'],
    rarePct: 20, epicPct: 0, legendaryPct: 0, divinePct: 0,
    pityAt: 50,
  },
  advanced: {
    name:'Advanced Draw', zh:'高级抽奖', cost:10, currency:'diamond' as const,
    desc:'Diamond draw — Rare to Epic gear', icon:'💫',
    ids: ['w_dagger','w_staff','w_flame','a_chain','a_mage','h_mage','b_swift','g_iron','g_battle','bl_iron','r_gold','r2_jade','n_topaz','n_emerald','o_iron','o_knight'],
    rarePct: 60, epicPct: 30, legendaryPct: 8, divinePct: 0,
    pityAt: 30,
  },
  divine: {
    name:'Divine Draw', zh:'神圣抽奖', cost:50, currency:'spirit' as const,
    desc:'Spirit Stone draw — Epic to Divine gear', icon:'⚜️',
    ids: ['w_dragon','w_chaos','w_heaven','a_dragon','a_divine','h_dragon','h_divine','b_shadow','b_divine','g_dragon','g_divine','r_dragon','r_divine','r2_sapph','r2_divine','n_dragon','n_divine','o_dragon','o_divine','bl_dragon'],
    rarePct: 0, epicPct: 40, legendaryPct: 45, divinePct: 13,
    pityAt: 10,
  },
};

// ─── DAILY TASKS ─────────────────────────────────────────────────────────────
export const DAILY_TASKS = [
  { id:'dt1', name:'Login Today',     zh:'今日登录',    desc:'Log in to the game',             gold:500,  diamond:0,  spirit:0  },
  { id:'dt2', name:'Clear 1 Dungeon', zh:'通关1个副本', desc:'Complete any dungeon',            gold:1000, diamond:2,  spirit:0  },
  { id:'dt3', name:'Clear 3 Dungeons',zh:'通关3个副本', desc:'Complete 3 dungeons',             gold:3000, diamond:5,  spirit:0  },
  { id:'dt4', name:'Daily Sign-In',   zh:'每日签到',    desc:'Claim your daily sign-in reward', gold:500,  diamond:0,  spirit:0  },
  { id:'dt5', name:'Open Shop',       zh:'逛商店',      desc:'Visit the shop',                  gold:200,  diamond:1,  spirit:0  },
];

export const WEEKLY_TASKS = [
  { id:'wt1', name:'Clear 10 Dungeons', zh:'通关10个副本', desc:'Complete 10 dungeons this week', gold:10000, diamond:20, spirit:1 },
  { id:'wt2', name:'Reach Level 10',    zh:'达到10级',     desc:'Reach player level 10',          gold:5000,  diamond:10, spirit:0 },
  { id:'wt3', name:'Buy from Shop',     zh:'商店购买',     desc:'Purchase any item from shop',     gold:2000,  diamond:5,  spirit:0 },
];
