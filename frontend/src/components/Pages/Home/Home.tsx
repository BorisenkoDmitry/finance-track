import { useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHook";
import { getFinanceRemaining } from "../../../stores/financeSlice/financeSlice";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  BarChart3,
  Wallet,
  StickyNote,
  Target,
  Building2,
  LayoutGrid,
} from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(n);

export const Home = () => {
  const dispatch = useAppDispatch();
  const { remainingFinance, isLoadingFinanceRem } = useAppSelector((st) => st.finance);
  const user = useAppSelector((st) => st.user.user);
  const periodDate = useAppSelector((st) => st.global.periodDate);

  useEffect(() => {
    dispatch(getFinanceRemaining());
  }, [dispatch, periodDate]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 6) return "Доброй ночи";
    if (h < 12) return "Доброе утро";
    if (h < 18) return "Добрый день";
    return "Добрый вечер";
  }, []);

  const balanceColor = remainingFinance > 0 ? "text-green-400" : remainingFinance < 0 ? "text-red-400" : "text-grey-0";

  return (
    <div className="flex flex-col gap-6 pb-10">

      {/* ═══ HERO with animated logo ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-primary-700/20 p-6 sm:p-10">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-32 -top-32 h-[400px] w-[400px] rounded-full bg-[#6359e9]/8 blur-[120px] animate-pulse-soft" />
          <div className="absolute -right-20 -bottom-20 h-[300px] w-[300px] rounded-full bg-[#2BD2BE]/6 blur-[100px] animate-pulse-soft" style={{ animationDelay: "1.5s" }} />
          <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/5 blur-[80px] animate-pulse-soft" style={{ animationDelay: "3s" }} />
        </div>

        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-10">
          {/* Animated Logo */}
          <div className="relative shrink-0">
            <AnimatedLogo />
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
            <p className="text-xs font-medium text-grey-200/50 animate-fade-in">{greeting},</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-grey-0 animate-fade-in-up sm:text-4xl">
              {user.user?.name ?? "Пользователь"}
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-grey-200/50 animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}>
              <span className="text-gradient font-semibold">Finance Track</span> — ваш персональный финансовый помощник.
              Контролируйте расходы, планируйте бюджет, отслеживайте доходы и достигайте финансовых целей.
            </p>

            {/* Balance */}
            <div className="mt-6 animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-grey-200/40">Общий баланс</p>
              {isLoadingFinanceRem ? (
                <div className="mt-2 skeleton h-12 w-48" />
              ) : (
                <p className={`mt-1 text-4xl font-extrabold tabular-nums tracking-tight sm:text-5xl ${balanceColor}`}>
                  {fmt(remainingFinance)}
                  <span className="ml-2 text-lg font-medium text-grey-200/40">₽</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Navigation cards ═══ */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {[
          { icon: <TrendingDown size={20} />, title: "Расходы", desc: "Учёт трат", to: "/expenses-and-income/spend", color: "#FF7582", delay: 0 },
          { icon: <TrendingUp size={20} />, title: "Доходы", desc: "Поступления", to: "/expenses-and-income/income", color: "#4ade80", delay: 1 },
          { icon: <Wallet size={20} />, title: "Бюджет", desc: "Лимиты", to: "/my-budget", color: "#355C7D", delay: 2 },
          { icon: <BarChart3 size={20} />, title: "Аналитика", desc: "Графики", to: "/analitic", color: "#a78bfa", delay: 3 },
          { icon: <LayoutGrid size={20} />, title: "Каталог", desc: "Категории", to: "/catalogs", color: "#C56C86", delay: 4 },
          { icon: <Target size={20} />, title: "Планы", desc: "Цели", to: "/planned-list", color: "#fbbf24", delay: 5 },
          { icon: <StickyNote size={20} />, title: "Заметки", desc: "Записи", to: "/notes", color: "#c084fc", delay: 6 },
          { icon: <Building2 size={20} />, title: "Интеграции", desc: "Банки", to: "/integrations", color: "#2dd4bf", delay: 7 },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="group flex flex-col gap-3 rounded-2xl border border-primary-700/15 p-4 transition-all duration-300 hover:border-primary-700/30 hover:shadow-glow-sm animate-fade-in-up active:scale-[0.97]"
            style={{ animationDelay: `${item.delay * 0.06}s`, animationFillMode: "backwards" }}
          >
            <div className="flex items-center justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${item.color}15`, color: item.color }}
              >
                {item.icon}
              </div>
              <ArrowRight size={14} className="text-grey-200/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-grey-200/50" />
            </div>
            <div>
              <p className="text-sm font-semibold text-grey-0">{item.title}</p>
              <p className="text-[11px] text-grey-200/40">{item.desc}</p>
            </div>
          </NavLink>
        ))}
      </div>

      {/* ═══ About section ═══ */}
      <section className="rounded-3xl border border-primary-700/15 p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: "0.5s", animationFillMode: "backwards" }}>
        <h2 className="text-lg font-bold text-grey-0">Возможности</h2>
        <p className="mt-1 text-xs text-grey-200/40">Всё для управления личными финансами</p>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Мгновенный учёт", desc: "Добавляйте расходы и доходы в пару кликов с привязкой к категориям", color: "#FF7582" },
            { title: "Умный бюджет", desc: "Устанавливайте лимиты и отслеживайте в реальном времени — сэкономлено или превышено", color: "#4ade80" },
            { title: "Визуальная аналитика", desc: "Графики трендов, сравнение доходов и расходов, распределение по категориям", color: "#a78bfa" },
            { title: "Финансовые планы", desc: "Ставьте цели на крупные покупки и отслеживайте прогресс накоплений", color: "#fbbf24" },
            { title: "Банковский импорт", desc: "Загружайте выписки из банков и автоматически привязывайте к категориям", color: "#2dd4bf" },
            { title: "Заметки", desc: "Храните финансовые идеи, договорённости и чек-листы рядом с цифрами", color: "#c084fc" },
          ].map((f) => (
            <div key={f.title} className="flex gap-3">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: f.color }} />
              <div>
                <p className="text-sm font-medium text-grey-0">{f.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-grey-200/40">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

/* ═══ Animated Logo ═══ */
const AnimatedLogo = () => (
  <div className="relative h-[140px] w-[140px] sm:h-[180px] sm:w-[180px]">
    {/* Outer rotating ring */}
    <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
      <svg viewBox="0 0 180 180" className="h-full w-full">
        <circle cx="90" cy="90" r="86" fill="none" stroke="url(#ringGrad)" strokeWidth="1" strokeDasharray="8 12" opacity="0.3" />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="180" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6359e9" />
            <stop offset="100%" stopColor="#2BD2BE" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    {/* Inner rotating ring (reverse) */}
    <div className="absolute inset-3 animate-[spin_15s_linear_infinite_reverse]">
      <svg viewBox="0 0 160 160" className="h-full w-full">
        <circle cx="80" cy="80" r="76" fill="none" stroke="#2BD2BE" strokeWidth="0.5" strokeDasharray="4 16" opacity="0.2" />
      </svg>
    </div>

    {/* Main circle */}
    <div className="absolute inset-6 sm:inset-8">
      <svg viewBox="0 0 120 120" className="h-full w-full drop-shadow-[0_0_30px_rgba(99,89,233,0.3)]">
        <defs>
          <linearGradient id="heroLogoGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6359e9" />
            <stop offset="100%" stopColor="#2BD2BE" />
          </linearGradient>
          <linearGradient id="heroLogoBg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7c74ef" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#2BD2BE" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle cx="60" cy="60" r="58" fill="url(#heroLogoBg)" stroke="url(#heroLogoGrad)" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="48" fill="#0b0a22" fillOpacity="0.9" />

        {/* F as a face character */}
        {/* Head (top bar) — wide rounded rectangle */}
        <rect
          x="26" y="28" width="30" height="20" rx="10" ry="10"
          fill="none" stroke="url(#heroLogoGrad)" strokeWidth="1.5"
          className="animate-[drawLetter_1.5s_ease-out_0.5s_both]"
          strokeDasharray="100" strokeDashoffset="100"
        />
        <rect
          x="26" y="28" width="30" height="20" rx="10" ry="10"
          fill="url(#heroLogoGrad)"
          className="animate-[fadeIn_0.6s_ease-out_1.8s_both]"
        />

        {/* Body (vertical bar) */}
        <rect
          x="37" y="48" width="8" height="26" rx="4"
          fill="none" stroke="url(#heroLogoGrad)" strokeWidth="1.5"
          className="animate-[drawLetter_1s_ease-out_1s_both]"
          strokeDasharray="80" strokeDashoffset="80"
        />
        <rect
          x="37" y="48" width="8" height="26" rx="4"
          fill="url(#heroLogoGrad)"
          className="animate-[fadeIn_0.6s_ease-out_2s_both]"
        />

        {/* Nose (middle bar) — small bump */}
        <rect
          x="45" y="52" width="10" height="6" rx="3"
          fill="none" stroke="url(#heroLogoGrad)" strokeWidth="1.5"
          className="animate-[drawLetter_0.8s_ease-out_1.3s_both]"
          strokeDasharray="40" strokeDashoffset="40"
        />
        <rect
          x="45" y="52" width="10" height="6" rx="3"
          fill="url(#heroLogoGrad)"
          className="animate-[fadeIn_0.6s_ease-out_2.1s_both]"
        />

        {/* === EYES === */}
        {/* Left eye — white sclera */}
        <ellipse cx="36" cy="38" rx="5" ry="5.5" fill="white" className="animate-[popIn_0.4s_ease-out_2.3s_both]" />
        {/* Right eye — white sclera */}
        <ellipse cx="50" cy="38" rx="5" ry="5.5" fill="white" className="animate-[popIn_0.4s_ease-out_2.4s_both]" />
        {/* Left pupil */}
        <g className="animate-[lookAround_6s_ease-in-out_3s_infinite]">
          <circle cx="35" cy="38.5" r="2.5" fill="#000" />
        </g>
        {/* Right pupil */}
        <g className="animate-[lookAroundAlt_6s_ease-in-out_3s_infinite]">
          <circle cx="51" cy="38.5" r="2.5" fill="#000" />
        </g>
        {/* Blink — eyelids */}
        <ellipse cx="36" cy="38" rx="5.3" ry="5.8" fill="url(#heroLogoGrad)" className="animate-[blink_4s_ease-in-out_3.5s_infinite]" />
        <ellipse cx="50" cy="38" rx="5.3" ry="5.8" fill="url(#heroLogoGrad)" className="animate-[blink_4s_ease-in-out_3.8s_infinite]" />

        {/* Smile */}
        <path
          d="M36 44 Q41 48 46 44"
          fill="none" stroke="#0b0a22" strokeWidth="1.5" strokeLinecap="round"
          className="animate-[fadeIn_0.5s_ease-out_2.8s_both]"
        />

        {/* T letter — wide crossbar + tall stem, rounded, with sunglasses */}

        {/* Crossbar — wide horizontal bar (the T shape) */}
        <rect
          x="58" y="30" width="34" height="8" rx="4"
          fill="none" stroke="#2BD2BE" strokeWidth="1.5"
          className="animate-[drawLetter_1.5s_ease-out_0.7s_both]"
          strokeDasharray="90" strokeDashoffset="90"
        />
        <rect
          x="58" y="30" width="34" height="8" rx="4"
          fill="#2BD2BE"
          className="animate-[fadeIn_0.6s_ease-out_2s_both]"
        />

        {/* Stem — centered vertical bar */}
        <rect
          x="71" y="38" width="8" height="36" rx="4"
          fill="none" stroke="#2BD2BE" strokeWidth="1.5"
          className="animate-[drawLetter_1.2s_ease-out_1s_both]"
          strokeDasharray="90" strokeDashoffset="90"
        />
        <rect
          x="71" y="38" width="8" height="36" rx="4"
          fill="#2BD2BE"
          className="animate-[fadeIn_0.6s_ease-out_2.2s_both]"
        />

        {/* Crown on top of crossbar */}
        <path
          d="M67 30 L69 24 L72 28 L75 22 L78 28 L81 24 L83 30"
          fill="#fbbf24" stroke="#fbbf24" strokeWidth="0.5" strokeLinejoin="round"
          className="animate-[popIn_0.4s_ease-out_2.3s_both]"
        />
        <circle cx="72" cy="25" r="0.8" fill="#fff" opacity="0.5" className="animate-[fadeIn_0.3s_ease-out_2.7s_both]" />
        <circle cx="78" cy="25" r="0.6" fill="#fff" opacity="0.4" className="animate-[fadeIn_0.3s_ease-out_2.8s_both]" />

        {/* Sunglasses on the crossbar */}
        <rect x="62" y="31.5" width="7" height="5" rx="2.5" fill="#0b0a22" className="animate-[popIn_0.3s_ease-out_2.5s_both]" />
        <rect x="81" y="31.5" width="7" height="5" rx="2.5" fill="#0b0a22" className="animate-[popIn_0.3s_ease-out_2.6s_both]" />
        {/* Bridge */}
        <path d="M69 34 L81 34" stroke="#0b0a22" strokeWidth="1.5" strokeLinecap="round" className="animate-[fadeIn_0.3s_ease-out_2.6s_both]" />
        {/* Glare */}
        <rect x="63.5" y="32.5" width="2.5" height="1.5" rx="0.7" fill="rgba(255,255,255,0.2)" className="animate-[fadeIn_0.3s_ease-out_2.8s_both]" />
        <rect x="82.5" y="32.5" width="2.5" height="1.5" rx="0.7" fill="rgba(255,255,255,0.2)" className="animate-[fadeIn_0.3s_ease-out_2.8s_both]" />

        {/* Chart line — draws itself */}
        <path
          d="M20 95 L35 88 L50 92 L65 82 L80 78 L95 70"
          stroke="#2BD2BE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.7"
          className="animate-[drawLine_1.5s_ease-out_2.5s_both]"
          strokeDasharray="100"
          strokeDashoffset="100"
        />
        <circle cx="95" cy="70" r="3" fill="#2BD2BE" opacity="0" className="animate-[fadeIn_0.4s_ease-out_3.8s_both]" />
      </svg>
    </div>

    {/* Floating coins */}
    <div className="absolute -right-2 top-2 animate-[float_3s_ease-in-out_infinite] sm:-right-3 sm:top-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2BD2BE] text-sm font-bold text-[#0b0a22] shadow-[0_0_20px_rgba(43,210,190,0.4)] sm:h-12 sm:w-12">
        $
      </div>
    </div>
    <div className="absolute -left-1 bottom-4 animate-[float_4s_ease-in-out_1s_infinite] sm:-left-2 sm:bottom-6">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6359e9] text-[10px] font-bold text-white shadow-[0_0_15px_rgba(99,89,233,0.4)] sm:h-8 sm:w-8">
        ₽
      </div>
    </div>
    <div className="absolute bottom-0 right-6 animate-[float_3.5s_ease-in-out_2s_infinite]">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500/80 text-[9px] font-bold text-white shadow-[0_0_12px_rgba(255,117,130,0.3)]">
        €
      </div>
    </div>
  </div>
);
