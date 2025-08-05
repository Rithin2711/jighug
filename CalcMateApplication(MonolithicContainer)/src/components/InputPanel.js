import React, { useState } from 'react';
import { calculate, getStepLatex } from '../lib/calculusEngine';
import LatexRenderer from './LatexRenderer';

// PUBLIC_INTERFACE
/**
 * Component for user input: selects type, receives input, validates and calculates on submit.
 * @param onCalculate - callback for successful calculation
 * @param onInputError - callback for error display
 */
function InputPanel({ onCalculate, onInputError }) {
  const [calcType, setCalcType] = useState('derivative');
  const [input, setInput] = useState('');
  const [variable, setVariable] = useState('x');
  const [calcPoint, setCalcPoint] = useState(''); // For limit, derivative at point
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <form className="input-panel" onSubmit={handleCalculate} style={{marginBottom:20}}>
      <label>
        Type:
        <select value={calcType} onChange={e => setCalcType(e.target.value)} style={{marginLeft:8}}>
          <option value="derivative">Derivative</option>
          <option value="integral">Integral</option>
          <option value="limit">Limit</option>
        </select>
      </label>

      <label style={{marginLeft:12}}>
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
