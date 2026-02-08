# Исправления TypeScript ошибок

## Исправленные ошибки:

### 1. `api.ts` - AxiosRequestConfig
**Проблема:** `AxiosRequestConfig` не экспортируется из axios в новых версиях
**Решение:** Убрал явную типизацию, добавил проверку `config.headers` перед использованием

### 2. `PlannedShutDownForm.tsx` - Тип price
**Проблема:** `parseFloat(currentItem.planPrice)` - parseFloat принимает только string, но planPrice это number
**Решение:** Заменил на `Number(currentItem.planPrice) || 0` - работает с любым типом

### 3. `catalogsSlice.ts` - Индексация state
**Проблема:** TypeScript не может определить тип при индексации `state[key]`
**Решение:** Добавил явную проверку типа ключа перед присваиванием:
```typescript
if (key === "typeInc" || key === "categoryExpList" || key === "sourceIncList" || key === "methodInc") {
  state[key] = ...
}
```

### 4. `financeSlice.ts` - Несоответствие типов fillMonthDays
**Проблема:** `fillMonthDays` возвращает `{ total: number; day: number }[]`, но ожидается `{ total: string; day: Date }[]`
**Решение:** Добавил преобразование результата:
```typescript
financeAnalitic: filledExps.map((item) => ({
  total: String(item.total),
  day: new Date(year, month, item.day),
}))
```

## Проверка сборки

Запустите сборку:
```cmd
cd frontend
npm run build
```

Или используйте bat-файл:
```cmd
frontend\build-check.bat
```

Все ошибки должны быть исправлены. Логика работы приложения не изменена.
