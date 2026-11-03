import { useState } from 'react';
import { flagCategories } from '../data/flagData';
import type { FlagDefinition } from '../types';

interface ProgressionTreeVisualProps {
  characterFlags: Record<string, string>;
  onFlagToggle: (flag: FlagDefinition, isChecked: boolean) => void;
  onOpenRaidGuide?: (zoneId: string) => void;
  onOpenNpc?: (npcId: string | number) => void;
}

// Flat list of all flags for lookup
const allFlags = flagCategories.flatMap(category => category.flags);

interface VisualNode {
  id: string;
  label: string;
  desc: string;
  type: 'group' | 'raid' | 'optional';
  x: number; // absolute coordinates inside 1080px canvas
  y: number; // absolute coordinates inside 1780px canvas
  wikiUrl?: string;
  pqdiUrl?: string;
  raidGuideZoneId?: string;
  npcId?: string | number;
  flags: {
    id: string;
    shortLabel: string;
    fullName: string;
  }[];
}

interface GroupBox {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const groupBoxes: GroupBox[] = [
  // TIER 1
  { id: 'pod', label: 'Plane of Disease', x: 40, y: 50, w: 220, h: 320 },
  { id: 'poj', label: 'Plane of Justice', x: 290, y: 50, w: 220, h: 320 },
  { id: 'poi', label: 'Plane of Innovation', x: 540, y: 50, w: 220, h: 320 },
  { id: 'pon', label: 'Plane of Nightmare', x: 790, y: 50, w: 250, h: 320 },
  
  // TIER 2
  { id: 'cod', label: 'Crypt of Decay', x: 40, y: 400, w: 220, h: 320 },
  { id: 'pos', label: 'Plane of Storms', x: 290, y: 400, w: 220, h: 320 },
  { id: 'pov', label: 'Plane of Valor', x: 540, y: 400, w: 220, h: 320 },
  { id: 'pot', label: 'Plane of Torment', x: 790, y: 400, w: 250, h: 340 },
  
  // TIER 3
  { id: 'bot', label: 'Bastion of Thunder', x: 40, y: 750, w: 220, h: 350 },
  { id: 'hoh', label: 'Halls of Honor', x: 290, y: 750, w: 220, h: 350 },
  { id: 'tactics', label: 'Plane of Tactics', x: 790, y: 750, w: 250, h: 250 },
  
  // TIER 3.5
  { id: 'sol', label: "Solusek Ro's Tower", x: 40, y: 1130, w: 1000, h: 140 },
  { id: 'library', label: 'Library Translations', x: 400, y: 1300, w: 280, h: 100 },
  
  // TIER 4
  { id: 'elementals', label: 'Elemental Planes (Fire / Air / Water / Earth)', x: 40, y: 1430, w: 1000, h: 230 },
  
  // TIER 5
  { id: 'time', label: 'Plane of Time', x: 400, y: 1690, w: 280, h: 100 }
];

const nodes: VisualNode[] = [
  // TIER 1
  {
    id: 'pod_adler',
    label: 'Adler Fuirstel',
    desc: 'PoD pre-flag: Speak to Adler in PoT Sick Bay and say "what ward". Tells Milyk about ward.',
    type: 'group',
    x: 150, y: 110,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Disease',
    pqdiUrl: 'https://www.pqdi.cc/npc/203394',
    raidGuideZoneId: 'podisease',
    flags: [
      { id: 'fuirstel_1', shortLabel: 'Hail', fullName: 'Speak to Adler Fuirstel' }
    ]
  },
  {
    id: 'pod_grummus',
    label: 'Grummus',
    desc: 'Defeat Grummus in Disease & hail Planar Projection. Grummus Ward obtained, enables Crypt of Decay entry.',
    type: 'group',
    x: 150, y: 210,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Disease',
    pqdiUrl: 'https://www.pqdi.cc/npc/205091',
    raidGuideZoneId: 'podisease',
    npcId: '205091',
    flags: [
      { id: 'fuirstel_2', shortLabel: 'Kill', fullName: 'Grummus Projection Hailed' }
    ]
  },
  {
    id: 'poj_mavuin',
    label: 'Mavuin Cell',
    desc: 'PoJ pre-flag: Locate Mavuin in the cells and say "information" to start the trial case process.',
    type: 'group',
    x: 400, y: 110,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Justice',
    pqdiUrl: 'https://www.pqdi.cc/npc/201081',
    raidGuideZoneId: 'pojustice',
    flags: [
      { id: 'mavuin_1', shortLabel: 'Hail', fullName: 'Mavuin cell spoken to' }
    ]
  },
  {
    id: 'poj_trials',
    label: 'Justice Trials',
    desc: 'Complete PoJ trial and speak to the Tribunal in the trial room ("mavuin sent me"), then go back and hail Mavuin in the cells to receive your flag.',
    type: 'group',
    x: 400, y: 210,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Justice',
    pqdiUrl: 'https://www.pqdi.cc/npc/201075',
    raidGuideZoneId: 'pojustice',
    npcId: '201075',
    flags: [
      { id: 'mavuin_2', shortLabel: 'Trial', fullName: 'Speak to Tribunal in Trial' },
      { id: 'mavuin_3', shortLabel: 'Return', fullName: 'Return to Mavuin in Cells' }
    ]
  },
  {
    id: 'poi_giwin',
    label: 'Giwin (Innovation)',
    desc: 'Innovation pre-flag: Speak to Giwin Mirakon inside the factory gate. Say "I will test the machine".',
    type: 'group',
    x: 650, y: 100,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Innovation',
    pqdiUrl: 'https://www.pqdi.cc/npc/206038',
    raidGuideZoneId: 'poinnovation',
    flags: [
      { id: 'zeks_1', shortLabel: 'Hail', fullName: 'Giwin in Innovation Factory' }
    ]
  },
  {
    id: 'poi_xanamech',
    label: 'Xanamech Nezmirthafen',
    desc: 'Optional: Kill Xanamech to get factory door key. At least one person will need this to unlock the door to the factory.',
    type: 'optional',
    x: 650, y: 190,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Innovation',
    pqdiUrl: 'https://www.pqdi.cc/npc/206208',
    raidGuideZoneId: 'poinnovation',
    npcId: '206208',
    flags: [] // Optional key, no flag checkbox
  },
  {
    id: 'poi_behemoth',
    label: 'Manaetic Behemoth',
    desc: 'Defeat the Manaetic Behemoth in the factory and hail Giwin Mirakon who spawns in the room immediately afterwards to unlock Plane of Tactics entry.',
    type: 'group',
    x: 650, y: 280,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Innovation',
    pqdiUrl: 'https://www.pqdi.cc/npc/206046',
    raidGuideZoneId: 'poinnovation',
    npcId: '206046',
    flags: [
      { id: 'zeks_2', shortLabel: 'Kill', fullName: 'Manaetic Behemoth Slain' }
    ]
  },
  {
    id: 'pon_adroha',
    label: 'Adroha Jezith',
    desc: 'PoN pre-flag: Say "Hail", then "tortured by nightmares" to Adroha Jezith in Plane of Tranquility Sick Bay.',
    type: 'group',
    x: 915, y: 100,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Nightmare',
    pqdiUrl: 'https://www.pqdi.cc/npc/203366',
    raidGuideZoneId: 'ponightmare',
    flags: [
      { id: 'thelin_1', shortLabel: 'Hail', fullName: 'Adroha spoken to' }
    ]
  },
  {
    id: 'pon_maze',
    label: 'Hedge Maze',
    desc: 'Complete the Hedge Maze event in Plane of Nightmare and hail Thelin Poxbourne at the end to get flagged.',
    type: 'group',
    x: 915, y: 190,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Nightmare',
    pqdiUrl: 'https://www.pqdi.cc/npc/204486',
    raidGuideZoneId: 'ponightmare',
    npcId: '204486',
    flags: [
      { id: 'thelin_2', shortLabel: 'Hail Thelin', fullName: 'Complete Hedge Maze & Hail Thelin' }
    ]
  },
  {
    id: 'pon_terris',
    label: 'Terris Thule',
    desc: 'Defeat Terris Thule in Nightmare and hail projection, then return to Elder Poxbourne in PoT.',
    type: 'group',
    x: 915, y: 280,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Nightmare',
    pqdiUrl: 'https://www.pqdi.cc/npc/221041',
    raidGuideZoneId: 'nightmareb',
    npcId: '221041',
    flags: [
      { id: 'thelin_3', shortLabel: 'Kill', fullName: 'Terris Thule Defeated' },
      { id: 'thelin_4', shortLabel: 'Return', fullName: 'Return to Elder Poxbourne' }
    ]
  },

  // TIER 2
  {
    id: 'cod_elder_fuirstel',
    label: 'Elder Fuirstel',
    desc: 'Decay pre-flag: Hail Elder Fuirstel in Plane of Tranquility Sick Bay after defeating Grummus to start Milyk\'s cure quest. Unlocks entry to Crypt of Decay.',
    type: 'group',
    x: 150, y: 460,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Crypt_of_Decay',
    pqdiUrl: 'https://www.pqdi.cc/npc/203375',
    raidGuideZoneId: 'codecay',
    flags: [
      { id: 'fuirstel_3', shortLabel: 'Hail', fullName: 'Hail Elder Fuirstel' }
    ]
  },
  {
    id: 'cod_tarkil',
    label: 'Carprin / Tarkil',
    desc: 'Complete the Carprin Deatharn event in Crypt of Decay and hail Tarkil Adan to gain lower depths floor access.',
    type: 'raid',
    x: 150, y: 550,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Crypt_of_Decay',
    pqdiUrl: 'https://www.pqdi.cc/npc/200232',
    raidGuideZoneId: 'codecay',
    npcId: '200232',
    flags: [
      { id: 'bertox_key_access', shortLabel: 'Carprin', fullName: 'Complete Carprin & Hail Tarkil' }
    ]
  },
  {
    id: 'cod_bertox',
    label: 'Bertoxxulous',
    desc: 'Defeat Bertoxxulous in the lower depths of Decay, hail the Planar Projection, and return to Elder Fuirstel in PoT.',
    type: 'raid',
    x: 150, y: 640,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Crypt_of_Decay',
    pqdiUrl: 'https://www.pqdi.cc/npc/200226',
    raidGuideZoneId: 'codecay',
    npcId: '200226',
    flags: [
      { id: 'fuirstel_4', shortLabel: 'Kill', fullName: 'Bertoxxulous Slain' },
      { id: 'fuirstel_5', shortLabel: 'Return', fullName: 'Elder Fuirstel final hail' }
    ]
  },
  {
    id: 'pos_askr',
    label: 'Askr (Storms)',
    desc: 'Give giant heads to Askr in Plane of Storms to get Talisman of Thunderous Foyer (BoT entry key).',
    type: 'group',
    x: 400, y: 560,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Storms',
    pqdiUrl: 'https://www.pqdi.cc/npc/210062',
    raidGuideZoneId: 'postorms',
    npcId: '210062',
    flags: [
      { id: 'karana_1', shortLabel: 'Heads', fullName: 'Storms: Speak to Askr' },
      { id: 'karana_2', shortLabel: 'Key', fullName: 'Storms: BoT Access Key' }
    ]
  },
  {
    id: 'pov_globe',
    label: 'Crystalline Globe',
    desc: 'Optional: Obtain Crystalline Globe to open Aerin\'Dar\'s lair door. At least one person in the group/raid needs this key.',
    type: 'optional',
    x: 650, y: 460,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Valor',
    raidGuideZoneId: 'povalor',
    flags: [] // Optional key, no checkbox
  },
  {
    id: 'pov_aerindar',
    label: 'Aerin`Dar',
    desc: 'Defeat Aerin\'Dar in Plane of Valor wasteland, hail the projection, and zone into Halls of Honor to complete your flag.',
    type: 'raid',
    x: 650, y: 550,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Valor',
    pqdiUrl: 'https://www.pqdi.cc/npc/208074',
    raidGuideZoneId: 'povalor',
    npcId: '208074',
    flags: [
      { id: 'aerindar_kill', shortLabel: 'Kill', fullName: 'Defeat Aerin\'Dar' },
      { id: 'aerindar_zone', shortLabel: 'HoH', fullName: 'Zone into Halls of Honor' }
    ]
  },

  // TIER 3
  {
    id: 'bot_torden_key',
    label: 'Agnarr\'s Key',
    desc: 'Optional: At least one person in the raid must be able to activate the stone to Agnarr\'s Chamber using the Symbol of Torden key.',
    type: 'optional',
    x: 150, y: 810,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Bastion_of_Thunder',
    raidGuideZoneId: 'bothunder',
    flags: [] // Optional key, no checkbox
  },
  {
    id: 'bot_agnarr',
    label: 'Agnarr / Karana',
    desc: 'Complete Agnarr the Storm Lord event then say "I will follow the path of the Fallen." to Karana inside the storm chamber.',
    type: 'raid',
    x: 150, y: 910,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Bastion_of_Thunder',
    pqdiUrl: 'https://www.pqdi.cc/npc/209026',
    raidGuideZoneId: 'bothunder',
    npcId: '209026',
    flags: [
      { id: 'karana_3', shortLabel: 'Askr', fullName: 'Hail Askr in BoT' },
      { id: 'karana_4', shortLabel: 'Karana', fullName: 'Defeat Agnarr & Hail Karana' }
    ]
  },
  {
    id: 'hoh_trials',
    label: 'Halls of Honor Trials',
    desc: 'Complete all 3 Trials of Honor (Rydda`Dar trial, Save Villagers trial, Nomads trial).',
    type: 'group',
    x: 400, y: 810,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Halls_of_Honor',
    pqdiUrl: 'https://www.pqdi.cc/npc/211106',
    raidGuideZoneId: 'hohonora',
    npcId: '211106',
    flags: [
      { id: 'hohtrials_1', shortLabel: 'Trial 1', fullName: 'Rydda`Dar (Northeast)' },
      { id: 'hohtrials_2', shortLabel: 'Trial 2', fullName: 'Save Villagers (Northwest)' },
      { id: 'hohtrials_3', shortLabel: 'Trial 3', fullName: 'Nomads (Southeast)' }
    ]
  },
  {
    id: 'hoh_marr',
    label: 'Mithaniel Marr',
    desc: 'Defeat Mithaniel Marr in his temple and hail the Planar Projection.',
    type: 'raid',
    x: 400, y: 910,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Halls_of_Honor',
    pqdiUrl: 'https://www.pqdi.cc/npc/220020',
    raidGuideZoneId: 'hohonorb',
    npcId: '220020',
    flags: [
      { id: 'mmarr_kill', shortLabel: 'Kill', fullName: 'Defeat Mithaniel Marr & Hail Projection' }
    ]
  },
  {
    id: 'pot_fahlia',
    label: 'Fahlia Shadyglade',
    desc: 'Torment pre-flag: Say "i will go" to Fahlia Shadyglade in Plane of Tranquility Sick Bay about Tylis Newleaf\'s coma.',
    type: 'group',
    x: 915, y: 460,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Torment',
    pqdiUrl: 'https://www.pqdi.cc/npc/203372',
    raidGuideZoneId: 'potorment',
    flags: [
      { id: 'tylis_1', shortLabel: 'Hail', fullName: 'Speak to Fahlia' }
    ]
  },
  {
    id: 'pot_sphere',
    label: 'Screaming Sphere',
    desc: 'Optional: Complete key quest to obtain A Screaming Sphere to unlock the door to Saryrn\'s Tower in Plane of Torment.',
    type: 'optional',
    x: 915, y: 540,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Torment',
    raidGuideZoneId: 'potorment',
    flags: [] // Optional key, no checkbox
  },
  {
    id: 'pot_tylis',
    label: 'Keeper of Sorrows',
    desc: 'Defeat the Keeper of Sorrows in Plane of Torment and hail Tylis Newleaf in the agony cage. Then return to PoT Sick Bay and hail both Fahlia and Tylis.',
    type: 'group',
    x: 915, y: 620,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Torment',
    pqdiUrl: 'https://www.pqdi.cc/npc/203373',
    raidGuideZoneId: 'potorment',
    npcId: '203373',
    flags: [
      { id: 'tylis_2', shortLabel: 'Hail Tylis', fullName: 'Rescue & Hail Tylis' },
      { id: 'tylis_3', shortLabel: 'Sick Bay', fullName: 'Go to PoT Sick Bay and Hail Fahlia & Tylis' }
    ]
  },
  {
    id: 'pot_saryrn',
    label: 'Saryrn',
    desc: 'Defeat Saryrn in Plane of Torment tower and hail Planar Projection.',
    type: 'raid',
    x: 915, y: 700,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Torment',
    pqdiUrl: 'https://www.pqdi.cc/npc/207001',
    raidGuideZoneId: 'potorment',
    npcId: '207001',
    flags: [
      { id: 'saryrn_kill', shortLabel: 'Kill', fullName: 'Defeat Saryrn' }
    ]
  },
  {
    id: 'tactics_twins',
    label: 'Tallon & Vallon Zek',
    desc: 'Defeat Tallon & Vallon Zek in Drunder. Then go to Grand Librarian Maelin in PoK library with the "Cipher" flag and say "what lore" to receive the combined "Zeks" flag.',
    type: 'raid',
    x: 915, y: 810,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Tactics',
    pqdiUrl: 'https://www.pqdi.cc/npc/214026',
    raidGuideZoneId: 'potactics',
    npcId: '214026',
    flags: [
      { id: 'zeks_3', shortLabel: 'Vallon', fullName: 'Defeat Vallon Zek' },
      { id: 'zeks_4', shortLabel: 'Tallon', fullName: 'Defeat Tallon Zek' },
      { id: 'zeks_6', shortLabel: 'Maelin', fullName: 'Hail Maelin with Cipher and say "what lore"' }
    ]
  },
  {
    id: 'tactics_rallos',
    label: 'Rallos Zek',
    desc: 'Defeat Rallos Zek in the Tactics Arena and hail Planar Projection.',
    type: 'raid',
    x: 915, y: 910,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Tactics',
    pqdiUrl: 'https://www.pqdi.cc/npc/214052',
    raidGuideZoneId: 'potactics',
    npcId: '214052',
    flags: [
      { id: 'zeks_7', shortLabel: 'Kill', fullName: 'Defeat Rallos Zek' }
    ]
  },

  // TIER 3.5 / TRANSITIONS
  {
    id: 'sol_pre',
    label: 'Miak & Cipher',
    desc: 'Tower of Sol Ro entry. Requires 6 prerequisite kills (Marr, Vallon, Tallon, Bertox, Saryrn, Terris), Cipher of Divine Language from Maelin, and Miak portal hail.',
    type: 'group',
    x: 200, y: 1200,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Solusek_Ro%27s_Tower',
    raidGuideZoneId: 'solrotower',
    flags: [
      { id: 'cipher_unlocked', shortLabel: 'Cipher', fullName: 'Cipher of Divine Language' },
      { id: 'pofire_1', shortLabel: 'Portal', fullName: 'Portal altered (Miak)' }
    ]
  },
  {
    id: 'sol_minis',
    label: 'Solusek Minis',
    desc: 'Defeat all 5 Tower wardens (Xuzl, Arlyxir, Protector of Dresolik, Rizlona, Jiva).',
    type: 'raid',
    x: 540, y: 1200,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Solusek_Ro%27s_Tower',
    raidGuideZoneId: 'solrotower',
    npcId: '212041',
    flags: [
      { id: 'sol_room_1', shortLabel: 'Xuzl', fullName: 'Xuzl Defeated (Wing 1)' },
      { id: 'sol_room_2', shortLabel: 'Arly', fullName: 'Arlyxir Defeated (Wing 2)' },
      { id: 'sol_room_3', shortLabel: 'Dres', fullName: 'Dresolik Defeated (Wing 3)' },
      { id: 'sol_room_4', shortLabel: 'Riz', fullName: 'Rizlona Defeated (Wing 4)' },
      { id: 'sol_room_5', shortLabel: 'Jiva', fullName: 'Jiva Defeated (Wing 5)' }
    ]
  },
  {
    id: 'sol_ro',
    label: 'Solusek Ro',
    desc: 'Defeat Solusek Ro at the top of the tower (requires defeating Rallos Zek). Hail Planar Projection to unlock direct access into the Plane of Fire.',
    type: 'raid',
    x: 880, y: 1200,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Solusek_Ro%27s_Tower',
    pqdiUrl: 'https://www.pqdi.cc/npc/212025',
    raidGuideZoneId: 'solrotower',
    npcId: '212025',
    flags: [
      { id: 'solusek_kill', shortLabel: 'Kill', fullName: 'Defeat Solusek Ro' }
    ]
  },
  {
    id: 'maelin_trans',
    label: 'Zebuxoruk Translations',
    desc: 'Zebuxoruk Translations: Hail Grand Librarian Maelin in PoK to unlock elemental planes zoning.',
    type: 'group',
    x: 540, y: 1350,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Grand_Librarian_Maelin',
    pqdiUrl: 'https://www.pqdi.cc/npc/202125',
    flags: [
      { id: 'zebuxoruk_1', shortLabel: 'Trans 1', fullName: 'Zebuxoruk Translation 1' },
      { id: 'zebuxoruk_2', shortLabel: 'Access', fullName: 'Translations: Elemental Access' }
    ]
  },

  // ELEMENTALS
  {
    id: 'elem_fire',
    label: 'Fennin Ro (Fire)',
    desc: 'Defeat Fennin Ro the Tyrant of Fire and hail Planar Projection.',
    type: 'raid',
    x: 160, y: 1540,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Fire',
    pqdiUrl: 'https://www.pqdi.cc/npc/217440',
    raidGuideZoneId: 'pofire',
    npcId: '217440',
    flags: [
      { id: 'essence_fire', shortLabel: 'Kill', fullName: 'Defeat Fennin Ro' }
    ]
  },
  {
    id: 'elem_air_key',
    label: 'Wind-Etched Key',
    desc: 'Optional – Obtain Wind Etched Key to zone up to Xegony Island. 1 person per group will need the key.',
    type: 'optional',
    x: 410, y: 1490,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Air',
    raidGuideZoneId: 'poair',
    flags: []
  },
  {
    id: 'elem_air',
    label: 'Xegony (Air)',
    desc: 'Defeat Xegony the Queen of Air and hail Planar Projection.',
    type: 'raid',
    x: 410, y: 1585,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Air',
    pqdiUrl: 'https://www.pqdi.cc/npc/215056',
    raidGuideZoneId: 'poair',
    npcId: '215056',
    flags: [
      { id: 'essence_air', shortLabel: 'Kill', fullName: 'Defeat Xegony' }
    ]
  },
  {
    id: 'elem_water',
    label: 'Coirnav (Water)',
    desc: 'Defeat Coirnav the Avatar of Water and hail Planar Projection.',
    type: 'raid',
    x: 670, y: 1540,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Water',
    pqdiUrl: 'https://www.pqdi.cc/npc/216048',
    raidGuideZoneId: 'powater',
    npcId: '216048',
    flags: [
      { id: 'essence_water', shortLabel: 'Kill', fullName: 'Defeat Coirnav' }
    ]
  },
  {
    id: 'elem_earth_key',
    label: 'Gem-Etched Key',
    desc: 'Optional – Kill Tantisala Jaggedtooth in Plane of Earth A. Loot Gem-Etched Key.',
    type: 'optional',
    x: 920, y: 1480,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Earth',
    raidGuideZoneId: 'poeartha',
    flags: []
  },
  {
    id: 'elem_earth_arbiter',
    label: 'Arbiter (Earth A)',
    desc: 'Complete the 4 ring events in Plane of EarthA to spawn A Mystical Arbitor of Earth.',
    type: 'raid',
    x: 920, y: 1550,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Earth',
    pqdiUrl: 'https://www.pqdi.cc/npc/218375',
    raidGuideZoneId: 'poeartha',
    npcId: '218375',
    flags: [
      { id: 'essence_earth_arbiter', shortLabel: 'Arbiter', fullName: 'Complete Ring Events & Kill Arbiter' }
    ]
  },
  {
    id: 'elem_earth_rathe',
    label: 'Rathe Council (B)',
    desc: 'Kill The Rathe Council in Plane of Earth B and Hail A Planar Projection to receive Mound of Living Stone.',
    type: 'raid',
    x: 920, y: 1620,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Earth',
    pqdiUrl: 'https://www.pqdi.cc/npc/222003',
    raidGuideZoneId: 'poearthb',
    npcId: '222003',
    flags: [
      { id: 'essence_earth_rathe', shortLabel: 'Rathe', fullName: 'Defeat The Rathe Council' }
    ]
  },

  // TIME
  {
    id: 'potime',
    label: 'Plane of Time Attuned',
    desc: 'Attune hourglass portal in Tranquility using elements and Maelin activation.',
    type: 'raid',
    x: 540, y: 1740,
    wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Time',
    raidGuideZoneId: 'potimeb',
    npcId: '223000',
    flags: [
      { id: 'time_portal_active', shortLabel: 'Attuned', fullName: 'Plane of Time Portal Attuned' }
    ]
  }
];

const connections = [
  // Adler -> Grummus
  { from: 'pod_adler', to: 'pod_grummus' },
  // Grummus -> Elder Fuirstel
  { from: 'pod_grummus', to: 'cod_elder_fuirstel' },
  // Elder Fuirstel -> Carprin/Tarkil
  { from: 'cod_elder_fuirstel', to: 'cod_tarkil' },
  // Carprin/Tarkil -> Bertox
  { from: 'cod_tarkil', to: 'cod_bertox' },

  // Mavuin -> Trials
  { from: 'poj_mavuin', to: 'poj_trials' },
  // Trials -> Askr (Storms)
  { from: 'poj_trials', to: 'pos_askr' },
  // Askr -> Agnarr
  { from: 'pos_askr', to: 'bot_agnarr' },
  // Trials -> Aerin`Dar (Valor)
  { from: 'poj_trials', to: 'pov_aerindar' },
  // Terris Thule & Bertoxxulous -> Fahlia (Torment)
  { from: 'pon_terris', to: 'pot_fahlia' },
  { from: 'cod_bertox', to: 'pot_fahlia' },
  // Fahlia -> Tylis
  { from: 'pot_fahlia', to: 'pot_tylis' },
  // Tylis -> Saryrn
  { from: 'pot_tylis', to: 'pot_saryrn' },

  // Innovation Giwin -> Behemoth
  { from: 'poi_giwin', to: 'poi_behemoth' },
  // Behemoth -> Twins
  { from: 'poi_behemoth', to: 'tactics_twins' },
  // Twins -> Rallos
  { from: 'tactics_twins', to: 'tactics_rallos' },

  // Adroha -> Hedge Maze
  { from: 'pon_adroha', to: 'pon_maze' },
  // Hedge Maze -> Terris
  { from: 'pon_maze', to: 'pon_terris' },
  // Valor -> Honor Trials
  { from: 'pov_aerindar', to: 'hoh_trials' },
  // Honor Trials -> Mithaniel Marr
  { from: 'hoh_trials', to: 'hoh_marr' },

  // Bosses required for Solusek Ro Tower entry (6 bosses: Bertox, Marr, Saryrn, Terris, Twins)
  { from: 'cod_bertox', to: 'sol_pre' },
  { from: 'hoh_marr', to: 'sol_pre' },
  { from: 'pot_saryrn', to: 'sol_pre' },
  { from: 'pon_terris', to: 'sol_pre' },
  { from: 'tactics_twins', to: 'sol_pre' },

  // Solusek Tower flow
  { from: 'sol_pre', to: 'sol_minis' },
  { from: 'sol_minis', to: 'sol_ro' },

  // Rallos Zek required to defeat Solusek Ro
  { from: 'tactics_rallos', to: 'sol_ro' },

  // Rallos -> Maelin Elemental translation
  { from: 'tactics_rallos', to: 'maelin_trans' },

  // Solusek Ro unlocks only Plane of Fire
  { from: 'sol_ro', to: 'elem_fire' },

  // Translations -> Elementals (except Fire)
  { from: 'maelin_trans', to: 'elem_air_key' },
  { from: 'elem_air_key', to: 'elem_air' },
  { from: 'maelin_trans', to: 'elem_water' },
  { from: 'maelin_trans', to: 'elem_earth_key' },
  { from: 'elem_earth_key', to: 'elem_earth_arbiter' },
  { from: 'elem_earth_arbiter', to: 'elem_earth_rathe' },

  // Elementals -> Time
  { from: 'elem_fire', to: 'potime' },
  { from: 'elem_air', to: 'potime' },
  { from: 'elem_water', to: 'potime' },
  { from: 'elem_earth_rathe', to: 'potime' }
];

export const ProgressionTreeVisual: React.FC<ProgressionTreeVisualProps> = ({
  characterFlags,
  onFlagToggle,
  onOpenRaidGuide,
  onOpenNpc
}) => {
  const [activePopupNodeId, setActivePopupNodeId] = useState<string | null>(null);

  // Check if a specific individual flag is completed
  const isFlagChecked = (flagId: string): boolean => {
    if (flagId.startsWith('hohtrials_')) {
      const bit = parseInt(flagId.split('_')[1], 10) - 1;
      const val = characterFlags['hohtrials'] || '000';
      return val[bit] === '1';
    }
    if (flagId.startsWith('sol_room_')) {
      const bit = parseInt(flagId.split('_')[2], 10) - 1;
      const val = characterFlags['sol_room'] || '00000';
      return val[bit] === '1';
    }

    const flagDef = allFlags.find(f => f.id === flagId);
    if (!flagDef) return false;

    const parentId = flagDef.parentFlagId || flagDef.id;
    const currentVal = characterFlags[parentId];
    if (!currentVal) return false;

    if (flagDef.isSubFlag && flagDef.bitPosition !== undefined) {
      return currentVal[flagDef.bitPosition] === '1';
    }
    if (flagDef.stepValue !== undefined) {
      const valNum = parseInt(currentVal, 10);
      return !isNaN(valNum) && valNum >= flagDef.stepValue;
    }
    return currentVal === (flagDef.stepValue !== undefined ? String(flagDef.stepValue) : '1') || currentVal === '2';
  };

  // Check if a visual node is fully completed
  const isNodeCompleted = (node: VisualNode): boolean => {
    if (node.flags.length === 0) return false;
    return node.flags.every(f => isFlagChecked(f.id));
  };

  const getBorderColor = (node: VisualNode) => {
    if (isNodeCompleted(node)) return 'var(--color-group)';
    if (node.type === 'raid') return 'rgba(239, 68, 68, 0.4)';
    if (node.type === 'optional') return 'rgba(59, 130, 246, 0.5)';
    return 'rgba(197, 168, 128, 0.4)';
  };

  const handleSubFlagChange = (flagId: string, checked: boolean) => {
    let realFlagId = flagId;
    if (flagId.startsWith('hohtrials_')) {
      const bit = parseInt(flagId.split('_')[1], 10) - 1;
      onFlagToggle({
        id: `hohtrials_bit_${bit}`,
        name: 'HoH Trial',
        description: '',
        type: 'group',
        zone: 'Halls of Honor',
        parentFlagId: 'hohtrials',
        isSubFlag: true,
        bitPosition: bit
      }, checked);
      return;
    }
    if (flagId.startsWith('sol_room_')) {
      const bit = parseInt(flagId.split('_')[2], 10) - 1;
      onFlagToggle({
        id: `sol_room_bit_${bit}`,
        name: 'Sol mini',
        description: '',
        type: 'raid',
        zone: 'Solusek Tower',
        parentFlagId: 'sol_room',
        isSubFlag: true,
        bitPosition: bit
      }, checked);
      return;
    }

    const flagDef = allFlags.find(f => f.id === realFlagId);
    if (flagDef) {
      onFlagToggle(flagDef, checked);
    }
  };

  // Helper to dynamically calculate popup container positioning based on node coordinates
  const getPopupStyle = (node: VisualNode): React.CSSProperties => {
    const style: React.CSSProperties = {
      position: 'absolute',
      width: '240px',
      backgroundColor: 'var(--color-bg-card)',
      border: '1px solid var(--color-gold-bright)',
      borderRadius: '6px',
      padding: '0.75rem',
      boxShadow: '0 8px 24px rgba(0,0,0,0.9)',
      zIndex: 200,
      color: 'var(--color-text-main)',
      fontSize: '0.75rem',
      textAlign: 'left',
      lineHeight: '1.4'
    };

    // Y alignment (above or below)
    if (node.y < 350) {
      style.top = '100%';
      style.bottom = 'auto';
    } else {
      style.bottom = '100%';
      style.top = 'auto';
    }

    // X alignment (left, right, or center)
    if (node.x < 250) {
      style.left = '0px';
      style.right = 'auto';
      const offsetSign = node.y < 350 ? '' : '-';
      style.transform = `translate(0, ${offsetSign}10px)`;
    } else if (node.x > 840) {
      style.left = 'auto';
      style.right = '0px';
      const offsetSign = node.y < 350 ? '' : '-';
      style.transform = `translate(0, ${offsetSign}10px)`;
    } else {
      style.left = '50%';
      style.right = 'auto';
      const offsetSign = node.y < 350 ? '' : '-';
      style.transform = `translate(-50%, ${offsetSign}10px)`;
    }

    return style;
  };

  const getTailStyle = (node: VisualNode): { tail: React.CSSProperties; tailBg: React.CSSProperties } => {
    const isBelow = node.y < 350;
    const isLeft = node.x < 250;
    const isRight = node.x > 840;

    const tail: React.CSSProperties = {
      position: 'absolute',
      marginLeft: '-6px',
      borderWidth: '6px',
      borderStyle: 'solid',
    };

    const tailBg: React.CSSProperties = {
      position: 'absolute',
      marginLeft: '-6px',
      borderWidth: '6px',
      borderStyle: 'solid',
    };

    // Y borders
    if (isBelow) {
      tail.bottom = '100%';
      tail.top = 'auto';
      tail.borderColor = 'transparent transparent var(--color-gold-bright) transparent';

      tailBg.bottom = '99%';
      tailBg.top = 'auto';
      tailBg.borderColor = 'transparent transparent var(--color-bg-card) transparent';
    } else {
      tail.top = '100%';
      tail.bottom = 'auto';
      tail.borderColor = 'var(--color-gold-bright) transparent transparent transparent';

      tailBg.top = '99%';
      tailBg.bottom = 'auto';
      tailBg.borderColor = 'var(--color-bg-card) transparent transparent transparent';
    }

    // X position
    if (isLeft) {
      tail.left = '30px';
      tailBg.left = '30px';
    } else if (isRight) {
      tail.left = 'auto';
      tail.right = '30px';
      tailBg.left = 'auto';
      tailBg.right = '30px';
    } else {
      tail.left = '50%';
      tailBg.left = '50%';
    }

    return { tail, tailBg };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onClick={() => setActivePopupNodeId(null)}>
      <div className="card" style={{ padding: '1rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
        <h4 style={{ fontSize: '1rem', color: 'var(--color-gold)' }}>Planar Tree Diagram:</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Click on any <span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', color: 'var(--color-gold-bright)' }}>Event/NPC name</span> to see detailed descriptions. Green paths indicate active progression pathways.
        </p>
      </div>

      <div style={{ overflowX: 'auto', width: '100%', border: 'var(--border-gold)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--border-glow)' }}>
        <div style={{ position: 'relative', width: '1080px', height: '1780px', backgroundColor: 'var(--color-bg-deep)', overflow: 'hidden' }}>
          
          {/* Plane Group Borders & Labels */}
          {groupBoxes.map(g => (
            <div
              key={g.id}
              style={{
                position: 'absolute',
                left: `${g.x}px`,
                top: `${g.y}px`,
                width: `${g.w}px`,
                height: `${g.h}px`,
                border: '1.5px dashed rgba(197, 168, 128, 0.45)',
                backgroundColor: 'rgba(32, 39, 47, 0.3)',
                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.6)',
                borderRadius: '8px',
                pointerEvents: 'none',
                zIndex: 2
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '15px',
                  backgroundColor: 'var(--color-bg-dark)',
                  padding: '1px 8px',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.75rem',
                  color: 'var(--color-gold-bright)',
                  border: '1.5px solid rgba(197, 168, 128, 0.55)',
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                {g.label}
              </div>
            </div>
          ))}

          {/* SVG Connection Lines layer */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 7 5 L 0 9 z" fill="rgba(255, 255, 255, 0.45)" />
              </marker>
              <marker id="arrow-active" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 1 L 7 5 L 0 9 z" fill="#34d399" />
              </marker>
            </defs>

            {connections.map((c, idx) => {
              const fromNode = nodes.find(n => n.id === c.from);
              const toNode = nodes.find(n => n.id === c.to);
              if (!fromNode || !toNode) return null;

              const active = isNodeCompleted(fromNode);

              const x1 = fromNode.x;
              const y1 = fromNode.y;
              const x2 = toNode.x;
              const y2 = toNode.y;

              const dx = x2 - x1;
              const dy = y2 - y1;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const ux = dx / dist;
              const uy = dy / dist;

              // Card is 145px wide, 50px tall. If mostly horizontal, offset 78px. If vertical, 30px.
              const startOffset = Math.abs(ux) > 0.7 ? 78 : 30;
              const endOffset = Math.abs(ux) > 0.7 ? 78 : 30;

              // Draw line starting just outside the source card and ending just before the destination card
              const ax1 = x1 + ux * startOffset;
              const ay1 = y1 + uy * startOffset;
              const ax2 = x2 - ux * (endOffset + 8); // add 8px padding for the arrow marker tip
              const ay2 = y2 - uy * (endOffset + 8);

              return (
                <path
                  key={idx}
                  d={`M ${ax1} ${ay1} L ${ax2} ${ay2}`}
                  stroke={active ? '#34d399' : 'rgba(255, 255, 255, 0.28)'}
                  strokeWidth={active ? 3.5 : 2}
                  fill="none"
                  markerEnd={active ? 'url(#arrow-active)' : 'url(#arrow)'}
                />
              );
            })}
          </svg>

          {/* Interactive HTML Nodes layer */}
          {nodes.map(node => {
            const completed = isNodeCompleted(node);
            const isPopupOpen = activePopupNodeId === node.id;

            return (
              <div
                key={node.id}
                style={{
                  position: 'absolute',
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isPopupOpen ? 110 : 10,
                  width: '145px',
                  backgroundColor: 'var(--color-bg-dark)',
                  border: `1px solid ${getBorderColor(node)}`,
                  boxShadow: completed ? '0 0 10px var(--color-group-glow)' : '0 4px 6px rgba(0,0,0,0.5)',
                  borderRadius: '6px',
                  padding: '0.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  fontSize: '0.78rem'
                }}
                className="visual-node-card"
                onClick={(e) => e.stopPropagation()} // Stop propagation to prevent immediate closing
              >
                {/* Clickable Detail Overlay Popup */}
                {isPopupOpen && (() => {
                  const { tail, tailBg } = getTailStyle(node);
                  return (
                    <div
                      style={getPopupStyle(node)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--color-gold-bright)' }}>{node.label}</span>
                        <button 
                          style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
                          onClick={() => setActivePopupNodeId(null)}
                        >
                          ✕
                        </button>
                      </div>
                      <p style={{ color: 'var(--color-text-muted)' }}>{node.desc}</p>
                      
                      {(node.raidGuideZoneId || node.pqdiUrl) && (
                        <div style={{ marginTop: '0.6rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {node.raidGuideZoneId && onOpenRaidGuide && (
                            <button
                              className="btn btn-group"
                              style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}
                              onClick={() => {
                                setActivePopupNodeId(null);
                                onOpenRaidGuide(node.raidGuideZoneId!);
                              }}
                            >
                              📖 View Raid Guide
                            </button>
                          )}
                          {node.npcId && onOpenNpc && (
                            <button
                              className="btn"
                              style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}
                              onClick={() => {
                                onOpenNpc(node.npcId!);
                              }}
                            >
                              ⚔️ Mob Combat Stats
                            </button>
                          )}
                        </div>
                      )}

                      {/* Tail arrow pointing to node name */}
                      <div style={tail} />
                      <div style={tailBg} />
                    </div>
                  );
                })()}

                {/* Header title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePopupNodeId(isPopupOpen ? null : node.id);
                    }}
                    style={{
                      fontWeight: 'bold',
                      color: completed ? '#34d399' : 'var(--color-gold-bright)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100px',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textDecorationStyle: 'dotted'
                    }}
                    title="Click to view details"
                  >
                    {node.label}
                  </span>
                  
                  {/* Small Action Icons */}
                  <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                    {node.raidGuideZoneId && onOpenRaidGuide && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenRaidGuide(node.raidGuideZoneId!);
                        }}
                        title="View Raid Encounter Guide"
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          color: '#34d399',
                          display: 'inline-flex',
                          alignItems: 'center'
                        }}
                      >
                        <svg style={{ width: '0.8rem', height: '0.8rem', fill: 'currentColor' }} viewBox="0 0 24 24">
                          <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
                        </svg>
                      </button>
                    )}
                    {node.wikiUrl && (
                      <a href={node.wikiUrl} target="_blank" rel="noopener noreferrer" title="Wiki Guide" style={{ color: 'var(--color-gold)', display: 'inline-flex' }}>
                        <svg style={{ width: '0.75rem', height: '0.75rem', fill: 'currentColor' }} viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                        </svg>
                      </a>
                    )}
                    {node.pqdiUrl && (
                      <a 
                        href={node.pqdiUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title="PQDI Mob Combat Stats" 
                        style={{ color: '#ab9b83', display: 'inline-flex' }}
                        onClick={(e) => {
                          if (node.npcId && onOpenNpc) {
                            e.preventDefault();
                            e.stopPropagation();
                            onOpenNpc(node.npcId);
                          }
                        }}
                      >
                        <svg style={{ width: '0.75rem', height: '0.75rem', fill: 'currentColor' }} viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>

                {/* Sub-steps checkboxes */}
                {node.flags.length > 0 ? (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.3rem',
                    backgroundColor: 'var(--color-bg-deep)',
                    padding: '0.2rem',
                    borderRadius: '4px',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    {node.flags.map(subFlag => {
                      const checked = isFlagChecked(subFlag.id);
                      return (
                        <label
                          key={subFlag.id}
                          title={subFlag.fullName}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.15rem',
                            fontSize: '0.68rem',
                            cursor: 'pointer',
                            color: checked ? '#34d399' : 'var(--color-text-muted)',
                            userSelect: 'none'
                          }}
                        >
                          <input
                            type="checkbox"
                            style={{
                              width: '0.7rem',
                              height: '0.7rem',
                              accentColor: 'var(--color-gold)',
                              cursor: 'pointer'
                            }}
                            checked={checked}
                            onChange={(e) => handleSubFlagChange(subFlag.id, e.target.checked)}
                          />
                          <span>{subFlag.shortLabel}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{
                    fontSize: '0.65rem',
                    color: 'var(--color-optional)',
                    textAlign: 'center',
                    padding: '0.2rem 0',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Optional Key
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default ProgressionTreeVisual;
