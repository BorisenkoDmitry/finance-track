class FieldsMethodsClass {
  normalizeNumberInput(input: number | string) {
    // Удаляем все символы кроме цифр, точек и запятых
    const cleaned = String(input).replace(/[^\d.,]/g, "");

    // Если нет разделителя, возвращаем как есть
    const dotIndex = cleaned.indexOf(".");
    const commaIndex = cleaned.indexOf(",");

    // Поддерживаем один разделитель: если оба есть, используем первый по порядку
    let sepIndex = -1;
    let sepChar = "";
    if (dotIndex !== -1 && commaIndex !== -1) {
      sepIndex = Math.min(dotIndex, commaIndex);
      sepChar = cleaned[sepIndex];
    } else if (dotIndex !== -1) {
      sepIndex = dotIndex;
      sepChar = ".";
    } else if (commaIndex !== -1) {
      sepIndex = commaIndex;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sepChar = ",";
    }

    if (sepIndex === -1) {
      // Нет разделителя
      return cleaned;
    }

    // Разделяем целую и дробную части
    const integerPart = cleaned.slice(0, sepIndex);
    let fractionalPart = cleaned.slice(sepIndex + 1);

    // Оставляем только цифры в дробной части, ограничиваем длину по требованию
    fractionalPart = fractionalPart.replace(/\D/g, "");
    // Например, держим две цифры после разделителя
    fractionalPart = fractionalPart.slice(0, 2);

    // Объединяем и нормализуем в точку
    const normalized = integerPart + "." + fractionalPart;
    // Удаляем лишние ведущие нули в целой части, но оставляем хотя бы '0'
    const parts = normalized.split(".");
    parts[0] = parts[0].replace(/^0+(?!$)/, "") || "0";

    return parts.join(".");
  }

  formatNumber(value: number) {
    return String(value)
      .replace(/\.0+$/, "")
      .replace(/(\.\d*[1-9])0+$/, "$1");
  }
}

export const { normalizeNumberInput, formatNumber } = new FieldsMethodsClass();
