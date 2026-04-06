import { useEffect, useMemo, useState, type FC } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale/ru";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHook";
import { setPeriodDate, setTypeDate } from "../../../stores/globalSlice";
import InputMask from "react-input-mask";
import { X, Calendar } from "lucide-react";

registerLocale("ru", ru);

interface IDateField {
  label?: string;
  options: { isMonth: boolean; isYear: boolean };
  isHideDateControlls?: boolean;
}

type PeriodTab = "today" | "yesterday" | "month" | "quarter" | "year";

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
const startOfYear = (d: Date) => new Date(d.getFullYear(), 0, 1);
const endOfYear = (d: Date) => new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999);
const quarterBounds = (d: Date) => {
  const q = Math.floor(d.getMonth() / 3);
  return { start: new Date(d.getFullYear(), q * 3, 1), end: new Date(d.getFullYear(), q * 3 + 3, 0, 23, 59, 59, 999) };
};

const fmtDate = (d: Date | null) => {
  if (!d) return "";
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
};

const parseDate = (s: string): Date | null => {
  const m = s.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return null;
  const [, dd, mm, yyyy] = m.map(Number);
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
  const d = new Date(yyyy, mm - 1, dd);
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return null;
  return d;
};

const fmtLabel = (s: Date, e: Date) => {
  const f = (d: Date) => d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
  return s.getTime() === e.getTime() || (s.getDate() === e.getDate() && s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear())
    ? f(s) : `${f(s)} – ${f(e)}`;
};

export const DateRangeField: FC<IDateField> = ({ options }) => {
  const { start, end } = useAppSelector((st) => st.global.periodDate);
  const periodStart = useMemo(() => new Date(start), [start]);
  const periodEnd = useMemo(() => new Date(end), [end]);
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<PeriodTab | "custom">("custom");
  const [calKey, setCalKey] = useState(0);
  const [openTo, setOpenTo] = useState<Date>(new Date());
  const [dS, setDS] = useState<Date | null>(periodStart);
  const [dE, setDE] = useState<Date | null>(periodEnd);
  const [fromTxt, setFromTxt] = useState(() => fmtDate(periodStart));
  const [toTxt, setToTxt] = useState(() => fmtDate(periodEnd));

  useEffect(() => {
    if (!open) return;
    setDS(periodStart); setDE(periodEnd); setTab("custom");
    setOpenTo(periodStart); setFromTxt(fmtDate(periodStart)); setToTxt(fmtDate(periodEnd));
    setCalKey((k) => k + 1);
  }, [open, periodStart, periodEnd]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const setDraft = (s: Date, e: Date) => {
    setDS(s); setDE(e); setFromTxt(fmtDate(s)); setToTxt(fmtDate(e));
    setOpenTo(s); setCalKey((k) => k + 1);
  };

  const apply = () => {
    if (!dS || !dE) return;
    const s = dS <= dE ? dS : dE;
    const e = dS <= dE ? dE : dS;
    dispatch(setTypeDate("days"));
    dispatch(setPeriodDate({ start: s.toISOString(), end: e.toISOString() }));
    setOpen(false);
  };

  const presets: { id: PeriodTab; label: string }[] = [
    { id: "today", label: "Сегодня" },
    { id: "yesterday", label: "Вчера" },
    ...(options.isMonth ? [{ id: "month" as PeriodTab, label: "Месяц" }] : []),
    { id: "quarter", label: "Квартал" },
    ...(options.isYear ? [{ id: "year" as PeriodTab, label: "Год" }] : []),
  ];

  const onPreset = (id: PeriodTab) => {
    setTab(id);
    const now = new Date();
    if (id === "today") setDraft(startOfDay(now), endOfDay(now));
    else if (id === "yesterday") { const y = new Date(now); y.setDate(y.getDate() - 1); setDraft(startOfDay(y), endOfDay(y)); }
    else if (id === "month") setDraft(startOfMonth(now), endOfMonth(now));
    else if (id === "quarter") { const q = quarterBounds(now); setDraft(q.start, q.end); }
    else if (id === "year") setDraft(startOfYear(now), endOfYear(now));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-primary-700/40 bg-primary-900/35 px-3 py-2 text-xs font-medium text-grey-100 transition-all hover:border-primary-600/50 sm:text-sm"
      >
        <Calendar size={14} className="text-grey-200/40" />
        {fmtLabel(periodStart, periodEnd)}
      </button>

      {open && (
        <div className="fixed inset-0 z-[2000] flex items-end justify-center bg-popup-overlay/80 backdrop-blur-[3px] sm:items-center">
          <div className="relative flex w-full max-w-lg flex-col rounded-t-3xl border border-primary-700/20 bg-bg-menu/98 backdrop-blur-xl sm:rounded-3xl sm:max-w-[520px] animate-fade-in-up max-h-[90dvh] overflow-hidden">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-primary-700/15 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/10 text-primary-400">
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-grey-0">Выбор периода</h3>
                  <p className="text-[10px] text-grey-200/50">Укажите диапазон дат</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-grey-200/40 transition-colors hover:bg-primary-700/20 hover:text-grey-0">
                <X size={16} />
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-4">
              {/* Presets */}
              <div className="mb-4 flex flex-wrap gap-1.5">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onPreset(p.id)}
                    className={[
                      "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",
                      tab === p.id
                        ? "bg-primary-500/20 text-primary-400 shadow-glow-sm"
                        : "bg-primary-800/30 text-grey-200/50 hover:bg-primary-800/50 hover:text-grey-200/80",
                    ].join(" ")}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Calendar */}
              <div className="period-picker period-picker--compact flex justify-center">
                <DatePicker
                  key={calKey}
                  inline
                  selectsRange
                  shouldCloseOnSelect={false}
                  monthsShown={1}
                  locale="ru"
                  calendarStartDay={1}
                  startDate={dS}
                  endDate={dE}
                  openToDate={openTo}
                  onChange={(dates) => {
                    const [s, e] = dates as [Date | null, Date | null];
                    setTab("custom"); setDS(s); setDE(e);
                    setFromTxt(fmtDate(s)); setToTxt(fmtDate(e));
                    if (s) { setOpenTo(s); setCalKey((k) => k + 1); }
                  }}
                />
              </div>

              {/* Date inputs */}
              <div className="mt-4 flex gap-3">
                <label className="flex flex-1 flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-grey-200/40">От</span>
                  <InputMask
                    mask="99.99.9999" maskChar={null} value={fromTxt}
                    onChange={(e) => {
                      const v = e.target.value; setTab("custom"); setFromTxt(v);
                      const d = parseDate(v); if (!d) return;
                      setDS(d); setOpenTo(d); setCalKey((k) => k + 1);
                      if (dE && d > dE) { setDE(d); setToTxt(fmtDate(d)); }
                    }}
                  >
                    {(ip) => <input {...ip} className="app-input py-2.5 text-center text-sm" />}
                  </InputMask>
                </label>
                <label className="flex flex-1 flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-grey-200/40">До</span>
                  <InputMask
                    mask="99.99.9999" maskChar={null} value={toTxt}
                    onChange={(e) => {
                      const v = e.target.value; setTab("custom"); setToTxt(v);
                      const d = parseDate(v); if (!d) return;
                      setDE(d); setCalKey((k) => k + 1);
                      if (dS && d < dS) { setDS(d); setFromTxt(fmtDate(d)); setOpenTo(d); }
                    }}
                  >
                    {(ip) => <input {...ip} className="app-input py-2.5 text-center text-sm" />}
                  </InputMask>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex shrink-0 items-center gap-2 border-t border-primary-700/15 px-5 py-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border border-primary-700/20 py-2.5 text-sm font-medium text-grey-200/60 transition-all hover:bg-primary-700/15 hover:text-grey-0"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={apply}
                disabled={!dS || !dE}
                className="group relative flex-1 overflow-hidden rounded-xl py-2.5 text-sm font-semibold text-grey-0 transition-all duration-300 hover:shadow-glow-md disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #FF7582 0%, #C56C86 50%, #725A7A 100%)" }}
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative z-10">Применить</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
