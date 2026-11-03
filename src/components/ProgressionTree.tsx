import { flagCategories } from '../data/flagData';
import type { FlagCategory } from '../data/flagData';
import type { FlagDefinition, FlagType } from '../types';

interface ProgressionTreeProps {
  characterFlags: Record<string, string>;
  onFlagToggle: (flag: FlagDefinition, isChecked: boolean) => void;
  onOpenRaidGuide?: (zoneId: string) => void;
  onOpenNpc?: (npcId: string | number) => void;
}

export const ProgressionTree: React.FC<ProgressionTreeProps> = ({
  characterFlags,
  onFlagToggle,
  onOpenRaidGuide,
  onOpenNpc
}) => {
  // Helper to determine if a specific flag/step is active in the character's record
  const isFlagChecked = (flag: FlagDefinition): boolean => {
    const parentId = flag.parentFlagId || flag.id;
    const currentVal = characterFlags[parentId];

    if (!currentVal) return false;

    if (flag.isSubFlag && flag.bitPosition !== undefined) {
      // Bitmask string flag (like hohtrials "111")
      return currentVal[flag.bitPosition] === '1';
    }

    if (flag.stepValue !== undefined) {
      // Step-based flag (like fuirstel goes 1 to 5)
      const currentValNum = parseInt(currentVal, 10);
      return !isNaN(currentValNum) && currentValNum >= flag.stepValue;
    }

    // Simple flag (usually "1" or "2" for aerindar)
    return currentVal === (flag.stepValue !== undefined ? String(flag.stepValue) : '1') || currentVal === '2';
  };

  const getBadgeClass = (type: FlagType) => {
    switch (type) {
      case 'group': return 'badge-group';
      case 'raid': return 'badge-raid';
      case 'optional': return 'badge-optional';
      default: return 'badge-optional';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="card" style={{ padding: '1rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <h4 style={{ fontSize: '1rem', color: 'var(--color-gold)' }}>Legend:</h4>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="badge badge-group">Group</span>
            <span style={{ color: 'var(--color-text-muted)' }}>Group content flags (Teal)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="badge badge-raid">Raid</span>
            <span style={{ color: 'var(--color-text-muted)' }}>Raid boss requirements (Red)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="badge badge-optional">Optional/Key</span>
            <span style={{ color: 'var(--color-text-muted)' }}>Optional keys or assistance flags (Blue)</span>
          </div>
        </div>
      </div>

      <div className="progression-grid">
        {flagCategories.map((category: FlagCategory) => (
          <div key={category.id} className="progression-tier">
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold-bright)', marginBottom: '0.25rem' }}>
                {category.name}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                {category.description}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {category.flags.map((flag) => {
                const checked = isFlagChecked(flag);
                return (
                  <div
                    key={flag.id}
                    className={`flag-row ${checked ? 'completed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      className="flag-checkbox"
                      checked={checked}
                      onChange={(e) => onFlagToggle(flag, e.target.checked)}
                    />
                    <div className="flag-info">
                      <div className="flag-title-row">
                        <h4>{flag.name}</h4>
                        <span className={`badge ${getBadgeClass(flag.type)}`}>
                          {flag.type}
                        </span>
                      </div>
                      <p className="flag-desc">{flag.description}</p>
                      
                      <div className="flag-links">
                        {flag.raidGuideZoneId && onOpenRaidGuide && (
                          <button
                            type="button"
                            className="flag-link"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#34d399' }}
                            onClick={() => onOpenRaidGuide(flag.raidGuideZoneId!)}
                          >
                            <svg style={{ width: '0.9rem', height: '0.9rem', fill: 'currentColor' }} viewBox="0 0 24 24">
                              <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
                            </svg>
                            Raid Guide
                          </button>
                        )}
                        {flag.wikiUrl && (
                          <a
                            href={flag.wikiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flag-link"
                          >
                            <svg style={{ width: '0.9rem', height: '0.9rem', fill: 'currentColor' }} viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                            </svg>
                            Wiki Guide
                          </a>
                        )}
                        {flag.pqdiUrl && (
                          <a
                            href={flag.pqdiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flag-link"
                            style={{ color: '#ab9b83' }}
                            onClick={(e) => {
                              if (flag.npcId && onOpenNpc) {
                                e.preventDefault();
                                onOpenNpc(flag.npcId);
                              }
                            }}
                          >
                            <svg style={{ width: '0.9rem', height: '0.9rem', fill: 'currentColor' }} viewBox="0 0 24 24">
                              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"/>
                            </svg>
                            PQDI NPC
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProgressionTree;
