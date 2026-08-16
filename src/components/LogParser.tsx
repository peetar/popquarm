import { useState, useEffect, useRef } from 'react';
import { parseLogText, readLastChunkOfFile, applyParsedFlagsToCharacterFlags } from '../utils/parser';
import type { LogParseMatch, Character } from '../types';

interface LogParserProps {
  activeCharacter: Character | null;
  onUpdateFlags: (updatedFlags: Record<string, string>) => void;
}

export const LogParser: React.FC<LogParserProps> = ({
  activeCharacter,
  onUpdateFlags
}) => {
  const [pasteText, setPasteText] = useState('');
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isWatching, setIsWatching] = useState(false);
  const [parseStats, setParseStats] = useState<{ parsedLines: number; matchesFound: number } | null>(null);
  const [recentMatches, setRecentMatches] = useState<LogParseMatch[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const watchIntervalRef = useRef<number | null>(null);
  const lastFileSizeBytesRef = useRef<number>(0);

  // Clear watch on unmount
  useEffect(() => {
    return () => {
      if (watchIntervalRef.current) {
        clearInterval(watchIntervalRef.current);
      }
    };
  }, []);

  const handlePasteParse = () => {
    if (!activeCharacter) {
      setErrorMsg('Please select or create a character first.');
      return;
    }
    if (!pasteText.trim()) return;

    setErrorMsg('');
    try {
      const result = parseLogText(pasteText);
      setParseStats({
        parsedLines: result.parsedLinesCount,
        matchesFound: result.unlockedFlagsCount
      });
      setRecentMatches(result.matches);

      if (result.matches.length > 0) {
        // Build incoming flags
        const incomingFlags: Record<string, string> = {};
        result.matches.forEach((m) => {
          if (m.bitPosition !== undefined) {
            // For bitmasks (hohtrials, sol_room), we need to set the bit.
            // Build a mask string
            const bitLength = m.matchedFlagId === 'hohtrials' ? 3 : 5;
            let valArr = Array(bitLength).fill('0');
            valArr[m.bitPosition] = '1';
            incomingFlags[m.matchedFlagId] = valArr.join('');
          } else {
            incomingFlags[m.matchedFlagId] = m.newValue;
          }
        });

        const mergedFlags = applyParsedFlagsToCharacterFlags(activeCharacter.flags, incomingFlags);
        onUpdateFlags(mergedFlags);
      }
    } catch (err: any) {
      setErrorMsg(`Parsing failed: ${err.message}`);
    }
  };

  const handleSelectFile = async () => {
    if (!activeCharacter) {
      setErrorMsg('Please select or create a character first.');
      return;
    }

    try {
      setErrorMsg('');
      // Check for file system access API support
      if ('showOpenFilePicker' in window) {
        const [handle] = await (window as any).showOpenFilePicker({
          types: [
            {
              description: 'EverQuest Log Files',
              accept: { 'text/plain': ['.txt'] }
            }
          ],
          multiple: false
        });
        
        if (handle) {
          setFileHandle(handle);
          setFileName(handle.name);
          const file = await handle.getFile();
          lastFileSizeBytesRef.current = file.size;
          
          // Do initial parse of last 5MB
          await parseFileHandle(handle);
        }
      } else {
        setErrorMsg('Your browser does not support the File System Access API. Please paste your logs instead.');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setErrorMsg(`Error choosing file: ${err.message}`);
      }
    }
  };

  const parseFileHandle = async (handle: FileSystemFileHandle) => {
    try {
      const file = await handle.getFile();
      // Read the last 5MB of the file
      const chunkText = await readLastChunkOfFile(file, 5);
      const result = parseLogText(chunkText);

      setParseStats({
        parsedLines: result.parsedLinesCount,
        matchesFound: result.unlockedFlagsCount
      });
      setRecentMatches(result.matches);

      if (result.matches.length > 0 && activeCharacter) {
        const incomingFlags: Record<string, string> = {};
        result.matches.forEach((m) => {
          if (m.bitPosition !== undefined) {
            const bitLength = m.matchedFlagId === 'hohtrials' ? 3 : 5;
            let valArr = Array(bitLength).fill('0');
            valArr[m.bitPosition] = '1';
            incomingFlags[m.matchedFlagId] = valArr.join('');
          } else {
            incomingFlags[m.matchedFlagId] = m.newValue;
          }
        });

        const mergedFlags = applyParsedFlagsToCharacterFlags(activeCharacter.flags, incomingFlags);
        onUpdateFlags(mergedFlags);
      }
    } catch (err: any) {
      setErrorMsg(`Error reading file: ${err.message}`);
    }
  };

  const handleManualFileParse = () => {
    if (fileHandle) {
      parseFileHandle(fileHandle);
    }
  };

  const toggleWatch = () => {
    if (!fileHandle) return;

    if (isWatching) {
      if (watchIntervalRef.current) {
        clearInterval(watchIntervalRef.current);
        watchIntervalRef.current = null;
      }
      setIsWatching(false);
    } else {
      setIsWatching(true);
      // Run watch loop every 3 seconds
      watchIntervalRef.current = window.setInterval(async () => {
        try {
          const file = await fileHandle.getFile();
          if (file.size > lastFileSizeBytesRef.current) {
            // File grew, read and parse
            await parseFileHandle(fileHandle);
            lastFileSizeBytesRef.current = file.size;
          }
        } catch (err) {
          console.error('Error during log file watch:', err);
        }
      }, 3000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* File System live log parser */}
      <div className="card">
        <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg style={{ width: '1.4rem', height: '1.4rem', fill: 'var(--color-gold)' }} viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          Live Log File Monitor
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          Link your active EverQuest character log file (e.g. <code>eqlog_CharName_projectquarm.txt</code>). 
          The app will monitor the log in real-time and automatically toggle your progression checkboxes when you sit and say <strong>"guided meditation"</strong> to the Seer or complete trials!
        </p>

        {errorMsg && (
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-raid-glow)', border: '1px solid var(--color-raid)', borderRadius: '4px', color: '#ff8888', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {errorMsg}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn btn-group" onClick={handleSelectFile}>
            Select Log File
          </button>
          
          {fileName && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-gold-bright)', fontWeight: 'bold' }}>
                Monitored: {fileName}
              </span>
              <button className="btn" onClick={handleManualFileParse} style={{ fontSize: '0.8rem', padding: '0.3rem 0.7rem' }}>
                Parse Now
              </button>
              <button 
                className={`btn ${isWatching ? 'btn-danger' : 'btn-group'}`} 
                onClick={toggleWatch} 
                style={{ fontSize: '0.8rem', padding: '0.3rem 0.7rem' }}
              >
                {isWatching ? 'Stop Live Watch' : 'Start Live Watch'}
              </button>
              {isWatching && (
                <span className="badge badge-group" style={{ animation: 'pulse 1.5s infinite', fontSize: '0.65rem' }}>
                  Watching Live
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Paste log fallback */}
      <div className="card">
        <h3 style={{ marginBottom: '0.75rem' }}>Paste Log Snippet</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
          Alternatively, sit in front of <strong>Seer Mal Nae`Shi</strong> in POK, type <code>/say guided meditation</code>, copy the text responses from your chat box, and paste them here:
        </p>

        <textarea
          className="parser-textarea"
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          placeholder="[Sat Aug 15 10:44:07 2026] Seer Mal Nae`Shi tells you, 'Your soul has formed a bond with the Plane of Time...'"
        />

        <div className="parser-status">
          <button className="btn btn-group" onClick={handlePasteParse} disabled={!pasteText.trim()}>
            Parse Pasted Logs
          </button>

          {parseStats && (
            <div style={{ fontSize: '0.85rem', color: 'var(--color-gold-bright)' }}>
              Parsed <strong>{parseStats.parsedLines}</strong> lines. Found <strong>{parseStats.matchesFound}</strong> flag updates!
            </div>
          )}
        </div>
      </div>

      {/* Recent parsed flags */}
      {recentMatches.length > 0 && (
        <div className="card">
          <h4 style={{ marginBottom: '0.75rem', color: 'var(--color-gold)' }}>Flag Events Found</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
            {recentMatches.map((m, idx) => (
              <div key={idx} style={{ padding: '0.5rem', backgroundColor: 'var(--color-bg-deep)', borderRadius: '4px', fontSize: '0.8rem', borderLeft: '3px solid var(--color-group)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                  <span>{m.timestamp}</span>
                  <span className="badge badge-group" style={{ fontSize: '0.65rem' }}>{m.matchedFlagId}</span>
                </div>
                <div style={{ color: 'var(--color-text-main)' }}>{m.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default LogParser;
