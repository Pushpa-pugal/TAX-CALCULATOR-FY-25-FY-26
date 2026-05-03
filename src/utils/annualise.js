/**
 * ANNUALISATION HELPER — single source of ×12 multiplication for the entire codebase.
 * All monetary fields must pass through this function when writing to Context.
 * taxEngine.js must NEVER call this — it only receives pre-annualised values.
 *
 * @param {string|number} value - raw value as entered by the user
 * @param {boolean} isMonthly - true if the field's toggle is set to 'M'
 * @returns {number} annualised value (value * 12 if monthly, else value as-is)
 */
export const annualise = (value, isMonthly) => {
  const num = Number(String(value).replace(/,/g, '')) || 0;
  return isMonthly ? num * 12 : num;
};

/**
 * Derive display value (raw typed number) from the annualised context value.
 * Used to show the correct number back in the input box.
 */
export const toDisplay = (annualisedValue, isMonthly) => {
  const num = Number(annualisedValue) || 0;
  if (num === 0) return '';
  const raw = isMonthly ? Math.round(num / 12) : num;
  return raw.toLocaleString('en-IN');
};
