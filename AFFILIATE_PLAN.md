# wagecheck.co.uk — Affiliate Monetisation Plan

**Last updated:** 2026-09-26  
**Status:** Phase 1 component built, Phase 2 in progress (remaining calculator pages)

---

## What's done

- Created `AffiliateSection.astro` — reusable 3-card component with sponsored disclaimer
- Added affiliate cards to: salary calculator, mortgage affordability, stamp duty calculator
- Auto-propagated to all 86 salary pages and 37 stamp duty pages via `layoutProps`

---

## Phase 2 — Remaining calculator pages

| Page | Cards to add |
|------|-------------|
| `bonus-calculator.astro` | Savings accounts, credit card eligibility, Stocks & shares ISA |
| `pay-rise-calculator.astro` | Savings accounts, credit card eligibility, Stocks & shares ISA |
| `hourly-wage-calculator.astro` | High-interest savings, credit card eligibility check |
| `pro-rata-calculator.astro` | Savings accounts, credit card eligibility, Stocks & shares ISA |
| `self-employed-tax-calculator.astro` | Accounting software, pension contributions, business bank accounts |
| `required-salary.astro` | Mortgage broker, savings for deposit, credit card eligibility |
| `rental-yield.astro` | Buy-to-let mortgage broker, conveyancer quotes, landlord insurance |

---

## Phase 3 — Affiliate programs to sign up for

### Priority 1 — Mortgage broker leads (mortgage affordability page)
- **Loan.co.uk** — direct affiliate, pay per completed lead
- **My Mortgage Protection Experts (MMPE)** — mortgage & protection affiliate
- **Awin** — hosts MoneySuperMarket, Compare the Market, and many brokers
- Expected: £20-£60 per qualified lead

### Priority 2 — Savings & ISAs (salary calculator, pay-rise, pro-rata, required-salary)
- **Monzo, Starling, Chase UK** — via Impact.com or direct affiliate schemes
- **Awin** — hosts most UK banks (NatWest, Santander, Lloyds, HSBC current/savings accounts)
- Expected: £2-£10 per account opened

### Priority 3 — Credit cards (salary calculator, bonus calculator, hourly wage)
- **American Express UK** — Business Alliance Program (B2B focus) / consumer via Awin
- **Capital One, MBNA, Amex consumer** — via Awin
- Expected: £3-£15 per approved application

### Priority 4 — Accounting software (self-employed tax calculator)
- **QuickBooks Self-Employed** — up to $300/referral (Intuit referral program)
- **Xero** — 10% commission per sale
- **GoSimpleTax** — self-assessment software, check direct affiliate program
- Expected: £5-£20 per signup

### Priority 5 — Conveyancing (stamp duty pages)
- **Awin / Impact** — hosts conveyancing comparison services
- Expected: £10-£30 per quote

---

## Phase 4 — Replace placeholder links

Once affiliate accounts are approved, replace the `href="#affiliate-*"` placeholders in:
- `src/components/AffiliateSection.astro` (not needed — generic component)
- `src/pages/salary-calculator.astro` lines 128-160
- `src/pages/mortgage-affordability.astro` lines 173-205
- `src/pages/stamp-duty-calculator.astro` lines 134-168
- `src/pages/salary/[amount].astro` lines 153-187 (layoutProps.affiliateCards)
- `src/pages/stamp-duty/[price].astro` lines 128-157 (layoutProps.affiliateCards)

---

## Phase 5 — Tracking

- GA4 is already on the site — add event tracking for affiliate link clicks
- Label each card with a data attribute so you can see which products convert
- Review monthly: which cards get clicks, which convert, swap out underperformers

---

## Compliance notes

- UK finance affiliate marketing falls under FCA financial promotion rules — disclosure is essential
- The `sponsored` flag on cards already shows "Sponsored" label + disclaimer — keep this
- Mortgage/financial advice disclaimer already on mortgage affordability page — keep
- Don't make returns or rates claims you can't verify — link to the provider's site for current figures
