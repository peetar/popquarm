import type { LogParseResult, LogParseMatch } from '../types';

// Map Seer meditation text to character globals
const seerPhrases: { phrase: string; flag: string; value: string; bitPosition?: number; desc: string }[] = [
  {
    phrase: "Your soul has formed a bond with the Plane of Time",
    flag: "time",
    value: "1",
    desc: "Time: Hourglass Portal Attuned"
  },
  {
    phrase: "The History translated for you reveals the fate of Zebuxoruk",
    flag: "zebuxoruk",
    value: "1",
    desc: "Zebuxoruk Fate: Part 1"
  },
  {
    phrase: "Learning of Zebuxoruk's fate, the only way to save him is gather materials",
    flag: "zebuxoruk",
    value: "2",
    desc: "Zebuxoruk Fate: Part 2 (Elemental Access)"
  },
  {
    phrase: "You have shown your prowess in battle to Askr",
    flag: "karana",
    value: "1",
    desc: "Storms: Speak to Askr (Giant Heads)"
  },
  {
    phrase: "You have obtained the Talisman of Thunderous Foyer",
    flag: "karana",
    value: "2", // values 2 or 3 represent access
    desc: "Storms: Bastion of Thunder Access"
  },
  {
    phrase: "The information obtained from Karana is written in a language that you cannot comprehend",
    flag: "karana",
    value: "4",
    desc: "Thunder: Defeat Agnarr the Storm Lord"
  },
  {
    phrase: "The Cipher of the Divine Language appears on your arms",
    flag: "cipher",
    value: "1",
    desc: "Cipher of Druzzil"
  },
  {
    phrase: "Saryrn been destroyed.  An aura surrounds the mystical symbols",
    flag: "saryrn",
    value: "1",
    desc: "Torment: Defeat Saryrn"
  },
  {
    phrase: "Mithaniel has been bested.  An aura surrounds the mystical symbols",
    flag: "mmarr",
    value: "1",
    desc: "Temple of Marr: Defeat Mithaniel Marr"
  },
  {
    phrase: "The information obtained from Mithaniel is written in a language that you cannot comprehend",
    flag: "mmarr_book",
    value: "1",
    desc: "Temple of Marr: Book half"
  },
  {
    phrase: "You have beaten Rydda`Dar in the first of Honor's Trials",
    flag: "hohtrials",
    value: "1",
    bitPosition: 0,
    desc: "Honor: Rydda`Dar Trial (Northeast)"
  },
  {
    phrase: "You have saved the villagers in the second of Honor's Trials",
    flag: "hohtrials",
    value: "1",
    bitPosition: 1,
    desc: "Honor: Save Villagers Trial (Northwest)"
  },
  {
    phrase: "You have defeated the nomads in the third of Honor's Trials",
    flag: "hohtrials",
    value: "1",
    bitPosition: 2,
    desc: "Honor: Nomads Trial (Southeast)"
  },
  {
    phrase: "You have completed all of Honor's Trials",
    flag: "hohtrials",
    value: "111",
    desc: "Honor: All Trials Completed"
  },
  {
    phrase: "You have defeated the construct Aerin'Dar, but have not yet entered the Halls of Honor",
    flag: "aerindar",
    value: "1",
    desc: "Valor: Defeat Aerin`Dar"
  },
  {
    phrase: "You have bested Aerin`Dar and proven yourself honorable enough to pass",
    flag: "aerindar",
    value: "2",
    desc: "Valor: Zone into Halls of Honor"
  },
  {
    phrase: "The evidence of Mavuin is the only thing that can save him now",
    flag: "mavuin",
    value: "1",
    desc: "Justice: Mavuin spoken to"
  },
  {
    phrase: "Having endured the trials, the Tribunal has agreed to reconsider",
    flag: "mavuin",
    value: "2",
    desc: "Justice: Spoke to Tribunal"
  },
  {
    phrase: "Mavuin is grateful to you for taking his case before the Tribunal",
    flag: "mavuin",
    value: "3",
    desc: "Justice: Returned to Mavuin"
  },
  {
    phrase: "Tylis is being tortured by Saryrn.  The only way for him to get away",
    flag: "tylis",
    value: "1",
    desc: "Torment: Speak to Fahlia Shadyglade"
  },
  {
    phrase: "Tylis has been removed from his agony",
    flag: "tylis",
    value: "2",
    desc: "Torment: Keeper of Sorrows (Rescue Tylis)"
  },
  {
    phrase: "Tylis Newleaf has been rescued from the depths of the Plane of Torment",
    flag: "tylis",
    value: "3",
    desc: "Torment: Return to Fahlia & Tylis"
  },
  {
    phrase: "Thelin being tormented by the imagery of Terris Thule needs assisstance",
    flag: "thelin",
    value: "1",
    desc: "Nightmare: Speak to Adroha Jezith"
  },
  {
    phrase: "Thelin has completed his pact with Terris Thule, but has been refused",
    flag: "thelin",
    value: "2",
    desc: "Nightmare: Complete Hedge Maze Event"
  },
  {
    phrase: "Terris Thule's grasp over Thelin has been released",
    flag: "thelin",
    value: "3",
    desc: "Nightmare: Defeat Terris Thule"
  },
  {
    phrase: "Saved from a world of eternal nightmares, Thelin is forever in your debt",
    flag: "thelin",
    value: "4",
    desc: "Nightmare: Returned to Elder Poxbourne"
  },
  {
    phrase: "Alder Fuirstel wishes you to obtain the Ward from the Plane of Disease",
    flag: "fuirstel",
    value: "1",
    desc: "Disease: Speak to Adler Fuirstel"
  },
  {
    phrase: "Grummus has been destroyed, about his corpse you found a small ward",
    flag: "fuirstel",
    value: "2",
    desc: "Disease: Grummus Projection Hailed"
  },
  {
    phrase: "Milyk has been saved from certain death, but is not recovering",
    flag: "fuirstel",
    value: "3",
    desc: "Decay: Speak to Elder Fuirstel"
  },
  {
    phrase: "Bertoxxulous has been slain, the curse from Milyk now lifted",
    flag: "fuirstel",
    value: "4",
    desc: "Decay: Defeat Bertoxxulous"
  },
  {
    phrase: "Saved from certain doom, Milyk and Adler are forever in your debt",
    flag: "fuirstel",
    value: "5",
    desc: "Decay: Final Elder Fuirstel Hail"
  },
  {
    phrase: "entrance to the Crypt of Bertoxxulous should open before your might",
    flag: "grummus",
    value: "1",
    desc: "Disease: Crypt of Decay Access"
  },
  {
    phrase: "The portal into the Plane of Fire has been altered",
    flag: "pofire",
    value: "1",
    desc: "Solusek: Portal Altered (Miak)"
  },
  {
    phrase: "Xuzl's arcane wisdom pulses in your mind",
    flag: "sol_room",
    value: "1",
    bitPosition: 0,
    desc: "Solusek: Xuzl Defeated (Wing 1)"
  },
  {
    phrase: "Arlyxir's wealth of knowledge flows through your mind",
    flag: "sol_room",
    value: "1",
    bitPosition: 1,
    desc: "Solusek: Arlyxir Defeated (Wing 2)"
  },
  {
    phrase: "The power of Dresolik surges through you",
    flag: "sol_room",
    value: "1",
    bitPosition: 2,
    desc: "Solusek: Protector of Dresolik Defeated (Wing 3)"
  },
  {
    phrase: "Rizlona's song slips through your thoughts",
    flag: "sol_room",
    value: "1",
    bitPosition: 3,
    desc: "Solusek: Rizlona Defeated (Wing 4)"
  },
  {
    phrase: "Jiva's strength fills your body",
    flag: "sol_room",
    value: "1",
    bitPosition: 4,
    desc: "Solusek: Jiva Defeated (Wing 5)"
  },
  {
    phrase: "The true route to the Plane of Fire is now clear in your mind",
    flag: "pofire",
    value: "2",
    desc: "Solusek: Defeat Solusek Ro"
  },
  {
    phrase: "Giwin would like you to find him in Drunder so he can present you",
    flag: "zeks",
    value: "2",
    desc: "Innovation: Manaetic Behemoth Defeated"
  },
  {
    phrase: "The pack of notes from Vallon are scribbled in a language that you cannot",
    flag: "zeks",
    value: "3", // Note: zeks can be 3, 4, or 5 depending on Vallon/Tallon order. We will map to 3 here, logic will handle merges.
    desc: "Tactics: Defeat Vallon Zek"
  },
  {
    phrase: "The pack of notes from Tallon are scribbled in a language that you cannot",
    flag: "zeks",
    value: "4",
    desc: "Tactics: Defeat Tallon Zek"
  },
  {
    phrase: "The words of Maelin echo in your mind, 'The Zeks and Solusek are planning",
    flag: "zeks",
    value: "6",
    desc: "Tactics: Spoke to Maelin about Solusek Ro"
  },
  {
    phrase: "The parchments of Rallos are scribed in a language that you cannot",
    flag: "zeks",
    value: "7",
    desc: "Tactics: Defeat Rallos Zek"
  },
  {
    phrase: "three small turns to the right on the bottommost rivet should open the door",
    flag: "poi_door",
    value: "1",
    desc: "Innovation: Xanamech / Factory Door Key"
  }
];

// Map Trial Emotes directly
const emotePhrases: { phrase: string; flag: string; value: string; bitPosition?: number; desc: string }[] = [
  {
    phrase: "Your body begins to emanate with the power of Trydan Faye",
    flag: "hohtrials",
    value: "1",
    bitPosition: 0,
    desc: "Honor: Rydda`Dar Trial (Northeast)"
  },
  {
    phrase: "Your body begins to emanate with the power of Rhaliq Trell",
    flag: "hohtrials",
    value: "1",
    bitPosition: 1,
    desc: "Honor: Save Villagers Trial (Northwest)"
  },
  {
    phrase: "Your body begins to emanate with the power of Alekson Garn",
    flag: "hohtrials",
    value: "1",
    bitPosition: 2,
    desc: "Honor: Nomads Trial (Southeast)"
  }
];

// Helper to parse timestamps from EverQuest log lines:
// e.g. "[Sat Aug 15 10:44:07 2026] Seer Mal Nae`Shi tells you, '...'"
const LOG_LINE_REGEX = /^\[([^\]]+)\]\s+(.+)$/;

export function parseLogText(text: string): LogParseResult {
  const lines = text.split(/\r?\n/);
  const matches: LogParseMatch[] = [];
  let parsedLinesCount = 0;

  for (const line of lines) {
    if (!line.trim()) continue;
    parsedLinesCount++;

    const logMatch = line.match(LOG_LINE_REGEX);
    if (!logMatch) continue;

    const timestamp = logMatch[1];
    const message = logMatch[2];

    // Check Seer Phrases
    for (const item of seerPhrases) {
      if (message.includes(item.phrase)) {
        matches.push({
          line,
          timestamp,
          matchedFlagId: item.flag,
          newValue: item.value,
          bitPosition: item.bitPosition,
          description: item.desc
        });
      }
    }

    // Check Trial Emote Phrases
    for (const item of emotePhrases) {
      if (message.includes(item.phrase)) {
        matches.push({
          line,
          timestamp,
          matchedFlagId: item.flag,
          newValue: item.value,
          bitPosition: item.bitPosition,
          description: item.desc
        });
      }
    }
  }

  // Deduplicate and filter matches: keep only the most recent match for a given flag and bit position
  const uniqueMatchesMap = new Map<string, LogParseMatch>();
  for (const match of matches) {
    const key = `${match.matchedFlagId}_${match.bitPosition ?? ''}`;
    // Since we parse top to bottom, later lines are newer. Overwrite previous matches.
    uniqueMatchesMap.set(key, match);
  }

  const finalMatches = Array.from(uniqueMatchesMap.values());

  return {
    matches: finalMatches,
    unlockedFlagsCount: finalMatches.length,
    parsedLinesCount
  };
}

// Slice log files to read only the last few megabytes for performance
export async function readLastChunkOfFile(file: File, maxMegaBytes: number = 5): Promise<string> {
  const size = file.size;
  const bytesToRead = Math.min(size, maxMegaBytes * 1024 * 1024);
  const startByte = size - bytesToRead;

  const blob = file.slice(startByte, size);
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string || '');
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsText(blob, 'utf-8');
  });
}

// Database Globals Query Parser:
// Parses text copy-pasted from SQL output (like a MySQL CLI table or insert statement list)
// Matches lines like:
// "| character_id | npc_id | zone_id | name | value |"
// or "INSERT INTO `quest_globals` VALUES (1234, 0, 0, 'fuirstel', '5', ...)"
// or simple lines like "fuirstel 5"
export function parseDatabaseDump(text: string): Record<string, string> {
  const flags: Record<string, string> = {};
  const lines = text.split(/\r?\n/);

  // Look for insert statements: e.g. VALUES (123, 0, 0, 'fuirstel', '5', ...)
  const insertRegex = /VALUES\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*'([^']+)'\s*,\s*'([^']+)'/i;
  // Look for SQL table rows: | 1234 | 0 | 0 | fuirstel | 5 |
  const sqlRowRegex = /\|\s*\d+\s*\|\s*\d+\s*\|\s*\d+\s*\|\s*([a-zA-Z0-9_]+)\s*\|\s*([a-zA-Z0-9_]+)\s*\|/;
  // Simple key-value: fuirstel 5 or fuirstel=5 or fuirstel\t5
  const kvRegex = /^\s*([a-zA-Z0-9_]+)\s*[=\t\s:]+\s*([a-zA-Z0-9_]+)\s*$/;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('--') || trimmed.startsWith('#')) continue;

    let flagName = '';
    let flagValue = '';

    const insertMatch = trimmed.match(insertRegex);
    if (insertMatch) {
      flagName = insertMatch[1];
      flagValue = insertMatch[2];
    } else {
      const sqlRowMatch = trimmed.match(sqlRowRegex);
      if (sqlRowMatch) {
        flagName = sqlRowMatch[1].trim();
        flagValue = sqlRowMatch[2].trim();
      } else {
        const kvMatch = trimmed.match(kvRegex);
        if (kvMatch) {
          flagName = kvMatch[1].trim();
          flagValue = kvMatch[2].trim();
        }
      }
    }

    if (flagName && flagValue) {
      // Valid PoP globals to keep
      const validGlobals = [
        'mavuin', 'seventh', 'thelin', 'poi_door', 'zeks', 'fuirstel', 'grummus',
        'aerindar', 'bertox_key', 'hohtrials', 'mmarr', 'mmarr_book', 'tylis',
        'saryrn', 'karana', 'cipher', 'sol_room', 'zebuxoruk', 'pofire', 'time',
        'earthb_key'
      ];
      if (validGlobals.includes(flagName.toLowerCase()) || flagName.toLowerCase().startsWith('cl_')) {
        flags[flagName.toLowerCase()] = flagValue;
      }
    }
  }

  return flags;
}

// Convert a parsed character flags map into UI-friendly checkboxes/selects
export function applyParsedFlagsToCharacterFlags(
  currentFlags: Record<string, string>,
  incomingFlags: Record<string, string>
): Record<string, string> {
  const updated = { ...currentFlags };

  Object.entries(incomingFlags).forEach(([flagId, val]) => {
    const name = flagId.toLowerCase();
    if (name === 'hohtrials' || name === 'sol_room') {
      // Merge strings (character by character)
      const currentVal = updated[name] || (name === 'hohtrials' ? '000' : '00000');
      const incomingVal = val;
      let merged = '';
      for (let i = 0; i < currentVal.length; i++) {
        const cChar = currentVal[i];
        const iChar = incomingVal[i] || '0';
        merged += (cChar === '1' || iChar === '1') ? '1' : '0';
      }
      updated[name] = merged;
    } else {
      // Numeric or direct string comparison. Keep maximum step value if numeric.
      const currentValNum = parseInt(updated[name] || '0', 10);
      const incomingValNum = parseInt(val, 10);

      if (!isNaN(currentValNum) && !isNaN(incomingValNum)) {
        updated[name] = Math.max(currentValNum, incomingValNum).toString();
      } else {
        updated[name] = val;
      }
    }
  });

  return updated;
}
