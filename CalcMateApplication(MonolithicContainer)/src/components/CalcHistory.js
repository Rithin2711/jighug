import React from 'react';
import LatexRenderer from './LatexRenderer';

// PUBLIC_INTERFACE
/**
 * Displays calculation history for current session (ephemeral).
 * @param history - array of calculation objects
 * @param onSelect - callback for selecting item from history
 */
function CalcHistory({ history, onSelect }) {
  if (history.length === 0) return null;

  return (
    <section style={{marginTop:28}}>
      <h3 style={{marginBottom:6, fontWeight:500, fontSize:'1.12em'}}>Session History</h3>
      <div className="history-list" style={{
        background:'#f9fafe', borderRadius:10, padding:8
      }}>
        {history.map((item, idx) => (
          <div className="history-item" key={item.created} style={{
            marginBottom:7, borderBottom:'1px dashed #cfd9ee', paddingBottom:7
          }}>
            <span style={{fontWeight:600, color:'#355'}}>
              [{item.calcType.charAt(0).toUpperCase() + item.calcType.slice(1)}]
            </span>{' '}
            <span style={{color:'#666', fontSize:'0.97em'}}>{item.rawInput} {item.atPoint ? `(at ${item.variable}=${item.atPoint})` : ''}</span>
            <button
              className="cm-btn"
              style={{background:'#eaf0ff', color:'#324ffe', marginLeft:14, fontSize:'0.95em'}}
              onClick={() => onSelect(item)}
            >
              View
            </button>
            <LatexRenderer latex={item.displayLatex} />
            <div style={{fontSize:'0.96em', color:'#555'}}>
              {item.stepLatex?.map((step, sidx) => (
                <LatexRenderer latex={step} key={sidx}/>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CalcHistory;
