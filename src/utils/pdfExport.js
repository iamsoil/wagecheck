import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const BRAND = [5, 150, 105];
const SLATE_900 = [15, 23, 42];
const SLATE_600 = [71, 85, 105];
const EMERALD_50 = [236, 253, 245];

function addHeader(doc, title) {
  const w = doc.internal.pageSize.getWidth();
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, w, 36, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('Wagecheck', 16, 22);
  doc.setFontSize(10);
  doc.text(title, 16, 30);
  doc.setTextColor(...SLATE_600);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, w - 16, 30, { align: 'right' });
}

function addFooter(doc) {
  const w = doc.internal.pageSize.getWidth();
  doc.setTextColor(...SLATE_600);
  doc.setFontSize(8);
  doc.text('wagecheck.co.uk  |  hello@wagecheck.co.uk', w / 2, 285, { align: 'center' });
}

function addDisclaimer(doc, y) {
  doc.setTextColor(...SLATE_600);
  doc.setFontSize(8);
  doc.text(
    'Disclaimer: Estimates based on 2026/27 HMRC guidance. Not professional financial advice. Consult HMRC or a certified accountant.',
    16, y, { maxWidth: 180 }
  );
}

export function generateSalaryPDF(d) {
  const doc = new jsPDF();
  addHeader(doc, 'Salary Calculation Report');

  autoTable(doc, {
    startY: 44,
    head: [['Input', 'Value']],
    body: [
      ['Gross Salary', d.grossSalary],
      ['Tax Code', d.taxCode],
      ['Pension Contribution', d.pension],
      ['Student Loan', d.studentLoan],
    ],
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
  });

  const y = doc.lastAutoTable.finalY + 8;
  doc.setTextColor(...SLATE_900);
  doc.setFontSize(13);
  doc.text('Results', 16, y);

  autoTable(doc, {
    startY: y + 4,
    head: [['', 'Annual', 'Monthly', 'Weekly']],
    body: [
      ['Gross Salary', d.annualGross, d.monthlyGross, d.weeklyGross],
      ['Income Tax', d.annualTax, d.monthlyTax, d.weeklyTax],
      ['National Insurance', d.annualNI, d.monthlyNI, d.weeklyNI],
      ['Pension', d.annualPension, d.monthlyPension, d.weeklyPension],
      ['Student Loan', d.annualSL, d.monthlySL, d.weeklySL],
      ['Take-Home Pay', d.annualNet, d.monthlyNet, d.weeklyNet],
    ],
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
    didParseCell: (hook) => {
      if (hook.row.index === 5) {
        hook.cell.styles.fontStyle = 'bold';
        hook.cell.styles.fillColor = EMERALD_50;
      }
    },
  });

  addDisclaimer(doc, doc.lastAutoTable.finalY + 10);
  addFooter(doc);
  doc.save(`wagecheck-salary-${d.grossSalaryRaw || 'report'}.pdf`);
}

export function generateStampDutyPDF(d) {
  const doc = new jsPDF();
  addHeader(doc, 'Stamp Duty Calculation Report');

  autoTable(doc, {
    startY: 44,
    head: [['Input', 'Value']],
    body: [
      ['Property Price', d.propertyPrice],
      ['Buyer Type', d.buyerType],
      ['Location', d.location],
    ],
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
  });

  const y = doc.lastAutoTable.finalY + 8;
  doc.setTextColor(...SLATE_900);
  doc.setFontSize(13);
  doc.text('Results', 16, y);

  autoTable(doc, {
    startY: y + 4,
    head: [['Band', 'Rate', 'Taxable Amount', 'Tax']],
    body: d.bands.map(b => [b.band, b.rate, b.taxable, b.tax]),
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
    foot: [['', '', 'Total SDLT', d.totalTax]],
    footStyles: { fillColor: EMERALD_50, fontStyle: 'bold' },
  });

  addDisclaimer(doc, doc.lastAutoTable.finalY + 10);
  addFooter(doc);
  doc.save(`wagecheck-stamp-duty-${d.propertyPriceRaw || 'report'}.pdf`);
}

export function generateBonusPDF(d) {
  const doc = new jsPDF();
  addHeader(doc, 'Bonus Tax Calculation Report');

  autoTable(doc, {
    startY: 44,
    head: [['Input', 'Value']],
    body: [
      ['Annual Salary', d.salary],
      ['Bonus Amount', d.bonus],
      ['Tax Code', d.taxCode],
      ['Pension', d.pension],
    ],
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
  });

  const y = doc.lastAutoTable.finalY + 8;
  doc.setTextColor(...SLATE_900);
  doc.setFontSize(13);
  doc.text('Results', 16, y);

  autoTable(doc, {
    startY: y + 4,
    head: [['Description', 'Amount']],
    body: [
      ['Gross Bonus', d.grossBonus],
      ['Income Tax on Bonus', d.tax],
      ['NI on Bonus', d.ni],
      ['Pension on Bonus', d.pensionDeduction],
      ['Net Bonus (You Keep)', d.netBonus],
    ],
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
    didParseCell: (hook) => {
      if (hook.row.index === 4) {
        hook.cell.styles.fontStyle = 'bold';
        hook.cell.styles.fillColor = EMERALD_50;
      }
    },
  });

  addDisclaimer(doc, doc.lastAutoTable.finalY + 10);
  addFooter(doc);
  doc.save(`wagecheck-bonus-${d.bonusRaw || 'report'}.pdf`);
}

export function generatePayRisePDF(d) {
  const doc = new jsPDF();
  addHeader(doc, 'Pay Rise Comparison Report');

  autoTable(doc, {
    startY: 44,
    head: [['Input', 'Value']],
    body: [
      ['Current Salary', d.currentSalary],
      ['New Salary', d.newSalary],
      ['Tax Code', d.taxCode],
    ],
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
  });

  const y = doc.lastAutoTable.finalY + 8;
  doc.setTextColor(...SLATE_900);
  doc.setFontSize(13);
  doc.text('Before vs After', 16, y);

  autoTable(doc, {
    startY: y + 4,
    head: [['', 'Current', 'New', 'Change']],
    body: [
      ['Gross Salary', d.currentGross, d.newGross, d.grossChange],
      ['Monthly Take-Home', d.currentMonthlyNet, d.newMonthlyNet, d.monthlyChange],
      ['Annual Take-Home', d.currentAnnualNet, d.newAnnualNet, d.annualChange],
      ['Tax Paid', d.currentTax, d.newTax, d.taxChange],
      ['NI Paid', d.currentNI, d.newNI, d.niChange],
    ],
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
  });

  addDisclaimer(doc, doc.lastAutoTable.finalY + 10);
  addFooter(doc);
  doc.save(`wagecheck-pay-rise-${d.newSalaryRaw || 'report'}.pdf`);
}

export function generateMortgagePDF(d) {
  const doc = new jsPDF();
  addHeader(doc, 'Mortgage Affordability Report');

  autoTable(doc, {
    startY: 44,
    head: [['Input', 'Value']],
    body: [
      ['Your Salary', d.yourSalary],
      ['Partner Salary', d.partnerSalary || 'N/A'],
      ['Deposit', d.deposit],
      ['Interest Rate', d.interestRate],
      ['Term (years)', d.term],
    ],
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
  });

  const y = doc.lastAutoTable.finalY + 8;
  doc.setTextColor(...SLATE_900);
  doc.setFontSize(13);
  doc.text('Results', 16, y);

  autoTable(doc, {
    startY: y + 4,
    head: [['Description', 'Amount']],
    body: [
      ['Max Borrowing', d.maxBorrowing],
      ['Max Property Price', d.maxPropertyPrice],
      ['Monthly Payment', d.monthlyPayment],
      ['Deposit %', d.depositPercent],
      ['Affordability', d.affordability],
    ],
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
    didParseCell: (hook) => {
      if (hook.row.index === 0) {
        hook.cell.styles.fontStyle = 'bold';
        hook.cell.styles.fillColor = EMERALD_50;
      }
    },
  });

  addDisclaimer(doc, doc.lastAutoTable.finalY + 10);
  addFooter(doc);
  doc.save(`wagecheck-mortgage-${d.yourSalaryRaw || 'report'}.pdf`);
}

export function generateHourlyWagePDF(d) {
  const doc = new jsPDF();
  addHeader(doc, 'Hourly Wage Calculation Report');

  autoTable(doc, {
    startY: 44,
    head: [['Input', 'Value']],
    body: [
      ['Hourly Rate', d.hourlyRate],
      ['Hours per Week', d.hoursPerWeek],
      ['Weeks per Year', d.weeksPerYear],
    ],
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
  });

  const y = doc.lastAutoTable.finalY + 8;
  doc.setTextColor(...SLATE_900);
  doc.setFontSize(13);
  doc.text('Results', 16, y);

  autoTable(doc, {
    startY: y + 4,
    head: [['Period', 'Gross', 'Tax', 'NI', 'Take-Home']],
    body: [
      ['Annual', d.annualGross, d.annualTax, d.annualNI, d.annualNet],
      ['Monthly', d.monthlyGross, d.monthlyTax, d.monthlyNI, d.monthlyNet],
      ['Weekly', d.weeklyGross, d.weeklyTax, d.weeklyNI, d.weeklyNet],
    ],
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
  });

  addDisclaimer(doc, doc.lastAutoTable.finalY + 10);
  addFooter(doc);
  doc.save(`wagecheck-hourly-${d.hourlyRateRaw || 'report'}.pdf`);
}

export function generateProRataPDF(d) {
  const doc = new jsPDF();
  addHeader(doc, 'Pro-Rata Salary Report');

  autoTable(doc, {
    startY: 44,
    head: [['Input', 'Value']],
    body: [
      ['Full-Time Salary', d.fullTimeSalary],
      ['Full-Time Hours/Week', d.fullTimeHours],
      ['Your Hours/Week', d.yourHours],
      ['Weeks per Year', d.weeksPerYear],
    ],
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
  });

  const y = doc.lastAutoTable.finalY + 8;
  doc.setTextColor(...SLATE_900);
  doc.setFontSize(13);
  doc.text('Results', 16, y);

  autoTable(doc, {
    startY: y + 4,
    head: [['Period', 'Gross', 'Tax', 'NI', 'Take-Home']],
    body: [
      ['Annual', d.annualGross, d.annualTax, d.annualNI, d.annualNet],
      ['Monthly', d.monthlyGross, d.monthlyTax, d.monthlyNI, d.monthlyNet],
      ['Weekly', d.weeklyGross, d.weeklyTax, d.weeklyNI, d.weeklyNet],
      ['Hourly', d.hourlyRate, '-', '-', '-'],
    ],
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
  });

  addDisclaimer(doc, doc.lastAutoTable.finalY + 10);
  addFooter(doc);
  doc.save(`wagecheck-prorata-${d.fullTimeSalaryRaw || 'report'}.pdf`);
}

export function generateRentalYieldPDF(d) {
  const doc = new jsPDF();
  addHeader(doc, 'Rental Yield Calculation Report');

  autoTable(doc, {
    startY: 44,
    head: [['Input', 'Value']],
    body: [
      ['Property Price', d.propertyPrice],
      ['Monthly Rent', d.monthlyRent],
      ['Annual Mortgage Interest', d.annualInterest || 'N/A'],
    ],
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
  });

  const y = doc.lastAutoTable.finalY + 8;
  doc.setTextColor(...SLATE_900);
  doc.setFontSize(13);
  doc.text('Results', 16, y);

  autoTable(doc, {
    startY: y + 4,
    head: [['Metric', 'Value']],
    body: [
      ['Gross Rental Yield', d.grossYield],
      ['Net Rental Yield', d.netYield],
      ['Annual Rent', d.annualRent],
      ['Monthly Rent', d.monthlyRent],
      ['Annual Interest', d.annualInterest || 'N/A'],
    ],
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
    didParseCell: (hook) => {
      if (hook.row.index === 0) {
        hook.cell.styles.fontStyle = 'bold';
        hook.cell.styles.fillColor = EMERALD_50;
      }
    },
  });

  addDisclaimer(doc, doc.lastAutoTable.finalY + 10);
  addFooter(doc);
  doc.save(`wagecheck-rental-yield-${d.propertyPriceRaw || 'report'}.pdf`);
}

export function generateComparePDF(d) {
  const doc = new jsPDF();
  addHeader(doc, 'Salary Comparison Report');

  autoTable(doc, {
    startY: 44,
    head: [['', 'Job A', 'Job B']],
    body: [
      ['Gross Salary', d.grossA, d.grossB],
      ['Annual Take-Home', d.takeHomeA, d.takeHomeB],
      ['Monthly Take-Home', d.monthlyA, d.monthlyB],
      ['Income Tax', d.taxA, d.taxB],
      ['National Insurance', d.niA, d.niB],
      ['Pension', d.pensionA, d.pensionB],
    ],
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
  });

  const y = doc.lastAutoTable.finalY + 8;
  doc.setTextColor(...SLATE_900);
  doc.setFontSize(13);
  doc.text('Difference', 16, y);

  autoTable(doc, {
    startY: y + 4,
    head: [['Metric', 'Difference']],
    body: [
      ['Annual Take-Home', d.annualDiff],
      ['Monthly Take-Home', d.monthlyDiff],
    ],
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
    didParseCell: (hook) => {
      hook.cell.styles.fontStyle = 'bold';
      hook.cell.styles.fillColor = EMERALD_50;
    },
  });

  addDisclaimer(doc, doc.lastAutoTable.finalY + 10);
  addFooter(doc);
  doc.save('wagecheck-compare-salaries.pdf');
}

export function generateRequiredSalaryPDF(d) {
  const doc = new jsPDF();
  addHeader(doc, 'Required Salary Report');

  autoTable(doc, {
    startY: 44,
    head: [['Input', 'Value']],
    body: [
      ['Desired Take-Home', d.desiredTakeHome],
      ['Pension Contribution', d.pension],
      ['Student Loan', d.studentLoan],
      ['Region', d.region],
    ],
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
  });

  const y = doc.lastAutoTable.finalY + 8;
  doc.setTextColor(...SLATE_900);
  doc.setFontSize(13);
  doc.text('Results', 16, y);

  autoTable(doc, {
    startY: y + 4,
    head: [['Description', 'Amount']],
    body: [
      ['Required Gross Salary', d.requiredGross],
      ['Annual Take-Home', d.annualNet],
      ['Monthly Take-Home', d.monthlyNet],
      ['Income Tax', d.annualTax],
      ['National Insurance', d.annualNI],
      ['Pension', d.annualPension],
      ['Student Loan', d.annualSL],
    ],
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
    didParseCell: (hook) => {
      if (hook.row.index === 0) {
        hook.cell.styles.fontStyle = 'bold';
        hook.cell.styles.fillColor = EMERALD_50;
      }
    },
  });

  addDisclaimer(doc, doc.lastAutoTable.finalY + 10);
  addFooter(doc);
  doc.save('wagecheck-required-salary.pdf');
}

export function generateOvertimePDF(d) {
  const doc = new jsPDF();
  addHeader(doc, 'Overtime Pay Report');

  autoTable(doc, {
    startY: 44,
    head: [['Input', 'Value']],
    body: [
      ['Hourly Rate', d.hourlyRate],
      ['Multiplier', d.multiplier],
      ['Overtime Hours', d.overtimeHours],
      ['Annual Salary', d.salary || 'Not entered'],
      ['Tax Code', d.taxCode],
    ],
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
  });

  const y = doc.lastAutoTable.finalY + 8;
  doc.setTextColor(...SLATE_900);
  doc.setFontSize(13);
  doc.text('Results', 16, y);

  autoTable(doc, {
    startY: y + 4,
    head: [['Item', 'Amount']],
    body: [
      ['Gross Overtime Pay', d.gross],
      ['Income Tax', d.tax],
      ['National Insurance', d.ni],
      ['Net Overtime Pay', d.net],
      ['Effective Marginal Rate', d.marginalRate],
    ],
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
    theme: 'grid',
    didParseCell: (hook) => {
      if (hook.row.index === 0) {
        hook.cell.styles.fontStyle = 'bold';
        hook.cell.styles.fillColor = EMERALD_50;
      }
    },
  });

  addDisclaimer(doc, doc.lastAutoTable.finalY + 10);
  addFooter(doc);
  doc.save('wagecheck-overtime-pay.pdf');
}
