import React, { useState } from 'react';
import FieldInput from './FieldInput';
import { annualise } from '../utils/annualise';
import './WizardSteps.css';

export default function Step1Basics({ inputs, onChange, onModeChange, onResetSalary }) {
  const [showModal, setShowModal] = useState(false);
  const [pendingMode, setPendingMode] = useState(null);
  const fm = inputs.fieldModes || {};

  const hasData = () => !!(
    inputs.grossSalary || inputs.basicSalary || inputs.hraReceived ||
    inputs.daAmount || inputs.specialAllowance || inputs.transportAllowance ||
    inputs.medicalAllowance || inputs.splitChildrenEdu || inputs.splitHostel ||
    inputs.ltaAmount || inputs.anyOtherAllowance || inputs.annualIncentive
  );

  const handleModeToggle = (mode) => {
    if (mode === inputs.salaryMode) return;
    if (hasData()) { setPendingMode(mode); setShowModal(true); }
    else onChange('salaryMode', mode);
  };

  const confirmSwitch = () => {
    onResetSalary();
    onChange('salaryMode', pendingMode);
    setShowModal(false);
  };

  // For gross mode, the single salary field uses its own ma-toggle via FieldInput
  // grossSalary stored in context is always annualised

  return (
    <div className="step-container animate-fade-in">
      <h2 className="step-title">Step 1: The Basics</h2>
      <p className="step-subtitle text-muted">Let's start with your age and annual income.</p>

      {/* Age group */}
      <div className="form-group">
        <label htmlFor="ageGroup">What is your age group?</label>
        <select id="ageGroup" name="ageGroup"
          value={inputs.ageGroup || 'below60'}
          onChange={e => onChange('ageGroup', e.target.value)}
          className="form-control">
          <option value="below60">Below 60 years</option>
          <option value="60to79">60 to 79 years</option>
          <option value="80plus">80 years and above</option>
        </select>
      </div>

      {/* Salary mode selector */}
      <div className="salary-mode-selector">
        <button className={inputs.salaryMode === 'gross' ? 'active' : ''} onClick={() => handleModeToggle('gross')}>
          Enter Gross Salary
        </button>
        <button className={inputs.salaryMode === 'splits' ? 'active' : ''} onClick={() => handleModeToggle('splits')}>
          Enter Salary Splits
        </button>
      </div>

      {/* ── Gross Mode ── */}
      {inputs.salaryMode === 'gross' && (
        <FieldInput
          id="grossSalary" name="grossSalary"
          label="Total salary before any deductions"
          value={inputs.grossSalary} onChange={onChange}
          onModeChange={onModeChange} fieldModes={fm}
          sectionTag="Sec 17(1)"
          faq="Check your offer letter (CTC breakdown) or the top line of your payslip before PF or PT are subtracted."
          placeholder="e.g. 12,00,000"
        />
      )}

      {/* ── Splits Mode ── */}
      {inputs.salaryMode === 'splits' && (
        <div className="splits-container">
          <FieldInput id="basicSalary" name="basicSalary" label="Basic Salary"
            value={inputs.basicSalary} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
            sectionTag="Forms basis for HRA, PF, Gratuity"
            linkText="HRA Exemption calculation (Step 3)" linkTarget="hraReceived" />

          <FieldInput id="hraReceived" name="hraReceived" label="HRA (House Rent Allowance)"
            value={inputs.hraReceived} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
            sectionTag="Sec 10(13A)" regime="old"
            linkText="HRA Received field (Step 3)" linkTarget="hraReceived" />

          <FieldInput id="daAmount" name="daAmount" label="Dearness Allowance (DA)"
            value={inputs.daAmount} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
            sectionTag="Fully taxable" />

          <FieldInput id="specialAllowance" name="specialAllowance" label="Special Allowance"
            value={inputs.specialAllowance} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
            sectionTag="Fully taxable" />

          <FieldInput id="transportAllowance" name="transportAllowance" label="Transport Allowance"
            value={inputs.transportAllowance} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
            sectionTag="Fully taxable in New Regime; ₹1,600/month exempt for PWD in Old Regime" />

          <FieldInput id="medicalAllowance" name="medicalAllowance" label="Medical Allowance"
            value={inputs.medicalAllowance} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
            sectionTag="Fully taxable — exemption removed from FY 2018-19" />

          <FieldInput id="splitChildrenEdu" name="splitChildrenEdu" label="Children's Education Allowance"
            value={inputs.splitChildrenEdu} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
            sectionTag="Sec 10(14)" regime="old"
            faq="Enter the amount received from employer. Claim the exemption in Step 2. Do not double-count."
            linkText="Children's Education Allowance (Step 2)" linkTarget="childrenEduCount" />

          <FieldInput id="splitHostel" name="splitHostel" label="Hostel Allowance"
            value={inputs.splitHostel} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
            sectionTag="Sec 10(14)" regime="old"
            faq="Enter the amount received from employer. Claim the exemption in Step 2. Do not double-count."
            linkText="Hostel Allowance (Step 2)" linkTarget="hostelAllowanceCount" />

          <FieldInput id="ltaAmount" name="ltaAmount" label="Leave Travel Allowance (LTA)"
            value={inputs.ltaAmount} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
            sectionTag="Sec 10(5)" regime="old"
            linkText="LTA (Step 2)" linkTarget="ltaAmount" />

          <FieldInput id="anyOtherAllowance" name="anyOtherAllowance" label="Any Other Allowance"
            value={inputs.anyOtherAllowance} onChange={onChange} onModeChange={onModeChange} fieldModes={fm}
            sectionTag="Fully taxable — enter remaining components here" />

          <div className="splits-summary">
            📊 Total Annual Salary: ₹{(Number(inputs.grossSalary) || 0).toLocaleString('en-IN')}
          </div>
        </div>
      )}

      {/* ── Annual Incentive / Bonus (Section 2D — always shown, always annual) ── */}
      <div className="incentive-block">
        <FieldInput
          id="annualIncentive" name="annualIncentive"
          label="Annual Incentive / Bonus"
          value={inputs.annualIncentive} onChange={onChange}
          onModeChange={onModeChange} fieldModes={fm}
          sectionTag="Sec 17(1) — Fully taxable"
          lockAnnual={true}
          faq="This is your yearly bonus or performance incentive. It is a one-time annual payment — enter the full year's amount regardless of when it was paid."
          placeholder="e.g. 1,00,000"
        />
      </div>

      {/* Confirmation modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>⚠️ Switching Salary Mode</h3>
            <p>Switching modes will clear all salary entries you have made so far. Your deduction entries (PF, HRA, investments, health) will NOT be affected.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={confirmSwitch}>Yes, Switch Mode</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
