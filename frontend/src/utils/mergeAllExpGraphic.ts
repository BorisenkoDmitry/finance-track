type DayItem = {
  day: number;
  [key: string]: number | string | unknown;
};

export function consolidateByDay(inputArrays: DayItem[][]): DayItem[] {
    // Собрать все уникальные дни
    const daySet = new Set<number>();
    for (const arr of inputArrays) {
      for (const item of arr) {
        if (typeof item.day === 'number') daySet.add(item.day);
      }
    }
    const days = Array.from(daySet).sort((a: number, b: number) => a - b);
  
    const result = days.map((d: number) => {
      // акумуляторы для полей
      const acc: DayItem = { day: d };
      // пройти по всем входам и добавлять значения для соответствующего дня
      for (const arr of inputArrays) {
        const it = arr.find((x: DayItem) => x.day === d);
        if (!it) continue;
        for (const [k, v] of Object.entries(it)) {
          if (k === 'day') continue;
          if (typeof v === 'number') {
            const currentValue = acc[k];
            acc[k] = ((typeof currentValue === 'number' ? currentValue : 0) as number) + v;
          } else {
            // пример: копируем последнее значение, если это не число
            acc[k] = Object.prototype.hasOwnProperty.call(acc, k) ? acc[k] : v;
          }
        }
      }
      // если нужно, можно заполнить отсутствующие поля нулями
      return acc;
    });
  
    return result;
  }