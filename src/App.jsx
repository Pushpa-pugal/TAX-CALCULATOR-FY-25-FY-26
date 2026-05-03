import { useState } from 'react'
import { TaxProvider, useTax } from './context/TaxContext'
import LandingPage from './components/LandingPage'
import WizardContainer from './components/WizardContainer'
import LivePreview from './components/LivePreview'
import ResultPage from './components/ResultPage'
import './App.css'

function CalculatorApp() {
  const [started, setStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { taxResults, inputs, resetInputs } = useTax();

  const handleRestart = () => {
    resetInputs();
    setShowResults(false);
    setStarted(false);
  };

  if (!started) return <LandingPage onStart={() => setStarted(true)} />;

  if (showResults) {
    return (
      <ResultPage
        results={taxResults}
        inputs={inputs}
        onRestart={handleRestart}
        onEdit={() => setShowResults(false)}
      />
    );
  }

  return (
    <div className="calculator-layout container">
      <header className="calculator-header">
        <button className="btn-back" onClick={() => setStarted(false)}>&larr; Back</button>
        <h1 className="header-title">Indian Tax Calculator</h1>
      </header>
      <div className="calculator-grid">
        <div className="calculator-left">
          <WizardContainer onFinish={() => setShowResults(true)} />
        </div>
        <div className="calculator-right">
          <LivePreview results={taxResults} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TaxProvider>
      <div style={{ position: 'fixed', bottom: '10px', right: '10px', opacity: 0.02, fontSize: '10px', color: '#ffffff', pointerEvents: 'none', userSelect: 'none', zIndex: 9999 }}>
        TaxCalcPushpa
      </div>
      <CalculatorApp />
    </TaxProvider>
  );
}
