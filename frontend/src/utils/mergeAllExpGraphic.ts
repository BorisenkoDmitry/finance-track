export function consolidateByDay(inputArrays) {
    // Собрать все уникальные дни
    const daySet = new Set();
    for (const arr of inputArrays) {
      for (const item of arr) {
        if (typeof item.day === 'number') daySet.add(item.day);
      }
    }
    const days = Array.from(daySet).sort((a,b) => a - b);
  
    const result = days.map(d => {
      // акумуляторы для полей
      const acc = { day: d };
      // пройти по всем входам и добавлять значения для соответствующего дня
      for (const arr of inputArrays) {
        const it = arr.find(x => x.day === d);
        if (!it) continue;
        for (const [k, v] of Object.entries(it)) {
          if (k === 'day') continue;
          if (typeof v === 'number') {
            acc[k] = (acc[k] ?? 0) + v;
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