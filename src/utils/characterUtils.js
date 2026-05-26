export const STAT_KEYS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

export const CLASS_COLORS = {
  Barbarian: "#f87171",
  Bard: "#fbbf24",
  Cleric: "#fcd34d",
  Druid: "#86efac",
  Fighter: "#fca5a5",
  Monk: "#fde68a",
  Paladin: "#fef08a",
  Ranger: "#6ee7b7",
  Rogue: "#d1d5db",
  Sorcerer: "#c084fc",
  Warlock: "#a78bfa",
  Wizard: "#93c5fd",
};

export const SKILLS = {
  Acrobatics: "DEX",
  AnimalHandling: "WIS",
  Arcana: "INT",
  Athletics: "STR",
  Deception: "CHA",
  History: "INT",
  Insight: "WIS",
  Intimidation: "CHA",
  Investigation: "INT",
  Medicine: "WIS",
  Nature: "INT",
  Perception: "WIS",
  Performance: "CHA",
  Persuasion: "CHA",
  Religion: "INT",
  SleightOfHand: "DEX",
  Stealth: "DEX",
  Survival: "WIS",
};

export const SAVE_PROFICIENCIES = {
  Barbarian: ["STR", "CON"],
  Bard: ["DEX", "CHA"],
  Cleric: ["WIS", "CHA"],
  Druid: ["INT", "WIS"],
  Fighter: ["STR", "CON"],
  Monk: ["STR", "DEX"],
  Paladin: ["WIS", "CHA"],
  Ranger: ["STR", "DEX"],
  Rogue: ["DEX", "INT"],
  Sorcerer: ["CON", "CHA"],
  Warlock: ["WIS", "CHA"],
  Wizard: ["INT", "WIS"],
};

const HIT_DIE_BY_CLASS = {
  barbarian: 12,
  fighter: 10,
  paladin: 10,
  ranger: 10,
  rogue: 8,
  bard: 8,
  cleric: 8,
  druid: 8,
  monk: 8,
  warlock: 8,
  sorcerer: 8,
  wizard: 6,
};

const HIT_DIE_AVERAGE = {
  12: 7,
  10: 6,
  8: 5,
  6: 4,
};

export function getClassColor(className) {
  return CLASS_COLORS[className] || "#ffd166";
}

export function scaleStat(stat, level) {
  return stat + Math.floor((level - 1) / 4);
}

export function getProficiencyBonus(level) {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}

export function getPassivePerception(wis) {
  return 10 + Math.floor((wis - 10) / 2);
}

export function calculateModifier(stat) {
  return Math.floor((Number(stat) - 10) / 2);
}

export function getHitDie(className) {
  return HIT_DIE_BY_CLASS[className?.toLowerCase()] || 6;
}

export function getAverageHitDie(hitDie) {
  return HIT_DIE_AVERAGE[hitDie] || 4;
}
