import React, { createContext, useContext, useState, useMemo } from 'react';
import { calculateTax } from '../utils/taxEngine';

const TaxContext = createContext(null);

export const useTax = () => useContext(TaxContext);

const DEFAULT_INPUTS = {
  // Step 1
  ageGroup: 'below60',
  salaryMode: 'gross', // 'gross' or 'splits'
  grossSalary: '',
  annualIncentive: '', // Section 2D — Locked Annual Only, never multiplied
  // Splits
  basicSalary: '', hraReceived: '', daAmount: '', specialAllowance: '',
  transportAllowance: '', medicalAllowance: '', splitChildrenEdu: '', 
  splitHostel: '', ltaAmount: '', anyOtherAllowance: '',
  
  // Step 2
  hasEPF: false, epfAmount: '',
  hasPT: false, ptAmount: '',
  hasEmployerNPS: false, employerNpsAmount: '',
  hasLTA: false, 
  hasChildrenEdu: false, childrenEduCount: 1,
  hasHostelAllowance: false, hostelAllowanceCount: 1,
  // Step 3
  hasRent: false, rentPaid: '', isMetro: false, 
  hasHomeLoan: false, homeLoanInterest: '',
  // Step 4
  has80C: false, other80cAmount: '',
  hasSelfNPS: false, selfNpsAmount: '',
  has80E: false, educationLoanInterest: '',
  has80EEA: false, sec80EEAAmount: '',
  has80G: false, donation100Amount: '', donation50Amount: '',
  has80GG: false,
  // Step 5
  hasHealthInsurance: false, healthPremiumSelf: '', healthPremiumParents: '', parentsSenior: false,
  hasInterest: false, savingsInterest: '', fdInterest: '',
  has80U: false, disability80USeverity: 'normal',
  has80DD: false, disability80DDSeverity: 'normal',

  fieldModes: {}, // stores 'M' or 'A' for each field
};

export const TaxProvider = ({ children }) => {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [isMonthly, setIsMonthly] = useState(false);

  const handleChange = (name, value) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleModeChange = (name, mode) => {
    setInputs(prev => ({ 
      ...prev, 
      fieldModes: { ...prev.fieldModes, [name]: mode } 
    }));
  };

  const handleResetSalaryFields = () => {
    setInputs(prev => ({
      ...prev,
      grossSalary: '',
      basicSalary: '', hraReceived: '', daAmount: '', specialAllowance: '',
      transportAllowance: '', medicalAllowance: '', splitChildrenEdu: '', 
      splitHostel: '', ltaAmount: '', anyOtherAllowance: ''
    }));
  };

  // Annualise all numeric inputs before passing to engine
  const annualisedInputs = useMemo(() => {
    // Start with a shallow copy
    const result = { ...inputs };

    // In splits mode, compute grossSalary from split fields (already stored annualised in context)
    if (result.salaryMode === 'splits') {
      result.grossSalary = (Number(result.basicSalary) || 0) +
                           (Number(result.hraReceived) || 0) +
                           (Number(result.daAmount) || 0) +
                           (Number(result.specialAllowance) || 0) +
                           (Number(result.transportAllowance) || 0) +
                           (Number(result.medicalAllowance) || 0) +
                           (Number(result.splitChildrenEdu) || 0) +
                           (Number(result.splitHostel) || 0) +
                           (Number(result.ltaAmount) || 0) +
                           (Number(result.anyOtherAllowance) || 0);
    }

    // INCENTIVE ISOLATION: annualIncentive is added to grossSalary here.
    // annualise() is NOT called on it — it is always stored and used as-is.
    result.grossSalary = (Number(result.grossSalary) || 0) + (Number(result.annualIncentive) || 0);

    // Apply global ×12 to non-split fields when global monthly toggle is on
    if (isMonthly) {
      const NUMERIC_FIELDS = [
        'grossSalary',
        'epfAmount','ptAmount','employerNpsAmount',
        'rentPaid','homeLoanInterest',
        'other80cAmount','selfNpsAmount','educationLoanInterest','sec80EEAAmount',
        'donation100Amount','donation50Amount',
        'healthPremiumSelf','healthPremiumParents','savingsInterest','fdInterest',
      ];
      for (const field of NUMERIC_FIELDS) {
        if (result[field] !== '' && result[field] !== undefined) {
          result[field] = (Number(result[field]) || 0) * 12;
        }
      }
    }

    return result;
  }, [inputs, isMonthly]);

  const taxResults = useMemo(() => calculateTax(annualisedInputs), [annualisedInputs]);

  return (
    <TaxContext.Provider value={{ 
      inputs, 
      handleChange, 
      handleModeChange,
      handleResetSalaryFields,
      isMonthly, 
      setIsMonthly, 
      taxResults, 
      annualisedInputs, 
      resetInputs: () => setInputs(DEFAULT_INPUTS) 
    }}>
      {children}
    </TaxContext.Provider>
  );
};
