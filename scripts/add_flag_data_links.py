import re

with open(r'c:\code\popquarm\src\data\flagData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

replacements = {
    'fuirstel_1': ('podisease', None),
    'fuirstel_2': ('podisease', '205091'),
    'grummus_access': ('podisease', '205091'),
    'mavuin_1': ('pojustice', None),
    'mavuin_2': ('pojustice', '201075'),
    'mavuin_3': ('pojustice', None),
    'poi_factory_key': ('poinnovation', '206208'),
    'zeks_1': ('poinnovation', None),
    'zeks_2': ('poinnovation', '206046'),
    'thelin_1': ('ponightmare', None),
    'thelin_2': ('ponightmare', '204486'),
    'thelin_3': ('nightmareb', '221041'),
    'thelin_4': ('nightmareb', None),
    'fuirstel_3': ('codecay', None),
    'bertox_key_access': ('codecay', '200232'),
    'fuirstel_4': ('codecay', '200226'),
    'fuirstel_5': ('codecay', None),
    'karana_1': ('postorms', '210062'),
    'karana_2': ('postorms', '210062'),
    'karana_3': ('bothunder', '210062'),
    'karana_4': ('bothunder', '209026'),
    'aerindar_kill': ('povalor', '208074'),
    'aerindar_zone': ('povalor', '208074'),
    'tylis_1': ('potorment', None),
    'tylis_2': ('potorment', '203373'),
    'tylis_3': ('potorment', None),
    'saryrn_kill': ('potorment', '207001'),
    'hoh_trial_1': ('hohonora', '211106'),
    'hoh_trial_2': ('hohonora', '211107'),
    'hoh_trial_3': ('hohonora', '211108'),
    'mmarr_kill': ('hohonorb', '220020'),
    'mmarr_book_flag': ('hohonorb', '220020'),
    'zeks_3': ('potactics', '214316'),
    'zeks_4': ('potactics', '214026'),
    'zeks_5': ('potactics', '214026'),
    'zeks_6': ('potactics', None),
    'zeks_7': ('potactics', '214052'),
    'cipher_unlocked': ('solrotower', None),
    'zebuxoruk_1': (None, None),
    'zebuxoruk_2': (None, None),
    'pofire_1': ('solrotower', None),
    'sol_mini_xuzl': ('solrotower', '212041'),
    'sol_mini_arlyxir': ('solrotower', '212042'),
    'sol_mini_dresolik': ('solrotower', '212043'),
    'sol_mini_rizlona': ('solrotower', '212044'),
    'sol_mini_jiva': ('solrotower', '212045'),
    'solusek_kill': ('solrotower', '212025'),
    'essence_fire': ('pofire', '217440'),
    'wind_etched_key': ('poair', None),
    'essence_air': ('poair', '215056'),
    'essence_water': ('powater', '216048'),
    'gem_etched_key': ('poeartha', None),
    'essence_earth_arbiter': ('poeartha', '218375'),
    'essence_earth_rathe': ('poearthb', '222003'),
    'quintessence_crafted': ('potimea', None),
    'time_portal_active': ('potimeb', '223000')
}

lines = text.split('\n')
new_lines = []
curr_flag_id = None

for i, line in enumerate(lines):
    m = re.search(r"id:\s*'([^']+)'", line)
    if m and m.group(1) in replacements:
        curr_flag_id = m.group(1)
    
    new_lines.append(line)
    
    if curr_flag_id:
        has_pqdi = any('pqdiUrl:' in lines[j] for j in range(max(0, i-5), min(len(lines), i+6)))
        if 'pqdiUrl:' in line or ('wikiUrl:' in line and not has_pqdi):
            rg, nid = replacements[curr_flag_id]
            if rg:
                new_lines.append(f"        raidGuideZoneId: '{rg}',")
            if nid:
                new_lines.append(f"        npcId: '{nid}',")
            curr_flag_id = None

out = '\n'.join(new_lines)
with open(r'c:\code\popquarm\src\data\flagData.ts', 'w', encoding='utf-8') as f:
    f.write(out)

print("Updated flagData.ts with raidGuideZoneId and npcId attributes!")
