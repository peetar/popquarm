import React from 'react';
import type { NpcRawData } from '../types';
import { parseSpecialAbilities, CLASS_MAP } from '../utils/npcData';

interface NpcModalProps {
  npc: NpcRawData | null;
  onClose: () => void;
}

export const NpcModal: React.FC<NpcModalProps> = ({ npc, onClose }) => {
  if (!npc) return null;

  const cleanName = (npc.name || '').replace(/_/g, ' ').replace(/^#/, '');
  const abilities = parseSpecialAbilities(npc.special_abilities);
  const className = CLASS_MAP[npc.class] || `Class ${npc.class}`;

  const hasAbility = (name: string) => abilities.some(a => a.name.toLowerCase() === name.toLowerCase());

  const isSlowable = !hasAbility('Unslowable');
  const hasFlurry = hasAbility('Flurry');
  const hasRampage = hasAbility('Rampage');
  const hasAreaRampage = hasAbility('Area Rampage');
  const hasSummon = hasAbility('Summon');
  const hasEnrage = hasAbility('Enrage');

  // Slow mitigation
  const slowMit = parseInt(npc.slow_mitigation || '0', 10);
  const slowMitText = slowMit > 0 ? `${slowMit}%` : (hasAbility('Unslowable') ? 'Immune' : 'None');

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(3px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div 
        className="card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '650px',
          maxWidth: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'var(--color-bg-dark)',
          border: '1px solid var(--color-gold-bright)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 15px var(--color-gold-glow)',
          padding: '1.5rem',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(197, 168, 128, 0.25)', paddingBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-gold-bright)', margin: 0 }}>
                {cleanName}
              </h2>
              {npc.name?.startsWith('#') && (
                <span className="badge badge-raid" style={{ fontSize: '0.65rem' }}>Boss Spawn (#)</span>
              )}
            </div>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              NPC ID: <strong>{npc.id}</strong> | Zone: <strong>{npc.long_name || npc.zone}</strong> | Level: <strong>{npc.level}</strong> {className}
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '0.2rem 0.5rem',
              lineHeight: 1
            }}
          >
            ✕
          </button>
        </div>

        {/* Tactical Key Combat Highlights Box */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.75rem',
          backgroundColor: 'var(--color-bg-deep)',
          padding: '0.85rem',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Hit Damage</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-raid)' }}>
              {npc.mindmg || '0'} - {npc.maxdmg || '0'}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Hit Points</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#34d399' }}>
              {parseInt(npc.hp || '0', 10).toLocaleString()} HP
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Attack Delay</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-gold-bright)' }}>
              {npc.attack_delay || '30'} ({((parseInt(npc.attack_delay || '30', 10)) / 10).toFixed(1)}s)
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Slow Mitigation</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: isSlowable ? '#60a5fa' : '#f87171' }}>
              {slowMitText}
            </div>
          </div>
        </div>

        {/* Essential Combat Flags */}
        <div>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--color-gold)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tactical Combat Profile
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span className={`badge ${hasSummon ? 'badge-raid' : 'badge-optional'}`}>
              {hasSummon ? '✓ Can Summon' : '✗ No Summon'}
            </span>
            <span className={`badge ${hasFlurry ? 'badge-raid' : 'badge-optional'}`}>
              {hasFlurry ? '✓ Flurry' : '✗ No Flurry'}
            </span>
            <span className={`badge ${hasRampage ? 'badge-raid' : 'badge-optional'}`}>
              {hasRampage ? '✓ Rampage' : '✗ No Rampage'}
            </span>
            <span className={`badge ${hasAreaRampage ? 'badge-raid' : 'badge-optional'}`}>
              {hasAreaRampage ? '✓ Area Rampage' : '✗ No Area Rampage'}
            </span>
            <span className={`badge ${hasEnrage ? 'badge-raid' : 'badge-optional'}`}>
              {hasEnrage ? '✓ Enrage' : '✗ No Enrage'}
            </span>
            <span className={`badge ${isSlowable ? 'badge-group' : 'badge-raid'}`}>
              {isSlowable ? '✓ Slowable' : '✗ Unslowable'}
            </span>
          </div>
        </div>

        {/* Resistances & Defense */}
        <div>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--color-gold)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Defenses & Resistances
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '0.5rem',
            textAlign: 'center',
            fontSize: '0.8rem',
            backgroundColor: 'var(--color-bg-deep)',
            padding: '0.6rem',
            borderRadius: '4px'
          }}>
            <div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.65rem' }}>AC</div>
              <strong style={{ color: '#fff' }}>{npc.AC || '0'}</strong>
            </div>
            <div>
              <div style={{ color: '#60a5fa', fontSize: '0.65rem' }}>MAGIC</div>
              <strong>{npc.MR || '0'}</strong>
            </div>
            <div>
              <div style={{ color: '#f87171', fontSize: '0.65rem' }}>FIRE</div>
              <strong>{npc.FR || '0'}</strong>
            </div>
            <div>
              <div style={{ color: '#38bdf8', fontSize: '0.65rem' }}>COLD</div>
              <strong>{npc.CR || '0'}</strong>
            </div>
            <div>
              <div style={{ color: '#34d399', fontSize: '0.65rem' }}>POISON</div>
              <strong>{npc.PR || '0'}</strong>
            </div>
            <div>
              <div style={{ color: '#fb923c', fontSize: '0.65rem' }}>DISEASE</div>
              <strong>{npc.DR || '0'}</strong>
            </div>
          </div>
        </div>

        {/* Detection & Regen */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.78rem' }}>
          <div style={{ backgroundColor: 'var(--color-bg-deep)', padding: '0.6rem', borderRadius: '4px' }}>
            <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>Detection: </span>
            <span style={{ color: 'var(--color-text-muted)' }}>
              See Invis: {npc.see_invis === '1' ? 'Yes' : 'No'} | 
              See IVU: {npc.see_invis_undead === '1' ? 'Yes' : 'No'} | 
              See Sneak: {npc.see_sneak === '1' ? 'Yes' : 'No'}
            </span>
          </div>
          <div style={{ backgroundColor: 'var(--color-bg-deep)', padding: '0.6rem', borderRadius: '4px' }}>
            <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>Regen: </span>
            <span style={{ color: 'var(--color-text-muted)' }}>
              Combat HP Regen: {npc.combat_hp_regen || '0'}/tick | OOC: {npc.hp_regen_rate || '0'}/tick
            </span>
          </div>
        </div>

        {/* All Parsed Special Abilities */}
        {abilities.length > 0 && (
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--color-gold)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Special Abilities Decoded ({abilities.length})
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {abilities.map((ab, i) => (
                <span 
                  key={i} 
                  style={{
                    fontSize: '0.72rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.07)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '3px',
                    color: 'var(--color-text-main)'
                  }}
                >
                  {ab.name}{ab.param ? ` (${ab.param})` : ''}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Link Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem', marginTop: 'auto' }}>
          <a
            href={`https://www.pqdi.cc/npc/${npc.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-group"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            Open on PQDI.cc ↗
          </a>
          <button 
            className="btn"
            onClick={onClose}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
