import katex from 'katex';
import 'katex/dist/katex.min.css';

// PUBLIC_INTERFACE
/**
 * Minimal wrapper to simulate BlockMath for LaTeX math rendering.
 * Used for SSR or fallback. Should be replaced by 'react-katex'
 */
export function BlockMath({ math, errorColor }) {
  try {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(math, {
            throwOnError: false,
            errorColor: errorColor || '#cc0000',
            displayMode: true,
          }),
        }}
      />
    );
  } catch (e) {
    return <span style={{ color: errorColor || '#cc0000' }}>Invalid LaTeX</span>;
  }
}
