import {
    AlertTriangle,
    ArrowDownRight,
    ArrowUpRight,
    CheckCircle2,
    Info,
    Lightbulb,
    TrendingUp,
    WalletCards,
} from "lucide-react";

import type {
    FinancialInsight,
} from "../../services/financialInsightApi";

interface FinancialInsightCardProps {
    insight: FinancialInsight;
    featured?: boolean;
}

const severityConfig = {
    INFO: {
        icon: Info,
        label: "Information",
        iconClass: "text-sky-300",
        iconBg: "border-sky-400/15 bg-sky-400/[0.08]",
        border: "border-sky-400/[0.10]",
        glow: "bg-sky-500/[0.07]",
        accent: "bg-sky-400",
        text: "text-sky-300",
    },

    WARNING: {
        icon: AlertTriangle,
        label: "Needs attention",
        iconClass: "text-amber-300",
        iconBg: "border-amber-400/15 bg-amber-400/[0.08]",
        border: "border-amber-400/[0.10]",
        glow: "bg-amber-500/[0.07]",
        accent: "bg-amber-400",
        text: "text-amber-300",
    },

    SUCCESS: {
        icon: CheckCircle2,
        label: "Looking good",
        iconClass: "text-emerald-300",
        iconBg: "border-emerald-400/15 bg-emerald-400/[0.08]",
        border: "border-emerald-400/[0.10]",
        glow: "bg-emerald-500/[0.07]",
        accent: "bg-emerald-400",
        text: "text-emerald-300",
    },
};

const typeConfig = {
    BUDGET: {
        label: "Budget",
        icon: WalletCards,
    },

    SAVINGS: {
        label: "Savings",
        icon: CheckCircle2,
    },

    SPENDING: {
        label: "Spending",
        icon: ArrowUpRight,
    },

    INCOME: {
        label: "Income",
        icon: TrendingUp,
    },
};

export default function FinancialInsightCard({
                                                 insight,
                                                 featured = false,
                                             }: FinancialInsightCardProps) {
    const severity =
        severityConfig[insight.severity as keyof typeof severityConfig] ??
        severityConfig.INFO;

    const SeverityIcon = severity.icon;

    const type =
        typeConfig[insight.type as keyof typeof typeConfig] ?? {
            label: insight.type,
            icon: Lightbulb,
        };

    const TypeIcon = type.icon;

    const percentage = Number(insight.percentage) || 0;
    const amount = Number(insight.amount) || 0;

    const isPositive =
        insight.severity === "SUCCESS" ||
        (insight.type === "SAVINGS" && percentage > 0);

    const progressWidth = Math.min(
        Math.max(Math.abs(percentage), 0),
        100
    );

    return (
        <article
            className={`
                group relative overflow-hidden
                rounded-3xl
                border
                ${severity.border}
                bg-[#0c0e13]
                transition-all duration-300
                hover:-translate-y-1
                hover:border-white/[0.12]
                hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                ${featured ? "min-h-[290px]" : "min-h-[290px]"}
            `}
        >
            {/* =====================================================
                BACKGROUND EFFECTS
            ===================================================== */}

            <div
                className={`
                    pointer-events-none absolute
                    -right-20 -top-24
                    h-64 w-64
                    rounded-full
                    ${severity.glow}
                    blur-3xl
                    transition-all duration-500
                    group-hover:scale-125
                `}
            />

            <div
                className="
                    pointer-events-none absolute
                    inset-x-0 top-0 h-px
                    bg-gradient-to-r
                    from-transparent
                    via-white/[0.10]
                    to-transparent
                "
            />

            {/* Left accent */}
            <div
                className={`
                    absolute left-0 top-8 bottom-8
                    w-[2px]
                    rounded-r-full
                    ${severity.accent}
                    opacity-50
                    transition-all duration-300
                    group-hover:opacity-100
                `}
            />

            {/* =====================================================
                CONTENT
            ===================================================== */}

            <div className="relative flex h-full flex-col p-5 sm:p-6">
                {/* =================================================
                    TOP BAR
                ================================================= */}

                <div className="flex items-start justify-between gap-4">
                    {/* Severity icon */}
                    <div
                        className={`
                            flex h-11 w-11 shrink-0
                            items-center justify-center
                            rounded-2xl
                            border
                            ${severity.iconBg}
                            ${severity.iconClass}
                            shadow-[0_8px_25px_rgba(0,0,0,0.15)]
                        `}
                    >
                        <SeverityIcon size={19} />
                    </div>

                    {/* Type */}
                    <div
                        className="
                            inline-flex items-center gap-1.5
                            rounded-full
                            border border-white/[0.07]
                            bg-white/[0.025]
                            px-2.5 py-1.5
                        "
                    >
                        <TypeIcon
                            size={11}
                            className="text-zinc-500"
                        />

                        <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                            {type.label}
                        </span>
                    </div>
                </div>

                {/* =================================================
                    LABEL
                ================================================= */}

                <div className="mt-5 flex items-center gap-2">
                    <span
                        className={`
                            h-1.5 w-1.5 rounded-full
                            ${severity.accent}
                        `}
                    />

                    <span
                        className={`
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.16em]
                            ${severity.text}
                        `}
                    >
                        {severity.label}
                    </span>
                </div>

                {/* =================================================
                    TITLE + MESSAGE
                ================================================= */}

                <div className="mt-2">
                    <h3
                        className={`
                            font-semibold
                            tracking-tight
                            text-white
                            ${
                            featured
                                ? "text-xl leading-7"
                                : "text-base leading-6"
                        }
                        `}
                    >
                        {insight.title}
                    </h3>

                    <p
                        className={`
                            mt-2
                            text-zinc-400
                            ${
                            featured
                                ? "max-w-2xl text-sm leading-6"
                                : "text-xs leading-5"
                        }
                        `}
                    >
                        {insight.message}
                    </p>
                </div>

                {/* =================================================
                    METRICS AREA
                ================================================= */}

                <div className="mt-auto pt-6">
                    {(percentage > 0 || amount > 0) && (
                        <div
                            className={`
                                grid gap-3
                                ${
                                percentage > 0 && amount > 0
                                    ? "sm:grid-cols-2"
                                    : "grid-cols-1"
                            }
                            `}
                        >
                            {/* Percentage */}
                            {percentage > 0 && (
                                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3.5">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                                                {insight.type === "SAVINGS"
                                                    ? "Goal progress"
                                                    : "Change"}
                                            </p>

                                            <div className="mt-1 flex items-center gap-1.5">
                                                {insight.type !== "SAVINGS" &&
                                                    (percentage > 0 ? (
                                                        <ArrowUpRight
                                                            size={13}
                                                            className={
                                                                isPositive
                                                                    ? "text-emerald-400"
                                                                    : "text-amber-400"
                                                            }
                                                        />
                                                    ) : (
                                                        <ArrowDownRight
                                                            size={13}
                                                            className="text-emerald-400"
                                                        />
                                                    ))}

                                                <span className="text-lg font-bold tracking-tight text-white">
                                                    {percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                                        <div
                                            className={`
                                                h-full
                                                rounded-full
                                                ${severity.accent}
                                                transition-all
                                                duration-700
                                            `}
                                            style={{
                                                width: `${progressWidth}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Amount */}
                            {amount > 0 && (
                                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3.5">
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                                        Amount
                                    </p>

                                    <p className="mt-1 truncate text-lg font-bold tracking-tight text-white">
                                        ₹
                                        {amount.toLocaleString("en-IN", {
                                            maximumFractionDigits: 2,
                                        })}
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-zinc-600">
                                        Financial impact
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* =================================================
                        BOTTOM STATUS
                    ================================================= */}

                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-3">
                        <span className="text-[10px] text-zinc-600">
                            Finora intelligence
                        </span>

                        <div
                            className={`
                                flex items-center gap-1.5
                                text-[10px]
                                font-medium
                                ${severity.text}
                                opacity-60
                                transition-opacity
                                group-hover:opacity-100
                            `}
                        >
                            <SparkleDot />

                            Active insight
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

/* =============================================================
   SMALL DECORATIVE DOT
============================================================= */

function SparkleDot() {
    return (
        <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-30" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
        </span>
    );
}