import React, { useState } from 'react';
import { calculate } from '../lib/calculusEngine';
import LatexRenderer from './LatexRenderer';

/**
 * Component for user input:
 * - If "forcedType" prop is set, locks the mode and hides the dropdown, provides a "Back" button.
 * - Otherwise, shows the mode dropdown as before.
 * @param onCalculate - callback for successful calculation
 * @param onInputError - callback for error display
 * @param forcedType - (optional) lock mode to 'integral'|'derivative'|'limit'
 * @param onBack - (optional) callback for back button to mode selection
 */
// PUBLIC_INTERFACE
function InputPanel({ onCalculate, onInputError, forcedType = null, onBack }) {
  const [calcType, setCalcType] = useState(forcedType || 'derivative');
  const [input, setInput] = useState('');
  const [variable, setVariable] = useState('x');
  const [calcPoint, setCalcPoint] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Update calcType if forcedType changes (for when returning to selection)
  React.useEffect(() => {
    if (forcedType) setCalcType(forcedType);
  }, [forcedType]);

  const resetFields = () => {
    setInput('');
    setCalcPoint('');
    setVariable('x');
  };

  // Validates input before calculation
  const handleCalculate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let computation;
    try {
      computation = await calculate({
        type: calcType,
        expression: input,
        variable,
        point: calcPoint // can be '' if not relevant
      });
    } catch (err) {
      onInputError("Error: " + (err.message || "Invalid input"));
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    if (computation.error) {
      onInputError(computation.error);
      return;
    }
    onCalculate({
      ...computation,
      rawInput: input,
      calcType,
      atPoint: calcPoint,
      variable,
      created: Date.now()
    });
    resetFields();
  };

  // placeholder description per type
  const getPlaceholder = () => {
    switch (calcType) {
      case "limit": return "e.g. (sin(x)-x)/(x^3), x→0";
      case "derivative": return "e.g. x^2 * sin(x)";
      case "integral": return "e.g. x^2 + 3*x";
      default: return "";
    }
  };

  // Fancier label for forcedType
  const getForcedLabel = () => {
    switch (forcedType) {
      case "integral": return <>Integral</>;
      case "derivative": return <>Differential</>;
      case "limit": return <>Limit</>;
      default: return null;
    }
  };

  return (
    <form className="input-panel" onSubmit={handleCalculate} style={{marginBottom:20, marginTop:14}}>
      {forcedType ? (
        <div style={{display:'flex', alignItems:'center', marginBottom:10, gap:12}}>
          <span style={{
            display:'inline-flex',
            alignItems:'center',
            fontWeight:600,
            color:'#304ffe',
            fontSize:'1.10em',
            letterSpacing:'0.01em'
          }}>
            <span style={{marginRight:8, fontSize:'1.29em', opacity:0.88}}>
              {forcedType === "integral" && "∫"}
              {forcedType === "derivative" && "𝑑/dx"}
              {forcedType === "limit" && "lim"}
            </span>
            {getForcedLabel()}
          </span>
          <button type="button"
            className="cm-btn"
            style={{
              background: "#e6edff",
              color: "#314dda",
              fontWeight:600,
              marginLeft:14,
              fontSize:"0.99em"
            }}
            onClick={onBack}
          >
            ← Change Problem Type
          </button>
        </div>
      ) : (
        <label>
          Type:
          <select value={calcType} onChange={e => setCalcType(e.target.value)} style={{marginLeft:8}}>
            <option value="derivative">Derivative</option>
            <option value="integral">Integral</option>
            <option value="limit">Limit</option>
          </select>
        </label>
      )}

      <label style={{marginLeft:forcedType ? 0 : 12}}>
        Variable:
        <input type="text"
          value={variable}
          maxLength={3}
          style={{marginLeft:6, width:45}}
          required
          onChange={e => setVariable(e.target.value.replace(/[^a-zA-Z]/, ""))}
        />
      </label>

      <br />

      <label>
        {calcType === "limit"
          ? "Expression (and x→value):"
          : calcType === "derivative"
          ? "Function to differentiate:"
          : "Function to integrate:"}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          type="text"
          required
          placeholder={getPlaceholder()}
          style={{width:'62%',marginLeft:8}}
        />
      </label>

      {(calcType === "limit" || calcType === "derivative") && (
        <label style={{marginLeft: 8}}>
          At {variable} =
          <input
            type="text"
            value={calcPoint}
            onChange={e => setCalcPoint(e.target.value)}
            placeholder={calcType === "limit" ? "e.g. 0" : "leave blank for general"}
            style={{marginLeft:6, width:60}}
          />
        </label>
      )}

      <button className="cm-btn" type="submit" disabled={isLoading||!input}>
        {isLoading ? "Calculating..." : "Calculate"}
      </button>
      <button className="cm-btn" type="button" onClick={resetFields} style={{background:'#eee', color:'#444', marginLeft:3}}>
        Clear
      </button>
    </form>
  );
}

export default InputPanel;
