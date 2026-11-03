import type { NpcRawData } from '../types';
import pqdiRawMap from '../data/pqdi_npcs.json';

export const SPECIAL_ABILITY_MAP: Record<string, string> = {
  '1': 'Summon',
  '2': 'Enrage',
  '3': 'Rampage',
  '4': 'Area Rampage',
  '5': 'Flurry',
  '6': 'Triple Attack',
  '7': 'Dual Wield',
  '8': 'Bane Attack',
  '9': 'Magical Attack',
  '10': 'Ranged Attack',
  '11': 'Unslowable',
  '12': 'Unmezable',
  '13': 'Uncharmable',
  '14': 'Unstunable',
  '15': 'Unsnareable',
  '16': 'Unfearable',
  '17': 'Immune to Dispel',
  '18': 'Immune to Melee',
  '19': 'Immune to Magic',
  '20': 'Immune to Fleeing',
  '21': 'Immune to Non-Bane',
  '22': 'Immune to Non-Magical',
  '23': 'Will Not Aggro',
  '24': 'Immune to Aggro',
  '25': 'Resist Spell',
  '26': 'See Invisibility',
  '27': 'See Sneak',
  '28': 'See Feign Death',
  '29': 'See Improved Hide',
  '30': 'Scout',
  '31': 'Tethered',
  '32': 'Destructible Object',
  '33': 'No Harm from World',
  '34': 'Always Flee',
  '35': 'Flee Percentage',
  '36': 'Allow Beneficial',
  '37': 'Disable Melee',
  '38': 'Chase Distance',
  '39': 'Allow Tank',
  '40': 'Ignore Root Aggro',
  '41': 'Casting Resist Diff',
  '42': 'Counter Avoid Damage',
  '43': 'Slow Mitigation',
  '44': 'Reverse Slow'
};

export const CLASS_MAP: Record<string, string> = {
  '1': 'Warrior',
  '2': 'Cleric',
  '3': 'Paladin',
  '4': 'Ranger',
  '5': 'Shadow Knight',
  '6': 'Druid',
  '7': 'Monk',
  '8': 'Bard',
  '9': 'Rogue',
  '10': 'Shaman',
  '11': 'Necromancer',
  '12': 'Wizard',
  '13': 'Magician',
  '14': 'Enchanter',
  '15': 'Beastlord',
  '16': 'Berserker'
};

export function getNpcData(npcId: string | number): NpcRawData | null {
  const idStr = String(npcId);
  const data = (pqdiRawMap as Record<string, any>)[idStr];
  if (!data || data.error) return null;
  return data as NpcRawData;
}

export function parseSpecialAbilities(specialAbilitiesStr?: string): { name: string; param?: string }[] {
  if (!specialAbilitiesStr) return [];
  const parts = specialAbilitiesStr.split('^');
  const results: { name: string; param?: string }[] = [];

  for (const part of parts) {
    if (!part) continue;
    const sub = part.split(',');
    const id = sub[0];
    const enabled = sub[1];
    const param = sub[2];

    // If enabled is 0, it is disabled
    if (enabled === '0') continue;

    const abilityName = SPECIAL_ABILITY_MAP[id] || `Special #${id}`;
    results.push({
      name: abilityName,
      param: param && param !== '1' ? param : undefined
    });
  }

  return results;
}
