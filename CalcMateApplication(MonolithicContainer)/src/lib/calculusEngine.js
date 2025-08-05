import { evaluate, derivative, parse } from 'mathjs';

// PUBLIC_INTERFACE
/**
 * Main calculation function.
 * @param {Object} opts
 * @param {'derivative'|'integral'|'limit'} opts.type 
 * @param {string} opts.expression
 * @param {string} opts.variable
 * @param {string|undefined} opts.point
 * @returns {Promise<Object>} A result object containing displayLatex, stepLatex, and error (if any)
 */
export async function calculate({ type, expression, variable, point }) {
  let displayLatex = "", stepLatex = [], error = "";
  try {
    if (!expression || !variable.match(/^[a-zA-Z]$/)) {
      return { error: "Input error: Check your function and variable." };
    }
    let parsed, numericVal, atPoint;
    switch (type) {
      case "derivative":
        parsed = parse(expression);
        displayLatex = `\\displaystyle \\frac{d}{d${variable}} \\left(${toLatex(expression)}\\right)`;

        // Compute derivative symbolically
        let deriv = derivative(parsed, variable);
        stepLatex.push(`= ${toLatex(deriv.toString())}`);

        // Evaluate at point if given
        if (point && point.trim() !== "") {
          atPoint = toNumber(point);
          numericVal = deriv.evaluate({ [variable]: atPoint });
          stepLatex.push(`\\text{At } ${variable} = ${atPoint}: = ${toLatex(numericVal.toString())}`);
        }
        break;

      case "integral":
        parsed = parse(expression);
        displayLatex = `\\displaystyle \\int ${toLatex(expression)}\\, d${variable}`;

        // Compute indefinite integral
        let intg = tryIntegrate(parsed, variable);
        if (typeof intg === "string" && intg.startsWith("unable:")) {
          return { error: "Integrator: " + intg.replace("unable:","") };
        }
        stepLatex.push(`= ${toLatex(intg.toString())}`);
        break;

      case "limit":
        // Parse input such as (expr), x→val
        if (!point || point.trim() === "") return { error: "For limits, specify x → value." };
        atPoint = toNumber(point);

        displayLatex = `\\displaystyle \\lim_{${variable} \\to ${atPoint}}\\; ${toLatex(expression)}`;
        // Plug point in, try direct sub.
        let limitVal = tryLimit(expression, variable, atPoint);
        if (limitVal.error) return { error: "Limit: " + limitVal.error };

        stepLatex = limitVal.stepLatex;
        break;
      default:
        return { error: "Unknown calculation type." };
    }
  } catch (err) {
    return { error: "Calculation error: " + err.message };
  }

  return {
    displayLatex,
    stepLatex,
    error: error || undefined
  };
}

// ========== Helper Functions ==========
function toLatex(expr) {
  // Try to print a latex representation using mathjs
  try {
    if (typeof expr !== 'string' && expr.toTex) return expr.toTex();
    return parse(expr).toTex();
  } catch {
    return expr.toString();
  }
}

function toNumber(str) {
  if (typeof str === "number") return str;
  if (!str) throw new Error("Not a number.");
  let s = str.replace(/π/g, 'pi').replace(/÷/g, '/');
  return evaluate(s);
}

/**
 * Try evaluating a limit step-by-step: direct substitution, 0/0, L'Hospital.
 */
function tryLimit(exprStr, variable, atPoint) {
  let stepLatex = [];
  let expr, directEval, numer, denom;
  try {
    expr = parse(exprStr);
    directEval = expr.evaluate({ [variable]: atPoint });
    if (typeof directEval === 'number' && isFinite(directEval)) {
      stepLatex.push(`\\text{Direct substitution gives: } ${directEval}`);
      return { value: directEval, stepLatex };
    }
  } catch { /* continue if cannot eval directly */ }
  // If substitution gives 0/0, try L'Hospital
  try {
    let splitted = splitFraction(exprStr);
    if (!splitted) return { error: "Expression is not a fraction, and direct substitution failed.", stepLatex };
    numer = splitted.numerator;
    denom = splitted.denominator;
    let numDeriv = derivative(parse(numer), variable);
    let denDeriv = derivative(parse(denom), variable);
    let hExpr = parse(`(${numDeriv.toString()})/(${denDeriv.toString()})`);
    let hospitalEval = hExpr.evaluate({ [variable]: atPoint });
    stepLatex.push(`\\text{Direct gives indeterminate } \\frac{0}{0}.\\ L'Hospital: } \\frac{d}{d${variable}} \\left(${toLatex(numer)}\\right) / \\frac{d}{d${variable}} \\left(${toLatex(denom)}\\right)`);
    stepLatex.push(`= ${toLatex(numDeriv)} / ${toLatex(denDeriv)} = ${hospitalEval}`);
    return { value: hospitalEval, stepLatex };
  } catch {
    return { error: "Unable to resolve limit with direct substitution or L'Hospital.", stepLatex };
  }
}

function splitFraction(expr) {
  // Looks for "(numer)/(denom)"
  const match = expr.match(/^(.+)\s*\/\s*(.+)$/);
  if (!match) return null;
  return {
    numerator: match[1],
    denominator: match[2]
  };
}

/**
 * Compute integral of parsed expr w.r.t. variable for basic polynomials only.
 * For more complex expressions, a better symbolic integrator would be required.
 */
function tryIntegrate(parsedExpr, variable) {
  // Try to symbolically integrate x^n -> x^(n+1)/(n+1) + C for polynomials
  try {
    // This is a very basic and limited fallback: only works for monomials like x^2, 3*x, or x
    // For demo purposes only, not a real CAS!
    let str = parsedExpr.toString();
    let match = str.match(/^([0-9.]*)\s*\*?\s*([a-zA-Z])(?:\^([0-9.]+))?$/);
    if (match && match[2] === variable) {
      const coef = match[1] === "" ? 1 : parseFloat(match[1]);
      const power = match[3] ? parseFloat(match[3]) : 1;
      const newPower = power + 1;
      const newCoef = coef / newPower;
      if (newCoef === 1)
        return `${variable}^${newPower}/${newPower}`;
      else
        return `${newCoef}*${variable}^${newPower}`;
    }
    // handle constant c: ∫c dx = c*x
    let constMatch = str.match(/^([0-9.]+)$/);
    if (constMatch)
      return `${constMatch[1]}*${variable}`;
    // If not recognized, return unable
    return "unable:Integration/step not implemented for this function.";
  } catch {
    return "unable:Integration/step not implemented for this function.";
  }
}

// ========== Exported helper to generate intermediate step latex if needed ==========
/**
 * Generates an array of LaTeX strings for step-by-step explanation.
 * This is a stub for now, but could be made to compute real steps.
 * @param calculationObj
 */
export function getStepLatex(calculationObj) {
  // For now, steps are precomputed within `calculate`
  return calculationObj.stepLatex || [];
}
