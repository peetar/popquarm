import type { Character } from '../types';

interface HeaderProps {
  characters: Character[];
  activeCharacter: Character | null;
  onSelectCharacter: (charId: string) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  characters,
  activeCharacter,
  onSelectCharacter,
  currentTab,
  setCurrentTab
}) => {
  return (
    <header className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--color-gold-bright)', letterSpacing: '0.1em' }}>
            PopQuarm
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '0.2rem' }}>
            Planar Progression & Flagging Tracker
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-serif)' }}>
            Active Character:
          </label>
          <select
            className="char-select"
            value={activeCharacter?.id || ''}
            onChange={(e) => onSelectCharacter(e.target.value)}
          >
            <option value="" disabled>-- Select Character --</option>
            {characters.map((char) => (
              <option key={char.id} value={char.id}>
                {char.name} ({char.class})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${currentTab === 'checklist' ? 'active' : ''}`}
          onClick={() => setCurrentTab('checklist')}
        >
          Progression Checklist
        </button>
        <button
          className={`tab-btn ${currentTab === 'seer' ? 'active' : ''}`}
          onClick={() => setCurrentTab('seer')}
        >
          Seer Meditation
        </button>
        <button
          className={`tab-btn ${currentTab === 'parser' ? 'active' : ''}`}
          onClick={() => setCurrentTab('parser')}
        >
          Live Log Parser
        </button>
        <button
          className={`tab-btn ${currentTab === 'import' ? 'active' : ''}`}
          onClick={() => setCurrentTab('import')}
        >
          Import / Export
        </button>
        <button
          className={`tab-btn ${currentTab === 'profiles' ? 'active' : ''}`}
          onClick={() => setCurrentTab('profiles')}
        >
          Profiles Manager
        </button>
      </div>
    </header>
  );
};
export default Header;
