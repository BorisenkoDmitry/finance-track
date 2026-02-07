import { Budgets } from 'src/budgets/budgets.entity';
import { Exp } from 'src/exp/exp.entity';
import { IncEntity } from 'src/inc/inc.entity';

function buildMonthsRange12(start?: Date | null) {
  const months: string[] = [];
  if (start != null) {
    for (let m = 0; m < 12; m++) {
      const mm = (m + 1).toString().padStart(2, '0');
      months.push(`${start?.getFullYear()}-${mm}`);
    }
  }
  return months;
}

function monthlySumIncs(incs: IncEntity[]) {
  const map = new Map<string, number>();
  for (const r of incs) {
    if (!r?.date) continue;
    const d = new Date(r.date);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`; // YYYY-MM
    const cur = map.get(key) ?? 0;
    map.set(key, cur + (Number(r.sum) || 0));
  }
  return map; // вернём Map, чтобы удобнее мержить с каркасом месяцев
}
function monthlySumExps(exps: Exp[]) {
  const map = new Map<string, number>();
  for (const r of exps) {
    if (!r?.date) continue;
    const d = new Date(r.date);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`; // YYYY-MM
    const cur = map.get(key) ?? 0;
    map.set(key, cur + (Number(r.price) || 0));
  }
  return map; // вернём Map, чтобы удобнее мержить с каркасом месяцев
}
function monthlySumBudgets(incs: Budgets[]) {
  const map = new Map<string, number>();
  for (const r of incs) {
    if (!r?.createdAt) continue;
    const d = new Date(r.createdAt);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`; // YYYY-MM
    const cur = map.get(key) ?? 0;
    map.set(key, cur + (Number(r.planned_amount) || 0));
  }
  return map; // вернём Map, чтобы удобнее мержить с каркасом месяцев
}
function fillMissingMonths12(
  aggMap: Map<string, number>,
  months12: string[],
): { month: string; total: number }[] {
  return months12.map((m) => ({ month: m, total: aggMap.get(m) ?? 0 }));
}
// Использование:
export function getMonthlyResult(
  exps: Exp[],
  inc: IncEntity[],
  budgets: Budgets[],
  start?: Date | null,
  end?: Date | null,
) {
  const months12 = buildMonthsRange12(end ?? null);
  console.log(months12);
  const incsMap = monthlySumIncs(inc);
  const budgetsMap = monthlySumBudgets(budgets);
  const expsMap = monthlySumExps(exps);
  const incsMonthly = fillMissingMonths12(incsMap, months12);
  const budgetsMonthly = fillMissingMonths12(budgetsMap, months12);
  const expsMonthly = fillMissingMonths12(expsMap, months12);
  console.log(budgetsMonthly);
  // Итоги считаем по уже заполненным массивам (ровно 12 элементов)
  const incsTotal = incsMonthly.reduce((acc, x) => acc + x.total, 0);
  const budgetsTotal = budgetsMonthly.reduce((acc, x) => acc + x.total, 0);
  const expsTotal = expsMonthly.reduce((acc, x) => acc + x.total, 0);
  return {
    filters: {
      dateStart: start?.toISOString() ?? null,
      dateEnd: end?.toISOString() ?? null,
    },
    // inc,
    // budgets,
    aggregates: {
      incsMonthly,
      budgetsMonthly,
      expsMonthly,
      incsTotal,
      budgetsTotal,
      expsTotal,
    },
  };
}
