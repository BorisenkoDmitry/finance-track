import { useEffect, useMemo, useRef, useState, type FC } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale/ru";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHook";
import {
  setPeriodDate,
  setTypeDate,
} from "../../../stores/globalSlice";
import { FieldWrapper } from "../../Wrappers/FieldWrapper/FieldWrapper";
import { Button } from "../Button/Button";
import { IoClose } from "react-icons/io5";
import InputMask from "react-input-mask";

registerLocale("ru", ru);

interface IDateField {
  label?: string;
  options: {
    isMonth: boolean;
    isYear: boolean;
  };
  isHideDateControlls?: boolean;
}

export type TypeDates = "days" | "months" | "years";

function shortMonthName(index: number) {
  const names = [
    "янв.", // 0
    "февр.", // 1
    "март", // 2
    "апр.", // 3
    "май", // 4
    "июн.", // 5
    "июл.", // 6
    "авг.", // 7
    "сен.", // 8
    "окт.", // 9
    "нбр.", // 10
    "дек.", // 11
  ];
  // Если нужна строгая 0..11 проверка
  if (typeof index !== "number" || index < 0 || index > 11) {
    return "";
  }
  return names[index];
}

type PeriodTab = "today" | "yesterday" | "month" | "quarter" | "year";

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function endOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

function startOfYear(d: Date) {
  return new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);
}

function endOfYear(d: Date) {
  return new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999);
}

function quarterBounds(d: Date) {
  const q = Math.floor(d.getMonth() / 3); // 0..3
  const start = new Date(d.getFullYear(), q * 3, 1, 0, 0, 0, 0);
  const end = new Date(d.getFullYear(), q * 3 + 3, 0, 23, 59, 59, 999);
  return { start, end };
}

function formatPeriodLabel(type: TypeDates, start: Date, end: Date) {
  if (type === "months") {
    return start.toLocaleDateString("ru-RU", { month: "2-digit", year: "numeric" });
  }
  if (type === "years") {
    return String(start.getFullYear());
  }

  const same =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  const fmt = (d: Date) =>
    d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });

  return same ? fmt(start) : `${fmt(start)} – ${fmt(end)}`;
}

function formatMaskDate(d: Date | null) {
  if (!d) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = String(d.getFullYear());
  return `${dd}.${mm}.${yyyy}`;
}

function parseMaskDate(s: string): Date | null {
  const m = s.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return null;
  const dd = Number(m[1]);
  const mm = Number(m[2]);
  const yyyy = Number(m[3]);
  if (!Number.isFinite(dd) || !Number.isFinite(mm) || !Number.isFinite(yyyy)) return null;
  if (mm < 1 || mm > 12) return null;
  if (dd < 1 || dd > 31) return null;
  const d = new Date(yyyy, mm - 1, dd, 0, 0, 0, 0);
  // Validate overflow (e.g. 31.02.2026)
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return null;
  return d;
}

export const DateRangeField: FC<IDateField> = ({ label, options }) => {
  const { start, end } = useAppSelector((st) => st.global.periodDate);
  const periodStart = useMemo(() => new Date(start), [start]);
  const periodEnd = useMemo(() => new Date(end), [end]);

  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const [tab, setTab] = useState<PeriodTab | "custom">("custom");
  const [openToDate, setOpenToDate] = useState<Date>(new Date());
  const [calendarKey, setCalendarKey] = useState(0);

  // Draft state (we apply to store only on "Apply")
  const [draftStart, setDraftStart] = useState<Date | null>(periodStart);
  const [draftEnd, setDraftEnd] = useState<Date | null>(periodEnd);
  const [fromText, setFromText] = useState<string>(() => formatMaskDate(periodStart));
  const [toText, setToText] = useState<string>(() => formatMaskDate(periodEnd));

  // When opening - sync draft from store
  useEffect(() => {
    if (!open) return;
    setDraftStart(periodStart);
    setDraftEnd(periodEnd);
    setTab("custom");
    setOpenToDate(periodStart ?? new Date());
    setFromText(formatMaskDate(periodStart));
    setToText(formatMaskDate(periodEnd));
    setCalendarKey((k) => k + 1);
  }, [open, periodEnd, periodStart]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const labelValue = useMemo(() => {
    // Always show an explicit range label in the header (matches "От/До" inputs UX)
    return formatPeriodLabel("days", periodStart, periodEnd);
  }, [periodEnd, periodStart]);

  const inputClasses = "app-input text-center cursor-pointer select-none";

  const tabs = useMemo(() => {
    const all: Array<{ id: PeriodTab; label: string; visible: boolean }> = [
      { id: "today", label: "сегодня", visible: true },
      { id: "yesterday", label: "вчера", visible: true },
      { id: "month", label: "месяц", visible: options.isMonth },
      { id: "quarter", label: "квартал", visible: true },
      { id: "year", label: "год", visible: options.isYear },
    ];
    // Previously this prop hid month/year radio. For the new picker we keep presets visible.
    return all.filter((t) => t.visible);
  }, [options.isMonth, options.isYear]);

  const setDraftPeriod = (_nextType: TypeDates, start: Date, end: Date) => {
    setDraftStart(start);
    setDraftEnd(end);
    setFromText(formatMaskDate(start));
    setToText(formatMaskDate(end));
    setOpenToDate(start);
    setCalendarKey((k) => k + 1);
  };

  const applyDraft = () => {
    if (!draftStart || !draftEnd) return;
    const s = draftStart <= draftEnd ? draftStart : draftEnd;
    const e = draftStart <= draftEnd ? draftEnd : draftStart;
    dispatch(setTypeDate("days"));
    dispatch(setPeriodDate({ start: s.toISOString(), end: e.toISOString() }));
    setOpen(false);
  };

  return (
    <FieldWrapper tagWrapp="div" label={label}>
      <div ref={rootRef} className="relative">
        <button
          type="button"
          className={inputClasses}
          onClick={() => setOpen((v) => !v)}
          aria-label="Выбор периода"
        >
          {labelValue}
        </button>

        {open && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-[color:var(--popup--bg-clr)] backdrop-blur-[3px]">
            <div className="period-picker period-picker--range app-surface-strong relative w-[980px] max-w-[95vw] p-4">
              <button
                type="button"
                className="app-icon-btn absolute right-3 top-3 h-10 w-10 rounded-full"
                onClick={() => setOpen(false)}
                aria-label="Закрыть"
              >
                <IoClose className="text-[22px]" />
              </button>

              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-2 pr-12 px-[50px]">
                {tabs.map((t) => {
                  const active = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      className={[
                        "rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider",
                        "border transition-colors duration-150",
                        active
                          ? "border-primary-500/60 bg-primary-500/15 text-grey-0"
                          : "border-primary-700/40 bg-primary-900/20 text-grey-200 hover:bg-primary-900/40 hover:text-grey-0",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50",
                      ].join(" ")}
                      onClick={() => {
                        setTab(t.id);
                        const now = new Date();

                        if (t.id === "today") {
                          setDraftPeriod("days", startOfDay(now), endOfDay(now));
                        } else if (t.id === "yesterday") {
                          const y = new Date(now);
                          y.setDate(y.getDate() - 1);
                          setDraftPeriod("days", startOfDay(y), endOfDay(y));
                        } else if (t.id === "month") {
                          setDraftPeriod("days", startOfMonth(now), endOfMonth(now));
                        } else if (t.id === "year") {
                          setDraftPeriod("days", startOfYear(now), endOfYear(now));
                        } else if (t.id === "quarter") {
                          const q = quarterBounds(now);
                          setDraftPeriod("days", q.start, q.end);
                        }
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 grid grid-cols-12 gap-4">
                {/* Calendar */}
                <div className="col-span-12">
                  <DatePicker
                    key={calendarKey}
                    inline
                    selectsRange
                    shouldCloseOnSelect={false}
                    monthsShown={2}
                    locale="ru"
                    calendarStartDay={1}
                    startDate={draftStart}
                    endDate={draftEnd}
                    openToDate={openToDate}
                    onChange={(dates) => {
                      const [start, end] = Array.isArray(dates)
                        ? (dates as [Date | null, Date | null])
                        : ([dates as Date | null, null] as [Date | null, Date | null]);
                      setTab("custom");
                      setDraftStart(start);
                      setDraftEnd(end);
                      setFromText(formatMaskDate(start));
                      setToText(formatMaskDate(end));
                      if (start) {
                        setOpenToDate(start);
                        // Ensure the calendar view follows the selected start date
                        setCalendarKey((k) => k + 1);
                      }
                    }}
                    renderMonthContent={(props) => <div>{shortMonthName(props)}</div>}
                  />
                </div>

                {/* Footer actions */}
              <div className="col-span-12 flex flex-wrap items-center justify-between gap-3 px-[50px] sticky bottom-[-20px] z-[1] bg-primary-900">
                  <div className="flex flex-wrap items-end gap-3">
                    <label className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-grey-200/80">
                        От
                      </span>
                      <InputMask
                        mask="99.99.9999"
                        maskChar={null}
                        value={fromText}
                        onChange={(e) => {
                          const v = e.target.value;
                          setTab("custom");
                          setFromText(v);
                          const d = parseMaskDate(v);
                          if (!d) return;
                          setDraftStart(d);
                          setOpenToDate(d);
                          setCalendarKey((k) => k + 1);
                          if (draftEnd && d > draftEnd) {
                            setDraftEnd(d);
                            setToText(formatMaskDate(d));
                          }
                        }}
                      >
                        {(inputProps) => (
                          <input {...inputProps} className="app-input w-[180px] text-center" />
                        )}
                      </InputMask>
                    </label>

                    <label className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-grey-200/80">
                        До
                      </span>
                      <InputMask
                        mask="99.99.9999"
                        maskChar={null}
                        value={toText}
                        onChange={(e) => {
                          const v = e.target.value;
                          setTab("custom");
                          setToText(v);
                          const d = parseMaskDate(v);
                          if (!d) return;
                          setDraftEnd(d);
                          setCalendarKey((k) => k + 1);
                          if (draftStart && d < draftStart) {
                            setDraftStart(d);
                            setFromText(formatMaskDate(d));
                            setOpenToDate(d);
                          }
                        }}
                      >
                        {(inputProps) => (
                          <input {...inputProps} className="app-input w-[180px] text-center" />
                        )}
                      </InputMask>
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      theme="grey"
                      onClick={() => setOpen(false)}
                      type="button"
                    >
                      Отмена
                    </Button>
                    <Button
                      theme="green"
                      onClick={applyDraft}
                      type="button"
                      disabled={!draftStart || !draftEnd}
                    >
                      Применить
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </FieldWrapper>
  );
};
