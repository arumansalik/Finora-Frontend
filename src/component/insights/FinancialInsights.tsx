import {
    AlertCircle,
    ArrowRight,
    Lightbulb,
    Loader2,
} from "lucide-react";

import {
    useFinancialInsights,
} from "../../hooks/useFinancialInsights";

import FinancialInsightCard from "./FinancialInsightCard";

export default function FinancialInsights() {

    const {
        data: insights = [],
        isLoading,
        isError,
        refetch,
    } = useFinancialInsights();

    return (
        <section className="mt-8">

            {/* Header */}

            <div className="mb-5 flex items-center justify-between">

                <div>

                    <div className="flex items-center gap-2">

                        <div
                            className="
                flex h-9 w-9
                items-center justify-center
                rounded-xl
                border border-violet-500/20
                bg-violet-500/10
                text-violet-400
              "
                        >
                            <Lightbulb size={17} />
                        </div>

                        <div>

                            <h2 className="text-lg font-semibold text-white">
                                Financial Insights
                            </h2>

                            <p className="text-xs text-zinc-500">
                                A quick look at your financial health
                            </p>

                        </div>

                    </div>

                </div>

                <button
                    type="button"
                    className="
            hidden sm:flex
            items-center gap-1.5
            text-xs font-medium
            text-zinc-500
            transition-colors
            hover:text-white
          "
                >
                    View analytics
                    <ArrowRight size={14} />
                </button>

            </div>

            {/* Loading */}

            {isLoading && (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="
                h-52
                animate-pulse
                rounded-2xl
                border border-white/[0.05]
                bg-white/[0.02]
              "
                        />
                    ))}

                </div>
            )}

            {/* Error */}

            {isError && !isLoading && (
                <div
                    className="
            rounded-2xl
            border border-red-500/10
            bg-red-500/[0.04]
            p-5
          "
                >

                    <div className="flex items-center gap-3">

                        <AlertCircle
                            size={19}
                            className="text-red-400"
                        />

                        <div className="flex-1">

                            <p className="text-sm font-medium text-white">
                                Couldn't load your insights
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                                Please try again.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="
                rounded-lg
                border border-white/[0.08]
                bg-white/[0.03]
                px-3 py-2
                text-xs font-medium
                text-zinc-300
                hover:bg-white/[0.06]
              "
                        >
                            Retry
                        </button>

                    </div>

                </div>
            )}

            {/* Empty */}

            {!isLoading &&
                !isError &&
                insights.length === 0 && (
                    <div
                        className="
              rounded-2xl
              border border-dashed
              border-white/[0.08]
              bg-white/[0.015]
              px-6 py-10
              text-center
            "
                    >

                        <Lightbulb
                            size={24}
                            className="mx-auto text-zinc-600"
                        />

                        <p className="mt-3 text-sm font-medium text-zinc-300">
                            No insights yet
                        </p>

                        <p className="mt-1 text-xs text-zinc-600">
                            Keep using Finora and we'll surface useful
                            financial patterns here.
                        </p>

                    </div>
                )}

            {/* Insights */}

            {!isLoading &&
                !isError &&
                insights.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                        {insights
                            .slice(0, 6)
                            .map((insight, index) => (
                                <FinancialInsightCard
                                    key={`${insight.type}-${insight.title}-${index}`}
                                    insight={insight}
                                />
                            ))}

                    </div>
                )}

        </section>
    );
}