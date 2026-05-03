import React, { useState } from 'react';
import { useTax } from '../context/TaxContext';
import Step1Basics from './Step1Basics';
import Step2Employer from './Step2Employer';
import Step3Housing from './Step3Housing';
import Step4Investments from './Step4Investments';
import Step5Health from './Step5Health';
import './WizardContainer.css';

const STEP_LABELS = [
  'Basics', 'Employer', 'Housing', 'Investments', 'Health'
];

const WizardContainer = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const { inputs, handleChange, handleModeChange, handleResetSalaryFields, isMonthly, setIsMonthly } = useTax();
  const totalSteps = 5;

  const validateStep1 = () => {
    if (inputs.salaryMode === 'gross') {
      if (!inputs.grossSalary || Number(inputs.grossSalary) <= 0) {
        setErrorMsg('Please enter your Gross Salary before proceeding.');
        return false;
      }
    } else {
      if (!inputs.basicSalary || Number(inputs.basicSalary) <= 0) {
        setErrorMsg('Please enter your Basic Salary before proceeding.');
        return false;
      }
    }
    setErrorMsg('');
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep < totalSteps) setCurrentStep(s => s + 1);
    else if (onFinish) onFinish();
  };

  const handleBack = () => {
    setErrorMsg('');
    if (currentStep > 1) setCurrentStep(s => s - 1);
  };

  const handleDotClick = (targetStep) => {
    if (currentStep === 1 && targetStep > 1 && !validateStep1()) return;
    setErrorMsg('');
    setCurrentStep(targetStep);
  };

  const renderStep = () => {
    const props = { 
      inputs, 
      onChange: (n, v) => { setErrorMsg(''); handleChange(n, v); }, 
      isMonthly,
      onModeChange: handleModeChange,
      onResetSalary: handleResetSalaryFields
    };
    switch (currentStep) {
      case 1: return <Step1Basics {...props} />;
      case 2: return <Step2Employer {...props} />;
      case 3: return <Step3Housing {...props} />;
      case 4: return <Step4Investments {...props} />;
      case 5: return <Step5Health {...props} />;
      default: return <Step1Basics {...props} />;
    }
  };

  return (
    <div className="wizard-wrapper">
      {/* Progress Dots */}
      <div className="wizard-progress">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            onClick={() => handleDotClick(i + 1)}
            title={STEP_LABELS[i]}
            className={`progress-dot ${currentStep === i + 1 ? 'active' : ''} ${currentStep > i + 1 ? 'completed' : ''}`}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>

      {errorMsg && (
        <div style={{ color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.15)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.3)', textAlign: 'center' }}>
          {errorMsg}
        </div>
      )}

      {/* Step content */}
      <div className="wizard-body">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="wizard-navigation">
        <button
          className="btn btn-secondary"
          onClick={handleBack}
          style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
        >
          &larr; Back
        </button>
        <button
          className={`btn ${currentStep === totalSteps ? 'btn-success' : 'btn-primary'}`}
          onClick={handleNext}
        >
          {currentStep === totalSteps ? '✓ Calculate Final Tax' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

export default WizardContainer;
