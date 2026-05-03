import React from 'react';
import Toggle from './Toggle';
import FieldInput from './FieldInput';
import './WizardSteps.css';

const Step2Employer = ({ inputs, onChange, onModeChange }) => {
  const fm = inputs.fieldModes || {};
  const toggle = (name, checked, clearFields = []) => {
    onChange(name, checked);
    if (!checked) clearFields.forEach(f => onChange(f, 0));
  };

  return (
    <div className="step-container animate-fade-in">
      <h2 className="step-title">Step 2: Employer Deductions</h2>
      <p className="step-subtitle text-muted">Details typically found on your payslip.</p>

      {/* EPF */}
      <div className="deduction-block">
        <Toggle label="Does your company deduct Employee Provident Fund (EPF)?"
          name="hasEPF" checked={!!inputs.hasEPF}
          onChange={(n, v) => toggle(n, v, ['epfAmount'])} />
        {inputs.hasEPF && (
          <div className="slide-down">
            <FieldInput id="epfAmount" name="epfAmount" label="Employee EPF contribution"
              value={inputs.epfAmount} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
              sectionTag="Sec 80C" regime="old"
              hint="Combined with other 80C investments (Step 4), capped at ₹1,50,000."
              linkText="Section 80C total (Step 4)" linkTarget="other80cAmount" />
          </div>
        )}
      </div>

      {/* Professional Tax */}
      <div className="deduction-block">
        <Toggle label="Does your company deduct Professional Tax?"
          name="hasPT" checked={!!inputs.hasPT}
          onChange={(n, v) => { onChange(n, v); if (v && !inputs.ptAmount) onChange('ptAmount', 2500); if (!v) onChange('ptAmount', 0); }} />
        {inputs.hasPT && (
          <div className="slide-down">
            <FieldInput id="ptAmount" name="ptAmount" label="Professional Tax per year"
              value={inputs.ptAmount} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
              sectionTag="Sec 16(iii)" regime="old"
              hint="Usually ₹2,400–₹2,500/year. Enter the exact amount from your payslip." />
          </div>
        )}
      </div>

      {/* Employer NPS */}
      <div className="deduction-block">
        <Toggle label="Does your employer contribute to NPS for you? (Sec 80CCD(2))"
          name="hasEmployerNPS" checked={!!inputs.hasEmployerNPS}
          onChange={(n, v) => toggle(n, v, ['employerNpsAmount'])} />
        {inputs.hasEmployerNPS && (
          <div className="slide-down">
            <FieldInput id="employerNpsAmount" name="employerNpsAmount" label="Employer NPS contribution"
              value={inputs.employerNpsAmount} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
              sectionTag="Sec 80CCD(2)" regime="both"
              hint="Available in both regimes. Capped at 10% of Basic+DA."
              linkText="Self NPS (Step 4 — 80CCD(1B))" linkTarget="selfNpsAmount" />
          </div>
        )}
      </div>

      {/* LTA */}
      <div className="deduction-block">
        <Toggle label="Do you receive Leave Travel Allowance (LTA)?"
          name="hasLTA" checked={!!inputs.hasLTA}
          onChange={(n, v) => toggle(n, v, ['ltaAmount'])} />
        {inputs.hasLTA && (
          <div className="slide-down">
            <FieldInput id="ltaAmount" name="ltaAmount" label="Exempt LTA amount claimed this year"
              value={inputs.ltaAmount} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
              sectionTag="Sec 10(5)" regime="old"
              faq="LTA is exempt in the Old Regime only. Claim actual travel expenses (domestic, shortest route) up to LTA received, twice in a 4-year block." />
          </div>
        )}
      </div>

      {/* Children Education */}
      <div className="deduction-block">
        <Toggle label="Do you receive Children's Education Allowance?"
          name="hasChildrenEdu" checked={!!inputs.hasChildrenEdu}
          onChange={(n, v) => toggle(n, v, [])} />
        {inputs.hasChildrenEdu && (
          <div className="slide-down">
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label htmlFor="childrenEduCount">
                Number of children (max 2)
                <span className="tax-tag">Sec 10(14)</span>
                <span className="regime-badge" style={{ background: 'rgba(239,168,0,0.15)', color: '#F0C040', border: '1px solid rgba(240,192,64,0.3)', marginLeft: 6 }}>Old Regime Only</span>
              </label>
              <select id="childrenEduCount" name="childrenEduCount"
                value={inputs.childrenEduCount || 1}
                onChange={e => onChange('childrenEduCount', e.target.value)}
                className="form-control">
                <option value={1}>1 child — ₹1,200/year</option>
                <option value={2}>2 children — ₹2,400/year</option>
              </select>
              <p className="input-hint">₹100/month per child, max 2 children. Old Regime only.</p>
            </div>
          </div>
        )}
      </div>

      {/* Hostel */}
      <div className="deduction-block">
        <Toggle label="Do you receive Hostel Expenditure Allowance?"
          name="hasHostelAllowance" checked={!!inputs.hasHostelAllowance}
          onChange={(n, v) => toggle(n, v, [])} />
        {inputs.hasHostelAllowance && (
          <div className="slide-down">
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label htmlFor="hostelAllowanceCount">
                Number of children (max 2)
                <span className="tax-tag">Sec 10(14)</span>
                <span className="regime-badge" style={{ background: 'rgba(239,168,0,0.15)', color: '#F0C040', border: '1px solid rgba(240,192,64,0.3)', marginLeft: 6 }}>Old Regime Only</span>
              </label>
              <select id="hostelAllowanceCount" name="hostelAllowanceCount"
                value={inputs.hostelAllowanceCount || 1}
                onChange={e => onChange('hostelAllowanceCount', e.target.value)}
                className="form-control">
                <option value={1}>1 child — ₹3,600/year</option>
                <option value={2}>2 children — ₹7,200/year</option>
              </select>
              <p className="input-hint">₹300/month per child, max 2 children. Old Regime only.</p>
            </div>
          </div>
        )}
      </div>

      <details className="faq-section" style={{ marginTop: '1rem' }}>
        <summary>Where do I find these numbers?</summary>
        <p>PF is usually 12% of your basic salary. Check your payslip for 'EPF Deduction'. Professional Tax is a state levy, typically ~₹200/month.</p>
      </details>
    </div>
  );
};

export default Step2Employer;
