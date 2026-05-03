import React from 'react';
import { useTax } from '../context/TaxContext';
import './LivePreview.css';

const fmt = (n) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0
}).format(n);

const LivePreview = ({ results }) => {
  const { isMonthly } = useTax();
  if (!results) return null;

  const { newRegime, oldRegime, baseIncome } = results;
  const newWinner = newRegime.totalTax <= oldRegime.totalTax;
  const oldWinner = oldRegime.totalTax < newRegime.totalTax;
  const difference = Math.abs(newRegime.totalTax - oldRegime.totalTax);

  return (
    <div className="live-preview-container">
      <div className="preview-header">
        <h3>Live Preview</h3>
        <div className="preview-header-right">
          {isMonthly && <span className="annualised-badge">Annualised</span>}
          <span className="pulse-indicator" />
        </div>
      </div>

      <div className="difference-banner">
        {difference === 0 ? (
          <span>Both regimes have the same tax!</span>
        ) : (
          <span>
            Save <strong>{fmt(difference)}</strong> with the{' '}
            <span className="highlight-regime">{newWinner ? 'New Regime' : 'Old Regime'}</span>
          </span>
        )}
      </div>

      <div className="comparison-grid">
        <div className="grid-label" />
        <div className={`grid-col-header ${newWinner ? 'winner-bg' : ''}`}>
          New Regime
          {newWinner && <span className="winner-badge">⭐ Best</span>}
        </div>
        <div className={`grid-col-header ${oldWinner ? 'winner-bg' : ''}`}>
          Old Regime
          {oldWinner && <span className="winner-badge">⭐ Best</span>}
        </div>

        <div className="grid-label">Gross Income</div>
        <div className="grid-value">{fmt(baseIncome)}</div>
        <div className="grid-value">{fmt(baseIncome)}</div>

        <div className="grid-label">Total Deductions</div>
        <div className="grid-value text-muted">− {fmt(newRegime.totalDeductions)}</div>
        <div className="grid-value text-muted">− {fmt(oldRegime.totalDeductions)}</div>

        <div className="grid-label strong">Taxable Income</div>
        <div className="grid-value strong">{fmt(newRegime.taxableIncome)}</div>
        <div className="grid-value strong">{fmt(oldRegime.taxableIncome)}</div>

        <div className="grid-divider" />

        <div className="grid-label" style={{ fontSize: '0.8rem' }}>Tax Before Cess</div>
        <div className="grid-value text-muted" style={{ fontSize: '0.8rem' }}>{fmt(newRegime.taxBeforeCess)}</div>
        <div className="grid-value text-muted" style={{ fontSize: '0.8rem' }}>{fmt(oldRegime.taxBeforeCess)}</div>

        <div className="grid-label" style={{ fontSize: '0.8rem' }}>Cess (4%)</div>
        <div className="grid-value text-muted" style={{ fontSize: '0.8rem' }}>+ {fmt(newRegime.cess)}</div>
        <div className="grid-value text-muted" style={{ fontSize: '0.8rem' }}>+ {fmt(oldRegime.cess)}</div>

        <div className="grid-divider" />

        <div className="grid-label highlight-tax">Total Tax</div>
        <div className={`grid-value highlight-tax ${newWinner ? 'text-success' : ''}`}>{fmt(newRegime.totalTax)}</div>
        <div className={`grid-value highlight-tax ${oldWinner ? 'text-success' : ''}`}>{fmt(oldRegime.totalTax)}</div>
      </div>
    </div>
  );
};

export default LivePreview;
