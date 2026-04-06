export type OperationType = "expense" | "income" | "transfer";

export type BankOperation = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: OperationType;
  category: string;
  mcc: string;
  cardNumber: string;
  cashback: number;
  status: "completed" | "pending" | "declined";
};

export type BankInfo = {
  id: string;
  name: string;
  logo: string;
  color: string;
  accent: string;
};

export const banks: BankInfo[] = [
  {
    id: "tinkoff",
    name: "Т-Банк",
    logo: "T",
    color: "#FFDD2D",
    accent: "rgba(255, 221, 45, 0.15)",
  },
  {
    id: "sber",
    name: "Сбербанк",
    logo: "C",
    color: "#21A038",
    accent: "rgba(33, 160, 56, 0.15)",
  },
  {
    id: "alfa",
    name: "Альфа-Банк",
    logo: "A",
    color: "#EF3124",
    accent: "rgba(239, 49, 36, 0.15)",
  },
];

const descriptions = [
  "Пятёрочка",
  "Яндекс.Такси",
  "Ozon",
  "Wildberries",
  "Перекрёсток",
  "Магнит",
  "Лента",
  "DNS",
  "М.Видео",
  "IKEA",
  "Starbucks",
  "KFC",
  "McDonald's",
  "Аптека Горздрав",
  "РЖД Билеты",
  "Яндекс.Плюс",
  "Netflix",
  "Steam",
  "ЖКХ Оплата",
  "МТС",
  "Мегафон",
  "Ростелеком",
  "АЗС Лукойл",
  "АЗС Газпром",
  "Спортмастер",
  "H&M",
  "Zara",
  "Книжный Лабиринт",
  "Аптека Ригла",
  "Delivery Club",
];

const categories = [
  "Продукты",
  "Транспорт",
  "Маркетплейсы",
  "Маркетплейсы",
  "Продукты",
  "Продукты",
  "Продукты",
  "Электроника",
  "Электроника",
  "Дом и ремонт",
  "Кафе и рестораны",
  "Кафе и рестораны",
  "Кафе и рестораны",
  "Здоровье",
  "Транспорт",
  "Подписки",
  "Подписки",
  "Развлечения",
  "ЖКХ",
  "Связь",
  "Связь",
  "Связь",
  "Авто",
  "Авто",
  "Одежда и спорт",
  "Одежда и спорт",
  "Одежда и спорт",
  "Книги",
  "Здоровье",
  "Кафе и рестораны",
];

const mccCodes = [
  "5411",
  "4121",
  "5399",
  "5399",
  "5411",
  "5411",
  "5411",
  "5732",
  "5732",
  "5712",
  "5814",
  "5814",
  "5814",
  "5912",
  "4112",
  "5815",
  "5815",
  "7994",
  "4900",
  "4812",
  "4812",
  "4812",
  "5541",
  "5541",
  "5941",
  "5651",
  "5651",
  "5942",
  "5912",
  "5814",
];

function randomDate(start: Date, end: Date): string {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString();
}

function randomAmount(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function generateMockOperations(
  startDate: string,
  endDate: string,
  count = 40
): BankOperation[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const ops: BankOperation[] = [];

  const incomeDescriptions = [
    "Зарплата", "Перевод от Иванов А.", "Возврат средств", "Кешбэк за март",
    "Перевод СБП", "Дивиденды", "Фриланс оплата", "Возврат товара Ozon",
  ];
  const transferDescriptions = [
    "Перевод между счетами", "Перевод на накопительный", "Перевод на вклад",
  ];

  for (let i = 0; i < count; i++) {
    const typeRoll = Math.random();
    const statusRoll = Math.random();
    const isIncome = typeRoll > 0.82;
    const isTransfer = !isIncome && typeRoll > 0.75;

    let description: string;
    let category: string;
    let mcc: string;
    let amount: number;
    let type: OperationType;
    let cashback = 0;

    if (isIncome) {
      type = "income";
      description = incomeDescriptions[Math.floor(Math.random() * incomeDescriptions.length)];
      category = "Пополнения";
      mcc = "6012";
      amount = randomAmount(1000, 80000);
    } else if (isTransfer) {
      type = "transfer";
      description = transferDescriptions[Math.floor(Math.random() * transferDescriptions.length)];
      category = "Переводы";
      mcc = "4829";
      amount = -randomAmount(500, 30000);
    } else {
      type = "expense";
      const idx = Math.floor(Math.random() * descriptions.length);
      description = descriptions[idx];
      category = categories[idx];
      mcc = mccCodes[idx];
      amount = -randomAmount(50, 15000);
      cashback = Math.random() > 0.6 ? Math.round(Math.abs(amount) * 0.01) : 0;
    }

    ops.push({
      id: `op-${i}-${Date.now()}`,
      date: randomDate(start, end),
      description,
      amount,
      type,
      category,
      mcc,
      cardNumber: `**** ${1000 + Math.floor(Math.random() * 9000)}`,
      cashback,
      status: statusRoll > 0.92 ? "declined" : statusRoll > 0.85 ? "pending" : "completed",
    });
  }

  return ops.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
