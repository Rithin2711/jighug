import React, { useState } from 'react';
import InputPanel from './components/InputPanel';
import CalcHistory from './components/CalcHistory';
import ExportButtons from './components/ExportButtons';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Top-level CalcMate application component.
 * Manages state for session history, calculation result, mode selection, and alerts.
 * Layout: Prominent "mode choose" cards, then input panel, result, history, and export.
 */
function App() {
  const [history, setHistory] = useState([]);
  const [currentCalc, setCurrentCalc] = useState(null);
  const [alert, setAlert] = useState("");
  const [mode, setMode] = useState(null); // 'integral', 'derivative', 'limit' | null at start

  // Add a new calculation to the session (ephemeral, no persistence)
  const addCalculation = (calcObj) => {
    setHistory((prev) => [calcObj, ...prev.slice(0, 19)]); // Max 20 items in history
    setCurrentCalc(calcObj);
  };

  // For displaying an alert message
  const showAlert = (msg) => {
    setAlert(msg);
    setTimeout(() => setAlert(""), 3400);
  };

  // Visual select landing: Only shown if !mode
  const selectCards = [
    {
      key: "integral",
      title: "Integral",
      emoji: "∫",
      desc: "Compute the indefinite integral of a function.",
    },
    {
      key: "derivative",
      title: "Differential",
      emoji: "𝑑/dx",
      desc: "Find the derivative of a function.",
    },
    {
      key: "limit",
      title: "Limits",
      emoji: "lim",
      desc: "Find the limit of a function as a variable approaches a value.",
    }
  ];

  return (
    <div className="app-main-container">
      <h1>CalcMate</h1>
      <h3>
        Calculus Simplified: Limits, Derivatives, Integrals <span role="img" aria-label="sparkle">✨</span>
      </h3>
      {alert !== "" && (
        <div className="app-alert">{alert}</div>
      )}
      {!mode ? (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2em', margin: '36px 0 34px 0', flexWrap: 'wrap' }}>
          {selectCards.map(opt => (
            <button
              className="cm-modecard"
              key={opt.key}
              onClick={() => setMode(opt.key)}
              style={{
                minWidth: 170,
                padding: "32px 22px 26px 22px",
                border: "1.5px solid #324ffe",
                background: "#f6f8ff",
                borderRadius: 14,
                boxShadow: "0 3px 13px #e4eafe",
                textAlign: "center",
                fontSize: "1.23em",
                fontWeight: 500,
                cursor: "pointer",
                color: "#28325A",
                position: "relative",
                transition: "box-shadow 0.16s, border 0.17s",
                marginBottom: 14
              }}
              onMouseDown={e => e.currentTarget.style.boxShadow = '0 1.5px 4px #c5dafc'}
              onMouseUp={e => e.currentTarget.style.boxShadow = '0 3px 13px #e4eafe'}
              tabIndex={0}
              aria-label={`Select ${opt.title}`}
            >
              <span style={{fontSize:"2.1em", display:"block", marginBottom:10, fontWeight:600, color:"#28325A"}}>
                {opt.emoji}
              </span>
              {opt.title}
              <div style={{fontWeight:400, fontSize:"0.98em", color:"#626ca6", marginTop:8}}>{opt.desc}</div>
            </button>
          ))}
        </div>
      ) : (
        <>
          <InputPanel
            onCalculate={addCalculation}
            onInputError={showAlert}
            forcedType={mode}
            onBack={() => setMode(null)}
          />
          <ExportButtons calculation={currentCalc} />
          <CalcHistory history={history} onSelect={setCurrentCalc} />
        </>
      )}
      <footer style={{marginTop:24, fontSize:'0.97em', color:'#888', textAlign:'center'}}>
        &copy; {new Date().getFullYear()} CalcMate Educational Tool
      </footer>
    </div>
  );
}

export default App;
