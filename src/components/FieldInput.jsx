/**
 * FieldInput — Reusable monetary input with:
 *   - Inline M | A toggle (persisted in Context fieldModes)
 *   - Section tag (gold pill)
 *   - Regime badge (Old/Both/New)
 *   - Live "Annual equivalent" hint in Monthly mode
 *   - Optional lockAnnual mode (for Annual Incentive field)
 *   - Optional FAQ expander
 *   - Optional related-field link
 */

import React from 'react';
import { annualise, toDisplay } from '../utils/annualise';

const REGIME_STYLES = {
  old:  { background: 'rgba(239,168,0,0.15)', color: '#F0C040', border: '1px solid rgba(240,192,64,0.3)' },
  both: { background: 'rgba(34,197,94,0.15)',  color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' },
  new:  { background: 'rgba(96,165,250,0.15)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.3)' },
};

const REGIME_LABELS = { old: 'Old Regime Only', both: 'Both Regimes', new: 'New Regime Only' };

export default function FieldInput({
  id,
  name,
  label,
  value,           // annualised value from Context
  onChange,        // (name, annualisedValue) => void
  onModeChange,    // (name, 'M'|'A') => void
  fieldModes,      // fieldModes object from Context
  sectionTag,      // e.g. "Sec 80C"
  regime,          // 'old' | 'both' | 'new'
  lockAnnual,      // if true: no M/A toggle, always annual
  faq,
  linkText,
  linkTarget,
  placeholder,
  hint,
  style,
}) {
  const mode = (!lockAnnual && fieldModes && fieldModes[name]) || 'A';
  const isMonthly = mode === 'M';

  const displayVal = toDisplay(value, isMonthly);
  const annualEquiv = isMonthly && value ? `₹${Number(value).toLocaleString('en-IN')}` : null;

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    // ANNUALISATION: single multiplication point for field [name]
    onChange(name, annualise(raw, isMonthly));
  };

  const toggleMode = (newMode) => {
    if (newMode === mode || lockAnnual) return;
    // re-annualise stored value for the new mode so the display stays consistent
    onModeChange(name, newMode);
  };

  return (
    <div className="field-input-wrapper" style={style}>
      {/* Label row */}
      <div className="field-label-row">
        <label htmlFor={id} className="field-label">
          {label}
          {sectionTag && <span className="tax-tag">{sectionTag}</span>}
          {regime && (
            <span className="regime-badge" style={REGIME_STYLES[regime]}>
              {REGIME_LABELS[regime]}
            </span>
          )}
        </label>
        {/* M | A toggle OR Annual Only lock */}
        {lockAnnual ? (
          <span className="annual-lock-badge">🔒 Annual Only</span>
        ) : (
          <div className="ma-toggle">
            <button
              type="button"
              className={mode === 'M' ? 'active' : ''}
              onClick={() => toggleMode('M')}
              title="Monthly"
            >M</button>
            <button
              type="button"
              className={mode === 'A' ? 'active' : ''}
              onClick={() => toggleMode('A')}
              title="Annual"
            >A</button>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="input-with-prefix">
        <span className="prefix">₹</span>
        <input
          type="text"
          id={id}
          name={name}
          value={displayVal}
          onChange={handleChange}
          className="form-control"
          placeholder={placeholder || '0'}
          autoComplete="off"
        />
      </div>

      {/* Annual equivalent hint */}
      {annualEquiv && (
        <p className="input-hint annual-hint">📅 Annual equivalent: {annualEquiv}</p>
      )}

      {/* Lock hint */}
      {lockAnnual && (
        <p className="input-hint" style={{ color: '#F0C040' }}>
          This amount is not multiplied even if other fields are in Monthly mode.
        </p>
      )}

      {/* Custom hint */}
      {hint && <p className="input-hint">{hint}</p>}

      {/* FAQ */}
      {faq && (
        <details className="faq-section">
          <summary>Why are we asking this?</summary>
          <p>{faq}</p>
        </details>
      )}

      {/* Related link */}
      {linkText && (
        <a href={linkTarget ? `#${linkTarget}` : '#'} className="related-link">
          🔗 Related Input: {linkText}
        </a>
      )}
    </div>
  );
}
