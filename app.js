/**
 * TaxPulse - Core Tax Engine & Application Logic
 */

// Application State
const appState = {
  activeTab: 'prototype', // 'prototype' or 'casestudy'
  activeSubTab: 'prd', // 'prd', 'slides', 'metrics', 'gtm'
  currentPage: 'landing',
  
  // Tax Estimator Inputs
  salary: 1200000,
  ageGroup: 'gen',
  cityType: 'metro',
  
  // Detailed Profile Inputs
  rentPaid: 0,
  hraReceived: 0,
  basicSalary: 600000,
  
  // Deductions
  deduction80C: 0,
  deduction80D: 0,
  deductionNPS: 0,
  homeLoanInterest: 0,
  otherDeductions: 0,
  
  // Multi-Income
  freelanceIncome: 0,
  rentalIncome: 0,
  capitalGainsSTCG: 0,
  capitalGainsLTCG: 0,
  
  // Checklist State
  completedChecklist: {
    salary: true,
    rent: false,
    investments: false,
    insurance: false,
    other: false
  },
  
  // Calculated Results
  results: {
    oldRegimeTax: 0,
    newRegimeTax: 0,
    recommendedRegime: 'new',
    taxSaved: 0,
    taxScore: 20,
    hraExemption: 0,
    totalGrossIncome: 1200000,
    totalDeductionsOld: 50000,
    totalDeductionsNew: 75000
  }
};

// Formatter Utility
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Math.max(0, Math.round(amount)));
}

// Format number into short Indian format (e.g. ₹12L)
function formatShortINR(amount) {
  if (amount >= 10000000) return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹ ${(amount / 100000).toFixed(1)} L`;
  if (amount >= 1000) return `₹ ${(amount / 1000).toFixed(0)} K`;
  return `₹ ${amount}`;
}

// ----------------------------------------------------
// Tax Calculation Algorithms (FY 2024-25 / FY 2025-26)
// ----------------------------------------------------

function calculateTax() {
  const grossSalary = Number(appState.salary);
  const freelance = Number(appState.freelanceIncome);
  const rental = Number(appState.rentalIncome);
  const stcg = Number(appState.capitalGainsSTCG);
  const ltcg = Number(appState.capitalGainsLTCG);

  const totalGrossIncome = grossSalary + freelance + rental + stcg + ltcg;
  appState.results.totalGrossIncome = totalGrossIncome;

  // 1. Calculate HRA Exemption (for Old Regime)
  let hraExemption = 0;
  if (appState.rentPaid > 0) {
    const basic = appState.basicSalary || grossSalary * 0.5;
    const actualHRA = appState.hraReceived || grossSalary * 0.2;
    const rentMinus10Basic = Math.max(0, appState.rentPaid * 12 - (basic * 0.1));
    const metroCap = (appState.cityType === 'metro') ? (basic * 0.5) : (basic * 0.4);
    hraExemption = Math.min(actualHRA, rentMinus10Basic, metroCap);
  }
  appState.results.hraExemption = hraExemption;

  // 2. Total Deductions under Old Regime
  const stdDeductionOld = 50000;
  const c80Deduction = Math.min(150000, Number(appState.deduction80C));
  const d80Deduction = Math.min(75000, Number(appState.deduction80D));
  const npsDeduction = Math.min(50000, Number(appState.deductionNPS));
  const homeLoanDed = Math.min(200000, Number(appState.homeLoanInterest));
  const otherDed = Number(appState.otherDeductions);

  const totalDeductionsOld = stdDeductionOld + hraExemption + c80Deduction + d80Deduction + npsDeduction + homeLoanDed + otherDed;
  appState.results.totalDeductionsOld = totalDeductionsOld;

  const taxableIncomeOld = Math.max(0, totalGrossIncome - totalDeductionsOld);

  // Old Regime Tax Calculation
  let oldTax = 0;
  if (taxableIncomeOld > 250000) {
    if (taxableIncomeOld <= 500000) {
      oldTax += (taxableIncomeOld - 250000) * 0.05;
    } else if (taxableIncomeOld <= 1000000) {
      oldTax += (500000 - 250000) * 0.05 + (taxableIncomeOld - 500000) * 0.20;
    } else {
      oldTax += (500000 - 250000) * 0.05 + (1000000 - 500000) * 0.20 + (taxableIncomeOld - 1000000) * 0.30;
    }
  }
  // Section 87A Rebate for Old Regime (Up to ₹5,00,000 taxable income)
  if (taxableIncomeOld <= 500000) {
    oldTax = 0;
  }
  // Add 4% Cess
  if (oldTax > 0) oldTax *= 1.04;
  appState.results.oldRegimeTax = Math.round(oldTax);

  // 3. New Regime Tax Calculation (Section 115BAC)
  const stdDeductionNew = 75000;
  appState.results.totalDeductionsNew = stdDeductionNew;
  const taxableIncomeNew = Math.max(0, totalGrossIncome - stdDeductionNew);

  let newTax = 0;
  if (taxableIncomeNew > 300000) {
    if (taxableIncomeNew <= 700000) {
      newTax += (taxableIncomeNew - 300000) * 0.05;
    } else if (taxableIncomeNew <= 1000000) {
      newTax += (700000 - 300000) * 0.05 + (taxableIncomeNew - 700000) * 0.10;
    } else if (taxableIncomeNew <= 1200000) {
      newTax += (700000 - 300000) * 0.05 + (1000000 - 700000) * 0.10 + (taxableIncomeNew - 1000000) * 0.15;
    } else if (taxableIncomeNew <= 1500000) {
      newTax += (700000 - 300000) * 0.05 + (1000000 - 700000) * 0.10 + (1200000 - 1000000) * 0.15 + (taxableIncomeNew - 1200000) * 0.20;
    } else {
      newTax += (700000 - 300000) * 0.05 + (1000000 - 700000) * 0.10 + (1200000 - 1000000) * 0.15 + (1500000 - 1200000) * 0.20 + (taxableIncomeNew - 1500000) * 0.30;
    }
  }
  // Section 87A Rebate for New Regime (Up to ₹7,00,000 taxable income)
  if (taxableIncomeNew <= 700000) {
    newTax = 0;
  }
  // Add 4% Cess
  if (newTax > 0) newTax *= 1.04;
  appState.results.newRegimeTax = Math.round(newTax);

  // Compare Regimes
  if (appState.results.newRegimeTax <= appState.results.oldRegimeTax) {
    appState.results.recommendedRegime = 'New Regime';
    appState.results.finalTax = appState.results.newRegimeTax;
    appState.results.taxSaved = Math.max(0, appState.results.oldRegimeTax - appState.results.newRegimeTax);
  } else {
    appState.results.recommendedRegime = 'Old Regime';
    appState.results.finalTax = appState.results.oldRegimeTax;
    appState.results.taxSaved = Math.max(0, appState.results.newRegimeTax - appState.results.oldRegimeTax);
  }

  // Calculate Gamified Tax Efficiency Score (0 - 100)
  calculateTaxScore();
}

function calculateTaxScore() {
  let score = 20; // Base score for adding salary

  if (appState.completedChecklist.rent || appState.rentPaid > 0) score += 20;
  if (appState.deduction80C >= 150000) score += 25;
  else if (appState.deduction80C > 0) score += Math.round((appState.deduction80C / 150000) * 20);

  if (appState.deduction80D > 0) score += 15;
  if (appState.deductionNPS > 0 || appState.homeLoanInterest > 0) score += 10;
  if (appState.completedChecklist.other) score += 10;

  appState.results.taxScore = Math.min(100, Math.max(20, score));
}

// ----------------------------------------------------
// UI Navigation & Page Management
// ----------------------------------------------------

function switchMainTab(tab) {
  appState.activeTab = tab;
  document.getElementById('tab-prototype').classList.toggle('active', tab === 'prototype');
  document.getElementById('tab-casestudy').classList.toggle('active', tab === 'casestudy');

  document.getElementById('view-prototype').classList.toggle('hidden', tab !== 'prototype');
  document.getElementById('view-casestudy').classList.toggle('hidden', tab !== 'casestudy');
}

function switchSubTab(subTab) {
  appState.activeSubTab = subTab;
  ['prd', 'slides', 'metrics', 'gtm'].forEach(t => {
    const btn = document.getElementById(`subtab-${t}`);
    const sec = document.getElementById(`case-sec-${t}`);
    if (btn) btn.classList.toggle('active', t === subTab);
    if (sec) sec.classList.toggle('hidden', t !== subTab);
  });
}

function navigateTo(pageId) {
  appState.currentPage = pageId;
  const pages = ['landing', 'estimator', 'results', 'profile', 'income', 'optimized-results', 'insights'];
  pages.forEach(p => {
    const el = document.getElementById(`page-${p}`);
    if (el) el.classList.add('hidden');
  });

  const target = document.getElementById(`page-${pageId}`);
  if (target) target.classList.remove('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack(targetPageId) {
  navigateTo(targetPageId);
}

// ----------------------------------------------------
// Form Handlers & Live Updates
// ----------------------------------------------------

function initFormListeners() {
  const salaryInput = document.getElementById('input-salary');
  const salaryDisplay = document.getElementById('salary-display');

  if (salaryInput && salaryDisplay) {
    salaryInput.addEventListener('input', (e) => {
      appState.salary = Number(e.target.value);
      salaryDisplay.textContent = formatCurrency(appState.salary);
    });
  }

  const ageInput = document.getElementById('input-age');
  if (ageInput) {
    ageInput.addEventListener('change', (e) => {
      appState.ageGroup = e.target.value;
    });
  }

  const cityInput = document.getElementById('input-city');
  if (cityInput) {
    cityInput.addEventListener('change', (e) => {
      appState.cityType = e.target.value;
    });
  }
}

function calculateAndNavigate() {
  calculateTax();

  // Update Page 3 (Quick Results)
  document.getElementById('result-tax').textContent = formatCurrency(appState.results.finalTax);
  document.getElementById('result-savings').textContent = formatCurrency(appState.results.taxSaved);
  document.getElementById('result-score').textContent = appState.results.taxScore;
  
  // Update SVG circular progress
  updateCircularScore('score-circle', appState.results.taxScore);

  navigateTo('results');
}

function updateCircularScore(elementId, score) {
  const el = document.getElementById(elementId);
  if (el) {
    const degrees = (score / 100) * 360;
    el.style.background = `conic-gradient(var(--color-primary) ${degrees}deg, #e2e8f0 ${degrees}deg)`;
  }
}

function calculateTotalAndShowInsights() {
  calculateTax();

  // Update Page 5.5 Breakdown
  document.getElementById('opt-gross').textContent = formatCurrency(appState.results.totalGrossIncome);
  
  const selectedDeduction = (appState.results.recommendedRegime === 'Old Regime') 
    ? appState.results.totalDeductionsOld 
    : appState.results.totalDeductionsNew;
    
  document.getElementById('opt-deductions').textContent = formatCurrency(selectedDeduction);
  document.getElementById('opt-taxable').textContent = formatCurrency(Math.max(0, appState.results.totalGrossIncome - selectedDeduction));
  
  document.getElementById('opt-tax').textContent = formatCurrency(appState.results.finalTax);
  document.getElementById('opt-savings').textContent = formatCurrency(appState.results.taxSaved);
  document.getElementById('opt-score').textContent = appState.results.taxScore;

  updateCircularScore('opt-score-circle', appState.results.taxScore);

  navigateTo('optimized-results');
}

function renderInsightsAndNavigate() {
  const container = document.getElementById('insights-container');
  if (!container) return;

  container.innerHTML = '';

  // 1. Regime Choice Insight
  const regimeCard = document.createElement('div');
  regimeCard.className = `insight-card success`;
  regimeCard.innerHTML = `
    <div class="flex justify-between items-center mb-2">
      <h3 class="font-bold text-lg text-primary">Regime Recommendation</h3>
      <span class="logo-tag">${appState.results.recommendedRegime}</span>
    </div>
    <p class="text-sm text-muted">
      Based on your profile, the <strong>${appState.results.recommendedRegime}</strong> saves you 
      <strong>${formatCurrency(appState.results.taxSaved)}</strong> compared to the alternative.
    </p>
  `;
  container.appendChild(regimeCard);

  // 2. Section 80C Insight
  const unused80C = 150000 - appState.deduction80C;
  if (unused80C > 0 && appState.results.recommendedRegime === 'Old Regime') {
    const cCard = document.createElement('div');
    cCard.className = `insight-card warning`;
    cCard.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-bold text-lg text-warning">Section 80C Opportunity</h3>
        <span class="text-xs font-bold text-warning">Save up to ${formatCurrency(unused80C * 0.3)}</span>
      </div>
      <p class="text-sm text-muted">
        You have <strong>${formatCurrency(unused80C)}</strong> remaining under Section 80C limit (ELSS, PPF, EPF). 
        Investing in ELSS mutual funds can reduce your taxable income further.
      </p>
    `;
    container.appendChild(cCard);
  }

  // 3. Section 80D Health Insurance Insight
  if (appState.deduction80D === 0 && appState.results.recommendedRegime === 'Old Regime') {
    const dCard = document.createElement('div');
    dCard.className = `insight-card warning`;
    dCard.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-bold text-lg">Section 80D Health Insurance</h3>
        <span class="text-xs font-bold text-success">+15 Tax Score</span>
      </div>
      <p class="text-sm text-muted">
        Add Health Insurance premiums to claim up to ₹25,000 (Self/Family) + ₹50,000 (Senior Parents) tax exemption.
      </p>
    `;
    container.appendChild(dCard);
  }

  // 4. HRA Insight
  if (appState.rentPaid > 0) {
    const hraCard = document.createElement('div');
    hraCard.className = `insight-card success`;
    hraCard.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-bold text-lg text-success">HRA Exemption Calculated</h3>
        <span class="font-bold text-success">${formatCurrency(appState.results.hraExemption)}</span>
      </div>
      <p class="text-sm text-muted">
        Your eligible HRA exemption is ${formatCurrency(appState.results.hraExemption)} based on your annual rent paid of ${formatCurrency(appState.rentPaid * 12)}.
      </p>
    `;
    container.appendChild(hraCard);
  }

  navigateTo('insights');
}

// ----------------------------------------------------
// Modal Dialog Handlers
// ----------------------------------------------------

function openModal(modalType) {
  const overlay = document.getElementById('modal-overlay');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  if (!overlay || !title || !body) return;

  overlay.classList.add('active');

  if (modalType === 'rent') {
    title.textContent = 'Rent & HRA Details';
    body.innerHTML = `
      <div class="form-group">
        <label class="form-label">Monthly Rent Paid (₹)</label>
        <input type="number" id="modal-rent" class="form-input" value="${appState.rentPaid || 15000}" placeholder="e.g. 15000">
      </div>
      <div class="form-group">
        <label class="form-label">Annual HRA Component in Salary (₹)</label>
        <input type="number" id="modal-hra-component" class="form-input" value="${appState.hraReceived || 240000}" placeholder="e.g. 240000">
      </div>
      <button class="btn btn-primary w-full mt-4" onclick="saveModalData('rent')">Save Rent Details</button>
    `;
  } else if (modalType === 'investments') {
    title.textContent = '80C Investments (ELSS, PPF, EPF)';
    body.innerHTML = `
      <div class="form-group">
        <label class="form-label">Total 80C Declared (₹ - Max 1.5 Lakhs)</label>
        <input type="number" id="modal-80c" class="form-input" value="${appState.deduction80C || 100000}" max="150000">
      </div>
      <div class="form-group">
        <label class="form-label">Additional NPS 80CCD(1B) (₹ - Max 50,000)</label>
        <input type="number" id="modal-nps" class="form-input" value="${appState.deductionNPS || 0}" max="50000">
      </div>
      <button class="btn btn-primary w-full mt-4" onclick="saveModalData('investments')">Save Investments</button>
    `;
  } else if (modalType === 'insurance') {
    title.textContent = 'Section 80D Health Insurance';
    body.innerHTML = `
      <div class="form-group">
        <label class="form-label">Health Insurance Premium (Self & Family) (₹)</label>
        <input type="number" id="modal-80d" class="form-input" value="${appState.deduction80D || 25000}" placeholder="e.g. 25000">
      </div>
      <button class="btn btn-primary w-full mt-4" onclick="saveModalData('insurance')">Save Insurance</button>
    `;
  } else if (modalType === 'other') {
    title.textContent = 'Home Loan Interest & Other Deductions';
    body.innerHTML = `
      <div class="form-group">
        <label class="form-label">Home Loan Self-Occupied Interest 24(b) (₹ - Max 2L)</label>
        <input type="number" id="modal-homeloan" class="form-input" value="${appState.homeLoanInterest || 0}">
      </div>
      <button class="btn btn-primary w-full mt-4" onclick="saveModalData('other')">Save Deductions</button>
    `;
  } else if (modalType === 'freelance' || modalType === 'rental_income' || modalType === 'capital_gains') {
    title.textContent = 'Multi-Income Stream';
    body.innerHTML = `
      <div class="form-group">
        <label class="form-label">Annual Freelance / Gig Income (₹)</label>
        <input type="number" id="modal-freelance" class="form-input" value="${appState.freelanceIncome || 0}">
      </div>
      <div class="form-group">
        <label class="form-label">Annual Rental Income Received (₹)</label>
        <input type="number" id="modal-rental" class="form-input" value="${appState.rentalIncome || 0}">
      </div>
      <div class="form-group">
        <label class="form-label">Capital Gains (STCG/LTCG) (₹)</label>
        <input type="number" id="modal-stcg" class="form-input" value="${appState.capitalGainsSTCG || 0}">
      </div>
      <button class="btn btn-primary w-full mt-4" onclick="saveModalData('multi_income')">Save Income Sources</button>
    `;
  }
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('active');
}

function saveModalData(type) {
  if (type === 'rent') {
    appState.rentPaid = Number(document.getElementById('modal-rent').value) || 0;
    appState.hraReceived = Number(document.getElementById('modal-hra-component').value) || 0;
    appState.completedChecklist.rent = true;
    markChecklistItemChecked('item-rent');
  } else if (type === 'investments') {
    appState.deduction80C = Number(document.getElementById('modal-80c').value) || 0;
    appState.deductionNPS = Number(document.getElementById('modal-nps').value) || 0;
    appState.completedChecklist.investments = true;
    markChecklistItemChecked('item-investments');
  } else if (type === 'insurance') {
    appState.deduction80D = Number(document.getElementById('modal-80d').value) || 0;
    appState.completedChecklist.insurance = true;
    markChecklistItemChecked('item-insurance');
  } else if (type === 'other') {
    appState.homeLoanInterest = Number(document.getElementById('modal-homeloan').value) || 0;
    appState.completedChecklist.other = true;
    markChecklistItemChecked('item-other');
  } else if (type === 'multi_income') {
    appState.freelanceIncome = Number(document.getElementById('modal-freelance').value) || 0;
    appState.rentalIncome = Number(document.getElementById('modal-rental').value) || 0;
    appState.capitalGainsSTCG = Number(document.getElementById('modal-stcg').value) || 0;
  }

  calculateTax();
  updateProfileProgressBar();
  closeModal();
}

function markChecklistItemChecked(id) {
  const item = document.getElementById(id);
  if (item) {
    item.classList.add('checked');
    const checkIcon = item.querySelector('.check-icon');
    if (checkIcon) checkIcon.classList.remove('hidden');
  }
}

function handleCheckboxClick(type, event) {
  event.stopPropagation();
  openModal(type);
}

function updateProfileProgressBar() {
  const count = Object.values(appState.completedChecklist).filter(Boolean).length;
  const pct = (count / 5) * 100;
  
  const bar = document.getElementById('progress-bar');
  const txt = document.getElementById('progress-text');
  
  if (bar) bar.style.width = `${pct}%`;
  if (txt) txt.textContent = `${count} of 5 completed`;
}

// ----------------------------------------------------
// AI Chatbot Assistant Simulator
// ----------------------------------------------------

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');

  if (!input || !messages || !input.value.trim()) return;

  const query = input.value.trim();
  input.value = '';

  // Append user bubble
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-bubble user';
  userMsg.textContent = query;
  messages.appendChild(userMsg);
  messages.scrollTop = messages.scrollHeight;

  // Bot response simulation
  setTimeout(() => {
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-bubble bot';

    const qLower = query.toLowerCase();
    if (qLower.includes('80c') || qLower.includes('elss')) {
      botMsg.innerHTML = `Section 80C allows deductions up to <strong>₹1,50,000</strong> per year across ELSS Mutual Funds, PPF, EPF, and Life Insurance. ELSS has the shortest lock-in period (3 years) with highest potential equity growth!`;
    } else if (qLower.includes('regime') || qLower.includes('old vs new')) {
      botMsg.innerHTML = `Under New Regime (FY 2024-25), tax slabs are lower and income up to ₹7,00,000 pays ₹0 tax! However, standard deduction of ₹75,000 applies, but 80C and HRA exemptions are disabled. Your currently optimal regime is <strong>${appState.results.recommendedRegime}</strong>.`;
    } else if (qLower.includes('hra') || qLower.includes('rent')) {
      botMsg.innerHTML = `HRA exemption is calculated as the MINIMUM of: (1) Actual HRA received, (2) Rent paid minus 10% basic salary, (3) 50% basic salary for metro cities or 40% for non-metros.`;
    } else if (qLower.includes('score')) {
      botMsg.innerHTML = `Your current Tax Efficiency Score is <strong>${appState.results.taxScore}/100</strong>. You can boost it by adding rent details, maxing out 80C investments, and adding 80D health insurance!`;
    } else {
      botMsg.innerHTML = `Great question! Based on your current income of ${formatCurrency(appState.results.totalGrossIncome)}, your estimated tax liability is ${formatCurrency(appState.results.finalTax)}. You can optimize further by updating your deduction checklist.`;
    }

    messages.appendChild(botMsg);
    messages.scrollTop = messages.scrollHeight;
  }, 600);
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  initFormListeners();
  calculateTax();
});
