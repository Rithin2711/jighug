import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import LatexRenderer from './LatexRenderer';

// PUBLIC_INTERFACE
/**
 * Provides 'Export to PDF' and 'Export as Image' buttons for the current solution.
 * @param calculation - the currently displayed calculation object
 */
function ExportButtons({ calculation }) {
  const exportAreaRef = useRef(null);

  if (!calculation) return null;

  // Export as PDF
  const handleExportPDF = async () => {
    const element = exportAreaRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#fff" });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
    const margin = 36;
    const pageWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
    const pageHeight = pdf.internal.pageSize.getHeight() - 2 * margin;
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    // Fit to width
    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight, 1);
    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth * ratio, imgHeight * ratio);
    pdf.save('calcmate_result.pdf');
  };

  // Export as Image
  const handleExportImage = async () => {
    const element = exportAreaRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#fff" });
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calcmate_result.png';
    link.click();
  };

  return (
    <div style={{margin: '18px 0 28px 0'}}>
      <div ref={exportAreaRef} style={{
        background:'#fff', border:'1px solid #d9e3fa', borderRadius:10, padding:15, boxShadow:'0 2.5px 9px #eee'
      }}>
        <div style={{fontSize:'1.1em', color:'#263'}}>
          <b>
            {calculation.calcType.charAt(0).toUpperCase() + calculation.calcType.slice(1)}
          </b>
          {(calculation.atPoint && calculation.atPoint!=="") &&
            <> (at {calculation.variable} = {calculation.atPoint})</>
          }
        </div>
        <LatexRenderer latex={calculation.displayLatex} />
        <div style={{fontWeight: 400, fontSize: '1.01em', margin: '6px 0'}}>
          {calculation.stepLatex?.map((step, idx) => (
            <LatexRenderer latex={step} key={idx}/>
          ))}
        </div>
        <div style={{color:'#777', fontSize:'0.94em', marginTop:8,wordBreak:'break-word'}}>
          <span><b>Input:</b> {calculation.rawInput}</span>
        </div>
      </div>
      <div style={{marginTop:12, display:'flex', gap:'0.7em'}}>
        <button className="cm-btn" onClick={handleExportPDF}>
          Export as PDF
        </button>
        <button className="cm-btn" onClick={handleExportImage}>
          Export as Image
        </button>
      </div>
    </div>
  );
}

export default ExportButtons;
