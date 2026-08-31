import {
    useState,
    type FormEvent,
} from "react"

import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom"

import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Sparkles,
} from "lucide-react"

import {
    useAuth,
} from "@/context/AuthContext"


export default function Login() {

    const navigate =
        useNavigate()

    const location =
        useLocation()


    const {
        login,
    } = useAuth()


    const [email, setEmail] =
        useState("")

    const [password, setPassword] =
        useState("")

    const [showPassword, setShowPassword] =
        useState(false)

    const [isSubmitting, setIsSubmitting] =
        useState(false)

    const [error, setError] =
        useState("")


    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault()

        setError("")

        setIsSubmitting(true)


        try {

            await login(
                email.trim(),
                password
            )


            const from =
                (
                    location.state as
                        { from?: string }
                        | null
                )?.from || "/"


            navigate(
                from,
                { replace: true }
            )

        } catch (error: any) {

            const message =
                error?.response?.data?.message ||
                "Invalid email or password."

            setError(
                message
            )

        } finally {

            setIsSubmitting(false)
        }
    }


    return (

        <div className="min-h-screen bg-[#07080c] text-white">

            <div className="grid min-h-screen lg:grid-cols-2">


                {/* ================================================= */}
                {/* BRAND SIDE */}
                {/* ================================================= */}

                <div className="relative hidden overflow-hidden border-r border-white/[0.07] lg:flex">

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.18),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.12),transparent_35%)]" />


                    <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

                        <div>

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">

                                    <Sparkles
                                        size={19}
                                    />

                                </div>

                                <span className="text-lg font-bold tracking-tight">
                                    FINORA
                                </span>

                            </div>


                            <div className="mt-28 max-w-lg">

                                <p className="text-sm font-medium text-violet-400">
                                    PERSONAL FINANCE, REIMAGINED
                                </p>

                                <h1 className="mt-5 text-5xl font-semibold leading-[1.08] tracking-[-0.04em] xl:text-6xl">

                                    Your money.
                                    <br />

                                    <span className="text-white/40">
                                        Your clarity.
                                    </span>

                                </h1>

                                <p className="mt-7 max-w-md text-base leading-7 text-white/40">

                                    Track spending, understand your
                                    cash flow, and build better financial
                                    habits from one beautifully focused
                                    workspace.

                                </p>

                            </div>

                        </div>


                        <div className="flex items-center gap-6 text-xs text-white/30">

                            <span className="flex items-center gap-2">

                                <ShieldCheck
                                    size={15}
                                />

                                Secure authentication

                            </span>

                            <span>
                                © 2026 Finora
                            </span>

                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* FORM SIDE */}
                {/* ================================================= */}

                <div className="flex items-center justify-center p-6 sm:p-10">

                    <div className="w-full max-w-md">


                        {/* Mobile logo */}

                        <div className="mb-10 flex items-center gap-3 lg:hidden">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">

                                <Sparkles
                                    size={19}
                                />

                            </div>

                            <span className="font-bold">
                                FINORA
                            </span>

                        </div>


                        <div className="mb-8">

                            <p className="text-sm font-medium text-violet-400">
                                WELCOME BACK
                            </p>

                            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                                Sign in to Finora
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-white/35">
                                Continue managing your finances
                                from where you left off.
                            </p>

                        </div>


                        {/* Error */}

                        {error && (

                            <div className="mb-5 rounded-xl border border-rose-400/20 bg-rose-400/5 px-4 py-3 text-sm text-rose-300">

                                {error}

                            </div>

                        )}


                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="space-y-5"
                        >


                            {/* Email */}

                            <div>

                                <label className="mb-2 block text-xs font-medium text-white/55">
                                    Email address
                                </label>

                                <div className="relative">

                                    <Mail
                                        size={17}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                                    />

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(
                                                event.target.value
                                            )
                                        }
                                        placeholder="you@example.com"
                                        required
                                        autoComplete="email"
                                        className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/50 focus:bg-white/[0.05]"
                                    />

                                </div>

                            </div>


                            {/* Password */}

                            <div>

                                <label className="mb-2 block text-xs font-medium text-white/55">
                                    Password
                                </label>

                                <div className="relative">

                                    <LockKeyhole
                                        size={17}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                                    />

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter your password"
                                        required
                                        autoComplete="current-password"
                                        className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/50 focus:bg-white/[0.05]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/25 hover:text-white"
                                    >

                                        {showPassword
                                            ? <EyeOff size={16} />
                                            : <Eye size={16} />
                                        }

                                    </button>

                                </div>

                            </div>


                            {/* Submit */}

                            <button
                                type="submit"
                                disabled={
                                    isSubmitting
                                }
                                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                {isSubmitting
                                    ? "Signing in..."
                                    : "Sign in"
                                }

                                {!isSubmitting && (

                                    <ArrowRight
                                        size={16}
                                        className="transition-transform group-hover:translate-x-0.5"
                                    />

                                )}

                            </button>

                        </form>


                        <p className="mt-8 text-center text-sm text-white/35">

                            Don't have an account?

                            {" "}

                            <Link
                                to="/register"
                                className="font-medium text-white transition hover:text-violet-300"
                            >
                                Create one
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    )
}