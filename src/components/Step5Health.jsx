import React from 'react';
import Toggle from './Toggle';
import FieldInput from './FieldInput';
import './WizardSteps.css';

const Step5Health = ({ inputs, onChange, onModeChange }) => {
  const fm = inputs.fieldModes || {};
  const isSeniorSelf = inputs.ageGroup === '60to79' || inputs.ageGroup === '80plus';

  const toggle = (name, checked, clearFields = []) => {
    onChange(name, checked);
    if (!checked) clearFields.forEach(f =>
      onChange(f, f === 'parentsSenior' ? false : 0)
    );
  };

  return (
    <div className="step-container animate-fade-in">
      <h2 className="step-title">Step 5: Health, Disability & Other Income</h2>
      <p className="step-subtitle text-muted">Final details on insurance, bank interest, and disability deductions.</p>

      {/* 80D Health Insurance */}
      <div className="deduction-block">
        <Toggle label="Do you pay health insurance premiums? (Sec 80D)"
          name="hasHealthInsurance" checked={!!inputs.hasHealthInsurance}
          onChange={(n, v) => toggle(n, v, ['healthPremiumSelf', 'healthPremiumParents', 'parentsSenior'])} />
        {inputs.hasHealthInsurance && (
          <div className="slide-down">
            <FieldInput id="healthPremiumSelf" name="healthPremiumSelf"
              label="Annual premium for yourself / family"
              value={inputs.healthPremiumSelf} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
              sectionTag="Sec 80D" regime="old"
              hint={`Limit: ${isSeniorSelf ? '₹50,000 (senior citizen)' : '₹25,000'}.`} />

            <FieldInput id="healthPremiumParents" name="healthPremiumParents"
              label="Annual premium for parents (optional)"
              value={inputs.healthPremiumParents} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
              sectionTag="Sec 80D" regime="old" />

            <div style={{ marginBottom: '0.75rem' }}>
              <Toggle label="Are your parents senior citizens (60+ years)?"
                name="parentsSenior" checked={!!inputs.parentsSenior}
                onChange={(n, v) => onChange(n, v)} />
            </div>
            <p className="input-hint">Parents limit: {inputs.parentsSenior ? '₹50,000 (senior citizens)' : '₹25,000'}. Old Regime only.</p>
          </div>
        )}
      </div>

      {/* Bank Interest — 80TTA / 80TTB */}
      <div className="deduction-block">
        <Toggle label="Did you earn interest from savings accounts or FDs?"
          name="hasInterest" checked={!!inputs.hasInterest}
          onChange={(n, v) => toggle(n, v, ['savingsInterest', 'fdInterest'])} />
        {inputs.hasInterest && (
          <div className="slide-down">
            <FieldInput id="savingsInterest" name="savingsInterest"
              label="Savings Account Interest this year"
              value={inputs.savingsInterest} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
              sectionTag={isSeniorSelf ? 'Sec 80TTB (60+)' : 'Sec 80TTA'} regime="old"
              linkText="Interest Exemption (80TTA/80TTB)" linkTarget="savingsInterest" />

            <FieldInput id="fdInterest" name="fdInterest"
              label="FD / Other Interest this year"
              value={inputs.fdInterest} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
              sectionTag={isSeniorSelf ? 'Sec 80TTB — seniors only' : 'Fully taxable'}
              hint="Added to your income first, then the 80TTA/80TTB exemption is applied." />
          </div>
        )}
        <details className="faq-section">
          <summary>What is 80TTA / 80TTB?</summary>
          <p>Under 60: Savings interest up to ₹10,000 is tax-free (80TTA — Old Regime only). Senior citizens: Both savings + FD interest up to ₹50,000 is tax-free (80TTB — Old Regime only).</p>
        </details>
      </div>

      {/* 80U — Disability Self */}
      <div className="deduction-block">
        <Toggle label="Do you have a certified disability? (Sec 80U)"
          name="has80U" checked={!!inputs.has80U}
          onChange={(n, v) => toggle(n, v, [])} />
        {inputs.has80U && (
          <div className="slide-down">
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label htmlFor="disability80USeverity">
                Severity of disability
                <span className="tax-tag">Sec 80U</span>
                <span className="regime-badge" style={{ background: 'rgba(239,168,0,0.15)', color: '#F0C040', border: '1px solid rgba(240,192,64,0.3)', marginLeft: 6 }}>Old Regime Only</span>
              </label>
              <select id="disability80USeverity" name="disability80USeverity"
                value={inputs.disability80USeverity || 'normal'}
                onChange={e => onChange('disability80USeverity', e.target.value)}
                className="form-control">
                <option value="normal">Normal disability (≥40%) — ₹75,000 deduction</option>
                <option value="severe">Severe disability (≥80%) — ₹1,25,000 deduction</option>
              </select>
              <p className="input-hint">A disability certificate from a competent medical authority is required.</p>
            </div>
          </div>
        )}
      </div>

      {/* 80DD — Disabled Dependent */}
      <div className="deduction-block">
        <Toggle label="Do you have a disabled dependent family member? (Sec 80DD)"
          name="has80DD" checked={!!inputs.has80DD}
          onChange={(n, v) => toggle(n, v, [])} />
        {inputs.has80DD && (
          <div className="slide-down">
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label htmlFor="disability80DDSeverity">
                Severity of dependent's disability
                <span className="tax-tag">Sec 80DD</span>
                <span className="regime-badge" style={{ background: 'rgba(239,168,0,0.15)', color: '#F0C040', border: '1px solid rgba(240,192,64,0.3)', marginLeft: 6 }}>Old Regime Only</span>
              </label>
              <select id="disability80DDSeverity" name="disability80DDSeverity"
                value={inputs.disability80DDSeverity || 'normal'}
                onChange={e => onChange('disability80DDSeverity', e.target.value)}
                className="form-control">
                <option value="normal">Normal disability (≥40%) — ₹75,000 deduction</option>
                <option value="severe">Severe disability (≥80%) — ₹1,25,000 deduction</option>
              </select>
              <p className="input-hint">Dependent must be spouse, child, parent, or sibling.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step5Health;
