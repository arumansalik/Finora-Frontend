import {
    AlertTriangle,
    RefreshCw,
} from "lucide-react"


interface DashboardErrorProps {
    onRetry: () => void
}


export default function DashboardError({
                                           onRetry,
                                       }: DashboardErrorProps) {

    return (
        <div className="flex min-h-[70vh] items-center justify-center p-6">

            <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-white/[0.025] p-8 text-center backdrop-blur-xl">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-400/10 bg-rose-400/10">

                    <AlertTriangle
                        size={24}
                        className="text-rose-400"
                    />

                </div>


                <h2 className="mt-5 text-xl font-bold">
                    We couldn't load your dashboard
                </h2>


                <p className="mt-2 text-sm leading-6 text-white/35">
                    Something went wrong while retrieving
                    your financial data. Your data hasn't
                    been deleted.
                </p>


                <button
                    onClick={onRetry}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                >

                    <RefreshCw
                        size={15}
                    />

                    Try again

                </button>

            </div>

        </div>
    )
}