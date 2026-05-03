# Product Requirements Document (PRD): Indian Salaried Tax Calculator (FY 2025-26)

## 1. Product Overview
**Goal:** Create a simple, privacy-first, browser-based tax calculator for salaried Indians to compare the Old vs. New tax regimes for FY 2025-26 (Assessment Year 2026-27).
**Target Audience:** Non-finance experts, young salaried professionals, and experienced employees who want a quick, plain-English comparison.
**Core Philosophy:** One question at a time (wizard), human-readable language, real-time live preview, actionable final advice.

## 2. Scope & Exclusions
**In Scope:**
* Salaried income, savings account interest, and FD interest.
* Deductions: Standard deduction, HRA, Sec 24(b) (Home Loan Interest), 80C, 80D, 80CCD(1B), 80CCD(2), 80TTA/TTB, Professional Tax.
* Age-based tax slabs (below 60, 60-79, 80+).
* Marginal Relief on Section 87A rebate for the New Regime.

**Out of Scope:**
* Capital gains, business/freelance income, agricultural income.
* Surcharge calculations for super-rich (focus is on incomes typically < 50L).
* PDF Report Generation (focus is strictly on an interactive on-screen experience).

## 3. UI/UX Architecture

> [!IMPORTANT]
> The design must feel polished, modern, and trustworthy. Use modern typography (e.g., Inter), subtle gradients, glassmorphism, and smooth micro-animations. Avoid generic white forms.

### 3.1 Landing Page
* **Headline:** "Find out which tax regime saves you more money in 5 minutes."
* **Design:** Full page, properly filled layout.
* **Trust Markers:** "100% Private. Runs entirely in your browser. No data saved."
* **Preview:** A blurred or mock result card showing the end value proposition to build confidence before starting.
* **Call to Action:** Prominent "Start Calculation" button.

### 3.2 Step-by-Step Wizard (The Core)
* **Layout:** Left side for the single question/input. Right side for the Live Preview Panel (stacked vertically on mobile).
* **Progress:** Minimalist progress bar or dot indicators at the top.
* **Questions:** Plain English, conversational tone. One logical grouping per step.
* **FAQ Section:** Small, expandable "Why are we asking this?" or "Where to find this?" below each question.
* **Navigation:** 'Back' and 'Next' buttons.

### 3.3 Live Preview Panel (Sticky Right Side)
* **Function:** Updates instantly as the user types, creating a real-time feedback loop.
* **Content:**
    * Two parallel columns: **Old Regime** | **New Regime**
    * Rows: Gross Income, Total Deductions, Net Taxable Income.
    * **Slab Breakdown:** A visual table showing how the tax is calculated per slab for the calculated income.
    * Total Tax Payable (including 4% health & education cess).
    * Highlighted dynamic banner: "Current Difference: You save ₹X in [Regime]".

### 3.4 Result Page
* **Headline:** Clear recommendation: "Pick the **[Winning Regime]**. You save **₹X**."
* **Breakdown:** A clear side-by-side table of income, all deductions, taxable income, and final tax.
* **Education Section ("How your inputs affected your tax"):**
    * Explain in plain English. E.g., "Your ₹1,50,000 in 80C reduced your Old Regime tax by ₹31,200."
* **Practical Suggestions:**
    * E.g., "You have only used ₹1,00,000 of your 80C limit. Investing ₹50,000 more could save you ₹X in the Old Regime."
    * E.g., "Consider NPS under 80CCD(1B) for an extra ₹50,000 deduction."

---

## 4. Wizard Step Details & Form Fields

### Step 1: The Basics (Age & Income)
* **Input 1:** What is your age group? (Options: Below 60, 60 to 79, 80 and above).
* **Input 2:** What is your total yearly salary before any deductions? (Label: Gross Salary).
* **FAQ:** "Where do I find my gross salary? Check your offer letter (CTC breakdown) or the top line of your payslip before PF or PT are subtracted."

### Step 2: Employer Deductions (PF & PT)
* **Input 1:** Does your company deduct Employee Provident Fund (EPF)? [Toggle]
    * *If Yes:* "How much do they deduct per year?" (Auto-maps to 80C).
* **Input 2:** Does your company deduct Professional Tax? [Toggle]
    * *If Yes:* "How much per year?" (Default to ₹2,400 or ₹2,500 based on common limits).
* **Input 3:** Does your employer put money into NPS for you? (Section 80CCD(2)) [Toggle]
    * *If Yes:* "Amount per year".
* **FAQ:** "PF is usually 12% of your basic salary. Check your payslip for 'EPF Deduction'."

### Step 3: Rent & Home Loan (HRA & Sec 24b)
* **Input 1:** Do you live in a rented house? [Toggle]
    * *If Yes:* "Total rent paid per year."
    * "Is your city a Metro (Delhi, Mumbai, Chennai, Kolkata)?" [Toggle]
    * "What is your Basic Salary per year?" (Hint: "Usually 40-50% of gross").
    * "How much HRA do you receive from your employer per year?"
* **Input 2:** Are you paying an EMI for a home loan? [Toggle]
    * *If Yes:* "Interest paid this year (up to ₹2,00,000 allowed for self-occupied)."
* **FAQ:** "HRA calculation requires your Basic Salary and actual HRA received to calculate the exact legal exemption according to Income Tax rules."

### Step 4: Common Investments (80C & NPS)
* **Input 1:** Have you invested in ELSS, PPF, LIC, or paid kids' school fees? [Toggle]
    * *If Yes:* "Total amount this year." (App checks if this + EPF > ₹1.5L and caps it internally).
* **Input 2:** Have you put extra money into NPS on your own? (Section 80CCD(1B)) [Toggle]
    * *If Yes:* "Total amount this year (up to ₹50,000 limit)."
* **FAQ:** "The maximum tax benefit under Section 80C (which includes your PF) is ₹1,50,000. NPS gives you an *extra* ₹50,000 limit."

### Step 5: Health & Other Income (80D & Interest)
* **Input 1:** Do you pay for health insurance? [Toggle]
    * *If Yes:* "Premium for yourself/family" and "Premium for senior citizen parents".
* **Input 2:** Did you earn any interest from savings accounts or FDs? [Toggle]
    * *If Yes:* "Savings Account Interest" and "FD/Other Interest".
* **FAQ:** "Savings account interest up to ₹10,000 is tax-free for those under 60. For seniors, FD & savings interest up to ₹50,000 is tax-free."

---

## 5. Tax Calculation Engine Rules (FY 2025-26)

> [!CAUTION]
> Ensure all calculations strictly follow the rules for Assessment Year 2026-27 (FY 2025-26). The New Regime is the default.

### 5.1 New Tax Regime (Default)
* **Income Base:** Gross Salary + Savings Interest + FD Interest.
* **Allowed Deductions:**
    * Standard Deduction: **₹75,000**.
    * Employer NPS (80CCD(2)): Actual amount.
* **Net Taxable Income:** Base - Allowed Deductions.
* **Slabs:**
    * ₹0 - ₹4,00,000: Nil
    * ₹4,00,001 - ₹8,00,000: 5%
    * ₹8,00,001 - ₹12,00,000: 10%
    * ₹12,00,001 - ₹16,00,000: 15%
    * ₹16,00,001 - ₹20,00,000: 20%
    * ₹20,00,001 - ₹24,00,000: 25%
    * Above ₹24,00,000: 30%
* **Rebate (Sec 87A):** Up to ₹60,000 if Net Taxable Income <= ₹12,00,000.
* **Marginal Relief:** If Taxable Income > ₹12,00,000, Tax Payable = `min(Calculated Tax, Income - 12,00,000)`. Applies only if `Calculated Tax > (Income - 12,00,000)`.
* **Cess:** 4% Health & Education Cess on the final tax amount.

### 5.2 Old Tax Regime
* **Income Base:** Gross Salary + Savings Interest + FD Interest.
* **HRA Exemption Formula:** Minimum of:
    1. Actual HRA received.
    2. 50% of Basic (Metro) or 40% of Basic (Non-Metro).
    3. Rent paid minus 10% of Basic.
* **Allowed Deductions:**
    * Standard Deduction: **₹50,000**.
    * Professional Tax: Actual.
    * HRA Exemption: Computed above.
    * Home Loan Interest (Sec 24b): Up to ₹2,00,000.
    * Section 80C: Sum of EPF + other 80C inputs (Strictly capped at ₹1,50,000).
    * Section 80CCD(1B) (NPS self): Up to ₹50,000.
    * Section 80CCD(2) (Employer NPS): Actual amount.
    * Section 80D (Health): Self up to ₹25k (₹50k if senior), Parents up to ₹25k (₹50k if senior).
    * Section 80TTA: Savings interest up to ₹10,000 (Age < 60).
    * Section 80TTB: Savings + FD interest up to ₹50,000 (Age >= 60).
* **Net Taxable Income:** Base - All Allowed Deductions.
* **Slabs (Below 60):**
    * ₹0 - ₹2,50,000: Nil
    * ₹2,50,001 - ₹5,00,000: 5%
    * ₹5,00,001 - ₹10,00,000: 20%
    * Above ₹10,00,000: 30%
* **Slabs (60 - 79):**
    * ₹0 - ₹3,00,000: Nil
    * ₹3,00,001 - ₹5,00,000: 5%
    * ₹5,00,001 - ₹10,00,000: 20%
    * Above ₹10,00,000: 30%
* **Slabs (80+):**
    * ₹0 - ₹5,00,000: Nil
    * ₹5,00,001 - ₹10,00,000: 20%
    * Above ₹10,00,000: 30%
* **Rebate (Sec 87A):** Up to ₹12,500 if Net Taxable Income <= ₹5,00,000.
* **Cess:** 4% Health & Education Cess on the final tax amount.

---

## 6. Edge Cases & Validations
* **Non-negative:** Prevent negative numbers in all financial inputs.
* **Capping logic:** Enforce limits during the calculation phase, not the input phase (e.g., if a user enters ₹3,00,000 for 80C, accept the input but cap the deduction at ₹1,50,000). Reflect this capping in the live preview.
* **HRA Zero-floor:** HRA Exemption cannot be negative. If `Rent < 10% Basic`, exemption is ₹0.
* **Interest Limits:** 80TTA cannot exceed actual savings interest entered. 80TTB cannot exceed total interest entered.

## 7. Implementation & Architecture Plan
* **Frontend Tech:** React (Vite or Next.js), configured with plain CSS or Tailwind depending on preference.
* **State Management:** Use a central store or React Context to hold the single source of truth for the user's answers. The Live Preview Panel subscribes to this state.
* **Calculation Engine:** Create a pure utility file `taxEngine.js`. It should expose a function `calculateTax(userInputs)` that returns the full breakdown (taxable income, total tax, slab breakdown) for both regimes. This ensures logic is testable without UI dependencies.

## User Review Required
Does this PRD align with your vision for the flow and calculation logic? Please review the assumptions made for the wizard steps (particularly the HRA breakdown) and confirm if any additional edge cases should be handled.
