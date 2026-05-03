import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, ChevronDown, ChevronUp, TrendingUp, Info, AlertTriangle } from 'lucide-react';
import TaxAssistantChat from './TaxAssistantChat';
import './ResultPage.css';

const fmt = (n) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0
}).format(n || 0);

const fmtPlain = (n) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n || 0);

// ─── Slab Breakdown component ───────────────────────────────────────────────
const SlabTable = ({ breakdown, label }) => {
  if (!breakdown || breakdown.length === 0) return <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No tax applicable.</p>;
  return (
    <table className="slab-table">
      <thead>
        <tr>
          <th>Income Slab</th>
          <th className="text-right">Rate</th>
          <th className="text-right">Tax</th>
        </tr>
      </thead>
      <tbody>
        {breakdown.map((s, i) => (
          <tr key={i} style={{ opacity: s.tax === 0 ? 0.45 : 1 }}>
            <td>
              {s.from === 0 ? 'Up to' : 'Above'} ₹{fmtPlain(s.from)}
              {s.to !== 'Above' ? ` – ₹${fmtPlain(s.to)}` : '+'}
            </td>
            <td className="text-right">{s.rate}%</td>
            <td className="text-right">{fmt(s.tax)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// ─── Suggestion Card component ──────────────────────────────────────────────
const SuggestionCard = ({ icon, title, oneLiner, badge, badgeColor, section, currentAmt, maxAmt, saving, instruments, note }) => {
  const [open, setOpen] = useState(false);
  const colors = {
    both: '#22C55E',
    old: '#C9A84C',
    new: '#60A5FA',
  };
  return (
    <div className="suggestion-card">
      <div className="suggestion-header">
        <div className="suggestion-icon">{icon}</div>
        <div className="suggestion-body">
          <div className="suggestion-title-row">
            <h4 className="suggestion-title">{title}</h4>
            <span className="suggestion-badge" style={{ background: colors[badgeColor] || colors.old }}>
              {badge}
            </span>
          </div>
          <p className="suggestion-oneliner">{oneLiner}</p>
        </div>
      </div>
      <button className="suggestion-detail-btn" onClick={() => setOpen(o => !o)}>
        {open ? <><ChevronUp size={14} /> Hide details</> : <><ChevronDown size={14} /> Show details</>}
      </button>
      {open && (
        <div className="suggestion-detail">
          {section && <p><strong>Section:</strong> {section}</p>}
          {maxAmt !== undefined && (
            <p><strong>Limit:</strong> {fmt(maxAmt)} &nbsp;|&nbsp; <strong>You entered:</strong> {fmt(currentAmt)} &nbsp;|&nbsp; <strong>Unused:</strong> {fmt(maxAmt - currentAmt)}</p>
          )}
          {saving !== undefined && saving > 0 && (
            <p className="suggestion-saving">💰 Maxing this out saves approx. <strong>{fmt(saving)}</strong> in tax.</p>
          )}
          {instruments && <p><strong>Options:</strong> {instruments}</p>}
          {note && <p className="suggestion-note"><Info size={13} /> {note}</p>}
        </div>
      )}
    </div>
  );
};

// ─── Main ResultPage ─────────────────────────────────────────────────────────
const ResultPage = ({ results, inputs, onRestart, onEdit }) => {
  const [slabsOpen, setSlabsOpen] = useState(true);

  if (!results) return null;
  const { newRegime, oldRegime, baseIncome } = results;
  const newWinner = newRegime.totalTax <= oldRegime.totalTax;
  const winnerLabel = newWinner ? 'New Regime' : 'Old Regime';
  const saving = Math.abs(newRegime.totalTax - oldRegime.totalTax);
  const savingMonthly = Math.round(saving / 12);

  // ── Deduction impact section ──────────────────────────────────────────────
  const d = oldRegime._deductions || {};
  const impactRows = [
    { label: 'Standard Deduction', amount: d.stdDeduction, section: 'Old Regime' },
    { label: 'Professional Tax', amount: d.pt, section: 'Old Regime' },
    { label: 'Employer NPS (80CCD(2))', amount: d.employerNps, section: 'Both Regimes' },
    { label: 'LTA', amount: d.lta, section: 'Old Regime' },
    { label: "Children's Education Allowance", amount: d.childrenEduExemption, section: 'Old Regime' },
    { label: 'Hostel Allowance', amount: d.hostelExemption, section: 'Old Regime' },
    { label: 'HRA Exemption', amount: d.hraExemption, section: 'Old Regime' },
    { label: 'Home Loan Interest (Sec 24b)', amount: d.sec24b, section: 'Old Regime' },
    { label: 'Section 80C (EPF + Investments)', amount: d.sec80cTotal, section: 'Old Regime' },
    { label: 'Self NPS (80CCD(1B))', amount: d.sec80ccd1b, section: 'Old Regime' },
    { label: 'Education Loan Interest (80E)', amount: d.educationLoan, section: 'Old Regime' },
    { label: 'Affordable Housing Loan (80EEA)', amount: d.sec80EEA, section: 'Old Regime' },
    { label: 'Donations (80G)', amount: d.sec80GDeduction, section: 'Old Regime' },
    { label: 'Rent without HRA (80GG)', amount: d.sec80GG, section: 'Old Regime' },
    { label: 'Health Insurance (80D)', amount: d.old80d, section: 'Old Regime' },
    { label: 'Interest Exemption (80TTA/TTB)', amount: d.interestDeduction, section: 'Old Regime' },
    { label: 'Disability – Self (80U)', amount: d.disability80U, section: 'Old Regime' },
    { label: 'Disability – Dependent (80DD)', amount: d.disability80DD, section: 'Old Regime' },
  ].filter(r => r.amount > 0);

  // Approximate marginal rate for saving estimates
  const oldMarginalRate = oldRegime.taxableIncome > 1000000 ? 0.30
    : oldRegime.taxableIncome > 500000 ? 0.20 : 0.05;

  // ── Suggestions ───────────────────────────────────────────────────────────
  const suggestions = [];

  const epf = Number(inputs.epfAmount) || 0;
  const other80c = Number(inputs.other80cAmount) || 0;
  const used80c = Math.min(epf + other80c, 150000);
  const unused80c = 150000 - used80c;
  if (unused80c > 0) {
    suggestions.push({
      icon: '📊', title: 'Maximise Section 80C',
      oneLiner: `Invest ${fmt(unused80c)} more to save approx. ${fmt(Math.round(unused80c * oldMarginalRate))} in tax.`,
      badge: 'Old Regime Only', badgeColor: 'old',
      section: 'Section 80C — Investments & Savings',
      currentAmt: used80c, maxAmt: 150000,
      saving: Math.round(unused80c * oldMarginalRate),
      instruments: 'PPF, ELSS mutual funds, LIC premium, NSC, 5-year FD, ULIP, tuition fees.',
      note: newWinner ? 'This only benefits you if you switch to the Old Regime.' : null,
    });
  }

  const usedNPS = Math.min(Number(inputs.selfNpsAmount) || 0, 50000);
  const unusedNPS = 50000 - usedNPS;
  if (unusedNPS > 0) {
    suggestions.push({
      icon: '🏦', title: 'Boost NPS (Section 80CCD(1B))',
      oneLiner: `An extra ${fmt(unusedNPS)} in NPS could save you ${fmt(Math.round(unusedNPS * oldMarginalRate))}.`,
      badge: 'Old Regime Only', badgeColor: 'old',
      section: 'Section 80CCD(1B) — National Pension System',
      currentAmt: usedNPS, maxAmt: 50000,
      saving: Math.round(unusedNPS * oldMarginalRate),
      instruments: 'NPS Tier-1 account via your employer or online (eNPS portal). Lock-in until age 60.',
      note: newWinner ? 'This only benefits you if you switch to the Old Regime.' : null,
    });
  }

  const ageGroup = inputs.ageGroup || 'below60';
  const isSeniorSelf = ageGroup === '60to79' || ageGroup === '80plus';
  const selfHealthMax = isSeniorSelf ? 50000 : 25000;
  const selfHealthUsed = Number(inputs.healthPremiumSelf) || 0;
  if (selfHealthUsed < selfHealthMax) {
    suggestions.push({
      icon: '🏥', title: 'Top up Health Insurance (80D)',
      oneLiner: `You can claim up to ${fmt(selfHealthMax)} for your own health insurance. Currently using ${fmt(selfHealthUsed)}.`,
      badge: 'Old Regime Only', badgeColor: 'old',
      section: 'Section 80D — Medical Insurance',
      currentAmt: selfHealthUsed, maxAmt: selfHealthMax,
      saving: Math.round((selfHealthMax - selfHealthUsed) * oldMarginalRate),
      instruments: 'Individual or family floater health insurance plans, preventive health checkups (₹5,000 sub-limit).',
    });
  }

  if (!inputs.hasHealthInsurance || !(Number(inputs.healthPremiumParents) > 0)) {
    suggestions.push({
      icon: '👨‍👩‍👧', title: "Add Parents' Health Insurance (80D)",
      oneLiner: `Insuring your parents can add up to ${fmt(inputs.parentsSenior ? 50000 : 25000)} in deductions.`,
      badge: 'Old Regime Only', badgeColor: 'old',
      section: 'Section 80D — Parent Medical Insurance',
      currentAmt: 0, maxAmt: inputs.parentsSenior ? 50000 : 25000,
      saving: Math.round((inputs.parentsSenior ? 50000 : 25000) * oldMarginalRate),
      instruments: 'Senior citizen health plans (Star, HDFC ERGO, etc.). Premiums are typically higher for seniors but the tax benefit is larger.',
    });
  }

  if (!inputs.hasRent && !inputs.has80GG && !inputs.hasHomeLoan) {
    suggestions.push({
      icon: '🏠', title: 'Claim Rent Deduction (Sec 80GG)',
      oneLiner: "You pay rent but haven't claimed HRA or 80GG. You may be eligible for up to ₹60,000 deduction.",
      badge: 'Old Regime Only', badgeColor: 'old',
      section: 'Section 80GG',
      instruments: 'Go back to Step 4 and enable "Rent without HRA (Sec 80GG)".',
    });
  }

  const homeLoanUsed = Number(inputs.homeLoanInterest) || 0;
  if (inputs.hasHomeLoan && homeLoanUsed < 200000) {
    suggestions.push({
      icon: '🏡', title: 'Home Loan Interest (Sec 24b)',
      oneLiner: `You have ₹${fmtPlain(200000 - homeLoanUsed)} of unused Sec 24b limit this year.`,
      badge: 'Old Regime Only', badgeColor: 'old',
      section: 'Section 24(b) — Interest on Home Loan',
      currentAmt: homeLoanUsed, maxAmt: 200000,
      instruments: 'No action needed — this reflects your actual interest paid. Your limit grows if your loan EMI increases.',
    });
  }

  if (newWinner) {
    suggestions.push({
      icon: '⚠️', title: 'Heads up: suggestions above are Old Regime only',
      oneLiner: 'The New Regime is better for you right now. Chasing Old Regime deductions may not be worth the effort.',
      badge: 'Important', badgeColor: 'new',
      note: "Switching investments purely for tax may reduce liquidity. Evaluate holistically before making changes.",
    });
  }

  return (
    <div className="result-page-bg">
      <div className="container result-page-container animate-fade-in">

        {/* ── Hero Banner ── */}
        <div className="hero-banner">
          <div className="hero-left">
            <div className="hero-check">✅</div>
            <div>
              <h1 className="hero-title">
                Go with the{' '}
                <span className="hero-winner-label">{winnerLabel}</span>
              </h1>
              <p className="hero-saving">
                You save <strong>{fmt(saving)}/year</strong>
                {savingMonthly > 0 && <span className="hero-monthly"> ({fmt(savingMonthly)}/month)</span>}
              </p>
            </div>
          </div>
          <div className="hero-actions">
            <button className="btn btn-secondary" onClick={onEdit}><ArrowLeft size={15} /> Edit</button>
            <button className="btn btn-secondary" onClick={onRestart}><RefreshCw size={15} /> Start Over</button>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="result-main-grid">

          {/* LEFT COLUMN */}
          <div className="result-left-col">

            {/* Side-by-side comparison table */}
            <div className="result-card">
              <h3 className="result-card-title">Tax Comparison</h3>
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Details</th>
                    <th className={`text-right ${newWinner ? 'col-winner' : ''}`}>
                      New Regime {newWinner && <span className="col-star">⭐ Recommended</span>}
                    </th>
                    <th className={`text-right ${!newWinner ? 'col-winner' : ''}`}>
                      Old Regime {!newWinner && <span className="col-star">⭐ Recommended</span>}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Gross Income</td>
                    <td className="text-right">{fmt(baseIncome)}</td>
                    <td className="text-right">{fmt(baseIncome)}</td>
                  </tr>
                  <tr className="row-muted">
                    <td>Total Deductions</td>
                    <td className="text-right">− {fmt(newRegime.totalDeductions)}</td>
                    <td className="text-right">− {fmt(oldRegime.totalDeductions)}</td>
                  </tr>
                  <tr className="row-strong">
                    <td>Taxable Income</td>
                    <td className="text-right">{fmt(newRegime.taxableIncome)}</td>
                    <td className="text-right">{fmt(oldRegime.taxableIncome)}</td>
                  </tr>
                  <tr className="row-muted">
                    <td>Tax Before Cess</td>
                    <td className="text-right">{fmt(newRegime.taxBeforeCess)}</td>
                    <td className="text-right">{fmt(oldRegime.taxBeforeCess)}</td>
                  </tr>
                  <tr className="row-muted">
                    <td>Cess (4%)</td>
                    <td className="text-right">+ {fmt(newRegime.cess)}</td>
                    <td className="text-right">+ {fmt(oldRegime.cess)}</td>
                  </tr>
                  <tr className="row-strong">
                    <td>Total Tax Payable</td>
                    <td className={`text-right ${newWinner ? 'cell-winner' : 'cell-loser'}`}>{fmt(newRegime.totalTax)}</td>
                    <td className={`text-right ${!newWinner ? 'cell-winner' : 'cell-loser'}`}>{fmt(oldRegime.totalTax)}</td>
                  </tr>
                  <tr className="row-muted">
                    <td>Monthly Tax Outgo</td>
                    <td className="text-right">{fmt(Math.round(newRegime.totalTax / 12))}</td>
                    <td className="text-right">{fmt(Math.round(oldRegime.totalTax / 12))}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Slab Breakdown */}
            <div className="result-card">
              <button className="slab-toggle-btn" onClick={() => setSlabsOpen(o => !o)}>
                <h3 className="result-card-title" style={{ margin: 0 }}>Slab-by-Slab Breakdown</h3>
                {slabsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {slabsOpen && (
                <div className="slab-grid">
                  <div>
                    <h4 className="slab-regime-label" style={{ color: newWinner ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                      New Regime {newWinner && '⭐'}
                    </h4>
                    <SlabTable breakdown={newRegime.breakdown} />
                  </div>
                  <div>
                    <h4 className="slab-regime-label" style={{ color: !newWinner ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                      Old Regime {!newWinner && '⭐'}
                    </h4>
                    <SlabTable breakdown={oldRegime.breakdown} />
                  </div>
                </div>
              )}
            </div>

            {/* How inputs impacted tax */}
            {impactRows.length > 0 && (
              <div className="result-card">
                <h3 className="result-card-title">How Your Inputs Impacted Your Tax</h3>
                <ul className="impact-list">
                  {impactRows.map((r, i) => (
                    <li key={i} className="impact-item">
                      <span className="impact-label">{r.label}</span>
                      <span className="impact-meta">
                        <span className="impact-amount">{fmt(r.amount)}</span>
                        <span className="impact-badge">{r.section}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — Suggestions */}
          <div className="result-right-col">
            <div className="result-card suggestions-panel">
              <div className="suggestions-header">
                <TrendingUp size={20} style={{ color: 'var(--color-primary)' }} />
                <h3 className="result-card-title" style={{ margin: 0 }}>Investment Suggestions</h3>
              </div>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Personalised tips based on your inputs.
              </p>
              {suggestions.length === 0 && (
                <p style={{ color: 'var(--color-success)', fontSize: '0.9rem' }}>
                  🎉 You're making excellent use of all major tax-saving sections!
                </p>
              )}
              {suggestions.map((s, i) => (
                <SuggestionCard key={i} {...s} />
              ))}
            </div>
          </div>

        </div>

        {/* ── Section 4: AI Tax Assistant Chat ── */}
        <TaxAssistantChat inputs={inputs} results={results} />
      </div>
    </div>
  );
};

export default ResultPage;
