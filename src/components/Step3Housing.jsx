import React from 'react';
import Toggle from './Toggle';
import FieldInput from './FieldInput';
import './WizardSteps.css';

const Step3Housing = ({ inputs, onChange, onModeChange }) => {
  const fm = inputs.fieldModes || {};
  const toggle = (name, checked, clearFields = []) => {
    onChange(name, checked);
    if (!checked) clearFields.forEach(f => onChange(f, typeof f === 'string' && (f === 'isMetro' || f === 'parentsSenior') ? false : 0));
  };

  return (
    <div className="step-container animate-fade-in">
      <h2 className="step-title">Step 3: Rent & Home Loan</h2>
      <p className="step-subtitle text-muted">Details about where you live and housing expenses.</p>

      {/* Rent / HRA */}
      <div className="deduction-block">
        <Toggle label="Do you live in a rented house?"
          name="hasRent" checked={!!inputs.hasRent}
          onChange={(n, v) => toggle(n, v, ['rentPaid', 'basicSalary', 'hraReceived', 'isMetro'])} />
        {inputs.hasRent && (
          <div className="slide-down">
            <div style={{ marginBottom: '0.75rem' }}>
              <Toggle label="Is your city a Metro (Delhi, Mumbai, Chennai, Kolkata)?"
                name="isMetro" checked={!!inputs.isMetro}
                onChange={(n, v) => onChange(n, v)} />
            </div>
            <FieldInput id="rentPaid" name="rentPaid"
              label="Total rent paid per year"
              value={inputs.rentPaid} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
              sectionTag="Sec 10(13A)" regime="old" />

            {inputs.salaryMode !== 'splits' && (
              <FieldInput id="basicSalary" name="basicSalary"
                label="Basic Salary per year"
                value={inputs.basicSalary} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
                sectionTag="For HRA formula"
                hint="Usually 40–50% of gross salary."
                linkText="HRA in salary splits (Step 1)" linkTarget="basicSalary" />
            )}

            {inputs.salaryMode !== 'splits' && (
              <FieldInput id="hraReceived" name="hraReceived"
                label="HRA received from employer per year"
                value={inputs.hraReceived} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
                sectionTag="Sec 10(13A)" regime="old"
                linkText="HRA from Splits (Step 1)" linkTarget="hraReceived" />
            )}
            {inputs.salaryMode === 'splits' && (
              <p className="input-hint">Basic Salary and HRA are pre-filled from your Splits entry in Step 1.</p>
            )}

            <details className="faq-section">
              <summary>Why do you need my Basic Salary for HRA?</summary>
              <p>HRA exemption is the minimum of: actual HRA received, rent paid minus 10% of basic, and 50% (Metro) or 40% (Non-Metro) of basic salary.</p>
            </details>
          </div>
        )}
      </div>

      {/* Home Loan */}
      <div className="deduction-block">
        <Toggle label="Are you paying home loan EMIs? (Sec 24b)"
          name="hasHomeLoan" checked={!!inputs.hasHomeLoan}
          onChange={(n, v) => toggle(n, v, ['homeLoanInterest'])} />
        {inputs.hasHomeLoan && (
          <div className="slide-down">
            <FieldInput id="homeLoanInterest" name="homeLoanInterest"
              label="Interest paid this year"
              value={inputs.homeLoanInterest} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
              sectionTag="Sec 24(b) — max ₹2,00,000" regime="old"
              hint="Up to ₹2,00,000 allowed for a self-occupied property."
              linkText="Section 80EEA (Step 4 — additional for affordable housing)" linkTarget="sec80EEAAmount" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Step3Housing;
