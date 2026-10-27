import {
    CheckCircle2,
    CircleAlert,
    TrendingDown,
} from "lucide-react";

interface HealthFactorCardProps {
    title: string;
    description: string;
    score: number;
    maxScore: number;
    status: string;
}

export default function HealthFactorCard({
                                             title,
                                             description,
                                             score,
                                             maxScore,
                                             status,
                                         }: HealthFactorCardProps) {
    const percentage =
        maxScore > 0
            ? (score / maxScore) * 100
            : 0;

    const Icon =
        status === "GOOD"
            ? CheckCircle2
            : status === "FAIR"
                ? TrendingDown
                : CircleAlert;

    return (
        <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5 transition-all duration-300 hover:border-violet-400/20 hover:bg-white/[0.04]">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-sm font-semibold text-white">
                        {title}
                    </h3>

                    <p className="mt-1.5 text-xs leading-5 text-zinc-500">
                        {description}
                    </p>
                </div>

                <Icon
                    className={
                        status === "GOOD"
                            ? "h-5 w-5 shrink-0 text-emerald-400"
                            : status === "FAIR"
                                ? "h-5 w-5 shrink-0 text-amber-400"
                                : "h-5 w-5 shrink-0 text-rose-400"
                    }
                />
            </div>

            <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            Score
          </span>

                    <span className="text-xs font-semibold text-zinc-300">
            {score} / {maxScore}
          </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                        className="h-full rounded-full bg-violet-400 transition-all duration-700"
                        style={{
                            width: `${percentage}%`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}