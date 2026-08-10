export type StudentLoanPlan = 'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgraduate';

export type SalaryRegion = 'rest-of-uk' | 'scotland';
export type PensionType = 'on-gross' | 'qualifying';

export type SalaryCalculationInput = {
  grossAnnualSalary: number;
  pensionContributionPercent: number;
  studentLoanPlan: StudentLoanPlan;
  region?: SalaryRegion;
  hoursPerWeek?: number;
  annualBonus?: number;
  taxCode?: string;
  blindAllowance?: boolean;
  marriageAllowance?: boolean;
  salarySacrifice?: number;
  childcareVouchers?: number;
  pensionType?: PensionType;
};

export type SalaryDeductionRow = {
  label: string;
  yearly: number;
  monthly: number;
  weekly: number;
  percentOfGross: number;
};

export type SalaryCalculationResult = {
  gross: number;
  bonus: number;
  pension: number;
  salaryAfterPension: number;
  personalAllowance: number;
  taxableIncome: number;
  incomeTax: number;
  bonusTax: number;
  nationalInsurance: number;
  studentLoan: number;
  totalDeductions: number;
  annualTakeHome: number;
  annualTakeHomeExcludingBonus: number;
  monthlyTakeHome: number;
  weeklyTakeHome: number;
  dailyTakeHome: number;
  hourlyTakeHome: number;
  percentageTakenHome: number;
  deductions: SalaryDeductionRow[];
};

export type StampDutyLocation = 'england' | 'wales' | 'scotland';
export type StampDutyBuyerType = 'first-time-buyer' | 'standard' | 'buy-to-let' | 'non-uk-resident';

export type StampDutyBandResult = {
  label: string;
  rate: number;
  taxableAmount: number;
  tax: number;
};

export type StampDutyCalculationResult = {
  bands: StampDutyBandResult[];
  total: number;
  effectiveRate: number;
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function calculatePersonalAllowance(adjustedIncome: number) {
  if (adjustedIncome <= 100000) {
    return 12570;
  }

  const reduction = (adjustedIncome - 100000) / 2;
  return clamp(12570 - reduction, 0, 12570);
}

type TaxBand = { lower: number; upper: number; rate: number };

function taxFromBands(taxableIncome: number, bands: TaxBand[]) {
  let total = 0;

  for (const band of bands) {
    const taxableAmount = Math.max(Math.min(taxableIncome, band.upper) - band.lower, 0);
    total += taxableAmount * band.rate;
  }

  return total;
}

const REST_OF_UK_BANDS: TaxBand[] = [
  { lower: 0, upper: 50270, rate: 0.2 },
  { lower: 50270, upper: 125140, rate: 0.4 },
  { lower: 125140, upper: Infinity, rate: 0.45 },
];

const SCOTLAND_BANDS: TaxBand[] = [
  { lower: 0, upper: 15629, rate: 0.19 },
  { lower: 15629, upper: 27491, rate: 0.2 },
  { lower: 27491, upper: 43662, rate: 0.21 },
  { lower: 43662, upper: 75000, rate: 0.42 },
  { lower: 75000, upper: 125140, rate: 0.45 },
  { lower: 125140, upper: Infinity, rate: 0.48 },
];

export function calculateIncomeTax(taxableIncome: number, region: SalaryRegion = 'rest-of-uk') {
  const bands = region === 'scotland' ? SCOTLAND_BANDS : REST_OF_UK_BANDS;
  return taxFromBands(taxableIncome, bands);
}

export function calculateNationalInsurance(taxableSalary: number) {
  const lowerLimit = 12570;
  const upperLimit = 50270;

  const mainRate = Math.max(Math.min(taxableSalary - lowerLimit, upperLimit - lowerLimit), 0) * 0.08;
  const additionalRate = Math.max(taxableSalary - upperLimit, 0) * 0.02;

  return mainRate + additionalRate;
}

const STUDENT_LOAN_THRESHOLDS: Record<Exclude<StudentLoanPlan, 'none'>, number> = {
  plan1: 24990,
  plan2: 27295,
  plan4: 31395,
  plan5: 25000,
  postgraduate: 21000,
};

export function calculateStudentLoan(taxableSalary: number, plan: StudentLoanPlan) {
  if (plan === 'none') {
    return 0;
  }

  const rate = plan === 'postgraduate' ? 0.06 : 0.09;
  return Math.max(taxableSalary - STUDENT_LOAN_THRESHOLDS[plan], 0) * rate;
}

export function parseTaxCode(taxCode: string | undefined) {
  if (!taxCode) {
    return 12570;
  }

  const match = taxCode.match(/^\s*(\d+)/);
  if (!match) {
    return 12570;
  }

  return clamp(parseInt(match[1], 10) * 10, 0, 125140);
}

export function calculateTakeHomePay(input: SalaryCalculationInput): SalaryCalculationResult {
  const gross = Math.max(input.grossAnnualSalary, 0);
  const bonus = Math.max(input.annualBonus ?? 0, 0);
  const hoursPerWeek = clamp(input.hoursPerWeek ?? 37.5, 1, 80);
  const region = input.region ?? 'rest-of-uk';
  const pensionType = input.pensionType ?? 'on-gross';

  const pensionPercent = clamp(input.pensionContributionPercent, 0, 20);
  const pensionEarnings = pensionType === 'qualifying' ? Math.max(Math.min(gross, 50270) - 6240, 0) : gross;
  const pension = (pensionEarnings * pensionPercent) / 100;

  const salarySacrifice = Math.max(input.salarySacrifice ?? 0, 0);
  const childcareVouchers = Math.max(input.childcareVouchers ?? 0, 0);
  const salaryAfterPension = Math.max(gross - pension - salarySacrifice - childcareVouchers, 0);

  let personalAllowance = calculatePersonalAllowance(salaryAfterPension + bonus);
  if (input.blindAllowance) {
    personalAllowance += 3070;
  }
  if (input.marriageAllowance) {
    personalAllowance += 1260;
  }
  personalAllowance = clamp(personalAllowance, 0, 125140);

  const taxableIncome = Math.max(salaryAfterPension - personalAllowance, 0);
  const incomeTax = calculateIncomeTax(taxableIncome, region);

  const taxableIncomeWithBonus = Math.max(salaryAfterPension + bonus - personalAllowance, 0);
  const incomeTaxWithBonus = calculateIncomeTax(taxableIncomeWithBonus, region);
  const bonusTax = Math.max(incomeTaxWithBonus - incomeTax, 0);

  const nationalInsurance = calculateNationalInsurance(salaryAfterPension);
  const studentLoan = calculateStudentLoan(salaryAfterPension, input.studentLoanPlan);

  const totalDeductions = incomeTax + bonusTax + nationalInsurance + studentLoan + pension + salarySacrifice + childcareVouchers;
  const annualTakeHomeExcludingBonus = Math.max(salaryAfterPension - incomeTax - nationalInsurance - studentLoan, 0);
  const annualTakeHome = Math.max(annualTakeHomeExcludingBonus + bonus - bonusTax, 0);

  const deductions: SalaryDeductionRow[] = [
    {
      label: 'Income Tax',
      yearly: incomeTax,
      monthly: incomeTax / 12,
      weekly: incomeTax / 52,
      percentOfGross: gross > 0 ? (incomeTax / gross) * 100 : 0,
    },
    {
      label: 'National Insurance',
      yearly: nationalInsurance,
      monthly: nationalInsurance / 12,
      weekly: nationalInsurance / 52,
      percentOfGross: gross > 0 ? (nationalInsurance / gross) * 100 : 0,
    },
    {
      label: 'Pension',
      yearly: pension,
      monthly: pension / 12,
      weekly: pension / 52,
      percentOfGross: gross > 0 ? (pension / gross) * 100 : 0,
    },
  ];

  if (studentLoan > 0) {
    deductions.push({
      label: 'Student Loan',
      yearly: studentLoan,
      monthly: studentLoan / 12,
      weekly: studentLoan / 52,
      percentOfGross: gross > 0 ? (studentLoan / gross) * 100 : 0,
    });
  }

  if (bonusTax > 0) {
    deductions.push({
      label: 'Bonus Tax',
      yearly: bonusTax,
      monthly: bonusTax / 12,
      weekly: bonusTax / 52,
      percentOfGross: gross > 0 ? (bonusTax / gross) * 100 : 0,
    });
  }

  return {
    gross,
    bonus,
    pension,
    salaryAfterPension,
    personalAllowance,
    taxableIncome,
    incomeTax,
    bonusTax,
    nationalInsurance,
    studentLoan,
    totalDeductions,
    annualTakeHome,
    annualTakeHomeExcludingBonus,
    monthlyTakeHome: annualTakeHome / 12,
    weeklyTakeHome: annualTakeHome / 52,
    dailyTakeHome: annualTakeHome / 260,
    hourlyTakeHome: annualTakeHome / (hoursPerWeek * 52),
    percentageTakenHome: gross > 0 ? (annualTakeHome / gross) * 100 : 0,
    deductions,
  };
}

function calculateBands(price: number, bands: Array<{ lower: number; upper: number; rate: number; label: string }>) {
  return bands.map((band) => {
    const taxableAmount = Math.max(Math.min(price, band.upper) - band.lower, 0);
    const tax = taxableAmount * band.rate;

    return {
      label: band.label,
      rate: band.rate,
      taxableAmount,
      tax,
    };
  });
}

export function calculateStampDuty(price: number, location: StampDutyLocation, buyerType: StampDutyBuyerType): StampDutyCalculationResult {
  const sanitizedPrice = Math.max(price, 0);

  let bands: StampDutyBandResult[];

  if (location === 'wales') {
    bands = calculateBands(sanitizedPrice, [
      { lower: 0, upper: 225000, rate: 0, label: 'Up to £225,000' },
      { lower: 225000, upper: 400000, rate: 0.06, label: '£225,001 - £400,000' },
      { lower: 400000, upper: 750000, rate: 0.075, label: '£400,001 - £750,000' },
      { lower: 750000, upper: 1500000, rate: 0.1, label: '£750,001 - £1.5m' },
      { lower: 1500000, upper: Infinity, rate: 0.12, label: 'Above £1.5m' },
    ]);
  } else if (location === 'scotland') {
    const firstTimeBuyer = buyerType === 'first-time-buyer';
    bands = calculateBands(sanitizedPrice, [
      { lower: 0, upper: firstTimeBuyer ? 175000 : 145000, rate: 0, label: firstTimeBuyer ? 'Up to £175,000' : 'Up to £145,000' },
      { lower: firstTimeBuyer ? 175000 : 145000, upper: 250000, rate: 0.02, label: firstTimeBuyer ? '£175,001 - £250,000' : '£145,001 - £250,000' },
      { lower: 250000, upper: 325000, rate: 0.05, label: '£250,001 - £325,000' },
      { lower: 325000, upper: 750000, rate: 0.1, label: '£325,001 - £750,000' },
      { lower: 750000, upper: Infinity, rate: 0.12, label: 'Above £750,000' },
    ]);
  } else {
    const firstTimeBuyer = buyerType === 'first-time-buyer';
    bands = calculateBands(sanitizedPrice, [
      { lower: 0, upper: firstTimeBuyer ? 425000 : 250000, rate: 0, label: firstTimeBuyer ? 'Up to £425,000' : 'Up to £250,000' },
      { lower: firstTimeBuyer ? 425000 : 250000, upper: firstTimeBuyer ? 625000 : 925000, rate: 0.05, label: firstTimeBuyer ? '£425,001 - £625,000' : '£250,001 - £925,000' },
      { lower: firstTimeBuyer ? 625000 : 925000, upper: 1500000, rate: 0.1, label: '£925,001 - £1.5m' },
      { lower: 1500000, upper: Infinity, rate: 0.12, label: 'Above £1.5m' },
    ]);
  }

  let total = bands.reduce((sum, band) => sum + band.tax, 0);

  if (location === 'england') {
    if (buyerType === 'buy-to-let') {
      total += sanitizedPrice * 0.03;
      bands.push({ label: 'Buy-to-let / second home surcharge', rate: 0.03, taxableAmount: sanitizedPrice, tax: sanitizedPrice * 0.03 });
    }

    if (buyerType === 'non-uk-resident') {
      total += sanitizedPrice * 0.02;
      bands.push({ label: 'Non-UK resident surcharge', rate: 0.02, taxableAmount: sanitizedPrice, tax: sanitizedPrice * 0.02 });
    }
  }

  if (location === 'scotland' && buyerType === 'buy-to-let') {
    total += sanitizedPrice * 0.06;
    bands.push({ label: 'Additional Dwelling Supplement', rate: 0.06, taxableAmount: sanitizedPrice, tax: sanitizedPrice * 0.06 });
  }

  return {
    bands,
    total,
    effectiveRate: sanitizedPrice > 0 ? (total / sanitizedPrice) * 100 : 0,
  };
}

export function findRequiredGross(
  desiredNet: number,
  input: Omit<SalaryCalculationInput, 'grossAnnualSalary'>,
): number {
  if (desiredNet <= 0) return 0;
  let low = desiredNet;
  let high = desiredNet * 2.5 + 1000;
  let gross = low;
  for (let i = 0; i < 50; i++) {
    gross = (low + high) / 2;
    const result = calculateTakeHomePay({ ...input, grossAnnualSalary: gross });
    if (Math.abs(result.annualTakeHome - desiredNet) < 1) break;
    if (result.annualTakeHome < desiredNet) low = gross;
    else high = gross;
  }
  return gross;
}
