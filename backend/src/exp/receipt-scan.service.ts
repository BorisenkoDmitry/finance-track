import { Injectable, Logger, BadRequestException } from '@nestjs/common';

type ReceiptProduct = {
  name: string;
  price: number;
  count: string;
};

type ScanResult = {
  products: ReceiptProduct[];
  total: number;
};

@Injectable()
export class ReceiptScanService {
  private readonly logger = new Logger(ReceiptScanService.name);
  private readonly apiKey = 'sk-aitunnel-r3DcBa6EccBrCFGfwSzPlDSp1CxMkRls';
  private readonly apiUrl = 'https://api.aitunnel.ru/v1/chat/completions';
  private readonly model = 'gpt-4o-mini';

  async scanReceipt(imageBase64: string): Promise<ScanResult> {
    if (!imageBase64 || imageBase64.length < 100) {
      throw new BadRequestException('Изображение не передано или слишком маленькое');
    }

    const prompt = `Ты — эксперт по распознаванию кассовых чеков из российских магазинов.

Проанализируй фото чека и извлеки ВСЕ товарные позиции.

ВАЖНЫЕ ПРАВИЛА для названий:
- Расшифруй ВСЕ сокращения в полные понятные названия на русском языке
- "МОЛ.ШОКОЛ." → "Молочный шоколад"
- "КУР.ФИЛЕ ОХЛ" → "Куриное филе охлаждённое"
- "Х/Б ИЗД" → "Хлебобулочное изделие"
- "СОК Я.АПЕЛЬС." → "Сок Я апельсиновый"
- "МАК.ИЗД.СПАГЕТТИ" → "Макаронные изделия спагетти"
- "ПАК.МАЙОНЕЗ" → "Пакет майонез"
- "БАНАНЫ ВЕС" → "Бананы весовые"
- Убирай артикулы, штрих-коды, коды товара
- Пиши нормальным регистром, первая буква заглавная
- Если бренд читаем — сохрани его ("Простоквашино", "Барилла")

ПРАВИЛА для данных:
- price — ИТОГОВАЯ цена позиции в рублях (число). Если есть скидка — бери цену ПОСЛЕ скидки
- count — количество или вес ("1 шт", "0.456 кг", "2 шт")
- total — итоговая сумма чека (строка ИТОГО на чеке)

Верни ТОЛЬКО валидный JSON, без markdown-блоков, без пояснений:
{"products":[{"name":"Название","price":123.45,"count":"1 шт"}],"total":1234.56}`;

    try {
      this.logger.log(
        `Scanning receipt, image size: ${(imageBase64.length / 1024).toFixed(0)} KB`,
      );

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`,
                    detail: 'high',
                  },
                },
              ],
            },
          ],
          max_tokens: 4096,
          temperature: 0.05,
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        this.logger.error(
          `AiTunnel API error: ${response.status} ${errBody}`,
        );
        throw new BadRequestException(
          `Ошибка AI сервиса: ${response.status}`,
        );
      }

      const data = (await response.json()) as {
        choices: { message: { content: string } }[];
      };

      const content = data.choices?.[0]?.message?.content ?? '';
      this.logger.log(`AI raw response: ${content.substring(0, 300)}`);

      // Extract JSON — handle markdown fences, extra text
      let jsonStr = content.trim();
      // Remove ```json ... ``` blocks
      const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (fenceMatch) {
        jsonStr = fenceMatch[1].trim();
      }
      // Try to find JSON object if there's extra text
      const jsonObjMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonObjMatch) {
        jsonStr = jsonObjMatch[0];
      }

      let parsed: ScanResult;
      try {
        parsed = JSON.parse(jsonStr);
      } catch (parseErr) {
        this.logger.error(`JSON parse failed: ${parseErr.message}`);
        this.logger.error(`Raw content: ${content}`);
        throw new BadRequestException(
          'Не удалось распознать данные чека. Попробуйте сделать фото ещё раз.',
        );
      }

      const products = (parsed.products || [])
        .filter((p) => p.name && p.price)
        .map((p) => ({
          name: String(p.name).trim(),
          price: Math.round(Number(p.price) * 100) / 100 || 0,
          count: String(p.count || '1 шт').trim(),
        }));

      const total =
        Number(parsed.total) ||
        products.reduce((s, p) => s + p.price, 0);

      this.logger.log(
        `Scanned ${products.length} products, total: ${total}`,
      );

      return { products, total };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error(`Receipt scan failed: ${error.message}`);
      throw new BadRequestException(
        'Ошибка при обработке чека. Попробуйте ещё раз.',
      );
    }
  }
}
