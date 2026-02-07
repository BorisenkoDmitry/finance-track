export function getMonthsDifference(startDate: Date, endDate: Date) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Корректируем, чтобы считать полные месяцы (без учёта дней)
  const startYear = start.getFullYear();
  const startMonth = start.getMonth(); // 0–11

  const endYear = end.getFullYear();
  const endMonth = end.getMonth();

  const diffYears = endYear - startYear;
  const diffMonths = endMonth - startMonth;

  return diffYears * 12 + diffMonths;
}

export function printMonthsRange(startDate: Date, endDate: Date) {
  const current = new Date(startDate);
  const end = new Date(endDate);

  // Устанавливаем день в 1, чтобы итерировать по месяцам

  current.setDate(1);
  end.setDate(1);

  const months = [];

  while (current <= end) {
    const dN = new Date(current);
    // if (
    //   current.getMonth() === end.getMonth() &&
    //   current.getFullYear() === end.getFullYear()
    // ) {
    //   // Устанавливаем день из endDate (сохраняем исходный день конца периода)
    //   newD.setDate(endDate.getDate());
    // } else {
    //   // Для остальных месяцев — день из startDate
    //   newD.setDate(startDate.getDate());
    // }
    dN.setMonth(current.getMonth() + 1);

    current.setMonth(current.getMonth() + 1);
    months.push(dN);
  }
  return months;
}
