import { useState } from 'react';
import type { Character, ClassName } from '../types';

interface CharacterManagerProps {
  characters: Character[];
  activeCharacter: Character | null;
  onSelectCharacter: (charId: string) => void;
  onCreateCharacter: (name: string, charClass: ClassName, level: number) => void;
  onDeleteCharacter: (charId: string) => void;
}

const CLASSES: ClassName[] = [
  'Bard', 'Beastlord', 'Cleric', 'Druid', 'Enchanter', 'Magician',
  'Monk', 'Necromancer', 'Paladin', 'Ranger', 'Rogue', 'Shadow Knight',
  'Shaman', 'Warrior', 'Wizard'
];

export const CharacterManager: React.FC<CharacterManagerProps> = ({
  characters,
  activeCharacter,
  onSelectCharacter,
  onCreateCharacter,
  onDeleteCharacter
}) => {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [charClass, setCharClass] = useState<ClassName>('Warrior');
  const [level, setLevel] = useState<number>(65);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateCharacter(name.trim(), charClass, level);
    setName('');
    setShowCreate(false);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '1rem', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ flex: 1 }}>Character Profiles</h3>
        <button className="btn" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? 'View List' : 'Create Character'}
        </button>
      </div>

      {showCreate ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-serif)' }}>Character Name</label>
            <input
              type="text"
              className="input-text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. QuarmSlayer"
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-serif)' }}>Level (46 - 65)</label>
            <input
              type="number"
              className="input-text"
              value={level}
              onChange={(e) => setLevel(Math.max(1, Math.min(65, parseInt(e.target.value) || 1)))}
              min={1}
              max={65}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-serif)' }}>Class</label>
            <div className="class-grid">
              {CLASSES.map((cls) => (
                <div
                  key={cls}
                  className={`class-btn ${charClass === cls ? 'selected' : ''}`}
                  onClick={() => setCharClass(cls)}
                >
                  {cls}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-group" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
            Summon Character
          </button>
        </form>
      ) : (
        <div>
          {characters.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--color-text-muted)' }}>
              <p>No character profiles found.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Please create a character to begin tracking your planar progression.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {characters.map((char) => (
                <div
                  key={char.id}
                  className={`flag-row ${activeCharacter?.id === char.id ? 'active' : ''}`}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderLeft: activeCharacter?.id === char.id ? '3px solid var(--color-gold)' : '3px solid transparent'
                  }}
                  onClick={() => onSelectCharacter(char.id)}
                >
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', color: activeCharacter?.id === char.id ? 'var(--color-gold-bright)' : 'var(--color-text-main)' }}>
                      {char.name}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      Level {char.level} {char.class}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {activeCharacter?.id === char.id && (
                      <span className="badge badge-group" style={{ fontSize: '0.65rem' }}>Active</span>
                    )}
                    <button
                      className="btn btn-danger"
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete ${char.name}?`)) {
                          onDeleteCharacter(char.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
