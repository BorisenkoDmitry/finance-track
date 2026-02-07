class Validation {
  isValidPrice(value: string | number): boolean {
    const num = typeof value === 'string' ? value.trim() : value;
    // Преобразуем в число
    const n = Number(num);
    if (typeof n !== 'number' || Number.isNaN(n)) return false;
    // Проверка на десятичную точность: ровно 2 знака после запятой
    const parts = String(n).split('.');
    if (parts.length === 2 && parts[1].length > 2) return false;
    // Точное значение с двумя знаками после запятой
    // Можно использовать регулярное выражение для строк: /^\d+(\.\d{1,2})?$/
    const re = /^\d+(\.\d{1,2})?$/;
    return re.test(String(n));
  }
}

export const validate = new Validation();
