import React from 'react';
import Toggle from './Toggle';
import FieldInput from './FieldInput';
import './WizardSteps.css';

const Step4Investments = ({ inputs, onChange, onModeChange }) => {
  const fm = inputs.fieldModes || {};
  const toggle = (name, checked, clearFields = []) => {
    onChange(name, checked);
    if (!checked) clearFields.forEach(f => onChange(f, 0));
  };
  const show80GG = !inputs.hasRent;

  return (
    <div className="step-container animate-fade-in">
      <h2 className="step-title">Step 4: Investments & Deductions</h2>
      <p className="step-subtitle text-muted">Tax-saving investments and other deductions (Old Regime unless noted).</p>

      {/* 80C */}
      <div className="deduction-block">
        <Toggle label="Have you invested in ELSS, PPF, LIC, or paid school fees? (Sec 80C)"
          name="has80C" checked={!!inputs.has80C}
          onChange={(n, v) => toggle(n, v, ['other80cAmount'])} />
        {inputs.has80C && (
          <div className="slide-down">
            <FieldInput id="other80cAmount" name="other80cAmount"
              label="Total amount this year"
              value={inputs.other80cAmount} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
              sectionTag="Sec 80C — combined cap ₹1,50,000" regime="old"
              hint="Combined with EPF (from Step 2), capped at ₹1,50,000."
              linkText="EPF (Step 2 — counts towards 80C limit)" linkTarget="epfAmount" />
          </div>
        )}
      </div>

      {/* Self NPS 80CCD(1B) */}
      <div className="deduction-block">
        <Toggle label="Have you invested in NPS personally? (Sec 80CCD(1B))"
          name="hasSelfNPS" checked={!!inputs.hasSelfNPS}
          onChange={(n, v) => toggle(n, v, ['selfNpsAmount'])} />
        {inputs.hasSelfNPS && (
          <div className="slide-down">
            <FieldInput id="selfNpsAmount" name="selfNpsAmount"
              label="Your personal NPS contribution"
              value={inputs.selfNpsAmount} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
              sectionTag="Sec 80CCD(1B) — extra ₹50,000" regime="old"
              hint="Extra ₹50,000 deduction over and above 80C. Old Regime only."
              linkText="Employer NPS (Step 2 — separate ₹50,000 bucket)" linkTarget="employerNpsAmount" />
          </div>
        )}
      </div>

      {/* 80E Education Loan */}
      <div className="deduction-block">
        <Toggle label="Are you repaying an Education Loan? (Sec 80E)"
          name="has80E" checked={!!inputs.has80E}
          onChange={(n, v) => toggle(n, v, ['educationLoanInterest'])} />
        {inputs.has80E && (
          <div className="slide-down">
            <FieldInput id="educationLoanInterest" name="educationLoanInterest"
              label="Interest paid this year"
              value={inputs.educationLoanInterest} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
              sectionTag="Sec 80E — no upper limit" regime="old"
              faq="Section 80E lets you deduct the full interest paid on an education loan (no cap). Available for max 8 years. Old Regime only."
              hint="Only interest component. No upper limit." />
          </div>
        )}
      </div>

      {/* 80EEA Affordable Housing */}
      <div className="deduction-block">
        <Toggle label="First-time home buyer? Affordable housing loan interest (Sec 80EEA)"
          name="has80EEA" checked={!!inputs.has80EEA}
          onChange={(n, v) => toggle(n, v, ['sec80EEAAmount'])} />
        {inputs.has80EEA && (
          <div className="slide-down">
            <FieldInput id="sec80EEAAmount" name="sec80EEAAmount"
              label="Additional interest on affordable housing loan"
              value={inputs.sec80EEAAmount} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
              sectionTag="Sec 80EEA — max ₹1,50,000" regime="old"
              hint="Only if stamp duty value ≤ ₹45L and first-time buyer."
              linkText="Home Loan Interest (Step 3 — Sec 24b)" linkTarget="homeLoanInterest" />
          </div>
        )}
      </div>

      {/* 80G Donations */}
      <div className="deduction-block">
        <Toggle label="Did you make charitable donations? (Sec 80G)"
          name="has80G" checked={!!inputs.has80G}
          onChange={(n, v) => toggle(n, v, ['donation100Amount', 'donation50Amount'])} />
        {inputs.has80G && (
          <div className="slide-down">
            <FieldInput id="donation100Amount" name="donation100Amount"
              label="Amount eligible for 100% deduction"
              value={inputs.donation100Amount} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
              sectionTag="Sec 80G" regime="old"
              hint="PM Relief Fund, National Defence Fund, etc." />
            <FieldInput id="donation50Amount" name="donation50Amount"
              label="Amount eligible for 50% deduction"
              value={inputs.donation50Amount} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
              sectionTag="Sec 80G" regime="old"
              hint="Jawaharlal Nehru Memorial Fund, etc. We apply the 50% automatically." />
          </div>
        )}
      </div>

      {/* 80GG (only if no HRA) */}
      {show80GG && (
        <div className="deduction-block">
          <Toggle label="Do you pay rent but don't receive HRA from your employer? (Sec 80GG)"
            name="has80GG" checked={!!inputs.has80GG}
            onChange={(n, v) => onChange(n, v)} />
          {inputs.has80GG && (
            <p className="input-hint" style={{ padding: '0 1rem 0.75rem' }}>
              Deduction is the least of: ₹60,000/year, 25% of total income, or rent paid minus 10% of income. Old Regime only. We calculate this automatically.
              <br />
              <span className="tax-tag" style={{ marginLeft: 0, marginTop: '0.4rem', display: 'inline-block' }}>Sec 80GG — max ₹60,000/year</span>
              {' '}
              <span className="regime-badge" style={{ background: 'rgba(239,168,0,0.15)', color: '#F0C040', border: '1px solid rgba(240,192,64,0.3)', padding: '2px 6px', borderRadius: 4, fontSize: 10 }}>Old Regime Only</span>
            </p>
          )}
        </div>
      )}

      <details className="faq-section" style={{ marginTop: '1rem' }}>
        <summary>What is the 80C limit?</summary>
        <p>The maximum benefit under Section 80C (including your PF from Step 2) is ₹1,50,000. NPS gives you an <em>extra</em> ₹50,000 exclusively in the Old Regime.</p>
      </details>
    </div>
  );
};

export default Step4Investments;
