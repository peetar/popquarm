import type { FlagDefinition } from '../types';

export interface FlagCategory {
  id: string;
  name: string;
  description: string;
  flags: FlagDefinition[];
}

export const flagCategories: FlagCategory[] = [
  {
    id: 'tier1',
    name: 'Tier 1 Planes',
    description: 'Initial entry planes available at level 46+. Completing these unlocks Tier 2.',
    flags: [
      // Plane of Disease
      {
        id: 'fuirstel_1',
        name: 'Disease: Speak to Adler Fuirstel',
        description: 'Speak to Adler Fuirstel in Plane of Tranquility near the PoDisease zone in. Say "what ward".',
        type: 'group',
        zone: 'Plane of Tranquility',
        npc: 'Adler Fuirstel',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Disease',
        pqdiUrl: 'https://www.pqdi.cc/npc/203394',
        raidGuideZoneId: 'podisease',
        parentFlagId: 'fuirstel',
        stepValue: 1,
        displayStepName: 'Fuirstel Step 1'
      },
      {
        id: 'fuirstel_2',
        name: 'Disease: Grummus Projection Hailed',
        description: 'Defeat Grummus in the Plane of Disease and hail the Planar Projection that spawns.',
        type: 'group',
        zone: 'Plane of Disease',
        npc: 'Grummus',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Disease',
        pqdiUrl: 'https://www.pqdi.cc/npc/205091',
        raidGuideZoneId: 'podisease',
        npcId: '205091',
        parentFlagId: 'fuirstel',
        stepValue: 2,
        displayStepName: 'Fuirstel Step 2'
      },
      {
        id: 'grummus_access',
        name: 'Disease: Crypt of Decay Access',
        description: 'Gained automatically upon hailing Grummus Projection. Allows you to zone into Crypt of Decay.',
        type: 'group',
        zone: 'Plane of Disease',
        npc: 'Planar Projection',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Disease',
        raidGuideZoneId: 'podisease',
        npcId: '205091',
        parentFlagId: 'grummus',
        stepValue: 1
      },
      // Plane of Justice
      {
        id: 'mavuin_1',
        name: 'Justice: Speak to Mavuin',
        description: 'Locate Mavuin in the Plane of Justice cells and say "information" to start the trial process.',
        type: 'group',
        zone: 'Plane of Justice',
        npc: 'Mavuin',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Justice',
        pqdiUrl: 'https://www.pqdi.cc/npc/201081',
        raidGuideZoneId: 'pojustice',
        parentFlagId: 'mavuin',
        stepValue: 1
      },
      {
        id: 'mavuin_2',
        name: 'Justice: Complete trial & speak to Tribunal',
        description: 'Complete any of the 6 Trials of Justice, loot the Mark, and say "mavuin sent me" to a Tribunal NPC in the trial room.',
        type: 'group',
        zone: 'Plane of Justice',
        npc: 'The Tribunal',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Justice',
        raidGuideZoneId: 'pojustice',
        npcId: '201075',
        parentFlagId: 'mavuin',
        stepValue: 2
      },
      {
        id: 'mavuin_3',
        name: 'Justice: Return to Mavuin',
        description: 'Return to Mavuin in the cells and hail him after completing the trial to receive your progression flag.',
        type: 'group',
        zone: 'Plane of Justice',
        npc: 'Mavuin',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Justice',
        pqdiUrl: 'https://www.pqdi.cc/npc/201081',
        raidGuideZoneId: 'pojustice',
        parentFlagId: 'mavuin',
        stepValue: 3
      },
      // Plane of Innovation
      {
        id: 'poi_factory_key',
        name: 'Innovation: Xanamech / Factory Door (Optional Key)',
        description: 'Kill Xanamech Nezmirthafen to get factory key. Only one person in group/raid needs this to open the factory gate.',
        type: 'optional',
        zone: 'Plane of Innovation',
        npc: 'Xanamech Nezmirthafen',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Innovation',
        pqdiUrl: 'https://www.pqdi.cc/npc/206208',
        raidGuideZoneId: 'poinnovation',
        npcId: '206208',
        parentFlagId: 'poi_door',
        stepValue: 1
      },
      {
        id: 'zeks_1',
        name: 'Innovation: Spoke to Giwin Mirakon in Factory',
        description: 'Speak to Giwin Mirakon inside the factory gate. Say "I will test the machine".',
        type: 'group',
        zone: 'Plane of Innovation',
        npc: 'Giwin Mirakon',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Innovation',
        pqdiUrl: 'https://www.pqdi.cc/npc/206038',
        raidGuideZoneId: 'poinnovation',
        parentFlagId: 'zeks',
        stepValue: 1
      },
      {
        id: 'zeks_2',
        name: 'Innovation: Manaetic Behemoth Hailed',
        description: 'Defeat Manaetic Behemoth and hail Giwin Mirakon who spawns in the room immediately afterwards.',
        type: 'raid',
        zone: 'Plane of Innovation',
        npc: 'Manaetic Behemoth',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Innovation',
        pqdiUrl: 'https://www.pqdi.cc/npc/206046',
        raidGuideZoneId: 'poinnovation',
        npcId: '206046',
        parentFlagId: 'zeks',
        stepValue: 2
      },
      // Plane of Nightmare
      {
        id: 'thelin_1',
        name: 'Nightmare: Speak to Adroha Jezith',
        description: 'Say "Hail", then "tortured by nightmares" to Adroha Jezith in Plane of Tranquility Sick Bay.',
        type: 'group',
        zone: 'Plane of Tranquility',
        npc: 'Adroha Jezith',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Nightmare',
        pqdiUrl: 'https://www.pqdi.cc/npc/203366',
        raidGuideZoneId: 'ponightmare',
        parentFlagId: 'thelin',
        stepValue: 1
      },
      {
        id: 'thelin_2',
        name: 'Nightmare: Complete Hedge Maze Event',
        description: 'Complete the Hedge Maze event in Plane of Nightmare. Hail Thelin Poxbourne at the end to zone out.',
        type: 'group',
        zone: 'Plane of Nightmare',
        npc: 'Thelin Poxbourne',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Nightmare',
        pqdiUrl: 'https://www.pqdi.cc/npc/204486',
        raidGuideZoneId: 'ponightmare',
        npcId: '204486',
        parentFlagId: 'thelin',
        stepValue: 2
      },
      {
        id: 'thelin_3',
        name: 'Nightmare: Defeat Terris Thule',
        description: 'Defeat Terris Thule in Plane of Nightmare B (Lair of Terris Thule) and hail the Planar Projection.',
        type: 'raid',
        zone: 'Plane of Nightmare B',
        npc: 'Terris Thule',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Nightmare',
        pqdiUrl: 'https://www.pqdi.cc/npc/221041',
        raidGuideZoneId: 'nightmareb',
        npcId: '221041',
        parentFlagId: 'thelin',
        stepValue: 3
      },
      {
        id: 'thelin_4',
        name: 'Nightmare: Return to Elder Poxbourne',
        description: 'Go back to Plane of Tranquility Sick Bay and hail Elder Poxbourne to complete the Nightmare line.',
        type: 'group',
        zone: 'Plane of Tranquility',
        npc: 'Elder Poxbourne',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Nightmare',
        pqdiUrl: 'https://www.pqdi.cc/npc/203374',
        raidGuideZoneId: 'nightmareb',
        parentFlagId: 'thelin',
        stepValue: 4
      }
    ]
  },
  {
    id: 'tier2',
    name: 'Tier 2 Planes',
    description: 'Requires completion of specific Tier 1 flags. Access to Crypt of Decay, Valor, Storms, and Torment.',
    flags: [
      // Crypt of Decay
      {
        id: 'fuirstel_3',
        name: 'Decay: Speak to Elder Fuirstel',
        description: 'Hail Elder Fuirstel in Plane of Tranquility Sick Bay after defeating Grummus.',
        type: 'group',
        zone: 'Plane of Tranquility',
        npc: 'Elder Fuirstel',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Crypt_of_Decay',
        pqdiUrl: 'https://www.pqdi.cc/npc/203375',
        raidGuideZoneId: 'codecay',
        parentFlagId: 'fuirstel',
        stepValue: 3
      },
      {
        id: 'bertox_key_access',
        name: 'Decay: Access to Lower Depths (Carprin)',
        description: 'Complete the Carprin Event in Crypt of Decay and hail Tarkil Adan to gain lower floor access.',
        type: 'raid',
        zone: 'Crypt of Decay',
        npc: 'Tarkil Adan',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Crypt_of_Decay',
        pqdiUrl: 'https://www.pqdi.cc/npc/200232',
        raidGuideZoneId: 'codecay',
        npcId: '200232',
        parentFlagId: 'bertox_key',
        stepValue: 1
      },
      {
        id: 'fuirstel_4',
        name: 'Decay: Defeat Bertoxxulous',
        description: 'Complete the Bertoxxulous Event in Crypt of Decay lower depths and hail the Planar Projection.',
        type: 'raid',
        zone: 'Crypt of Decay',
        npc: 'Bertoxxulous',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Crypt_of_Decay',
        pqdiUrl: 'https://www.pqdi.cc/npc/200226',
        raidGuideZoneId: 'codecay',
        npcId: '200226',
        parentFlagId: 'fuirstel',
        stepValue: 4
      },
      {
        id: 'fuirstel_5',
        name: 'Decay: Return to Elder Fuirstel',
        description: 'Hail Elder Fuirstel one final time in the Plane of Tranquility Sick Bay to finish the Decay line.',
        type: 'group',
        zone: 'Plane of Tranquility',
        npc: 'Elder Fuirstel',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Crypt_of_Decay',
        pqdiUrl: 'https://www.pqdi.cc/npc/203375',
        raidGuideZoneId: 'codecay',
        parentFlagId: 'fuirstel',
        stepValue: 5
      },
      // Plane of Torment
      {
        id: 'tylis_1',
        name: 'Torment: Speak to Fahlia Shadyglade',
        description: 'Say "i will go" to Fahlia Shadyglade in Plane of Tranquility Sick Bay about Tylis Newleaf\'s coma. Requires completing PoNightmare and PoDisease/CoD lines.',
        type: 'group',
        zone: 'Plane of Tranquility',
        npc: 'Fahlia Shadyglade',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Torment',
        pqdiUrl: 'https://www.pqdi.cc/npc/203372',
        raidGuideZoneId: 'potorment',
        parentFlagId: 'tylis',
        stepValue: 1
      },
      {
        id: 'tylis_2',
        name: 'Torment: Keeper of Sorrows (Rescue Tylis)',
        description: 'Complete the Keeper of Sorrows event in Plane of Torment and hail Tylis Newleaf inside the agony cage.',
        type: 'group',
        zone: 'Plane of Torment',
        npc: 'Tylis Newleaf',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Torment',
        pqdiUrl: 'https://www.pqdi.cc/npc/203373',
        raidGuideZoneId: 'potorment',
        npcId: '203373',
        parentFlagId: 'tylis',
        stepValue: 2
      },
      {
        id: 'tylis_3',
        name: 'Torment: Return to Fahlia & Tylis',
        description: 'Go to Plane of Tranquility Sick Bay and hail both Fahlia Shadyglade and Tylis Newleaf to complete the Tylis rescue series.',
        type: 'group',
        zone: 'Plane of Tranquility',
        npc: 'Tylis Newleaf',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Torment',
        raidGuideZoneId: 'potorment',
        parentFlagId: 'tylis',
        stepValue: 3
      },
      {
        id: 'saryrn_kill',
        name: 'Torment: Defeat Saryrn',
        description: 'Kill Saryrn in Plane of Torment and hail the Planar Projection.',
        type: 'raid',
        zone: 'Plane of Torment',
        npc: 'Saryrn',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Torment',
        pqdiUrl: 'https://www.pqdi.cc/npc/207001',
        raidGuideZoneId: 'potorment',
        npcId: '207001',
        parentFlagId: 'saryrn',
        stepValue: 1
      },
      // Plane of Storms
      {
        id: 'karana_1',
        name: 'Storms: Speak to Askr the Lost (Giant Heads)',
        description: 'Find Askr the Lost at the zone-in of Plane of Storms and hand in Giant parts to advance.',
        type: 'group',
        zone: 'Plane of Storms',
        npc: 'Askr the Lost',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Bastion_of_Thunder',
        pqdiUrl: 'https://www.pqdi.cc/npc/210062',
        raidGuideZoneId: 'postorms',
        npcId: '210062',
        parentFlagId: 'karana',
        stepValue: 1
      },
      {
        id: 'karana_2',
        name: 'Storms: Bastion of Thunder Access (Talisman)',
        description: 'Complete Askr\'s Giant Collect Quest to obtain the Talisman of Thunderous Foyer. Click the center stone in Storms to zone in.',
        type: 'group',
        zone: 'Plane of Storms',
        npc: 'Askr the Lost',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Bastion_of_Thunder',
        raidGuideZoneId: 'postorms',
        npcId: '210062',
        parentFlagId: 'karana',
        stepValue: 2 // values 2 and 3 represent having talisman/access
      },
      // Plane of Valor
      {
        id: 'aerindar_kill',
        name: 'Valor: Defeat Aerin`Dar',
        description: 'Defeat the dragon Aerin`Dar in the ruins of Plane of Valor and hail the Planar Projection.',
        type: 'raid',
        zone: 'Plane of Valor',
        npc: 'Aerin`Dar',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Halls_of_Honor_Access',
        pqdiUrl: 'https://www.pqdi.cc/npc/208074',
        raidGuideZoneId: 'povalor',
        npcId: '208074',
        parentFlagId: 'aerindar',
        stepValue: 1
      },
      {
        id: 'aerindar_zone',
        name: 'Valor: Zone into Halls of Honor',
        description: 'Click the stone inside Aerin`Dar\'s lair to zone into the Halls of Honor and complete the flag series.',
        type: 'group',
        zone: 'Plane of Valor',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Halls_of_Honor_Access',
        raidGuideZoneId: 'povalor',
        npcId: '208074',
        parentFlagId: 'aerindar',
        stepValue: 2
      }
    ]
  },
  {
    id: 'tier3',
    name: 'Tier 3 Planes',
    description: 'Requires completion of specific Tier 2 keys. Confronting the gods and the Zeks.',
    flags: [
      // Bastion of Thunder (Agnarr)
      {
        id: 'karana_3',
        name: 'Thunder: Hail Askr in BoT',
        description: 'Hail Askr the Lost inside the entry hall of Bastion of Thunder.',
        type: 'group',
        zone: 'Bastion of Thunder',
        npc: 'Askr the Lost',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Bastion_of_Thunder',
        pqdiUrl: 'https://www.pqdi.cc/npc/209061',
        raidGuideZoneId: 'bothunder',
        npcId: '210062',
        parentFlagId: 'karana',
        stepValue: 3
      },
      {
        id: 'karana_4',
        name: 'Thunder: Defeat Agnarr & Hail Karana',
        description: 'Complete the Agnarr the Storm Lord event in Bastion of Thunder, then say "I will follow the path of the Fallen." to Karana inside the storm chamber.',
        type: 'raid',
        zone: 'Bastion of Thunder',
        npc: 'Agnarr the Storm Lord',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Bastion_of_Thunder',
        pqdiUrl: 'https://www.pqdi.cc/npc/209026',
        raidGuideZoneId: 'bothunder',
        npcId: '209026',
        parentFlagId: 'karana',
        stepValue: 4
      },
      // Halls of Honor Trials
      {
        id: 'hoh_trial_1',
        name: 'Honor: Rydda`Dar Trial (Northeast)',
        description: 'Complete Trial 1 in Halls of Honor (Dragon fight) and hail Trydan Faye.',
        type: 'raid',
        zone: 'Halls of Honor',
        npc: 'Trydan Faye',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Halls_of_Honor_Trials',
        raidGuideZoneId: 'hohonora',
        npcId: '211106',
        parentFlagId: 'hohtrials',
        isSubFlag: true,
        bitPosition: 0
      },
      {
        id: 'hoh_trial_2',
        name: 'Honor: Save Villagers Trial (Northwest)',
        description: 'Complete Trial 2 in Halls of Honor (Protect villagers) and hail Rhaliq Trell.',
        type: 'raid',
        zone: 'Halls of Honor',
        npc: 'Rhaliq Trell',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Halls_of_Honor_Trials',
        raidGuideZoneId: 'hohonora',
        npcId: '211107',
        parentFlagId: 'hohtrials',
        isSubFlag: true,
        bitPosition: 1
      },
      {
        id: 'hoh_trial_3',
        name: 'Honor: Save Nomads Trial (Southeast)',
        description: 'Complete Trial 3 in Halls of Honor (Save single villager) and hail Alekson Garn.',
        type: 'raid',
        zone: 'Halls of Honor',
        npc: 'Alekson Garn',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Halls_of_Honor_Trials',
        raidGuideZoneId: 'hohonora',
        npcId: '211108',
        parentFlagId: 'hohtrials',
        isSubFlag: true,
        bitPosition: 2
      },
      // Temple of Marr
      {
        id: 'mmarr_kill',
        name: 'Temple of Marr: Defeat Mithaniel Marr (Cipher half)',
        description: 'Defeat Mithaniel Marr in Temple of Marr (HoH-B) and hail the Planar Projection to get your cipher half flag.',
        type: 'raid',
        zone: 'Halls of Honor B',
        npc: 'Mithaniel Marr',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Mithaniel_Marr',
        pqdiUrl: 'https://www.pqdi.cc/npc/220020',
        raidGuideZoneId: 'hohonorb',
        npcId: '220020',
        parentFlagId: 'mmarr',
        stepValue: 1
      },
      {
        id: 'mmarr_book_flag',
        name: 'Temple of Marr: Defeat Mithaniel Marr (Book half)',
        description: 'Hailing the Mithaniel Marr Planar Projection also awards the Book half flag, which is translated later for the Zebuxoruk quest line.',
        type: 'raid',
        zone: 'Halls of Honor B',
        npc: 'Planar Projection',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Mithaniel_Marr',
        raidGuideZoneId: 'hohonorb',
        npcId: '220020',
        parentFlagId: 'mmarr_book',
        stepValue: 1
      },
      // Plane of Tactics (Zeks)
      {
        id: 'zeks_3',
        name: 'Tactics: Defeat Vallon Zek',
        description: 'Defeat Vallon Zek in Plane of Tactics and hail the Planar Projection.',
        type: 'raid',
        zone: 'Plane of Tactics',
        npc: 'Vallon Zek',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#The_Zeks',
        pqdiUrl: 'https://www.pqdi.cc/npc/214316',
        raidGuideZoneId: 'potactics',
        npcId: '214316',
        parentFlagId: 'zeks',
        stepValue: 3
      },
      {
        id: 'zeks_4',
        name: 'Tactics: Defeat Tallon Zek',
        description: 'Defeat Tallon Zek in Plane of Tactics and hail the Planar Projection.',
        type: 'raid',
        zone: 'Plane of Tactics',
        npc: 'Tallon Zek',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#The_Zeks',
        pqdiUrl: 'https://www.pqdi.cc/npc/214026',
        raidGuideZoneId: 'potactics',
        npcId: '214026',
        parentFlagId: 'zeks',
        stepValue: 4
      },
      {
        id: 'zeks_5',
        name: 'Tactics: Both Zek Brothers Defeated',
        description: 'Achieved when both Tallon and Vallon Zek are completed. Seer meditation text combines them.',
        type: 'raid',
        zone: 'Plane of Tactics',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#The_Zeks',
        raidGuideZoneId: 'potactics',
        npcId: '214026',
        parentFlagId: 'zeks',
        stepValue: 5
      },
      {
        id: 'zeks_6',
        name: 'Tactics: Combined Zeks flag (Maelin)',
        description: 'Go to Grand Librarian Maelin in the top of the library in the Plane of Knowledge (up the elevator). With the "Cipher" flag and character flags for killing both Vallon and Tallon Zek, say "what lore" to Maelin for the combined "Zeks" character flag.',
        type: 'group',
        zone: 'Plane of Knowledge',
        npc: 'Grand Librarian Maelin',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#The_Zeks',
        raidGuideZoneId: 'potactics',
        parentFlagId: 'zeks',
        stepValue: 6
      },
      {
        id: 'zeks_7',
        name: 'Tactics: Defeat Rallos Zek',
        description: 'Defeat Rallos Zek in Plane of Tactics, hail the Planar Projection, and say "unlock my memories" to Seer Mal Nae`Shi.',
        type: 'raid',
        zone: 'Plane of Tactics',
        npc: 'Rallos Zek',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Rallos_Zek',
        pqdiUrl: 'https://www.pqdi.cc/npc/214052',
        raidGuideZoneId: 'potactics',
        npcId: '214052',
        parentFlagId: 'zeks',
        stepValue: 7
      }
    ]
  },
  {
    id: 'translators',
    name: 'Library & Seer Progression Transitions',
    description: 'Special gates where you speak to Grand Librarian Maelin to combine your flags and advance. If stuck, visit Maelin and Seer back-and-forth.',
    flags: [
      {
        id: 'cipher_unlocked',
        name: 'Cipher of Divine Language',
        description: 'If you already have the Mithaniel Marr character flag, go to Grand Librarian Maelin in the top of the library in the Plane of Knowledge (up the elevator). With both Saryrn and Marr character flags, "Hail" Maelin to receive a "Cipher" character flag.',
        type: 'group',
        zone: 'Plane of Knowledge',
        npc: 'Grand Librarian Maelin',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Maelin_and_Seer_Clean_Up_Guides',
        raidGuideZoneId: 'solrotower',
        parentFlagId: 'cipher',
        stepValue: 1
      },
      {
        id: 'zebuxoruk_1',
        name: 'Zebuxoruk Fate: Part 1',
        description: 'Speak to Maelin (say "lore") with Mithaniel Marr Book (`mmarr_book`) and Agnarr/Karana (`karana` = 4) completed.',
        type: 'group',
        zone: 'Plane of Knowledge',
        npc: 'Grand Librarian Maelin',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Maelin_and_Seer_Clean_Up_Guides',
        parentFlagId: 'zebuxoruk',
        stepValue: 1
      },
      {
        id: 'zebuxoruk_2',
        name: 'Zebuxoruk Fate: Part 2 (Elemental Access)',
        description: 'Speak to Maelin (say "information") with Zebuxoruk Part 1 (`zebuxoruk` = 1) and Rallos Zek (`zeks` = 7) completed. Unlocks Elemental Planes!',
        type: 'group',
        zone: 'Plane of Knowledge',
        npc: 'Grand Librarian Maelin',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Maelin_and_Seer_Clean_Up_Guides',
        parentFlagId: 'zebuxoruk',
        stepValue: 2
      }
    ]
  },
  {
    id: 'tier4',
    name: 'Solusek Ro\'s Tower',
    description: 'Requires elemental access (Zebuxoruk = 2). Complete the five wing bosses to challenge Solusek Ro.',
    flags: [
      {
        id: 'pofire_1',
        name: 'Solusek: Portal altered (Miak)',
        description: 'Speak to Miak the Light Bearer in Plane of Tranquility. (Sets pofire = 1). Enables entry into the Tower of Solusek Ro.',
        type: 'group',
        zone: 'Plane of Tranquility',
        npc: 'Miak the Light Bearer',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Solusek_Ro.27s_Tower',
        raidGuideZoneId: 'solrotower',
        parentFlagId: 'pofire',
        stepValue: 1
      },
      {
        id: 'sol_mini_xuzl',
        name: 'Solusek: Xuzl Defeated (Wing 1)',
        description: 'Defeat Xuzl in Solusek Ro\'s Tower and activate the flame stone behind him.',
        type: 'raid',
        zone: 'Solusek Ro\'s Tower',
        npc: 'Xuzl',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Solusek_Ro.27s_Tower',
        raidGuideZoneId: 'solrotower',
        npcId: '212041',
        parentFlagId: 'sol_room',
        isSubFlag: true,
        bitPosition: 0
      },
      {
        id: 'sol_mini_arlyxir',
        name: 'Solusek: Arlyxir Defeated (Wing 2)',
        description: 'Defeat Arlyxir in Solusek Ro\'s Tower and activate the flame stone behind him.',
        type: 'raid',
        zone: 'Solusek Ro\'s Tower',
        npc: 'Arlyxir',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Solusek_Ro.27s_Tower',
        raidGuideZoneId: 'solrotower',
        npcId: '212042',
        parentFlagId: 'sol_room',
        isSubFlag: true,
        bitPosition: 1
      },
      {
        id: 'sol_mini_dresolik',
        name: 'Solusek: Protector of Dresolik Defeated (Wing 3)',
        description: 'Defeat the Protector of Dresolik in Solusek Ro\'s Tower and activate the flame stone behind him.',
        type: 'raid',
        zone: 'Solusek Ro\'s Tower',
        npc: 'Protector of Dresolik',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Solusek_Ro.27s_Tower',
        raidGuideZoneId: 'solrotower',
        npcId: '212043',
        parentFlagId: 'sol_room',
        isSubFlag: true,
        bitPosition: 2
      },
      {
        id: 'sol_mini_rizlona',
        name: 'Solusek: Rizlona Defeated (Wing 4)',
        description: 'Defeat Rizlona in Solusek Ro\'s Tower and activate the flame stone behind her.',
        type: 'raid',
        zone: 'Solusek Ro\'s Tower',
        npc: 'Rizlona',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Solusek_Ro.27s_Tower',
        raidGuideZoneId: 'solrotower',
        npcId: '212044',
        parentFlagId: 'sol_room',
        isSubFlag: true,
        bitPosition: 3
      },
      {
        id: 'sol_mini_jiva',
        name: 'Solusek: Jiva Defeated (Wing 5)',
        description: 'Defeat Jiva in Solusek Ro\'s Tower and activate the flame stone behind him.',
        type: 'raid',
        zone: 'Solusek Ro\'s Tower',
        npc: 'Jiva',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Solusek_Ro.27s_Tower',
        raidGuideZoneId: 'solrotower',
        npcId: '212045',
        parentFlagId: 'sol_room',
        isSubFlag: true,
        bitPosition: 4
      },
      {
        id: 'solusek_kill',
        name: 'Solusek: Defeat Solusek Ro',
        description: 'Defeat Solusek Ro in his chamber and hail the Planar Projection. (Sets pofire = 2).',
        type: 'raid',
        zone: 'Solusek Ro\'s Tower',
        npc: 'Solusek Ro',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Solusek_Ro.27s_Tower',
        pqdiUrl: 'https://www.pqdi.cc/npc/212025',
        raidGuideZoneId: 'solrotower',
        npcId: '212025',
        parentFlagId: 'pofire',
        stepValue: 2
      }
    ]
  },
  {
    id: 'elementals',
    name: 'Elemental Planes',
    description: 'The four deep elemental realms. You must kill the god of each plane to obtain their elemental essences.',
    flags: [
      {
        id: 'essence_fire',
        name: 'Fire: Defeat Fennin Ro (Globe of Dancing Flame)',
        description: 'Defeat Fennin Ro the Tyrant of Fire in Plane of Fire and hail the Planar Projection to get your Globe of Dancing Flame.',
        type: 'raid',
        zone: 'Plane of Fire',
        npc: 'Fennin Ro the Tyrant of Fire',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Fire',
        pqdiUrl: 'https://www.pqdi.cc/npc/217440',
        raidGuideZoneId: 'pofire',
        npcId: '217440',
      },
      {
        id: 'wind_etched_key',
        name: 'Air: Wind-Etched Key (Optional)',
        description: 'Optional – Obtain Wind Etched Key to zone up to Xegony Island. (1 person per group will need the key).',
        type: 'optional',
        zone: 'Plane of Air',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Air',
        raidGuideZoneId: 'poair',
      },
      {
        id: 'essence_air',
        name: 'Air: Defeat Xegony (Amorphous Cloud of Air)',
        description: 'Defeat Xegony the Queen of Air in Plane of Air (Eryslai) and hail the Planar Projection to get your Amorphous Cloud of Air.',
        type: 'raid',
        zone: 'Plane of Air',
        npc: 'Xegony the Queen of Air',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Air',
        pqdiUrl: 'https://www.pqdi.cc/npc/215056',
        raidGuideZoneId: 'poair',
        npcId: '215056',
      },
      {
        id: 'essence_water',
        name: 'Water: Defeat Coirnav (Sphere of Coalesced Water)',
        description: 'Defeat Coirnav the Avatar of Water in Plane of Water and hail the Planar Projection to get your Sphere of Coalesced Water.',
        type: 'raid',
        zone: 'Plane of Water',
        npc: 'Coirnav the Avatar of Water',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Water',
        pqdiUrl: 'https://www.pqdi.cc/npc/216048',
        raidGuideZoneId: 'powater',
        npcId: '216048',
      },
      {
        id: 'gem_etched_key',
        name: 'Earth: Gem-Etched Key (Optional)',
        description: 'Optional – Kill Tantisala Jaggedtooth in Plane of Earth A. Loot Gem-Etched Key.',
        type: 'optional',
        zone: 'Plane of Earth A',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Earth',
        raidGuideZoneId: 'poeartha',
      },
      {
        id: 'essence_earth_arbiter',
        name: 'Earth: Passkey of the Twelve (Arbiter)',
        description: 'Complete the 4 ring events in Plane of EarthA to spawn A Mystical Arbitor of Earth.',
        type: 'raid',
        zone: 'Plane of Earth A',
        npc: 'A Mystical Arbitor of Earth',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Earth',
        pqdiUrl: 'https://www.pqdi.cc/npc/218375',
        raidGuideZoneId: 'poeartha',
        npcId: '218375',
        parentFlagId: 'earthb_key',
        stepValue: 1
      },
      {
        id: 'essence_earth_rathe',
        name: 'Earth: Defeat The Rathe Council (Mound of Living Stone)',
        description: 'Kill The Rathe Council in Plane of Earth B and Hail A Planar Projection to receive Mound of Living Stone.',
        type: 'raid',
        zone: 'Plane of Earth B',
        npc: 'The Rathe Council',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Earth',
        pqdiUrl: 'https://www.pqdi.cc/npc/222003',
        raidGuideZoneId: 'poearthb',
        npcId: '222003',
      }
    ]
  },
  {
    id: 'time_plane',
    name: 'Plane of Time Access',
    description: 'The final destination. Combine the essences to craft the key to time.',
    flags: [
      {
        id: 'quintessence_crafted',
        name: 'Time: Combine Essences (Quintessence)',
        description: 'Combine Globe of Dancing Flame, Amorphous Cloud of Air, Sphere of Coalesced Water, and Mound of Living Stone inside an Odylic Vial to create the Quintessence of Elements.',
        type: 'raid',
        zone: 'Plane of Knowledge',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Time_Access',
        raidGuideZoneId: 'potimea',
      },
      {
        id: 'time_portal_active',
        name: 'Time: Hourglass Portal Attuned',
        description: 'Go to Plane of Innovation with Quintessence. Say "yes" to Chronographer Muan to port to clock. Say "researched" to Loreseeker Maelin. Click machine to attune your soul.',
        type: 'raid',
        zone: 'Plane of Innovation',
        npc: 'Loreseeker Maelin',
        wikiUrl: 'https://wiki.takp.info/wiki/Planes_of_Power_progression#Plane_of_Time_Access',
        raidGuideZoneId: 'potimeb',
        npcId: '223000',
        parentFlagId: 'time',
        stepValue: 1
      }
    ]
  }
];

export const allFlagsMap = new Map<string, FlagDefinition>();
flagCategories.forEach(category => {
  category.flags.forEach(flag => {
    allFlagsMap.set(flag.id, flag);
  });
});
