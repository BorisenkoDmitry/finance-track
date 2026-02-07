import type { financeAnaliticItem } from "../stores/financeSlice/financeSlice";

class CompareForGraphics {
  // Вспомогательная: создаёт дату в целевом месяце по годy, месяцу и дню

  // Основная функция
  fillMonthDays(
    input: financeAnaliticItem[],
    targetMonthDate?: Date,
    budgetTotal?: string | undefined
  ): { total: number; day: number }[] {
    // Определяем целевой год/месяц
    const now = new Date();
    const ref = targetMonthDate ?? now;
    const year = ref.getFullYear();
    const month = ref.getMonth(); // 0..11

    // Узнаём число дней в целевом месяце
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dateInMonth = (
      year: number,
      month0Index: number,
      day: number
    ): Date => {
      const d = new Date(year, month0Index, day);
      d.setHours(0, 0, 0, 0);
      return d;
    };
    const startOfDay = (d: Date): Date => {
      const nd = new Date(d);
      nd.setHours(0, 0, 0, 0);
      return nd;
    };

    // Приведём входные даты к началу дня для точного сравнения
    const normalizedInput = input.map((p) => ({
      total: p.total,
      date: startOfDay(new Date(p.day)),
    }));

    // Построим результат: для каждого дня создаём объект или возьмём существующий
    const result: financeAnaliticItem[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = dateInMonth(year, month, day);
      // Поиск элемента в входном массиве по дате
      const found = normalizedInput.find(
        (d) => d.date.getTime() === currentDate.getTime()
      );
      if (found) {
        result.push({ total: found.total, day: currentDate });
      } else {
        if (budgetTotal) {
          result.push({
            total: String(Number(budgetTotal) / daysInMonth),
            day: currentDate,
          });
        } else {
          result.push({ total: "0", day: currentDate });
        }
      }
    }
    console.log(result);

    return result.map((x) => {
      return {
        total: Math.floor(Number(x.total)),
        day: new Date(x.day).getDate(),
      };
    });
  }
}

export const { fillMonthDays } = new CompareForGraphics();
