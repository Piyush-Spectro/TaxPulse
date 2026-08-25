# Product Requirement Document (PRD): TaxPulse Engine

> **Product Manager:** Piyush Kumar  
> **Project:** Self-Initiated Product Portfolio Project  
> **Status:** MVP Approved  

---

## 1. Executive Summary & Problem Statement

### Strategic Intent
TaxPulse is an AI-powered continuous tax planning & score engine designed for Indian salaried professionals. It transforms tax management from a stressful March scramble into an ongoing, automated financial health habit.

### Core User Friction
Over 70% of salaried professionals delay tax planning until March, resulting in sub-optimal investments, lost HRA/80C exemptions, and unexpected tax liabilities.

### Key Pain Points
- **Tax Jargon Friction:** Section 115BAC, 80CCD, HRA math confuse young earners.
- **Lack of Real-Time Visibility:** Users don't know their current tax liability during salary credits.
- **Absence of Feedback Loops:** Static calculators output tax liability without giving step-by-step guidance.
- **Compliance vs Financial Literacy:** Market tools focus on filing return fees rather than continuous learning.

---

## 2. Target User Persona

- **Primary Persona:** Arjun Verma (26-year-old Senior Software Engineer in Bengaluru, CTC: ₹16,00,000 LPA).
- **Core Need:** *"When my salary credits, I want to see my estimated tax liability and exact steps to lower it, so I can invest systematically year-round."*

---

## 3. Market Analysis & Competitive Differentiators

| Platform Category | Current Market Solution | TaxPulse Differentiator |
| :--- | :--- | :--- |
| **Traditional Tax Filers** | Focus exclusively on tax return filing in March. | Year-round continuous planning with monthly salary nudges. |
| **Wealth & Investment Apps** | Provide generic 80C mutual fund recommendations. | Personalized deduction engine tailored to salary & HRA math. |
| **Brokers & Trackers** | Track capital gains without overall tax slab context. | Holistic multi-income tracker combining salary, freelance & capital gains. |
| **TaxPulse Solution** | 10-second estimator + 0-100 Tax Score + Regime Matcher. | **First gamified tax optimization system with live AI assistant.** |

---

## 4. Core System Architecture & Feature Requirements

### Phase 1: Must-Have MVP Features
1. **10-Second Tax Estimator:** Instant client-side calculation based on salary slider, age bracket, and metro/non-metro HRA caps.
2. **Tax Efficiency Score (0-100):** Dynamic progress metric quantifying deduction utilization (80C, 80D, HRA) and regime selection.
3. **Old vs New Regime Comparator:** Real-time calculation comparing Section 115BAC (with ₹75k std deduction) vs Old Tax Slabs.
4. **Amendments & Life-Event Simulator:** Enables users to project mid-year salary raises, bonuses, or new insurance policies.

### Phase 2: Nice-to-Have Features
1. **Form 16 / AIS Auto-Import:** Upload/scan statements to auto-fill tax fields.
2. **In-App AI Tax Assistant:** Conversational widget demystifying complex tax terminology.
3. **Multi-Income Stream Aggregator:** Unified tracking for salary, freelance/gig work, rental income, and capital gains.

---

## 5. Business Metrics (AARRR Framework)
- **Acquisition:** 25% of new registered users activate the Tax Module within 14 days; CTR > 18% on homepage banners.
- **Engagement:** 35% weekly active user retention for users tracking tax insights; >45% complete full Tax Score setup.
- **Data Depth:** 50% of active users log 3+ deduction categories (rent, 80C, 80D).
- **Monetization:** 6-9% conversion to partner tax-saving products (ELSS/NPS); 3-5% conversion to expert advisory.

---

## 6. Feature Prioritization & Execution Plan (RICE Framework)

| Feature Description | Reach | Impact | Confidence | Effort | RICE Score | Phase |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **10-Sec Quick Tax Estimator** | 10 | 9 | 90% | 2 wks | **40.5** | Phase 1 (MVP) |
| **Gamified Tax Efficiency Score** | 9 | 8 | 85% | 2 wks | **30.6** | Phase 1 (MVP) |
| **Personalized 80C / HRA Insights** | 8 | 8 | 80% | 3 wks | **17.0** | Phase 1 (MVP) |
| **Form 16 OCR Auto-Import** | 6 | 9 | 70% | 6 wks | **6.3** | Phase 2 |
| **In-App AI Tax Assistant** | 5 | 7 | 75% | 4 wks | **6.5** | Phase 2 |

---

## 7. Security, Compliance & Technical Constraints
- **Data Security:** AES-256 encryption at rest and TLS 1.3 in transit. Consent-driven data processing.
- **Regulatory Adaptability:** Decoupled tax logic engine allowing instant updates upon Union Budget announcements.
- **User Trust Disclaimer:** Clear UI disclaimers stating calculations are directional estimates for planning purposes.
