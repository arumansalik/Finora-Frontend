import { Activity } from "lucide-react";

interface FinancialHealthGaugeProps {
    score: number;
    status: string;
}

const getStatusLabel = (status: string) => {
    switch (status) {
        case "EXCELLENT":
            return "Excellent";
        case "GOOD":
            return "Good";
        case "FAIR":
            return "Fair";
        default:
            return "Needs Attention";
    }
};

export default function FinancialHealthGauge({
                                                 score,
                                                 status,
                                             }: FinancialHealthGaugeProps) {
    const radius = 82;
    const circumference = 2 * Math.PI * radius;

    const progress =
        Math.min(Math.max(score, 0), 100) / 100;

    const offset =
        circumference -
        progress * circumference;

    return (
        <div className="relative flex items-center justify-center">
            <svg
                width="210"
                height="210"
                viewBox="0 0 210 210"
                className="-rotate-90"
            >
                <circle
                    cx="105"
                    cy="105"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-white/[0.06]"
                />

                <circle
                    cx="105"
                    cy="105"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="text-violet-400 transition-all duration-1000"
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Activity className="mb-1 h-5 w-5 text-violet-400" />

                <span className="text-5xl font-bold tracking-tight text-white">
          {score}
        </span>

                <span className="mt-1 text-xs text-zinc-500">
          / 100
        </span>

                <span className="mt-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-medium text-violet-300">
          {getStatusLabel(status)}
        </span>
            </div>
        </div>
    );
}