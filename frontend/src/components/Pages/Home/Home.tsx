import { ContentHeader } from "../../Layouts/ContentHeader/ContentHeader";
import { ContentMain } from "../../Layouts/ContentMain/ContentMain";
import { NavLink } from "react-router-dom";


export const Home = () => {

  return (
    <>
      <ContentHeader
        className="home"
        title="FINANCE TRACK"
        subtitle={
          <div className="max-w-[760px] text-sm leading-6 text-grey-200/80">
            Единое место для расходов, доходов, бюджета, планов и аналитики. Выбирайте
            период в шапке, фиксируйте операции и получайте понятную картину финансов.
          </div>
        }
      />
      <ContentMain>
        <div className="grid grid-cols-12 gap-6 pb-10">
          {/* Left: content */}
          <div className="col-span-8 flex flex-col gap-6">
            <section className="app-surface-strong p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-grey-200/70">
                    Мини‑инструкция
                  </div>
                  <div className="mt-2 text-xl font-bold tracking-[-0.02em] text-grey-0">
                    Быстрый старт за 2 минуты
                  </div>
                </div>
                <div className="inline-flex flex-wrap gap-2">
                  <span className="rounded-full border border-primary-700/40 bg-primary-900/25 px-3 py-1 text-xs text-grey-200/75">
                    Dark UI
                  </span>
                  <span className="rounded-full border border-primary-700/40 bg-primary-900/25 px-3 py-1 text-xs text-grey-200/75">
                    Периоды
                  </span>
                  <span className="rounded-full border border-primary-700/40 bg-primary-900/25 px-3 py-1 text-xs text-grey-200/75">
                    Аналитика
                  </span>
                </div>
              </div>

              <ol className="mt-5 grid grid-cols-2 gap-4">
                <li className="rounded-2xl border border-primary-700/40 bg-primary-900/20 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-grey-200/70">
                    1. Каталог
                  </div>
                  <div className="mt-2 text-sm text-grey-200/85">
                    Создайте категории расходов/доходов — так таблицы и аналитика будут
                    максимально полезны.
                  </div>
                </li>
                <li className="rounded-2xl border border-primary-700/40 bg-primary-900/20 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-grey-200/70">
                    2. Операции
                  </div>
                  <div className="mt-2 text-sm text-grey-200/85">
                    Добавляйте расходы и доходы, редактируйте строки, используйте фильтры
                    по категории/описанию/цене.
                  </div>
                </li>
                <li className="rounded-2xl border border-primary-700/40 bg-primary-900/20 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-grey-200/70">
                    3. Бюджет
                  </div>
                  <div className="mt-2 text-sm text-grey-200/85">
                    Планируйте лимиты по категориям. Выделяйте строки и переносите бюджет на
                    следующий месяц.
                  </div>
                </li>
                <li className="rounded-2xl border border-primary-700/40 bg-primary-900/20 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-grey-200/70">
                    4. Аналитика
                  </div>
                  <div className="mt-2 text-sm text-grey-200/85">
                    Сравнивайте расходы и доходы, смотрите динамику по периодам и по всем
                    категориям.
                  </div>
                </li>
              </ol>
            </section>

            <section className="app-surface p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-grey-200/70">
                Как пользоваться
              </div>
              <div className="mt-2 text-lg font-bold text-grey-0">Рабочий сценарий</div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-grey-200/85">
                <div className="rounded-2xl border border-primary-700/40 bg-primary-900/20 p-4">
                  <div className="font-semibold text-grey-0">Период</div>
                  <div className="mt-1">
                    В шапке выбирайте диапазон дат — таблицы и аналитика будут строиться по нему.
                  </div>
                </div>
                <div className="rounded-2xl border border-primary-700/40 bg-primary-900/20 p-4">
                  <div className="font-semibold text-grey-0">Чистые данные</div>
                  <div className="mt-1">
                    Используйте понятные описания и правильные категории — это улучшает поиск и
                    отчёты.
                  </div>
                </div>
                <div className="rounded-2xl border border-primary-700/40 bg-primary-900/20 p-4">
                  <div className="font-semibold text-grey-0">Планы</div>
                  <div className="mt-1">
                    Для целей используйте “Планы” — список и календарь помогают контролировать сроки.
                  </div>
                </div>
                <div className="rounded-2xl border border-primary-700/40 bg-primary-900/20 p-4">
                  <div className="font-semibold text-grey-0">Заметки</div>
                  <div className="mt-1">
                    Фиксируйте договорённости, идеи и важные события — всё остаётся рядом с финансами.
                  </div>
                </div>
              </div>
            </section>

            <section className="app-surface p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-grey-200/70">
                Полезные мелочи
              </div>
              <div className="mt-2 text-lg font-bold text-grey-0">Советы</div>
              <ul className="mt-4 grid grid-cols-2 gap-4 text-sm text-grey-200/85">
                <li className="rounded-2xl border border-primary-700/40 bg-primary-900/20 p-4">
                  В таблицах можно выделять строки и выполнять действия массово (где это предусмотрено).
                </li>
                <li className="rounded-2xl border border-primary-700/40 bg-primary-900/20 p-4">
                  Фильтры сверху — “липкие”: они остаются на месте при прокрутке.
                </li>
              </ul>
            </section>
          </div>

          {/* Right: mini landing */}
          <aside className="col-span-4">
            <div className="sticky top-6 z-[1] flex flex-col gap-4">
              <div className="app-surface-strong p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-grey-200/70">
                  Мини‑лендинг
                </div>
                <div className="mt-2 text-lg font-bold text-grey-0">Быстрые разделы</div>
                <div className="mt-4 grid gap-2">
                  <NavLink className="app-icon-btn justify-start px-4 py-3" to="/expenses-and-income">
                    Расходы и доходы
                  </NavLink>
                  <NavLink className="app-icon-btn justify-start px-4 py-3" to="/my-budget">
                    Мой бюджет
                  </NavLink>
                  <NavLink className="app-icon-btn justify-start px-4 py-3" to="/catalogs">
                    Каталог
                  </NavLink>
                  <NavLink className="app-icon-btn justify-start px-4 py-3" to="/planned-list">
                    Планы
                  </NavLink>
                  <NavLink className="app-icon-btn justify-start px-4 py-3" to="/analitic">
                    Аналитика
                  </NavLink>
                  <NavLink className="app-icon-btn justify-start px-4 py-3" to="/notes">
                    Заметки
                  </NavLink>
                </div>
              </div>

              <div className="app-surface p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-grey-200/70">
                  Подсказка
                </div>
                <div className="mt-2 text-sm text-grey-200/85">
                  Если видите, что данные “не те” — сначала проверьте выбранный период в шапке.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </ContentMain>
    </>
  );
};
