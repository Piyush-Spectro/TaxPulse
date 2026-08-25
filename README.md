# TaxPulse

**A tax-planning product concept for Indian salaried professionals.**

TaxPulse explores how an interactive estimator, regime comparison, and guided deduction checklist can make tax planning easier to understand throughout the year.

[**Explore the live prototype**](https://piyush-spectro.github.io/TaxPulse/) · [Read the PRD](PRD.md) · [Download the PRD](docs/TaxPulse_Capstone_PRD.pdf)

**Project:** Self-initiated Product Management capstone

**Product Manager:** Piyush Kumar

**Stage:** Interactive prototype

## The problem

Salaried professionals need to understand how income, deductions, and regime choice affect their tax estimate. The product hypothesis is that showing these decisions together—with clear next steps—can encourage earlier, more informed planning.

**Target user:** A salaried professional managing rent, investments, and insurance who wants a simple way to explore tax-planning scenarios.

## Product approach

| User need | Prototype experience | Intended benefit |
| --- | --- | --- |
| Get an initial estimate | Salary-based estimator | Give users a starting point before asking for more details |
| Understand regime choice | Side-by-side old and new regime comparison | Make the effect of deductions easier to explore |
| Know what to add next | Guided deduction checklist | Break profile completion into manageable steps |
| See progress | Illustrative 0–100 Tax Efficiency Score | Provide feedback as users add information |
| Explore additional income | Inputs for freelance, rental, and capital-gains income | Demonstrate a consolidated planning flow |
| Understand terminology | Scripted tax-assistant demo | Explore contextual explanations inside the experience |

## Try the prototype

1. Open the [live demo](https://piyush-spectro.github.io/TaxPulse/) and adjust the salary input.
2. Add sample rent, investment, and insurance details.
3. Compare the estimates and observe how the score and suggested next steps change.

## Product management work

The [PRD](PRD.md) captures the problem framing, target persona, feature requirements, RICE prioritization, phased roadmap, and proposed success metrics.

The central product tradeoff is to offer an initial estimate with minimal input, then collect more detail through a checklist. The prototype demonstrates that flow; document import and production integrations remain future work.

## Validation plan

The next step is to test whether users can complete the estimator, understand the regime comparison, and identify a useful next action without assistance.

Proposed measures include estimator completion, deduction-checklist completion, comprehension of the results, and repeat usage. Metrics in the PRD are planning targets, not measured outcomes; this repository does not report validated user or business results.

## Prototype scope

- Built as a browser-based demonstration, with no backend or account system.
- The assistant uses scripted responses; it is not connected to a live AI model.
- Tax calculations and the score are simplified illustrations. Capital gains are combined with other income in the current implementation, and tax-year coverage has not been validated for current filing use.
- Production security, document import, and regulatory-update capabilities described in the PRD are requirements, not implemented guarantees.

## Technology

HTML, CSS, and vanilla JavaScript, hosted on GitHub Pages. No build step or npm installation is required.

<details>
<summary>Run locally</summary>

Requires Git and Python 3.

```bash
git clone https://github.com/Piyush-Spectro/TaxPulse.git
cd TaxPulse
python3 -m http.server 8080
```

Open [localhost:8080](http://localhost:8080) in your browser.

</details>

## Author

[Piyush Kumar](https://github.com/Piyush-Spectro) · Product Management portfolio project
