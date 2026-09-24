import {
    AlertTriangle,
    ArrowUpRight,
    CheckCircle2,
    Info,
    Lightbulb,
    TrendingUp,
} from "lucide-react";

import type {
    FinancialInsight,
} from "../../services/financialInsightApi";

interface FinancialInsightCardProps {
    insight: FinancialInsight;
}

const severityConfig = {
    INFO: {
        icon: Info,
        iconClass:
            "text-blue-400 bg-blue-500/10 border-blue-500/20",
        accent:
            "from-blue-500/10 via-transparent to-transparent",
    },

    WARNING: {
        icon: AlertTriangle,
        iconClass:
            "text-amber-400 bg-amber-500/10 border-amber-500/20",
        accent:
            "from-amber-500/10 via-transparent to-transparent",
    },

    SUCCESS: {
        icon: CheckCircle2,
        iconClass:
            "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        accent:
            "from-emerald-500/10 via-transparent to-transparent",
    },
};

const typeIcons = {
    BUDGET: TrendingUp,
    SAVINGS: CheckCircle2,
    SPENDING: ArrowUpRight,
    INCOME: TrendingUp,
};

export default function FinancialInsightCard({
                                                 insight,
                                             }: FinancialInsightCardProps) {

    const severity =
        severityConfig[insight.severity] ??
        severityConfig.INFO;

    const SeverityIcon = severity.icon;

    const TypeIcon =
        typeIcons[
            insight.type as keyof typeof typeIcons
            ] ?? Lightbulb;

    return (
        <div
            className={`
        group relative overflow-hidden
        rounded-2xl
        border border-white/[0.06]
        bg-[#0d0f14]
        p-5
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-white/[0.12]
        hover:shadow-2xl
      `}
        >

            {/* Background glow */}

            <div
                className={`
          pointer-events-none
          absolute inset-0
          bg-gradient-to-br
          ${severity.accent}
        `}
            />

            {/* Content */}

            <div className="relative">

                {/* Top row */}

                <div className="flex items-start justify-between gap-4">

                    <div
                        className={`
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              border
              ${severity.iconClass}
            `}
                    >
                        <SeverityIcon size={19} />
                    </div>

                    <div
                        className="
              flex h-8 w-8
              items-center justify-center
              rounded-lg
              bg-white/[0.03]
              text-zinc-500
              transition-colors
              group-hover:text-zinc-300
            "
                    >
                        <TypeIcon size={15} />
                    </div>

                </div>

                {/* Title */}

                <div className="mt-5">

                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                        {insight.type}
                    </p>

                    <h3 className="mt-1 text-base font-semibold text-white">
                        {insight.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                        {insight.message}
                    </p>

                </div>

                {/* Percentage */}

                {insight.percentage > 0 && (
                    <div className="mt-5">

                        {insight.type === "SAVINGS" ? (
                            <>
                                <div className="mb-2 flex items-center justify-between">

          <span className="text-xs text-zinc-500">
            Goal progress
          </span>

                                    <span className="text-xs font-semibold text-zinc-300">
            {insight.percentage.toFixed(1)}%
          </span>

                                </div>

                                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

                                    <div
                                        className="
              h-full
              rounded-full
              bg-white
              transition-all
              duration-700
            "
                                        style={{
                                            width: `${Math.min(
                                                insight.percentage,
                                                100
                                            )}%`,
                                        }}
                                    />

                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">

        <span className="text-xs text-zinc-500">
          Month-over-month
        </span>

                                <span className="text-xs font-semibold text-zinc-300">
          {insight.percentage.toFixed(1)}%
        </span>

                            </div>
                        )}

                    </div>
                )}

                {/* Amount */}

                {insight.amount > 0 && (
                    <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">

            <span className="text-xs text-zinc-500">
              Amount
            </span>

                        <span className="text-sm font-semibold text-white">
              ₹
                            {insight.amount.toLocaleString("en-IN", {
                                maximumFractionDigits: 2,
                            })}
            </span>

                    </div>
                )}

            </div>
        </div>
    );
}