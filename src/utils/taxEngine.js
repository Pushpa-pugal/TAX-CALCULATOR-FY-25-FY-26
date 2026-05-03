// taxEngine.js — DO NOT modify calculation logic (PRD constraint)

const NEW_REGIME_SLABS = [
  { limit: 400000, rate: 0 },
  { limit: 800000, rate: 0.05 },
  { limit: 1200000, rate: 0.10 },
  { limit: 1600000, rate: 0.15 },
  { limit: 2000000, rate: 0.20 },
  { limit: 2400000, rate: 0.25 },
  { limit: Infinity, rate: 0.30 }
];

const OLD_REGIME_SLABS_BELOW_60 = [
  { limit: 250000, rate: 0 },
  { limit: 500000, rate: 0.05 },
  { limit: 1000000, rate: 0.20 },
  { limit: Infinity, rate: 0.30 }
];

const OLD_REGIME_SLABS_60_TO_79 = [
  { limit: 300000, rate: 0 },
  { limit: 500000, rate: 0.05 },
  { limit: 1000000, rate: 0.20 },
  { limit: Infinity, rate: 0.30 }
];

const OLD_REGIME_SLABS_80_PLUS = [
  { limit: 500000, rate: 0 },
  { limit: 1000000, rate: 0.20 },
  { limit: Infinity, rate: 0.30 }
];

function calculateTaxFromSlabs(income, slabs) {
  let tax = 0;
  let previousLimit = 0;
  const breakdown = [];
  for (const slab of slabs) {
    if (income > previousLimit) {
      const taxableInThisSlab = Math.min(income, slab.limit) - previousLimit;
      const taxForSlab = taxableInThisSlab * slab.rate;
      tax += taxForSlab;
      breakdown.push({
        from: previousLimit,
        to: slab.limit === Infinity ? 'Above' : slab.limit,
        rate: slab.rate * 100,
        tax: taxForSlab
      });
      previousLimit = slab.limit;
    } else break;
  }
  return { tax, breakdown };
}

export function calculateTax(userInputs) {
  // ── Parse Inputs ──
  const ageGroup = userInputs.ageGroup || 'below60';
  const isSeniorSelf = ageGroup === '60to79' || ageGroup === '80plus';

  const grossSalary       = Number(userInputs.grossSalary)         || 0;
  const epf               = Number(userInputs.epfAmount)           || 0;
  const pt                = Number(userInputs.ptAmount)            || 0;
  const employerNps       = Number(userInputs.employerNpsAmount)   || 0;
  const lta               = Number(userInputs.ltaAmount)           || 0;

  // Children Education: ₹100/month × children (max 2) × 12 = ₹1,200/year max
  const childEduCount     = Math.min(Number(userInputs.childrenEduCount) || 0, 2);
  const childrenEduExemption = userInputs.hasChildrenEdu ? childEduCount * 1200 : 0;

  // Hostel: ₹300/month × children (max 2) × 12 = ₹3,600/year max
  const hostelCount       = Math.min(Number(userInputs.hostelAllowanceCount) || 0, 2);
  const hostelExemption   = userInputs.hasHostelAllowance ? hostelCount * 3600 : 0;

  const rentPaid          = Number(userInputs.rentPaid)            || 0;
  const basicSalary       = Number(userInputs.basicSalary)         || 0;
  const hraReceived       = Number(userInputs.hraReceived)         || 0;
  const isMetro           = !!userInputs.isMetro;
  const homeLoanInterest  = Number(userInputs.homeLoanInterest)    || 0;

  const other80c          = Number(userInputs.other80cAmount)      || 0;
  const selfNps           = Number(userInputs.selfNpsAmount)       || 0;
  const educationLoan     = Number(userInputs.educationLoanInterest) || 0;
  const sec80EEA          = userInputs.has80EEA ? Math.min(Number(userInputs.sec80EEAAmount) || 0, 150000) : 0;

  const donation100       = Number(userInputs.donation100Amount)   || 0;
  const donation50        = Number(userInputs.donation50Amount)    || 0;
  const sec80GDeduction   = donation100 + (donation50 * 0.5);

  // 80GG: only if no HRA
  const sec80GG           = (!userInputs.hasRent && userInputs.has80GG)
                              ? Math.min(60000, rentPaid > 0 ? rentPaid : 60000)
                              : 0;

  const healthPremiumSelf    = Number(userInputs.healthPremiumSelf)    || 0;
  const healthPremiumParents = Number(userInputs.healthPremiumParents) || 0;
  const parentsSenior        = !!userInputs.parentsSenior;

  const savingsInterest   = Number(userInputs.savingsInterest)    || 0;
  const fdInterest        = Number(userInputs.fdInterest)         || 0;

  // 80U / 80DD (disability) — Old Regime only
  const disability80U  = userInputs.has80U
    ? (userInputs.disability80USeverity === 'severe' ? 125000 : 75000) : 0;
  const disability80DD = userInputs.has80DD
    ? (userInputs.disability80DDSeverity === 'severe' ? 125000 : 75000) : 0;

  // ── Income base ──
  const baseIncome = grossSalary + savingsInterest + fdInterest;

  // ── NEW REGIME ──
  const newStdDeduction   = Math.min(grossSalary, 75000);
  const newTotalDeductions = newStdDeduction + employerNps;
  const newTaxableIncome  = Math.max(0, baseIncome - newTotalDeductions);

  let { tax: newCalcTax, breakdown: newSlabBreakdown } = newTaxableIncome > 0
    ? calculateTaxFromSlabs(newTaxableIncome, NEW_REGIME_SLABS)
    : { tax: 0, breakdown: [] };

  if (newTaxableIncome <= 1200000) {
    newCalcTax = Math.max(0, newCalcTax - 60000);        // 87A rebate
  } else {
    const above12L = newTaxableIncome - 1200000;
    if (newCalcTax > above12L) newCalcTax = Math.min(newCalcTax, above12L); // marginal relief
  }
  const newCess     = newCalcTax * 0.04;
  const newTotalTax = newCalcTax + newCess;

  // ── OLD REGIME ──
  const oldStdDeduction = Math.min(grossSalary, 50000);

  // HRA exemption
  let hraExemption = 0;
  if (hraReceived > 0 && rentPaid > 0 && basicSalary > 0) {
    const rentMinus10 = Math.max(0, rentPaid - 0.1 * basicSalary);
    const pctBasic    = isMetro ? 0.5 * basicSalary : 0.4 * basicSalary;
    hraExemption      = Math.min(hraReceived, rentMinus10, pctBasic);
  }

  const sec24b       = Math.min(homeLoanInterest, 200000);
  const sec80cTotal  = Math.min(epf + other80c, 150000);
  const sec80ccd1b   = Math.min(selfNps, 50000);

  const maxSelfHealth    = isSeniorSelf ? 50000 : 25000;
  const maxParentsHealth = parentsSenior ? 50000 : 25000;
  const old80d = Math.min(healthPremiumSelf, maxSelfHealth) + Math.min(healthPremiumParents, maxParentsHealth);

  let interestDeduction = 0;
  if (isSeniorSelf) {
    interestDeduction = Math.min(savingsInterest + fdInterest, 50000); // 80TTB
  } else {
    interestDeduction = Math.min(savingsInterest, 10000);               // 80TTA
  }

  const oldTotalDeductions =
    oldStdDeduction +
    pt +
    employerNps +
    lta +
    childrenEduExemption +
    hostelExemption +
    hraExemption +
    sec24b +
    sec80cTotal +
    sec80ccd1b +
    educationLoan +   // 80E — no upper cap
    sec80EEA +
    sec80GDeduction +
    sec80GG +
    old80d +
    interestDeduction +
    disability80U +
    disability80DD;

  const oldTaxableIncome = Math.max(0, baseIncome - oldTotalDeductions);

  let oldSlabs;
  if (ageGroup === '80plus')     oldSlabs = OLD_REGIME_SLABS_80_PLUS;
  else if (ageGroup === '60to79') oldSlabs = OLD_REGIME_SLABS_60_TO_79;
  else                            oldSlabs = OLD_REGIME_SLABS_BELOW_60;

  let { tax: oldCalcTax, breakdown: oldSlabBreakdown } = oldTaxableIncome > 0
    ? calculateTaxFromSlabs(oldTaxableIncome, oldSlabs)
    : { tax: 0, breakdown: [] };

  if (oldTaxableIncome <= 500000) {
    oldCalcTax = Math.max(0, oldCalcTax - 12500); // 87A rebate
  }
  const oldCess     = oldCalcTax * 0.04;
  const oldTotalTax = oldCalcTax + oldCess;

  // ── Return ──
  return {
    baseIncome,
    newRegime: {
      totalDeductions: newTotalDeductions,
      taxableIncome:   newTaxableIncome,
      taxBeforeCess:   newCalcTax,
      cess:            newCess,
      totalTax:        newTotalTax,
      breakdown:       newSlabBreakdown,
    },
    oldRegime: {
      totalDeductions: oldTotalDeductions,
      taxableIncome:   oldTaxableIncome,
      taxBeforeCess:   oldCalcTax,
      cess:            oldCess,
      totalTax:        oldTotalTax,
      breakdown:       oldSlabBreakdown,
      // expose components for Result Page insights
      _deductions: {
        stdDeduction: oldStdDeduction, pt, employerNps,
        lta, childrenEduExemption, hostelExemption,
        hraExemption, sec24b, sec80cTotal, sec80ccd1b,
        educationLoan, sec80EEA, sec80GDeduction, sec80GG,
        old80d, interestDeduction, disability80U, disability80DD,
      },
    },
  };
}
