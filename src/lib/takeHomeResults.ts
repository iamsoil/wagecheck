import { calculateTakeHomePay } from './calculations';

export type SalaryResult = ReturnType<typeof calculateTakeHomePay>;

export const gb = (n: number) => n.toLocaleString('en-GB', { maximumFractionDigits: 2 });
export const money = (n: number) => `£${Math.round(n).toLocaleString('en-GB')}`;
export const pct = (n: number) => `${gb(n)}%`;

export function setNum(panel: HTMLElement, key: string, value: number) {
  const wrapper = panel.querySelector<HTMLElement>(`[data-var="${key}"]`);
  const el = wrapper?.querySelector<HTMLElement>('[data-animated-number]');
  if (el) {
    el.dataset.animatedNumber = String(value);
  }
}

export function barSegments(result: SalaryResult) {
  return [
    { var: 'Takehome', label: 'Take-home', value: result.annualTakeHome, colorClass: 'bg-emerald-500' },
    { var: 'Tax', label: 'Income Tax', value: result.incomeTax + result.bonusTax, colorClass: 'bg-rose-500' },
    { var: 'Ni', label: 'National Insurance', value: result.nationalInsurance, colorClass: 'bg-blue-500' },
    { var: 'Loan', label: 'Student Loan', value: result.studentLoan, colorClass: 'bg-amber-500' },
    { var: 'Pension', label: 'Pension', value: result.pension, colorClass: 'bg-slate-400' },
  ];
}

function stackHtml(segments: ReturnType<typeof barSegments>) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const bar = segments
    .map(
      (s) =>
        `<div style="width:${total > 0 ? (s.value / total) * 100 : 0}%" class="${s.colorClass} ${s.value === 0 ? 'hidden' : ''}"></div>`
    )
    .join('');
  const legend = segments
    .map(
      (s) =>
        `<span class="flex items-center gap-1.5 text-xs text-slate-600"><span class="h-2.5 w-2.5 rounded-full ${s.colorClass}"></span>${s.label} · ${
          total > 0 ? Math.round((s.value / total) * 100) : 0
        }%</span>`
    )
    .join('');
  return `<div class="flex h-4 w-full overflow-hidden rounded-full">${bar}</div><div class="mt-3 flex flex-wrap gap-x-4 gap-y-2">${legend}</div>`;
}

const tableLabels: Record<string, string> = {
  tax: 'Income Tax',
  ni: 'National Insurance',
  loan: 'Student Loan',
  pension: 'Pension',
  bonus: 'Bonus Tax',
};

function setBar(panel: HTMLElement, result: SalaryResult) {
  const segments = barSegments(result);
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  segments.forEach((s) => {
    const barEl = panel.querySelector<HTMLElement>(`[data-var="bar${s.var}"]`);
    if (barEl) {
      barEl.style.width = total > 0 ? `${(s.value / total) * 100}%` : '0%';
      barEl.classList.toggle('hidden', s.value === 0);
    }
    const legEl = panel.querySelector<HTMLElement>(`[data-var="leg${s.var}"]`);
    if (legEl) {
      legEl.textContent = `${money(s.value)} · ${total > 0 ? Math.round((s.value / total) * 100) : 0}%`;
    }
  });
}

function setTable(panel: HTMLElement, result: SalaryResult) {
  const byLabel: Record<string, { yearly: number; monthly: number; weekly: number; pct: number }> = {};
  result.deductions.forEach((d) => {
    byLabel[d.label] = { yearly: d.yearly, monthly: d.monthly, weekly: d.weekly, pct: d.percentOfGross };
  });

  panel.querySelectorAll<HTMLElement>('[data-table-row]').forEach((row) => {
    const key = row.dataset.tableRow ?? '';
    let data: { yearly: number; monthly: number; weekly: number; pct: number };
    if (key === 'takehome') {
      data = {
        yearly: result.annualTakeHome,
        monthly: result.monthlyTakeHome,
        weekly: result.weeklyTakeHome,
        pct: result.percentageTakenHome,
      };
    } else {
      data = byLabel[tableLabels[key]] ?? { yearly: 0, monthly: 0, weekly: 0, pct: 0 };
    }

    if (key === 'loan' || key === 'bonus') {
      row.classList.toggle('hidden', data.yearly === 0);
    }

    const cells = {
      yearly: row.querySelector('[data-cell="yearly"]'),
      monthly: row.querySelector('[data-cell="monthly"]'),
      weekly: row.querySelector('[data-cell="weekly"]'),
      pct: row.querySelector('[data-cell="pct"]'),
    };
    if (cells.yearly) cells.yearly.textContent = money(data.yearly);
    if (cells.monthly) cells.monthly.textContent = money(data.monthly);
    if (cells.weekly) cells.weekly.textContent = money(data.weekly);
    if (cells.pct) cells.pct.textContent = pct(data.pct);
  });
}

function setShare(panel: HTMLElement, result: SalaryResult, product: string, extraRows: { label: string; value: string }[]) {
  const rows = [
    ...extraRows,
    { label: 'Gross annual salary', value: money(result.gross) },
    { label: 'Income Tax', value: money(result.incomeTax) },
    { label: 'National Insurance', value: money(result.nationalInsurance) },
    { label: 'Student Loan', value: money(result.studentLoan) },
    { label: 'Pension', value: money(result.pension) },
    { label: 'Bonus tax', value: money(result.bonusTax) },
    { label: 'Annual take-home pay', value: money(result.annualTakeHome) },
    { label: 'Monthly take-home pay', value: money(result.monthlyTakeHome) },
    { label: 'Weekly take-home pay', value: money(result.weeklyTakeHome) },
  ];
  const segments = barSegments(result);

  panel.dataset.sharePayload = JSON.stringify({
    product,
    rows,
    markdown: { headers: ['Item', 'Amount'], rows },
    modal: {
      title: 'Your take-home pay',
      value: money(result.monthlyTakeHome),
      sub: 'per month after tax, National Insurance, pension and student loan',
      stack: segments,
    },
  });

  const card = panel.querySelector<HTMLElement>('[data-share-card]');
  if (card) {
    const title = card.querySelector<HTMLElement>('[data-share-title]');
    const value = card.querySelector<HTMLElement>('[data-share-value]');
    const sub = card.querySelector<HTMLElement>('[data-share-sub]');
    const stackEl = card.querySelector<HTMLElement>('[data-share-stack]');
    if (title) title.textContent = 'Your take-home pay';
    if (value) value.textContent = money(result.monthlyTakeHome);
    if (sub) sub.textContent = 'per month after tax, National Insurance, pension and student loan';
    if (stackEl) stackEl.innerHTML = stackHtml(segments);
  }
}

export function renderTakeHomeResults(
  panel: HTMLElement,
  result: SalaryResult,
  product: string,
  extraRows: { label: string; value: string }[] = []
) {
  setNum(panel, 'grossAnnual', result.gross);
  setNum(panel, 'annual', result.annualTakeHome);
  setNum(panel, 'monthly', result.monthlyTakeHome);
  setNum(panel, 'weekly', result.weeklyTakeHome);

  const breakdown = [
    { key: 'dedTax', value: result.incomeTax, card: '[data-ded-tax-card]' },
    { key: 'dedNi', value: result.nationalInsurance, card: '[data-ded-ni-card]' },
    { key: 'dedLoan', value: result.studentLoan, card: '[data-ded-loan-card]' },
    { key: 'dedPension', value: result.pension, card: '[data-ded-pension-card]' },
    { key: 'dedBonus', value: result.bonusTax, card: '[data-ded-bonus-card]' },
  ];
  breakdown.forEach((d, i) => {
    window.setTimeout(() => {
      setNum(panel, d.key, d.value);
      const card = panel.querySelector<HTMLElement>(d.card);
      card?.classList.toggle('hidden', d.value === 0);
    }, i * 100);
  });

  setBar(panel, result);
  setTable(panel, result);
  setShare(panel, result, product, extraRows);
}
