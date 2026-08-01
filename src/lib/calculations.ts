export type StudentLoanPlan = 'none' | 'plan1' | 'plan2' | 'plan4' | 'postgraduate';

export type SalaryCalculationInput = {
  grossAnnualSalary: number;
  pensionContributionPercent: number;
  studentLoanPlan: StudentLoanPlan;
};

export type SalaryCalculationResult = {
  gross: number;
  pension: number;
  salaryAfterPension: number;
  personalAllowance: number;
  taxableIncome: number;
  incomeTax: number;
  nationalInsurance: number;
  studentLoan: number;
  annualTakeHome: number;
  monthlyTakeHome: number;
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

export function calculateIncomeTax(taxableIncome: number) {
  const basicBand = 37700;
  const higherBand = 74870;

  const basicTax = Math.min(taxableIncome, basicBand) * 0.2;
  const higherTax = Math.max(Math.min(taxableIncome - basicBand, higherBand), 0) * 0.4;
  const additionalTax = Math.max(taxableIncome - basicBand - higherBand, 0) * 0.45;

  return basicTax + higherTax + additionalTax;
}

export function calculateNationalInsurance(taxableSalary: number) {
  const lowerLimit = 12570;
  const upperLimit = 50270;

  const mainRate = Math.max(Math.min(taxableSalary - lowerLimit, upperLimit - lowerLimit), 0) * 0.08;
  const additionalRate = Math.max(taxableSalary - upperLimit, 0) * 0.02;

  return mainRate + additionalRate;
}

export function calculateStudentLoan(taxableSalary: number, plan: StudentLoanPlan) {
  if (plan === 'none') {
    return 0;
  }

  const thresholds: Record<Exclude<StudentLoanPlan, 'none'>, number> = {
    plan1: 24990,
    plan2: 27295,
    plan4: 31395,
    postgraduate: 21000,
  };

  const rate = plan === 'postgraduate' ? 0.06 : 0.09;
  return Math.max(taxableSalary - thresholds[plan], 0) * rate;
}

export function calculateTakeHomePay(input: SalaryCalculationInput): SalaryCalculationResult {
  const gross = Math.max(input.grossAnnualSalary, 0);
  const pension = gross * clamp(input.pensionContributionPercent, 0, 20) / 100;
  const salaryAfterPension = Math.max(gross - pension, 0);
  const personalAllowance = calculatePersonalAllowance(salaryAfterPension);
  const taxableIncome = Math.max(salaryAfterPension - personalAllowance, 0);
  const incomeTax = calculateIncomeTax(taxableIncome);
  const nationalInsurance = calculateNationalInsurance(salaryAfterPension);
  const studentLoan = calculateStudentLoan(salaryAfterPension, input.studentLoanPlan);
  const annualTakeHome = Math.max(salaryAfterPension - incomeTax - nationalInsurance - studentLoan, 0);

  return {
    gross,
    pension,
    salaryAfterPension,
    personalAllowance,
    taxableIncome,
    incomeTax,
    nationalInsurance,
    studentLoan,
    annualTakeHome,
    monthlyTakeHome: annualTakeHome / 12,
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