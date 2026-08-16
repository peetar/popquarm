export type ClassName =
  | 'Bard'
  | 'Beastlord'
  | 'Cleric'
  | 'Druid'
  | 'Enchanter'
  | 'Magician'
  | 'Monk'
  | 'Necromancer'
  | 'Paladin'
  | 'Ranger'
  | 'Rogue'
  | 'Shadow Knight'
  | 'Shaman'
  | 'Warrior'
  | 'Wizard';

export type FlagType = 'group' | 'raid' | 'checklist' | 'optional';

export interface FlagDefinition {
  id: string; // The database global name, e.g. "fuirstel", "thelin", "zeks", "hohtrials", etc.
  name: string; // Human readable name
  description: string;
  type: FlagType;
  zone: string;
  npc?: string;
  wikiUrl?: string;
  pqdiUrl?: string;
  maxValue?: number; // For step-based flags (e.g., fuirstel goes up to 5)
  isSubFlag?: boolean; // True if it's part of a compound flag (like hohtrials bit positions or sol_room bit positions)
  bitPosition?: number; // 0-indexed position in a bitmask-like string flag (e.g., hohtrials = "111")
  parentFlagId?: string; // If this is a sub-flag, which character global holds it
  displayStepName?: string; // Human readable label for the specific step value
  stepValue?: number; // For step-based flags, the exact value this sub-item represents
}

export interface Character {
  id: string; // UUID or timestamp
  name: string;
  class: ClassName;
  level: number;
  flags: Record<string, string>; // e.g. { "fuirstel": "5", "thelin": "4", "hohtrials": "111" }
  createdAt: number;
  updatedAt: number;
}

export interface LogParseMatch {
  line: string;
  timestamp: string;
  matchedFlagId: string;
  newValue: string;
  bitPosition?: number;
  description: string;
}

export interface LogParseResult {
  matches: LogParseMatch[];
  unlockedFlagsCount: number;
  parsedLinesCount: number;
}
