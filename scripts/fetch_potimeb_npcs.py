import re
import json
import urllib.request
import time
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor

class MyParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_strong = False
        self.in_span = False
        self.cur_k = ''
        self.cur_v = ''
        self.items = {}
    def handle_starttag(self, tag, attrs):
        if tag == 'strong': self.in_strong = True
        elif tag == 'span': self.in_span = True
    def handle_endtag(self, tag):
        if tag == 'strong': self.in_strong = False
        elif tag == 'span': 
            self.in_span = False
            if self.cur_k:
                self.items[self.cur_k.strip().rstrip(':')] = self.cur_v.strip()
                self.cur_k = ''
                self.cur_v = ''
    def handle_data(self, data):
        if self.in_strong: self.cur_k += data
        elif self.in_span: self.cur_v += data

def fetch_npc(nid):
    url = f'https://www.pqdi.cc/npc/{nid}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    for _ in range(3):
        try:
            with urllib.request.urlopen(req, timeout=8) as resp:
                p = MyParser()
                p.feed(resp.read().decode('utf-8', errors='ignore'))
                return nid, p.items
        except Exception:
            time.sleep(0.5)
    return nid, {'error': 'Failed to fetch'}

with open(r'c:\code\eqmacemu\docs\raid_guides\planes_of_power\potimeb.md', 'r', encoding='utf-8') as f:
    text = f.read()

potimeb_ids = set(re.findall(r'pqdi\.cc/npc/(\d+)', text))

with open(r'c:\code\popquarm\src\data\pqdi_npcs.json', 'r', encoding='utf-8') as f:
    npc_data = json.load(f)

missing = [nid for nid in potimeb_ids if nid not in npc_data]
print(f'Fetching {len(missing)} missing NPCs for Plane of Time B...')

with ThreadPoolExecutor(max_workers=10) as executor:
    for nid, data in executor.map(fetch_npc, sorted(missing)):
        npc_data[nid] = data
        print(f"Fetched {nid}: {data.get('name')}")

with open(r'c:\code\popquarm\src\data\pqdi_npcs.json', 'w', encoding='utf-8') as f:
    json.dump(npc_data, f, indent=2)

print('Updated pqdi_npcs.json with all Plane of Time B mobs!')
