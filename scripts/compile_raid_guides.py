import os
import glob
import re
import json

guides_dir = r"c:\code\eqmacemu\docs\raid_guides\planes_of_power"
guide_files = sorted(glob.glob(os.path.join(guides_dir, "*.md")))

guides_data = []

tier_order = {
    "Tier 1": 1,
    "Tier 2": 2,
    "Tier 3": 3,
    "Tier 4": 4,
    "Tier 5": 5
}

for gf in guide_files:
    fname = os.path.basename(gf)
    with open(gf, "r", encoding="utf-8") as f:
        content = f.read()
    
    if fname == "INDEX.md":
        continue
    
    # Extract YAML metadata block
    yaml_match = re.search(r"```yaml\s*\n(.*?)\n```", content, re.DOTALL)
    metadata = {}
    if yaml_match:
        yaml_text = yaml_match.group(1)
        for line in yaml_text.split("\n"):
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if ":" in line and not line.startswith("-"):
                parts = line.split(":", 1)
                k = parts[0].strip()
                v = parts[1].strip().strip("\"'")
                metadata[k] = v

    # Extract H1 title
    title_match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
    title = title_match.group(1) if title_match else fname
    
    # Extract encounters from H2 headers
    all_h2 = re.findall(r"^##\s+([^\n]+)", content, re.MULTILINE)
    encounters = []
    for h in all_h2:
        h_clean = h.strip()
        # ignore non-encounter headings
        if any(x in h_clean.lower() for x in ["overview", "cheat-sheet", "quick reference", "quick cheat", "table of contents", "summary", "trash", "architecture"]):
            continue
        encounters.append(h_clean)

    tier = metadata.get("progression_tier", "Tier 1")
    zone_short = metadata.get("zone_short_name", fname.replace(".md", ""))
    zone_long = metadata.get("zone_long_name", title)

    guides_data.append({
        "id": zone_short,
        "filename": fname,
        "title": title,
        "zoneShortName": zone_short,
        "zoneLongName": zone_long,
        "tier": tier,
        "tierNum": tier_order.get(tier.split(":")[0].strip(), 99),
        "encounters": encounters,
        "rawMarkdown": content
    })

guides_data.sort(key=lambda x: (x["tierNum"], x["zoneLongName"]))

print(f"Parsed {len(guides_data)} zone guides!")
for g in guides_data:
    print(f"{g['tier']} - {g['zoneLongName']} ({len(g['encounters'])} encounters)")

with open(r"c:\code\popquarm\src\data\raidGuidesData.json", "w", encoding="utf-8") as f:
    json.dump(guides_data, f, indent=2)

print("Saved to src/data/raidGuidesData.json successfully!")
