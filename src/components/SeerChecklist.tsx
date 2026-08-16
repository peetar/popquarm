import { useState } from 'react';
import type { Character } from '../types';

interface SeerChecklistProps {
  activeCharacter: Character | null;
  onUpdateFlags: (updatedFlags: Record<string, string>) => void;
}

interface SeerChecklistItem {
  id: string;
  phrase: string;
  label: string;
  getChecked: (flags: Record<string, string>) => boolean;
  setChecked: (flags: Record<string, string>, checked: boolean) => void;
}

interface SeerGroup {
  title: string;
  items: SeerChecklistItem[];
}

const seerGroups: SeerGroup[] = [
  {
    title: 'T1 - Plane of Justice (Mavuin)',
    items: [
      {
        id: 'poj1',
        phrase: 'the evidence of mavuin is the only thing that can save him now',
        label: 'The evidence of Mavuin is the only thing that can save him now.',
        getChecked: (f) => parseInt(f.mavuin || '0', 10) >= 1,
        setChecked: (f, c) => { f.mavuin = c ? '1' : '0'; }
      },
      {
        id: 'poj2',
        phrase: 'tribunal has agreed to reconsider',
        label: "Having endured the trials, the Tribunal has agreed to reconsider Mavuin's case.",
        getChecked: (f) => parseInt(f.mavuin || '0', 10) >= 2,
        setChecked: (f, c) => { f.mavuin = c ? '2' : '1'; }
      },
      {
        id: 'poj3',
        phrase: 'mavuin is grateful to you for taking his case',
        label: 'Mavuin is grateful to you for taking his case before the Tribunal.',
        getChecked: (f) => parseInt(f.mavuin || '0', 10) >= 3,
        setChecked: (f, c) => { f.mavuin = c ? '3' : '2'; }
      }
    ]
  },
  {
    title: 'T1 - Plane of Disease (Grummus)',
    items: [
      {
        id: 'grummus1',
        phrase: 'fuirstel wishes you to obtain the ward from the plane of disease and take it to his ill brother milyk',
        label: 'Alder Fuirstel wishes you to obtain the Ward from the Plane of Disease and take it to his ill brother Milyk.',
        getChecked: (f) => parseInt(f.fuirstel || '0', 10) >= 1,
        setChecked: (f, c) => { f.fuirstel = c ? '1' : '0'; }
      },
      {
        id: 'grummus2',
        phrase: 'for a moment you pause, sticking your hand into your pocket',
        label: 'For a moment you pause, sticking your hand into your pocket. (Ward in pocket)',
        getChecked: (f) => f.grummus === '1',
        setChecked: (f, c) => { f.grummus = c ? '1' : '0'; }
      },
      {
        id: 'grummus3',
        phrase: 'grummus has been destroyed, about his corpse you found a small ward to protect from disease',
        label: 'Grummus has been destroyed, about his corpse you found a small ward to protect from disease.',
        getChecked: (f) => parseInt(f.fuirstel || '0', 10) >= 2,
        setChecked: (f, c) => { f.fuirstel = c ? '2' : '1'; }
      },
      {
        id: 'grummus4',
        phrase: 'now that grummus has been destroyed, the entrance to the crypt of bertoxxulous should open before your might',
        label: 'Now that Grummus has been destroyed, the entrance to the Crypt of Bertoxxulous should open.',
        getChecked: (f) => f.grummus === '1', // Grummus killed flag check
        setChecked: (f, c) => { f.grummus = c ? '1' : '0'; }
      }
    ]
  },
  {
    title: 'T1 - Plane of Nightmare (Terris Thule)',
    items: [
      {
        id: 'terris1',
        phrase: 'thelin being tormented by the imagery of terris thule',
        label: 'Thelin being tormented by the imagery of Terris Thule needs assistance.',
        getChecked: (f) => parseInt(f.thelin || '0', 10) >= 1,
        setChecked: (f, c) => { f.thelin = c ? '1' : '0'; }
      },
      {
        id: 'terris2',
        phrase: 'thelin has completed his pact with terris thule, but has been refused',
        label: 'Thelin has completed his pact with Terris Thule, but has been refused.',
        getChecked: (f) => parseInt(f.thelin || '0', 10) >= 2,
        setChecked: (f, c) => { f.thelin = c ? '2' : '1'; }
      },
      {
        id: 'terris3',
        phrase: 'terris still haunts your nightmares',
        label: 'Terris still haunts your nightmares whenever you attempt to recall your battle.',
        getChecked: (f) => parseInt(f.thelin || '0', 10) >= 2,
        setChecked: (f, c) => { f.thelin = c ? '2' : '1'; }
      },
      {
        id: 'terris4',
        phrase: "terris thule's grasp over thelin has been released",
        label: "Terris Thule's grasp over Thelin has been released.",
        getChecked: (f) => parseInt(f.thelin || '0', 10) >= 3,
        setChecked: (f, c) => { f.thelin = c ? '3' : '2'; }
      },
      {
        id: 'terris5',
        phrase: 'thelin is forever in your debt',
        label: 'Saved from a world of eternal nightmares, Thelin is forever in your debt.',
        getChecked: (f) => parseInt(f.thelin || '0', 10) >= 4,
        setChecked: (f, c) => { f.thelin = c ? '4' : '3'; }
      }
    ]
  },
  {
    title: 'T1 - Plane of Innovation',
    items: [
      {
        id: 'poi1',
        phrase: "you remember nitram's words",
        label: "You remember Nitram's words - 'three small turns to the right... rivet'.",
        getChecked: (f) => f.poi_door === '1',
        setChecked: (f, c) => { f.poi_door = c ? '1' : '0'; }
      },
      {
        id: 'poi2',
        phrase: 'giwin would like you to find him in drunder so he can present you',
        label: 'Giwin would like you to find him in Drunder so he can present you to Rallos Zek (Pre-req done).',
        getChecked: (f) => parseInt(f.zeks || '0', 10) >= 2,
        setChecked: (f, c) => { f.zeks = c ? '2' : '1'; }
      }
    ]
  },
  {
    title: 'T2 - Crypt of Decay (Bertoxxulous)',
    items: [
      {
        id: 'bert1',
        phrase: 'milyk has been saved from certain death, but is not recovering',
        label: 'Milyk has been saved from certain death, but is not recovering.',
        getChecked: (f) => parseInt(f.fuirstel || '0', 10) >= 3,
        setChecked: (f, c) => { f.fuirstel = c ? '3' : '2'; }
      },
      {
        id: 'bert2',
        phrase: 'bertoxxulous has been slain',
        label: 'Bertoxxulous has been slain.',
        getChecked: (f) => parseInt(f.fuirstel || '0', 10) >= 4,
        setChecked: (f, c) => { f.fuirstel = c ? '4' : '3'; }
      },
      {
        id: 'bert3',
        phrase: 'battle against the plaguebringer',
        label: 'As you recall your memory of your battle against the Plaguebringer.',
        getChecked: (f) => parseInt(f.fuirstel || '0', 10) >= 4,
        setChecked: (f, c) => { f.fuirstel = c ? '4' : '3'; }
      },
      {
        id: 'bert4',
        phrase: 'milyk and adler are forever in your debt',
        label: 'Saved from certain doom, Milyk and Adler are forever in your debt.',
        getChecked: (f) => parseInt(f.fuirstel || '0', 10) >= 5,
        setChecked: (f, c) => { f.fuirstel = c ? '5' : '4'; }
      }
    ]
  },
  {
    title: 'T2 - Plane of Storms (Askr)',
    items: [
      {
        id: 'pos1',
        phrase: 'shown your prowess in battle to askr',
        label: 'You have shown your prowess in battle to Askr.',
        getChecked: (f) => parseInt(f.karana || '0', 10) >= 1,
        setChecked: (f, c) => { f.karana = c ? '1' : '0'; }
      },
      {
        id: 'pos2',
        phrase: 'obtained the talisman of thunderous foyer',
        label: 'You have obtained the Talisman of Thunderous Foyer from Askr.',
        getChecked: (f) => parseInt(f.karana || '0', 10) >= 2,
        setChecked: (f, c) => { f.karana = c ? '2' : '1'; }
      }
    ]
  },
  {
    title: 'T2 - Plane of Valor (Aerin`Dar)',
    items: [
      {
        id: 'aerin1',
        phrase: 'you have defeated aerin`dar but have yet to learn the true meaning of justice',
        label: 'You have defeated Aerin`Dar but have yet to learn the true meaning of justice.',
        getChecked: (f) => parseInt(f.aerindar || '0', 10) >= 1,
        setChecked: (f, c) => { f.aerindar = c ? '1' : '0'; }
      },
      {
        id: 'aerin2',
        phrase: 'proven yourself honorable enough to pass into mithaniel',
        label: "You have bested Aerin`Dar and proven yourself honorable enough to pass into Mithaniel's Halls.",
        getChecked: (f) => parseInt(f.aerindar || '0', 10) >= 2,
        setChecked: (f, c) => { f.aerindar = c ? '2' : '1'; }
      }
    ]
  },
  {
    title: 'T2 - Plane of Torment (Saryrn)',
    items: [
      {
        id: 'saryrn1',
        phrase: 'tylis is being tortured by saryrn',
        label: 'Tylis is being tortured by Saryrn.',
        getChecked: (f) => parseInt(f.tylis || '0', 10) >= 1,
        setChecked: (f, c) => { f.tylis = c ? '1' : '0'; }
      },
      {
        id: 'saryrn2',
        phrase: 'tylis still seems to have no idea who you are',
        label: 'Although it was kind of you to help him, Tylis still seems to have no idea who you are.',
        getChecked: (f) => parseInt(f.tylis || '0', 10) >= 1,
        setChecked: (f, c) => { f.tylis = c ? '1' : '0'; }
      },
      {
        id: 'saryrn3',
        phrase: 'tylis has been removed from his agony',
        label: 'Tylis has been removed from his agony.',
        getChecked: (f) => parseInt(f.tylis || '0', 10) >= 2,
        setChecked: (f, c) => { f.tylis = c ? '2' : '1'; }
      },
      {
        id: 'saryrn4',
        phrase: 'whenever you try to focus you feel a searing pain on your arm',
        label: 'You attempt to recall your defeat of Saryrn, but you feel a searing pain on your arm.',
        getChecked: (f) => parseInt(f.tylis || '0', 10) >= 2,
        setChecked: (f, c) => { f.tylis = c ? '2' : '1'; }
      },
      {
        id: 'saryrn5',
        phrase: 'half of the cipher of the gods glows on your arm',
        label: 'You feel the searing pain of torment as half of the cipher of the gods glows on your arm.',
        getChecked: (f) => parseInt(f.tylis || '0', 10) >= 3,
        setChecked: (f, c) => { f.tylis = c ? '3' : '2'; }
      },
      {
        id: 'saryrn6',
        phrase: 'saryrn has been destroyed',
        label: 'Saryrn has been destroyed.',
        getChecked: (f) => f.saryrn_kill === '1',
        setChecked: (f, c) => { f.saryrn_kill = c ? '1' : '0'; }
      }
    ]
  },
  {
    title: 'T3 - Bastion of Thunder (Agnarr)',
    items: [
      {
        id: 'bot1',
        phrase: 'memory is clouded',
        label: 'You recall meeting with Karana, but the memory is clouded.',
        getChecked: (f) => parseInt(f.karana || '0', 10) >= 3,
        setChecked: (f, c) => { f.karana = c ? '3' : '2'; }
      },
      {
        id: 'bot2',
        phrase: 'written in a language that you cannot comprehend',
        label: 'The information obtained from Karana is written in a language that you cannot comprehend.',
        getChecked: (f) => parseInt(f.karana || '0', 10) >= 3,
        setChecked: (f, c) => { f.karana = c ? '3' : '2'; }
      },
      {
        id: 'bot3',
        phrase: 'talisman in your chest warms and a light rain falls',
        label: 'As you think back to your meeting with Karana, the talisman in your chest warms and a light rain falls.',
        getChecked: (f) => parseInt(f.karana || '0', 10) >= 4,
        setChecked: (f, c) => { f.karana = c ? '4' : '3'; }
      }
    ]
  },
  {
    title: 'T3 - Halls of Honor Trials',
    items: [
      {
        id: 'hoh1',
        phrase: 'beaten rydda`dar',
        label: "You have beaten Rydda`Dar in the first of Honor's Trials.",
        getChecked: (f) => f.hohtrials?.[0] === '1',
        setChecked: (f, c) => {
          const val = f.hohtrials || '000';
          f.hohtrials = (c ? '1' : '0') + val[1] + val[2];
        }
      },
      {
        id: 'hoh2',
        phrase: 'saved the villagers',
        label: "You have saved the villagers in the second of Honor's Trials.",
        getChecked: (f) => f.hohtrials?.[1] === '1',
        setChecked: (f, c) => {
          const val = f.hohtrials || '000';
          f.hohtrials = val[0] + (c ? '1' : '0') + val[2];
        }
      },
      {
        id: 'hoh3',
        phrase: 'defeated the nomads',
        label: "You have defeated the nomads in the third of Honor's Trials.",
        getChecked: (f) => f.hohtrials?.[2] === '1',
        setChecked: (f, c) => {
          const val = f.hohtrials || '000';
          f.hohtrials = val[0] + val[1] + (c ? '1' : '0');
        }
      }
    ]
  },
  {
    title: 'T3 - Mithaniel Marr',
    items: [
      {
        id: 'marr1',
        phrase: 'image of mithaniel',
        label: 'An image of Mithaniel Marr flashes before you.',
        getChecked: (f) => f.mmarr_book === '1',
        setChecked: (f, c) => { f.mmarr_book = c ? '1' : '0'; }
      },
      {
        id: 'marr2',
        phrase: 'mithaniel has been bested',
        label: 'Mithaniel Marr has been bested.',
        getChecked: (f) => f.mmarr === '1',
        setChecked: (f, c) => { f.mmarr = c ? '1' : '0'; }
      }
    ]
  },
  {
    title: 'T3 - Plane of Tactics (Zeks)',
    items: [
      {
        id: 'vallon1',
        phrase: 'vallon fell before you with great ease',
        label: 'Vallon fell before you with great ease.',
        getChecked: (f) => parseInt(f.zeks || '0', 10) >= 3,
        setChecked: (f, c) => { f.zeks = c ? '3' : '2'; }
      },
      {
        id: 'vallon2',
        phrase: 'notes from vallon are scribbled',
        label: 'The pack of notes from Vallon are scribbled in a language that you cannot comprehend.',
        getChecked: (f) => parseInt(f.zeks || '0', 10) >= 3,
        setChecked: (f, c) => { f.zeks = c ? '3' : '2'; }
      },
      {
        id: 'tallon1',
        phrase: 'tallon fell before you with great ease',
        label: 'Tallon fell before you with great ease.',
        getChecked: (f) => parseInt(f.zeks || '0', 10) >= 4,
        setChecked: (f, c) => { f.zeks = c ? '4' : '3'; }
      },
      {
        id: 'tallon2',
        phrase: 'notes from tallon are scribbled',
        label: 'The pack of notes from Tallon are scribbled in a language that you cannot comprehend.',
        getChecked: (f) => parseInt(f.zeks || '0', 10) >= 4,
        setChecked: (f, c) => { f.zeks = c ? '4' : '3'; }
      },
      {
        id: 'rztw1',
        phrase: 'parchments of rallos are scribed',
        label: 'The parchments of Rallos are scribed in a language that you cannot comprehend.',
        getChecked: (f) => parseInt(f.zeks || '0', 10) >= 5,
        setChecked: (f, c) => { f.zeks = c ? '5' : '4'; }
      },
      {
        id: 'rztw2',
        phrase: "warlord's flaming axe",
        label: "Your heart beat speeds as you recall the Warlord's flaming axe (Rallos Zek Defeated).",
        getChecked: (f) => parseInt(f.zeks || '0', 10) >= 7,
        setChecked: (f, c) => { f.zeks = c ? '7' : '6'; }
      }
    ]
  },
  {
    title: 'Library Translations',
    items: [
      {
        id: 'combined1',
        phrase: 'fate of zebuxoruk',
        label: 'The history translated for you reveals the fate of Zebuxoruk.',
        getChecked: (f) => parseInt(f.zebuxoruk || '0', 10) >= 1,
        setChecked: (f, c) => { f.zebuxoruk = c ? '1' : '0'; }
      },
      {
        id: 'combined2',
        phrase: 'cipher of the divine language appears',
        label: 'The cipher of the divine language appears on your arms for a brief moment then fades.',
        getChecked: (f) => f.cipher === '1',
        setChecked: (f, c) => { f.cipher = c ? '1' : '0'; }
      },
      {
        id: 'combined3',
        phrase: 'words of maelin echo in your mind',
        label: "The words of Maelin echo in your mind (Spoke to Maelin about Solusek Ro's invasion).",
        getChecked: (f) => parseInt(f.zeks || '0', 10) >= 6,
        setChecked: (f, c) => { f.zeks = c ? '6' : '5'; }
      }
    ]
  },
  {
    title: 'Tower of Solusek Ro',
    items: [
      {
        id: 'tosr_pre',
        phrase: 'portal into the plane of fire has been altered',
        label: 'The portal into the Plane of Fire has been altered.',
        getChecked: (f) => parseInt(f.pofire || '0', 10) >= 1,
        setChecked: (f, c) => { f.pofire = c ? '1' : '0'; }
      },
      {
        id: 'tosr_xuzl',
        phrase: "xuzl's arcane wisdom",
        label: "Xuzl's arcane wisdom pulses in your mind.",
        getChecked: (f) => f.sol_room?.[0] === '1',
        setChecked: (f, c) => {
          const val = f.sol_room || '00000';
          f.sol_room = (c ? '1' : '0') + val.slice(1);
        }
      },
      {
        id: 'tosr_arly',
        phrase: "arlyxir's wealth of knowledge",
        label: "Arlyxir's wealth of knowledge flows through your mind.",
        getChecked: (f) => f.sol_room?.[1] === '1',
        setChecked: (f, c) => {
          const val = f.sol_room || '00000';
          f.sol_room = val[0] + (c ? '1' : '0') + val.slice(2);
        }
      },
      {
        id: 'tosr_dres',
        phrase: 'power of dresolik surges',
        label: 'The power of Dresolik surges through you.',
        getChecked: (f) => f.sol_room?.[2] === '1',
        setChecked: (f, c) => {
          const val = f.sol_room || '00000';
          f.sol_room = val.slice(0, 2) + (c ? '1' : '0') + val.slice(3);
        }
      },
      {
        id: 'tosr_rizl',
        phrase: "rizlona's song slips",
        label: "Rizlona's song slips through your thoughts.",
        getChecked: (f) => f.sol_room?.[3] === '1',
        setChecked: (f, c) => {
          const val = f.sol_room || '00000';
          f.sol_room = val.slice(0, 3) + (c ? '1' : '0') + val[4];
        }
      },
      {
        id: 'tosr_jiva',
        phrase: "jiva's strength fills",
        label: "Jiva's strength fills your body.",
        getChecked: (f) => f.sol_room?.[4] === '1',
        setChecked: (f, c) => {
          const val = f.sol_room || '00000';
          f.sol_room = val.slice(0, 4) + (c ? '1' : '0');
        }
      },
      {
        id: 'tosr_solro',
        phrase: 'besting the burning prince proves your might',
        label: 'Besting the Burning Prince proves your might (Solusek Ro defeated).',
        getChecked: (f) => parseInt(f.pofire || '0', 10) >= 2,
        setChecked: (f, c) => { f.pofire = c ? '2' : '1'; }
      }
    ]
  },
  {
    title: 'Elemental Planes & Plane of Time',
    items: [
      {
        id: 'elem1',
        phrase: 'gather materials that will allow you to power up the machine',
        label: "Learning of Zebuxoruk's fate, you must gather elemental materials.",
        getChecked: (f) => parseInt(f.zeks || '0', 10) >= 7 && parseInt(f.zebuxoruk || '0', 10) >= 1,
        setChecked: (f, c) => {
          if (c) {
            f.zeks = '7';
            f.zebuxoruk = '1';
          }
        }
      },
      {
        id: 'elem2',
        phrase: 'true route to the plane of fire is now clear',
        label: 'The true route to the Plane of Fire is now clear in your mind.',
        getChecked: (f) => parseInt(f.zebuxoruk || '0', 10) >= 2,
        setChecked: (f, c) => { f.zebuxoruk = c ? '2' : '1'; }
      },
      {
        id: 'potime',
        phrase: 'formed a bond with the plane of time',
        label: 'Your soul has formed a bond with the Plane of Time.',
        getChecked: (f) => f.time === '1',
        setChecked: (f, c) => { f.time = c ? '1' : '0'; }
      }
    ]
  }
];

export const SeerChecklist: React.FC<SeerChecklistProps> = ({
  activeCharacter,
  onUpdateFlags
}) => {
  const [pasteText, setPasteText] = useState('');
  const [parseStats, setParseStats] = useState<string | null>(null);

  if (!activeCharacter) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--color-text-muted)' }}>
        Select a character to view Seer Mal Nae`Shi's guided meditation flag checker.
      </div>
    );
  }

  const flags = activeCharacter.flags;

  const handleManualCheck = (item: SeerChecklistItem, checked: boolean) => {
    const updated = { ...flags };
    item.setChecked(updated, checked);
    onUpdateFlags(updated);
  };

  const handleSeerParse = () => {
    if (!pasteText.trim()) return;

    const seer = pasteText.toLowerCase();
    const checkedMap: Record<string, boolean> = {};

    // 1. Initial matching based on string inclusion
    seerGroups.forEach(group => {
      group.items.forEach(item => {
        if (seer.includes(item.phrase)) {
          checkedMap[item.id] = true;
        } else {
          // Keep current state if no log line matches
          checkedMap[item.id] = item.getChecked(flags);
        }
      });
    });

    // Special match rules from original TAKP js
    if (seer.includes("completed all of honor's trials")) {
      checkedMap['hoh1'] = true;
      checkedMap['hoh2'] = true;
      checkedMap['hoh3'] = true;
    }
    if (seer.includes("saryrn been destroyed")) {
      checkedMap['saryrn6'] = true;
    }

    // Helper indicators
    let poj_trial = checkedMap['poj3'] ? 3 : checkedMap['poj2'] ? 2 : checkedMap['poj1'] ? 1 : 0;
    let grummus = checkedMap['grummus3'] ? 3 : checkedMap['grummus2'] ? 2 : checkedMap['grummus1'] ? 1 : 0;
    if (checkedMap['grummus4']) grummus = 4;

    let nightmare = checkedMap['terris5'] ? 5 : checkedMap['terris4'] ? 4 : checkedMap['terris3'] ? 3 : checkedMap['terris2'] ? 2 : checkedMap['terris1'] ? 1 : 0;
    let behemoth = checkedMap['poi2'] ? 1 : 0;
    let aerin = checkedMap['aerin2'] ? 2 : checkedMap['aerin1'] ? 1 : 0;
    let bertox = checkedMap['bert4'] ? 4 : checkedMap['bert3'] ? 3 : checkedMap['bert2'] ? 2 : checkedMap['bert1'] ? 1 : 0;
    let saryrn = checkedMap['saryrn5'] ? 5 : checkedMap['saryrn4'] ? 4 : checkedMap['saryrn3'] ? 3 : checkedMap['saryrn2'] ? 2 : checkedMap['saryrn1'] ? 1 : 0;
    if (checkedMap['saryrn6']) saryrn = 6;

    let askr = checkedMap['pos2'] ? 2 : checkedMap['pos1'] ? 1 : 0;
    let bot = checkedMap['bot3'] ? 3 : checkedMap['bot2'] ? 2 : checkedMap['bot1'] ? 1 : 0;
    if (bot === 2) askr = 10;

    let vallon = checkedMap['vallon2'] ? 2 : checkedMap['vallon1'] ? 1 : 0;
    let tallon = checkedMap['tallon2'] ? 2 : checkedMap['tallon1'] ? 1 : 0;

    let rztw1 = checkedMap['rztw1'];
    let rztw2 = checkedMap['rztw2'];

    let hoh1 = checkedMap['hoh1'] ? 1 : 0;
    let hoh2 = checkedMap['hoh2'] ? 1 : 0;
    let hoh3 = checkedMap['hoh3'] ? 1 : 0;

    let marr = checkedMap['marr2'] ? 2 : checkedMap['marr1'] ? 1 : 0;
    if (seer.includes("information obtained from mithaniel")) marr = 3;
    if (seer.includes("mithaniel has been bested")) marr = 5;

    let combined1 = checkedMap['combined1'] ? 1 : 0;
    let combined2 = checkedMap['combined2'] ? 1 : 0;
    let combined3 = checkedMap['combined3'] ? 1 : 0;

    let tosr_pre = checkedMap['tosr_pre'] ? 1 : 0;
    let tosr_arly = checkedMap['tosr_arly'] ? 1 : 0;
    let tosr_jiva = checkedMap['tosr_jiva'] ? 1 : 0;
    let tosr_dres = checkedMap['tosr_dres'] ? 1 : 0;
    let tosr_xuzl = checkedMap['tosr_xuzl'] ? 1 : 0;
    let tosr_rizl = checkedMap['tosr_rizl'] ? 1 : 0;
    let tosr_solro = checkedMap['tosr_solro'] ? 1 : 0;

    let elem1 = checkedMap['elem1'] ? 1 : 0;
    let elem2 = checkedMap['elem2'] ? 1 : 0;
    let potime = checkedMap['potime'] ? 1 : 0;

    // 2. Backward Inference Logic (TAKP check scripts rules)
    if (elem2 >= 1) tosr_solro = 1;
    if (elem1 >= 1) { combined1 = 1; combined3 = 1; }
    if (combined1 >= 1) { marr = 10; bot = 10; askr = 10; }
    if (combined2 >= 1) { saryrn = 10; marr = 10; }
    if (combined3 >= 1) { tallon = 10; vallon = 10; saryrn = 10; marr = 10; }
    if (marr >= 3) { hoh1 = 1; hoh2 = 1; hoh3 = 1; }
    if (rztw1) { tallon = 10; vallon = 10; }
    if (tallon >= 2 || vallon >= 2) behemoth = 10;
    if (tosr_solro >= 1) {
      tosr_pre = 1; tosr_arly = 1; tosr_jiva = 1; tosr_dres = 1; tosr_xuzl = 1; tosr_rizl = 1;
    }

    // 3. Write back variables to checkboxes state map
    if (poj_trial >= 3) { checkedMap['poj1'] = true; checkedMap['poj2'] = true; checkedMap['poj3'] = true; }
    else if (poj_trial === 2) { checkedMap['poj1'] = true; checkedMap['poj2'] = true; }
    else if (poj_trial === 1) { checkedMap['poj1'] = true; }

    if (grummus >= 4) { checkedMap['grummus1'] = true; checkedMap['grummus2'] = true; checkedMap['grummus3'] = true; checkedMap['grummus4'] = true; }
    else if (grummus === 3) { checkedMap['grummus1'] = true; checkedMap['grummus3'] = true; }
    else if (grummus === 2) { checkedMap['grummus1'] = true; checkedMap['grummus2'] = true; }
    else if (grummus === 1) { checkedMap['grummus1'] = true; }

    if (nightmare >= 5) {
      checkedMap['terris1'] = true; checkedMap['terris2'] = true; checkedMap['terris3'] = true; checkedMap['terris4'] = true; checkedMap['terris5'] = true;
    } else if (nightmare === 4) {
      checkedMap['terris1'] = true; checkedMap['terris2'] = true; checkedMap['terris3'] = true; checkedMap['terris4'] = true;
    } else if (nightmare === 3) {
      checkedMap['terris1'] = true; checkedMap['terris2'] = true; checkedMap['terris3'] = true;
    } else if (nightmare === 2) {
      checkedMap['terris1'] = true; checkedMap['terris2'] = true;
    } else if (nightmare === 1) {
      checkedMap['terris1'] = true;
    }

    if (behemoth >= 10) checkedMap['poi2'] = true;

    if (aerin >= 2) { checkedMap['aerin1'] = true; checkedMap['aerin2'] = true; }
    else if (aerin === 1) checkedMap['aerin1'] = true;

    if (bertox >= 4) {
      checkedMap['bert1'] = true; checkedMap['bert2'] = true; checkedMap['bert3'] = true; checkedMap['bert4'] = true;
    } else if (bertox === 3) {
      checkedMap['bert1'] = true; checkedMap['bert2'] = true; checkedMap['bert3'] = true;
    } else if (bertox === 2) {
      checkedMap['bert1'] = true; checkedMap['bert2'] = true;
    } else if (bertox === 1) {
      checkedMap['bert1'] = true;
    }

    if (saryrn >= 10) {
      checkedMap['saryrn1'] = true; checkedMap['saryrn2'] = true; checkedMap['saryrn3'] = true; checkedMap['saryrn4'] = true; checkedMap['saryrn5'] = true; checkedMap['saryrn6'] = true;
    } else {
      if (saryrn >= 6) { checkedMap['saryrn1'] = true; checkedMap['saryrn2'] = true; checkedMap['saryrn3'] = true; checkedMap['saryrn4'] = true; checkedMap['saryrn5'] = true; checkedMap['saryrn6'] = true; }
      else if (saryrn === 5) { checkedMap['saryrn1'] = true; checkedMap['saryrn2'] = true; checkedMap['saryrn3'] = true; checkedMap['saryrn4'] = true; checkedMap['saryrn5'] = true; }
      else if (saryrn === 4) { checkedMap['saryrn1'] = true; checkedMap['saryrn2'] = true; checkedMap['saryrn3'] = true; checkedMap['saryrn4'] = true; }
      else if (saryrn === 3) { checkedMap['saryrn1'] = true; checkedMap['saryrn2'] = true; checkedMap['saryrn3'] = true; }
      else if (saryrn === 2) { checkedMap['saryrn1'] = true; checkedMap['saryrn2'] = true; }
      else if (saryrn === 1) { checkedMap['saryrn1'] = true; }
    }

    if (askr >= 10) { checkedMap['pos1'] = true; checkedMap['pos2'] = true; }
    else if (askr === 2) { checkedMap['pos1'] = true; checkedMap['pos2'] = true; }
    else if (askr === 1) { checkedMap['pos1'] = true; }

    if (bot >= 10) { checkedMap['bot1'] = true; checkedMap['bot2'] = true; checkedMap['bot3'] = true; }
    else if (bot === 3) { checkedMap['bot1'] = true; checkedMap['bot2'] = true; checkedMap['bot3'] = true; }
    else if (bot === 2) { checkedMap['bot1'] = true; checkedMap['bot2'] = true; }
    else if (bot === 1) { checkedMap['bot1'] = true; }

    if (vallon >= 10) { checkedMap['vallon1'] = true; checkedMap['vallon2'] = true; }
    else if (vallon === 2) { checkedMap['vallon1'] = true; checkedMap['vallon2'] = true; }
    else if (vallon === 1) { checkedMap['vallon1'] = true; }

    if (tallon >= 10) { checkedMap['tallon1'] = true; checkedMap['tallon2'] = true; }
    else if (tallon === 2) { checkedMap['tallon1'] = true; checkedMap['tallon2'] = true; }
    else if (tallon === 1) { checkedMap['tallon1'] = true; }

    if (rztw1) checkedMap['rztw1'] = true;
    if (rztw2) checkedMap['rztw2'] = true;

    if (hoh1) checkedMap['hoh1'] = true;
    if (hoh2) checkedMap['hoh2'] = true;
    if (hoh3) checkedMap['hoh3'] = true;

    if (marr >= 10) {
      checkedMap['marr1'] = true; checkedMap['marr2'] = true;
    } else {
      if (marr >= 5) { checkedMap['marr1'] = true; checkedMap['marr2'] = true; }
      else if (marr === 3) { checkedMap['marr1'] = true; }
      else if (marr === 2) { checkedMap['marr2'] = true; }
      else if (marr === 1) { checkedMap['marr1'] = true; }
    }

    if (combined1) checkedMap['combined1'] = true;
    if (combined2) checkedMap['combined2'] = true;
    if (combined3) checkedMap['combined3'] = true;

    if (tosr_pre) checkedMap['tosr_pre'] = true;
    if (tosr_arly) checkedMap['tosr_arly'] = true;
    if (tosr_jiva) checkedMap['tosr_jiva'] = true;
    if (tosr_dres) checkedMap['tosr_dres'] = true;
    if (tosr_xuzl) checkedMap['tosr_xuzl'] = true;
    if (tosr_rizl) checkedMap['tosr_rizl'] = true;
    if (tosr_solro) checkedMap['tosr_solro'] = true;

    if (elem1) checkedMap['elem1'] = true;
    if (elem2) checkedMap['elem2'] = true;
    if (potime) checkedMap['potime'] = true;

    // 4. Construct updated character flags qglobals
    const updated = { ...flags };
    seerGroups.forEach(group => {
      group.items.forEach(item => {
        item.setChecked(updated, !!checkedMap[item.id]);
      });
    });

    onUpdateFlags(updated);
    setParseStats('Successfully parsed Seer log! Checked flags have been synced to your character progression.');
    setPasteText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Seer Text Parser */}
      <div className="card">
        <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg style={{ width: '1.4rem', height: '1.4rem', fill: 'var(--color-gold)' }} viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          Guided Meditation Parser (TAKP Format)
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          Find <strong>Seer Mal Nae`Shi</strong> in Plane of Knowledge, type <code>/sit</code>, target her, and type <code>/say unlock memories</code> then <code>/say guided meditation</code>. 
          Paste the Seer text log below to automatically resolve and back-fill your progression checklist.
        </p>

        {parseStats && (
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(52, 211, 153, 0.15)', border: '1px solid #10b981', borderRadius: '4px', color: '#34d399', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {parseStats}
          </div>
        )}

        <textarea
          className="parser-textarea"
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          placeholder="Paste Seer messages here..."
          rows={6}
        />

        <button className="btn btn-group" onClick={handleSeerParse} disabled={!pasteText.trim()} style={{ marginTop: '0.5rem' }}>
          Check My Flags
        </button>
      </div>

      {/* Grouped Checklist */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem', color: 'var(--color-gold)' }}>Seer Flag Messages Checklist</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {seerGroups.map(group => (
            <div key={group.title} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--color-gold-bright)', marginBottom: '0.5rem', borderLeft: '3px solid var(--color-gold)', paddingLeft: '0.5rem' }}>
                {group.title}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '0.5rem' }}>
                {group.items.map(item => {
                  const checked = item.getChecked(flags);
                  return (
                    <label
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        color: checked ? '#34d399' : 'var(--color-text-muted)',
                        userSelect: 'none',
                        lineHeight: '1.4'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => handleManualCheck(item, e.target.checked)}
                        style={{
                          marginTop: '0.2rem',
                          accentColor: 'var(--color-gold)',
                          cursor: 'pointer'
                        }}
                      />
                      <span>{item.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SeerChecklist;
