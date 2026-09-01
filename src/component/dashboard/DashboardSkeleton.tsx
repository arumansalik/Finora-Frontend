export default function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-[#08090d] p-6 text-white lg:p-10">

            {/* Header */}

            <div className="animate-pulse">

                <div className="h-3 w-32 rounded bg-white/10" />

                <div className="mt-3 h-9 w-64 rounded-lg bg-white/10" />

                <div className="mt-3 h-4 w-96 max-w-full rounded bg-white/5" />

            </div>


            {/* Summary */}

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {Array.from({
                    length: 4,
                }).map((_, index) => (

                    <div
                        key={index}
                        className="animate-pulse rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6"
                    >

                        <div className="h-3 w-24 rounded bg-white/10" />

                        <div className="mt-4 h-8 w-32 rounded bg-white/10" />

                        <div className="mt-3 h-3 w-20 rounded bg-white/5" />

                    </div>

                ))}

            </div>


            {/* Charts */}

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">

                <div className="h-[380px] animate-pulse rounded-3xl border border-white/[0.07] bg-white/[0.025]" />

                <div className="h-[380px] animate-pulse rounded-3xl border border-white/[0.07] bg-white/[0.025]" />

            </div>


            {/* Bottom */}

            <div className="mt-6 grid gap-6 lg:grid-cols-2">

                <div className="h-72 animate-pulse rounded-3xl border border-white/[0.07] bg-white/[0.025]" />

                <div className="h-72 animate-pulse rounded-3xl border border-white/[0.07] bg-white/[0.025]" />

            </div>

        </div>
    )
}