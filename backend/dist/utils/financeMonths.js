"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthlyResult = getMonthlyResult;
function buildMonthsRange12(start) {
    const months = [];
    if (start != null) {
        for (let m = 0; m < 12; m++) {
            const mm = (m + 1).toString().padStart(2, '0');
            months.push(`${start?.getFullYear()}-${mm}`);
        }
    }
    return months;
}
function monthlySumIncs(incs) {
    const map = new Map();
    for (const r of incs) {
        if (!r?.date)
            continue;
        const d = new Date(r.date);
        const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
        const cur = map.get(key) ?? 0;
        map.set(key, cur + (Number(r.sum) || 0));
    }
    return map;
}
function monthlySumExps(exps) {
    const map = new Map();
    for (const r of exps) {
        if (!r?.date)
            continue;
        const d = new Date(r.date);
        const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
        const cur = map.get(key) ?? 0;
        map.set(key, cur + (Number(r.price) || 0));
    }
    return map;
}
function monthlySumBudgets(incs) {
    const map = new Map();
    for (const r of incs) {
        if (!r?.createdAt)
            continue;
        const d = new Date(r.createdAt);
        const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
        const cur = map.get(key) ?? 0;
        map.set(key, cur + (Number(r.planned_amount) || 0));
    }
    return map;
}
function fillMissingMonths12(aggMap, months12) {
    return months12.map((m) => ({ month: m, total: aggMap.get(m) ?? 0 }));
}
function getMonthlyResult(exps, inc, budgets, start, end) {
    const months12 = buildMonthsRange12(end ?? null);
    console.log(months12);
    const incsMap = monthlySumIncs(inc);
    const budgetsMap = monthlySumBudgets(budgets);
    const expsMap = monthlySumExps(exps);
    const incsMonthly = fillMissingMonths12(incsMap, months12);
    const budgetsMonthly = fillMissingMonths12(budgetsMap, months12);
    const expsMonthly = fillMissingMonths12(expsMap, months12);
    console.log(budgetsMonthly);
    const incsTotal = incsMonthly.reduce((acc, x) => acc + x.total, 0);
    const budgetsTotal = budgetsMonthly.reduce((acc, x) => acc + x.total, 0);
    const expsTotal = expsMonthly.reduce((acc, x) => acc + x.total, 0);
    return {
        filters: {
            dateStart: start?.toISOString() ?? null,
            dateEnd: end?.toISOString() ?? null,
        },
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
//# sourceMappingURL=financeMonths.js.map