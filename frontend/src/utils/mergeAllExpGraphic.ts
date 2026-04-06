type GraphicItem = Record<string, unknown> & { day: number };

export function consolidateByDay(inputArrays: GraphicItem[][]) {
    const daySet = new Set<number>();
    for (const arr of inputArrays) {
      for (const item of arr) {
        if (typeof item.day === 'number') daySet.add(item.day);
      }
    }
    const days = Array.from(daySet).sort((a, b) => a - b);

    const result = days.map(d => {
      const acc: Record<string, unknown> = { day: d };
      for (const arr of inputArrays) {
        const it = arr.find(x => x.day === d);
        if (!it) continue;
        for (const [k, v] of Object.entries(it)) {
          if (k === 'day') continue;
          if (typeof v === 'number') {
            acc[k] = ((acc[k] as number) ?? 0) + v;
          } else {
            acc[k] = Object.prototype.hasOwnProperty.call(acc, k) ? acc[k] : v;
          }
        }
      }
      return acc;
    });

    return result;
  }
