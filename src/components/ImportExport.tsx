import { useState } from 'react';
import type { Character } from '../types';
import { parseDatabaseDump, applyParsedFlagsToCharacterFlags } from '../utils/parser';

interface ImportExportProps {
  activeCharacter: Character | null;
  onImportCharacter: (importedChar: Character) => void;
  onUpdateFlags: (updatedFlags: Record<string, string>) => void;
}

export const ImportExport: React.FC<ImportExportProps> = ({
  activeCharacter,
  onImportCharacter,
  onUpdateFlags
}) => {
  const [dbDumpText, setDbDumpText] = useState('');
  const [dbImportSuccess, setDbImportSuccess] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Handle exporting active character as JSON
  const handleExportJSON = () => {
    if (!activeCharacter) return;
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeCharacter, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `popquarm_${activeCharacter.name.toLowerCase()}_flags.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handle uploading character JSON
  const handleFileUploadJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    fileReader.onload = (event) => {
      try {
        setErrorMsg('');
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.name && parsed.class && parsed.flags) {
          onImportCharacter(parsed as Character);
          setDbImportSuccess(`Successfully imported character profile for ${parsed.name}!`);
        } else {
          setErrorMsg('Invalid character file. Must contain name, class, and flags.');
        }
      } catch (err: any) {
        setErrorMsg(`Failed to parse file: ${err.message}`);
      }
    };
    fileReader.readAsText(files[0]);
  };

  // Handle importing SQL query dump or tab-separated text
  const handleImportDbDump = () => {
    if (!activeCharacter) {
      setErrorMsg('Please select or create a character profile first.');
      return;
    }
    if (!dbDumpText.trim()) return;

    setErrorMsg('');
    setDbImportSuccess('');
    try {
      const parsedFlags = parseDatabaseDump(dbDumpText);
      const keysFound = Object.keys(parsedFlags);

      if (keysFound.length === 0) {
        setErrorMsg('No valid Planes of Power globals found in pasted dump. Please verify the format.');
        return;
      }

      const mergedFlags = applyParsedFlagsToCharacterFlags(activeCharacter.flags, parsedFlags);
      onUpdateFlags(mergedFlags);
      setDbImportSuccess(`Successfully parsed and updated ${keysFound.length} flags from database dump!`);
      setDbDumpText('');
    } catch (err: any) {
      setErrorMsg(`Failed to import dump: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* JSON File Export / Import */}
      <div className="card">
        <h3 style={{ marginBottom: '0.75rem' }}>JSON Export / Import</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          Back up your character profile locally or share it with your guildmates.
        </p>

        {errorMsg && (
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-raid-glow)', border: '1px solid var(--color-raid)', borderRadius: '4px', color: '#ff8888', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {errorMsg}
          </div>
        )}

        {dbImportSuccess && (
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-group-glow)', border: '1px solid var(--color-group)', borderRadius: '4px', color: '#34d399', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {dbImportSuccess}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button 
            className="btn btn-group" 
            onClick={handleExportJSON} 
            disabled={!activeCharacter}
            title={!activeCharacter ? 'Select a character first' : ''}
          >
            Export Profile
          </button>

          <div style={{ position: 'relative' }}>
            <label className="btn" style={{ cursor: 'pointer' }}>
              Import Profile
              <input 
                type="file" 
                accept=".json" 
                onChange={handleFileUploadJSON} 
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* SQL Global Query Importer & TSV file loader */}
      <div className="card">
        <h3 style={{ marginBottom: '0.5rem' }}>Database & /outputfile Importer</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          For GMs, server developers, or if you can query the database directly, copy and paste the results of a <code>quest_globals</code> query. 
          It also supports standard key-value outputs (e.g. <code>FlagName [tab] Value</code>) to prepare for a potential future <code>/outputfile popquarm</code> command.
        </p>

        <textarea
          className="parser-textarea"
          value={dbDumpText}
          onChange={(e) => setDbDumpText(e.target.value)}
          placeholder={`Example SQL Query Rows:
| charid | npcid | zoneid | name      | value |
|   1234 |     0 |      0 | fuirstel  | 5     |
|   1234 |     0 |      0 | thelin    | 4     |

Or /outputfile popquarm format:
fuirstel\t5
thelin\t4
hohtrials\t111`}
        />

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-group" 
            onClick={handleImportDbDump}
            disabled={!dbDumpText.trim()}
          >
            Import Dump
          </button>
          
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Query tip: <code>SELECT * FROM quest_globals WHERE charid = YOUR_CHAR_ID;</code>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ImportExport;
