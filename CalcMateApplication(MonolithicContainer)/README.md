# CalcMate - Monolithic React Container

CalcMate is a user-friendly, fully client-side web application for solving basic calculus problems: limits, derivatives, and integrals. It provides quick, accurate solutions with step-by-step explanations and LaTeX-style math output. No backend or persistent storage required (ephemeral history).

## Features

- Input calculus expressions: limits, derivatives, integrals (selectable)
- Input validation and error handling
- Real-time calculation using math.js (all local, no backend)
- Step-by-step explanations
- LaTeX-style results rendered with KaTeX
- Responsive layout for desktop/mobile
- Session-based (ephemeral) calculation history
- Export results to PDF or image
- Intuitive and friendly interface targeting students

## Tech Stack

- React
- math.js (calculation engine)
- KaTeX (LaTeX rendering)
- html2canvas and jsPDF (export functionality)

## Installation & Running

```bash
# From this folder:
npm install
npm start
```

The app will be available at http://localhost:3000.

## Usage

1. Select the problem type (limit, derivative, integral).
2. Enter your expression and variable of interest.
3. For limits and evaluation at a point, specify the value.
4. View solution, step-by-step explanation, and export/share your results.
5. Session history is saved while the page is active.

---

**All logic is performed client-side with no persistent user data and no backend or login required.**
