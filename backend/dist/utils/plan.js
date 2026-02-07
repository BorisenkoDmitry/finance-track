"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthsDifference = getMonthsDifference;
exports.printMonthsRange = printMonthsRange;
function getMonthsDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const endYear = end.getFullYear();
    const endMonth = end.getMonth();
    const diffYears = endYear - startYear;
    const diffMonths = endMonth - startMonth;
    return diffYears * 12 + diffMonths;
}
function printMonthsRange(startDate, endDate) {
    const current = new Date(startDate);
    const end = new Date(endDate);
    current.setDate(1);
    end.setDate(1);
    const months = [];
    while (current <= end) {
        const dN = new Date(current);
        dN.setMonth(current.getMonth() + 1);
        current.setMonth(current.getMonth() + 1);
        months.push(dN);
    }
    return months;
}
//# sourceMappingURL=plan.js.map