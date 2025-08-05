import React, { useState } from 'react';
import InputPanel from './components/InputPanel';
import CalcHistory from './components/CalcHistory';
import ExportButtons from './components/ExportButtons';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Top-level CalcMate application component.
 * Manages state for session history, calculation result, and alerts.
 * Layout: Input panel, result/step display, history, and export controls.
 */
function App() {
  const [history, setHistory] = useState([]);
  const [currentCalc, setCurrentCalc] = useState(null);
  const [alert, setAlert] = useState("");

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

  return (
    <div className="app-main-container">
      <h1>CalcMate</h1>
      <h3>
        Calculus Simplified: Limits, Derivatives, Integrals <span role="img" aria-label="sparkle">✨</span>
      </h3>
      {alert !== "" && (
        <div className="app-alert">{alert}</div>
      )}
      <InputPanel onCalculate={addCalculation} onInputError={showAlert} />
      <ExportButtons calculation={currentCalc} />
      <CalcHistory history={history} onSelect={setCurrentCalc} />
      <footer style={{marginTop:24, fontSize:'0.97em', color:'#888', textAlign:'center'}}>
        &copy; {new Date().getFullYear()} CalcMate Educational Tool
      </footer>
    </div>
  );
}

export default App;
