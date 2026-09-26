# wagecheck.co.uk — Affiliate Monetisation Plan

**Last updated:** 2026-09-26
**Status:** Phase 2 complete (all calculator pages have AffiliateSection blocks), Phase 4 pending (replace placeholder links)

---

## What's done

- Created `AffiliateSection.astro` — reusable 3-card component with sponsored disclaimer
- Added affiliate cards to all 10 calculator pages (salary, mortgage, stamp duty, bonus, pay-rise, hourly wage, pro-rata, self-employed tax, required salary, rental yield)
- Auto-propagated to 86 salary pages and 37 stamp duty pages via `layoutProps`
- Mobile-friendly 3-column card grid, "Sponsored" label + disclaimer on each card

---

## Affiliate cards by page — placeholder hrefs to replace

| Page | Card 1 | Card 2 | Card 3 |
|------|--------|--------|--------|
| `salary-calculator.astro` | High-interest savings accounts → `#affiliate-savings` | Credit card eligibility → `#affiliate-creditcards` | Stocks & shares ISA → `#affiliate-isas` |
| `mortgage-affordability.astro` | Mortgage broker → `#affiliate-broker` | Remortgage deals → `#affiliate-remortgage` | Help-to-Buy / savings → `#affiliate-savings-deposit` |
| `stamp-duty-calculator.astro` | Mortgage broker → `#affiliate-broker` | Conveyancing quotes → `#affiliate-conveyancing` | First-time buyer savings → `#affiliate-ftb-savings` |
| `bonus-calculator.astro` | High-interest savings → `#affiliate-savings` | Credit card eligibility → `#affiliate-creditcards` | Stocks & shares ISA → `#affiliate-isas` |
| `pay-rise-calculator.astro` | High-interest savings → `#affiliate-savings` | Credit card eligibility → `#affiliate-creditcards` | Stocks & shares ISA → `#affiliate-isas` |
| `hourly-wage-calculator.astro` | High-interest savings → `#affiliate-savings` | Credit card eligibility → `#affiliate-creditcards` | Mortgage affordability → `/mortgage-affordability/` |
| `pro-rata-calculator.astro` | High-interest savings → `#affiliate-savings` | Credit card eligibility → `#affiliate-creditcards` | Stocks & shares ISA → `#affiliate-isas` |
| `self-employed-tax-calculator.astro` | Tax software → `#affiliate-taxsoftware` | Business bank account → `#affiliate-business-bank` | Pension → `#affiliate-pension` |
| `required-salary.astro` | Mortgage broker → `#affiliate-broker` | Savings for deposit → `#affiliate-savings-deposit` | Credit card eligibility → `#affiliate-creditcards` |
| `rental-yield.astro` | Buy-to-let mortgage broker → `#affiliate-btlmortgage` | Conveyancing quotes → `#affiliate-conveyancer` | Landlord insurance → `#affiliate-landlord-insurance` |

---

## Phase 3 — Affiliate programs to sign up for

### Priority 1 — Mortgage broker leads (mortgage affordability, stamp duty, required salary)
- **Loan.co.uk** — direct affiliate, pay per completed lead
- **My Mortgage Protection Experts (MMPE)** — mortgage & protection affiliate
- **Awin** — hosts MoneySuperMarket, Compare the Market, and many brokers
- **Compare the Market** — via Awin
- Expected: £20-£60 per qualified lead

### Priority 2 — Savings & ISAs (salary, bonus, pay-rise, hourly wage, pro-rata, stamp duty)
- **Monzo, Starling, Chase UK** — via Impact.com or direct affiliate schemes
- **Awin** — hosts most UK banks (NatWest, Santander, Lloyds, HSBC current/savings accounts)
- **Moneybox** — via Awin/Impact
- **OurPersonalBanking / Nationwide** — check direct schemes
- Expected: £2-£10 per account opened

### Priority 3 — Credit cards (salary, bonus, hourly wage, pay-rise, pro-rata, required salary)
- **American Express UK** — consumer via Awin
- **Capital One, MBNA** — via Awin
- **Nationwide credit cards** — via Awin
- Expected: £3-£15 per approved application

### Priority 4 — Accounting software (self-employed tax calculator)
- **QuickBooks Self-Employed** — Intuit referral program, up to $300/referral
- **Xero** — 10% commission per sale
- **GoSimpleTax** — self-assessment software, check direct affiliate program
- **FreeAgent** — check direct affiliate program
- Expected: £5-£20 per signup

### Priority 5 — Conveyancing (stamp duty, rental yield)
- **Awin / Impact** — hosts conveyancing comparison services
- **Homeward** — check direct
- Expected: £10-£30 per quote

### Priority 6 — Buy-to-let mortgage (rental yield)
- **Loan.co.uk B2L** — check if they have a BTL-specific program
- **Awin** — hosts BTL brokers
- Expected: £30-£80 per lead (higher value than residential)

### Priority 7 — Landlord insurance (rental yield)
- **Awin** — hosts AXO, Cover4Lettings, and others
- Expected: £5-£15 per quote

---

## Phase 4 — Replace placeholder links (in priority order)

Once affiliate accounts are approved, replace the `#affiliate-*` hrefs. Priority order by revenue potential:

1. **Mortgage broker** — highest CPA, pages: mortgage-affordability, stamp-duty, required-salary
2. **Savings accounts** — broad relevance, pages: salary, bonus, pay-rise, hourly-wage, pro-rata, stamp-duty
3. **Credit cards** — pages: salary, bonus, hourly-wage, pay-rise, pro-rata, required-salary
4. **Stocks & shares ISA** — pages: salary, bonus, pay-rise, pro-rata
5. **Conveyancing** — pages: stamp-duty, rental-yield
6. **Accounting software** — page: self-employed-tax
7. **Business bank account** — page: self-employed-tax
8. **Pension** — page: self-employed-tax
9. **Remortgage** — page: mortgage-affordability
10. **Buy-to-let mortgage** — page: rental-yield
11. **Landlord insurance** — page: rental-yield
12. **First-time buyer savings** — page: stamp-duty

---

## Phase 5 — Tracking

- GA4 already on site — add event tracking for affiliate link clicks
- Add `data-affiliate="product-name"` attributes to each card link
- Track clicks in GA4 as `affiliate_click` events with product label
- Review monthly: which cards get clicks, which convert, swap out underperformers

Example GA4 event:
```js
gtag('event', 'affiliate_click', {
  event_category: 'affiliate',
  event_label: 'high-interest-savings',
  value: 1
});
```

---

## Compliance notes

- UK finance affiliate marketing falls under FCA financial promotion rules — disclosure is essential
- The `sponsored` flag on cards already shows "Sponsored" label + disclaimer — keep this
- Mortgage/financial advice disclaimer already on mortgage affordability page — keep
- Don't make returns or rates claims you can't verify — link to the provider's site for current figures
- Affiliate links should use `rel="noopener sponsored"` — already in place

---

## Quick sign-up checklist

- [ ] Create Awin publisher account — broad access to UK banks, credit cards, conveyancers, landlord insurance
- [ ] Create Impact.com publisher account — Monzo, Starling, Chase UK (if available)
- [ ] Apply to Loan.co.uk affiliate program — mortgage leads (highest value)
- [ ] Apply to MMPE (My Mortgage Protection Experts) — mortgage & protection
- [ ] Apply to QuickBooks Self-Employed referral program — self-employed tax page
- [ ] Apply to Xero affiliate program — self-employed tax page
- [ ] Check Cover4Lettings / AXO affiliate via Awin — landlord insurance
- [ ] Check Compare the Market mortgage comparison via Awin — mortgage affordability
