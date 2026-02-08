import { useEffect, useMemo, useState, type FC } from "react";

type ResponsiveGuardProps = {
  minWidth?: number;
};

export const ResponsiveGuard: FC<ResponsiveGuardProps> = ({ minWidth = 1200 }) => {
  const [isTooSmall, setIsTooSmall] = useState(false);

  const mq = useMemo(() => `(max-width: ${minWidth - 1}px)`, [minWidth]);

  useEffect(() => {
    const mql = window.matchMedia(mq);
    const apply = () => setIsTooSmall(Boolean(mql.matches));
    apply();

    // Use addEventListener (modern API)
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, [mq]);

  useEffect(() => {
    if (!isTooSmall) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isTooSmall]);

  if (!isTooSmall) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-[color:var(--popup--bg-clr)] backdrop-blur-[6px]">
      <div className="app-surface-strong w-[720px] max-w-[92vw] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-grey-200/70">
              Адаптив в разработке
            </div>
            <div className="mt-2 text-2xl font-bold tracking-[-0.02em] text-grey-0">
              Откройте приложение на большем экране
            </div>
            <div className="mt-2 text-sm leading-6 text-grey-200/80">
              Сейчас интерфейс оптимизирован под ширину{" "}
              <span className="font-semibold text-grey-0">{minWidth}px+</span>. Для
              корректной работы увеличьте окно браузера или откройте приложение на ПК.
            </div>
          </div>

          <div className="rounded-2xl border border-primary-700/40 bg-primary-900/25 px-3 py-2 text-xs text-grey-200/75">
            min: <span className="text-grey-0 font-semibold">{minWidth}px</span>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-primary-700/40 bg-primary-900/20 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-grey-200/70">
            Подсказка
          </div>
          <div className="mt-2 text-sm text-grey-200/85">
            Если вы на телефоне — включите режим «Версия для ПК» или откройте приложение
            на компьютере.
          </div>
        </div>
      </div>
    </div>
  );
};

