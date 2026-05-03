import React from 'react';
import './BasicForm.css';

const BasicForm = ({ inputs, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Keep raw numeric strings or parse as needed.
    // For inputs, removing non-numeric characters for salary
    if (name === 'grossSalary') {
      const numericValue = value.replace(/\D/g, '');
      onChange(name, numericValue);
    } else {
      onChange(name, value);
    }
  };

  return (
    <div className="basic-form-container glass-panel">
      <h2>Step 1: The Basics</h2>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        Let's start with your age and annual income.
      </p>

      <div className="form-group">
        <label htmlFor="ageGroup">What is your age group?</label>
        <select 
          id="ageGroup" 
          name="ageGroup" 
          value={inputs.ageGroup} 
          onChange={handleChange}
          className="form-control"
        >
          <option value="below60">Below 60 years</option>
          <option value="60to79">60 to 79 years</option>
          <option value="80plus">80 years and above</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="grossSalary">What is your total yearly salary before any deductions?</label>
        <div className="input-with-prefix">
          <span className="prefix">₹</span>
          <input 
            type="text" 
            id="grossSalary" 
            name="grossSalary"
            value={inputs.grossSalary ? Number(inputs.grossSalary).toLocaleString('en-IN') : ''} 
            onChange={handleChange}
            className="form-control"
            placeholder="e.g. 15,00,000"
          />
        </div>
        
        <details className="faq-section">
          <summary>Where do I find my gross salary?</summary>
          <p>Check your offer letter (CTC breakdown) or the top line of your payslip before PF or PT are subtracted.</p>
        </details>
      </div>
    </div>
  );
};

export default BasicForm;
