import { useState, useEffect } from 'react';
import Header from './components/Header';
import { CharacterManager } from './components/CharacterManager';
import ProgressionTree from './components/ProgressionTree';
import ProgressionTreeVisual from './components/ProgressionTreeVisual';
import LogParser from './components/LogParser';
import ImportExport from './components/ImportExport';
import SeerChecklist from './components/SeerChecklist';
import type { Character, ClassName, FlagDefinition } from './types';
import './App.css';

function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('checklist');
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedChars = localStorage.getItem('popquarm_characters');
      if (storedChars) {
        const parsed = JSON.parse(storedChars);
        setCharacters(parsed);
      }
      
      const storedActiveId = localStorage.getItem('popquarm_active_id');
      if (storedActiveId) {
        setActiveCharacterId(storedActiveId);
      }
    } catch (e) {
      console.error('Error loading characters from localStorage:', e);
    }
  }, []);

  // Save to local storage when characters change
  const saveCharacters = (newChars: Character[]) => {
    setCharacters(newChars);
    localStorage.setItem('popquarm_characters', JSON.stringify(newChars));
  };

  const saveActiveId = (id: string | null) => {
    setActiveCharacterId(id);
    if (id) {
      localStorage.setItem('popquarm_active_id', id);
    } else {
      localStorage.removeItem('popquarm_active_id');
    }
  };

  const activeCharacter = characters.find(c => c.id === activeCharacterId) || null;

  // Automatically direct to profiles tab if there are no characters
  useEffect(() => {
    if (characters.length === 0) {
      setCurrentTab('profiles');
    } else if (!activeCharacterId && characters.length > 0) {
      saveActiveId(characters[0].id);
    }
  }, [characters, activeCharacterId]);

  const handleCreateCharacter = (name: string, charClass: ClassName, level: number) => {
    const newChar: Character = {
      id: Date.now().toString(),
      name,
      class: charClass,
      level,
      flags: {
        // Initialize default empty values for compound flags
        hohtrials: '000',
        sol_room: '00000'
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const updated = [...characters, newChar];
    saveCharacters(updated);
    saveActiveId(newChar.id);
    setCurrentTab('checklist'); // Go straight to progression
  };

  const handleDeleteCharacter = (charId: string) => {
    const updated = characters.filter(c => c.id !== charId);
    saveCharacters(updated);
    if (activeCharacterId === charId) {
      if (updated.length > 0) {
        saveActiveId(updated[0].id);
      } else {
        saveActiveId(null);
      }
    }
  };

  const handleSelectCharacter = (charId: string) => {
    saveActiveId(charId);
  };

  const handleImportCharacter = (importedChar: Character) => {
    // Generate new unique ID to avoid duplicates if importing same character
    const charToImport = {
      ...importedChar,
      id: Date.now().toString(),
      updatedAt: Date.now()
    };
    const updated = [...characters, charToImport];
    saveCharacters(updated);
    saveActiveId(charToImport.id);
  };

  // Flag checklist checkbox toggle handler
  const handleFlagToggle = (flag: FlagDefinition, isChecked: boolean) => {
    if (!activeCharacter) return;

    const parentId = flag.parentFlagId || flag.id;
    const currentVal = activeCharacter.flags[parentId];
    let newVal = '';

    if (flag.isSubFlag && flag.bitPosition !== undefined) {
      // Bitmask string flag (like hohtrials "111")
      const currentStr = currentVal || (parentId === 'hohtrials' ? '000' : '00000');
      let strArr = currentStr.split('');
      strArr[flag.bitPosition] = isChecked ? '1' : '0';
      newVal = strArr.join('');
    } else if (flag.stepValue !== undefined) {
      // Step-based flag (like fuirstel 1-5)
      if (isChecked) {
        // Checking a step checks all previous steps
        newVal = flag.stepValue.toString();
      } else {
        // Unchecking a step unchecks all subsequent steps (setting to previous step)
        newVal = (flag.stepValue - 1).toString();
      }
    } else {
      // Binary simple flag
      newVal = isChecked ? (flag.stepValue !== undefined ? String(flag.stepValue) : '1') : '0';
    }

    const updatedCharacters = characters.map(c => {
      if (c.id === activeCharacter.id) {
        return {
          ...c,
          flags: {
            ...c.flags,
            [parentId]: newVal
          },
          updatedAt: Date.now()
        };
      }
      return c;
    });

    saveCharacters(updatedCharacters);
  };

  // Handles updating the flags object in full (e.g. from parser/importer)
  const handleUpdateFlags = (updatedFlags: Record<string, string>) => {
    if (!activeCharacter) return;

    const updatedCharacters = characters.map(c => {
      if (c.id === activeCharacter.id) {
        return {
          ...c,
          flags: updatedFlags,
          updatedAt: Date.now()
        };
      }
      return c;
    });

    saveCharacters(updatedCharacters);
  };

  return (
    <div className="app-container">
      <Header
        characters={characters}
        activeCharacter={activeCharacter}
        onSelectCharacter={handleSelectCharacter}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      <main style={{ minHeight: '60vh' }}>
        {currentTab === 'profiles' && (
          <CharacterManager
            characters={characters}
            activeCharacter={activeCharacter}
            onSelectCharacter={handleSelectCharacter}
            onCreateCharacter={handleCreateCharacter}
            onDeleteCharacter={handleDeleteCharacter}
          />
        )}

        {characters.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', marginTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-gold)' }}>Welcome to the PoP Flagging Tracker</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Please create a character profile in the <strong>Profiles Manager</strong> tab to start tracking your Planes of Power progression.
            </p>
            <button className="btn" onClick={() => setCurrentTab('profiles')}>
              Go to Profiles Manager
            </button>
          </div>
        ) : (
          <>
            {currentTab === 'checklist' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <button 
                    className={`btn ${viewMode === 'tree' ? 'btn-group' : ''}`}
                    onClick={() => setViewMode('tree')}
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}
                  >
                    Diagram Tree View
                  </button>
                  <button 
                    className={`btn ${viewMode === 'list' ? 'btn-group' : ''}`}
                    onClick={() => setViewMode('list')}
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}
                  >
                    Classic Checklist View
                  </button>
                </div>
                {viewMode === 'tree' ? (
                  <ProgressionTreeVisual
                    characterFlags={activeCharacter?.flags || {}}
                    onFlagToggle={handleFlagToggle}
                  />
                ) : (
                  <ProgressionTree
                    characterFlags={activeCharacter?.flags || {}}
                    onFlagToggle={handleFlagToggle}
                  />
                )}
              </div>
            )}

            {currentTab === 'seer' && (
              <SeerChecklist activeCharacter={activeCharacter} onUpdateFlags={handleUpdateFlags} />
            )}

            {currentTab === 'parser' && (
              <LogParser
                activeCharacter={activeCharacter}
                onUpdateFlags={handleUpdateFlags}
              />
            )}

            {currentTab === 'import' && (
              <ImportExport
                activeCharacter={activeCharacter}
                onImportCharacter={handleImportCharacter}
                onUpdateFlags={handleUpdateFlags}
              />
            )}
          </>
        )}
      </main>

      <footer style={{ marginTop: '3rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <p>Created by zondro/peetar/thebrain. Issues can be reported on <a href="https://github.com/peetar/popquarm/issues" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold-bright)', textDecoration: 'underline' }}>GitHub Issues</a>.</p>
        <p>ProjectQuarm Planes of Power progression tracker, pair-programmed with Antigravity AI.</p>
        <p>All character data is stored client-side in your local browser cookies/storage.</p>
      </footer>
    </div>
  );
}

export default App;
