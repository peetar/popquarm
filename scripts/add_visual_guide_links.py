import re

with open(r'c:\code\popquarm\src\components\ProgressionTreeVisual.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

replacements = {
    'pod_adler': ('podisease', None),
    'pod_grummus': ('podisease', '205091'),
    'poj_mavuin': ('pojustice', None),
    'poj_trials': ('pojustice', '201075'),
    'poi_giwin': ('poinnovation', None),
    'poi_xanamech': ('poinnovation', '206208'),
    'poi_behemoth': ('poinnovation', '206046'),
    'pon_adroha': ('ponightmare', None),
    'pon_maze': ('ponightmare', '204486'),
    'pon_terris': ('nightmareb', '221041'),
    'cod_elder_fuirstel': ('codecay', None),
    'cod_tarkil': ('codecay', '200232'),
    'cod_bertox': ('codecay', '200226'),
    'pos_askr': ('postorms', '210062'),
    'pov_globe': ('povalor', None),
    'pov_aerindar': ('povalor', '208074'),
    'bot_torden_key': ('bothunder', None),
    'bot_agnarr': ('bothunder', '209026'),
    'hoh_trials': ('hohonora', '211106'),
    'hoh_marr': ('hohonorb', '220020'),
    'pot_fahlia': ('potorment', None),
    'pot_sphere': ('potorment', None),
    'pot_tylis': ('potorment', '203373'),
    'pot_saryrn': ('potorment', '207001'),
    'tactics_twins': ('potactics', '214026'),
    'tactics_rallos': ('potactics', '214052'),
    'sol_pre': ('solrotower', None),
    'sol_minis': ('solrotower', '212041'),
    'sol_ro': ('solrotower', '212025'),
    'elem_fire': ('pofire', '217440'),
    'elem_air_key': ('poair', None),
    'elem_air': ('poair', '215056'),
    'elem_water': ('powater', '216048'),
    'elem_earth_key': ('poeartha', None),
    'elem_earth_arbiter': ('poeartha', '218375'),
    'elem_earth_rathe': ('poearthb', '222003'),
    'potime': ('potimeb', '223000')
}

lines = text.split('\n')
new_lines = []
curr_node_id = None

for i, line in enumerate(lines):
    m = re.search(r"id:\s*'([^']+)'", line)
    if m and m.group(1) in replacements:
        curr_node_id = m.group(1)
    
    new_lines.append(line)
    
    if curr_node_id:
        has_pqdi = any('pqdiUrl:' in lines[j] for j in range(max(0, i-5), min(len(lines), i+6)))
        if 'pqdiUrl:' in line or ('wikiUrl:' in line and not has_pqdi):
            rg, nid = replacements[curr_node_id]
            if rg:
                new_lines.append(f"    raidGuideZoneId: '{rg}',")
            if nid:
                new_lines.append(f"    npcId: '{nid}',")
            curr_node_id = None

out = '\n'.join(new_lines)
with open(r'c:\code\popquarm\src\components\ProgressionTreeVisual.tsx', 'w', encoding='utf-8') as f:
    f.write(out)

print("Updated ProgressionTreeVisual.tsx with raidGuideZoneId and npcId attributes!")
