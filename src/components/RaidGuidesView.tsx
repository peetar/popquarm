import React, { useState, useMemo } from 'react';
import { marked } from 'marked';
import type { RaidGuide, NpcRawData } from '../types';
import raidGuidesRaw from '../data/raidGuidesData.json';
import { NpcModal } from './NpcModal';
import { getNpcData } from '../utils/npcData';

const raidGuides = raidGuidesRaw as RaidGuide[];

interface RaidGuidesViewProps {
  initialZoneId?: string | null;
  onSelectZone?: (zoneId: string) => void;
}

export const RaidGuidesView: React.FC<RaidGuidesViewProps> = ({ initialZoneId }) => {
  const [selectedGuide, setSelectedGuide] = useState<RaidGuide | null>(() => {
    if (initialZoneId) {
      return raidGuides.find(g => g.id === initialZoneId || g.zoneShortName === initialZoneId) || null;
    }
    return null;
  });

  const [activeNpc, setActiveNpc] = useState<NpcRawData | null>(null);
  const [filterTier, setFilterTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Group guides by tier
  const filteredGuides = useMemo(() => {
    return raidGuides.filter(g => {
      const matchesTier = filterTier === 'all' || g.tier.toLowerCase().includes(filterTier.toLowerCase());
      const matchesSearch = !searchQuery.trim() || 
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.zoneLongName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.encounters.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTier && matchesSearch;
    });
  }, [filterTier, searchQuery]);

  // Handle clicking NPC link or custom button inside markdown popup
  const handleOpenNpc = (npcId: string) => {
    const data = getNpcData(npcId);
    if (data) {
      setActiveNpc(data);
    } else {
      window.open(`https://www.pqdi.cc/npc/${npcId}`, '_blank');
    }
  };

  // Convert raw markdown with marked and enhance PQDI links
  const guideHtml = useMemo(() => {
    if (!selectedGuide) return '';
    try {
      // Remove YAML frontmatter if present for cleaner markdown presentation
      const cleanMd = selectedGuide.rawMarkdown.replace(/```yaml[\s\S]*?```/, '');
      return marked.parse(cleanMd, { async: false }) as string;
    } catch {
      return selectedGuide.rawMarkdown;
    }
  }, [selectedGuide]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Controls & Search Bar */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-gold-bright)', margin: 0 }}>
            Planes of Power Raid Guides
          </h2>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            Encounter mechanics, script triggers, add timelines, and live PQDI mob combat stats.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Tier Filters */}
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
            {['all', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5'].map(t => (
              <button
                key={t}
                className={`btn ${filterTier === t ? 'btn-group' : ''}`}
                onClick={() => setFilterTier(t)}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
              >
                {t === 'all' ? 'All Tiers' : t}
              </button>
            ))}
          </div>

          {/* Search box */}
          <input
            type="text"
            className="char-select"
            placeholder="Search encounters, zones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '200px', fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
          />
        </div>
      </div>

      {/* Grid of Zone Encounters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1rem'
      }}>
        {filteredGuides.map(guide => {
          const isSelected = selectedGuide?.id === guide.id;
          return (
            <div
              key={guide.id}
              className="card"
              onClick={() => setSelectedGuide(guide)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                border: isSelected ? '1px solid var(--color-gold-bright)' : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isSelected ? '0 0 15px var(--color-gold-glow)' : 'none',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="badge badge-group" style={{ fontSize: '0.65rem' }}>
                  {guide.tier}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                  {guide.zoneShortName}
                </span>
              </div>

              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--color-gold-bright)', margin: 0 }}>
                  {guide.zoneLongName}
                </h3>
              </div>

              {/* Encounter bullet tags */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: 'auto' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Encounters ({guide.encounters.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {guide.encounters.map((enc, i) => {
                    const cleanEnc = enc.replace(/^#+/, '').replace(/^(Raid Encounter|Mini-Raid Encounter|Mini Encounter|Event Encounter|Tribunal Trial|Encounter|The Trials|Raid Event)[\s:]+/i, '').trim();
                    return (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.7rem',
                          backgroundColor: 'var(--color-bg-deep)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          color: 'var(--color-text-main)'
                        }}
                      >
                        {cleanEnc}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                <button
                  className="btn btn-group"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGuide(guide);
                  }}
                >
                  View Guide & Mechanics →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guide Detail Popup Modal */}
      {selectedGuide && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedGuide(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
            zIndex: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div
            className="card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '900px',
              maxWidth: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: 'var(--color-bg-dark)',
              border: '1px solid var(--color-gold-bright)',
              boxShadow: '0 12px 35px rgba(0,0,0,0.9), 0 0 20px var(--color-gold-glow)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(197, 168, 128, 0.25)', paddingBottom: '0.75rem' }}>
              <div>
                <span className="badge badge-group" style={{ fontSize: '0.7rem', marginBottom: '0.35rem', display: 'inline-block' }}>
                  {selectedGuide.tier}
                </span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-gold-bright)', margin: 0 }}>
                  {selectedGuide.zoneLongName}
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Zone Shortname: <code>{selectedGuide.zoneShortName}</code> | File: <code>{selectedGuide.filename}</code>
                </div>
              </div>
              <button
                onClick={() => setSelectedGuide(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  fontSize: '1.3rem',
                  cursor: 'pointer',
                  padding: '0.2rem 0.6rem',
                  lineHeight: 1
                }}
              >
                ✕
              </button>
            </div>

            {/* Quick Encounter Jump Buttons */}
            {selectedGuide.encounters.length > 0 && (
              <div style={{ backgroundColor: 'var(--color-bg-deep)', padding: '0.75rem', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Jump to Encounter:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {selectedGuide.encounters.map((enc, idx) => {
                    const cleanEnc = enc.replace(/^#+/, '').replace(/^(Raid Encounter|Mini-Raid Encounter|Mini Encounter|Event Encounter|Tribunal Trial|Encounter|The Trials|Raid Event)[\s:]+/i, '').trim();
                    return (
                      <button
                        key={idx}
                        className="btn"
                        style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                        onClick={() => {
                          // Try scrolling to matching heading
                          const headers = document.querySelectorAll('.raid-guide-content h2');
                          for (const h of Array.from(headers)) {
                            if (h.textContent?.toLowerCase().includes(cleanEnc.toLowerCase())) {
                              h.scrollIntoView({ behavior: 'smooth' });
                              break;
                            }
                          }
                        }}
                      >
                        {cleanEnc}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Rendered Guide Body */}
            <div 
              className="raid-guide-content"
              style={{
                lineHeight: '1.6',
                color: 'var(--color-text-main)',
                fontSize: '0.88rem'
              }}
              onClick={(e) => {
                // Intercept clicks on PQDI links to open rich NpcModal
                const target = (e.target as HTMLElement).closest('a');
                if (target && target.href && target.href.includes('pqdi.cc/npc/')) {
                  const match = target.href.match(/pqdi\.cc\/npc\/(\d+)/);
                  if (match) {
                    e.preventDefault();
                    handleOpenNpc(match[1]);
                  }
                }
              }}
              dangerouslySetInnerHTML={{ __html: guideHtml }}
            />

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Tip: Click any blue mob link to inspect live PQDI combat stats, slow mitigation, flurry & rampage.
              </span>
              <button
                className="btn btn-group"
                onClick={() => setSelectedGuide(null)}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mob Raw Info Popup Modal */}
      <NpcModal
        npc={activeNpc}
        onClose={() => setActiveNpc(null)}
      />
    </div>
  );
};
export default RaidGuidesView;
