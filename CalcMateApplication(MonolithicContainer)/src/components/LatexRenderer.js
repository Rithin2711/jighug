import React from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

// PUBLIC_INTERFACE
/**
 * Renders a LaTeX string as a mathematical formula (block mode).
 * @param latex {string} The latex formula to render
 */
function LatexRenderer({ latex }) {
  if (!latex) return null;
  return (
    <div style={{margin:'12px 0', fontSize:'1.12em'}}>
      <BlockMath math={latex} errorColor="#cc0000" />
    </div>
  );
}

export default LatexRenderer;
