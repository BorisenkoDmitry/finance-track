import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale/ru";
import { FieldWrapper } from "../../Wrappers/FieldWrapper/FieldWrapper";
import { IoClose } from "react-icons/io5";
import InputMask from "react-input-mask";
import { Button } from "../Button/Button";

interface IDateField {
  label?: string;
  selected: Date;
  onChange: (date: Date) => void;
  isTimeOn?: boolean;
  isMonth?: boolean;
  disabled?: boolean;
  direction?: "row" | "column";
}

registerLocale("ru", ru);

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
  if (typeof index !== "number" || index < 0 || index > 11) return "";
  return names[index];
}

function formatMaskDate(d: Date) {
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
  if (mm < 1 || mm > 12) return null;
  if (dd < 1 || dd > 31) return null;
  const d = new Date(yyyy, mm - 1, dd, 0, 0, 0, 0);
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return null;
  return d;
}

function formatMaskTime(d: Date) {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function parseMaskTime(s: string): { h: number; m: number } | null {
  const m = s.match(/^(\d{2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const mm = Number(m[2]);
  if (!Number.isFinite(h) || !Number.isFinite(mm)) return null;
  if (h < 0 || h > 23) return null;
  if (mm < 0 || mm > 59) return null;
  return { h, m: mm };
}

export const DateField: FC<IDateField> = ({
  label,
  selected,
  onChange,
  isTimeOn,
  isMonth,
  disabled,
  direction = "row",
}) => {
  const [open, setOpen] = useState(false);
  const [calendarKey, setCalendarKey] = useState(0);
  const [openToDate, setOpenToDate] = useState<Date>(selected);

  const [draft, setDraft] = useState<Date>(selected);
  const [dateText, setDateText] = useState<string>(() => formatMaskDate(selected));
  const [timeText, setTimeText] = useState<string>(() => formatMaskTime(selected));

  useEffect(() => {
    if (!open) return;
    setDraft(selected);
    setDateText(formatMaskDate(selected));
    setTimeText(formatMaskTime(selected));
    setOpenToDate(selected);
    setCalendarKey((k) => k + 1);
  }, [open, selected]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const buttonLabel = useMemo(() => {
    if (isMonth) {
      return draft.toLocaleDateString("ru-RU", { month: "2-digit", year: "numeric" });
    }
    if (isTimeOn) {
      return `${formatMaskDate(draft)} ${formatMaskTime(draft)}`;
    }
    return formatMaskDate(draft);
  }, [draft, isMonth, isTimeOn]);

  const inputClasses = "app-input text-center cursor-pointer select-none";

  const apply = () => {
    const next = new Date(draft);
    if (isMonth) {
      next.setDate(1);
      next.setHours(0, 0, 0, 0);
    } else if (!isTimeOn) {
      next.setHours(0, 0, 0, 0);
    }
    onChange(next);
    setOpen(false);
  };

  const layoutClass = direction === "column" ? "flex flex-col gap-2" : "flex gap-5";

  return (
    <FieldWrapper tagWrapp="div" label={label}>
      <div className={layoutClass}>
        <button
          type="button"
          className={inputClasses}
          disabled={disabled}
          onClick={() => setOpen(true)}
          aria-label="Выбор даты"
        >
          {buttonLabel}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-[color:var(--popup--bg-clr)] backdrop-blur-[3px]">
          <div className="period-picker period-picker--single app-surface-strong relative max-w-[95vw] p-6">
            <button
              type="button"
              className="app-icon-btn absolute right-3 top-3 h-8 w-8 rounded-lg"
              onClick={() => setOpen(false)}
              aria-label="Закрыть"
            >
              <IoClose className="text-[18px]" />
            </button>

            <div className="flex flex-col gap-4">
              <div>
                <DatePicker
                  key={calendarKey}
                  inline
                  locale="ru"
                  calendarStartDay={1}
                  selected={draft}
                  openToDate={openToDate}
                  onChange={(d: Date | null) => {
                    if (!d) return;
                    setDraft(d);
                    setDateText(formatMaskDate(d));
                    setTimeText(formatMaskTime(d));
                    setOpenToDate(d);
                    setCalendarKey((k) => k + 1);
                  }}
                  showMonthYearPicker={Boolean(isMonth)}
                  showTimeSelect={Boolean(isTimeOn) && !isMonth}
                  timeIntervals={15}
                  timeFormat="HH:mm"
                  dateFormat="dd.MM.yyyy HH:mm"
                  showTimeCaption={false}
                  renderMonthContent={(monthIndex) => <div>{shortMonthName(monthIndex)}</div>}
                />
              </div>

              {/* Date & Time inputs + actions */}
              <div className="flex flex-wrap items-end gap-3">
                {!isMonth && (
                  <label className="flex flex-1 flex-col gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-grey-200/40">
                      Дата
                    </span>
                    <InputMask
                      mask="99.99.9999"
                      maskChar={null}
                      value={dateText}
                      onChange={(e) => {
                        const v = e.target.value;
                        setDateText(v);
                        const parsed = parseMaskDate(v);
                        if (!parsed) return;
                        const next = new Date(draft);
                        next.setFullYear(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
                        setDraft(next);
                        setOpenToDate(next);
                        setCalendarKey((k) => k + 1);
                      }}
                    >
                      {(inputProps) => (
                        <input {...inputProps} className="app-input py-2.5 text-center text-sm" />
                      )}
                    </InputMask>
                  </label>
                )}

                {isTimeOn && !isMonth && (
                  <label className="flex w-[100px] flex-col gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-grey-200/40">
                      Время
                    </span>
                    <InputMask
                      mask="99:99"
                      maskChar={null}
                      value={timeText}
                      onChange={(e) => {
                        const v = e.target.value;
                        setTimeText(v);
                        const parsed = parseMaskTime(v);
                        if (!parsed) return;
                        const next = new Date(draft);
                        next.setHours(parsed.h, parsed.m, 0, 0);
                        setDraft(next);
                        setCalendarKey((k) => k + 1);
                      }}
                    >
                      {(inputProps) => (
                        <input {...inputProps} className="app-input py-2.5 text-center text-sm" />
                      )}
                    </InputMask>
                  </label>
                )}
              </div>

              <div className="flex items-center gap-2">
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
                  disabled={disabled}
                  className="group relative flex-1 overflow-hidden rounded-xl py-2.5 text-sm font-semibold text-grey-0 transition-all duration-300 hover:shadow-glow-md disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #FF7582 0%, #C56C86 50%, #725A7A 100%)" }}
                >
                  <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="relative z-10">Применить</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </FieldWrapper>
  );
};
