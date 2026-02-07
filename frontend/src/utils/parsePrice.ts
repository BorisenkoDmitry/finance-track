export function formatPrice(price: number) {
  return (
    new Intl.NumberFormat("ru-RU", {
      maximumFractionDigits: 2,
    }).format(price) + " ₽"
  );
}
