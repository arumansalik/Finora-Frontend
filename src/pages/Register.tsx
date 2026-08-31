import {
    useState,
    type FormEvent,
} from "react"

import {
    Link,
    useNavigate,
} from "react-router-dom"

import {
    ArrowRight,
    Check,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    Sparkles,
    UserRound,
} from "lucide-react"

import {
    useAuth,
} from "@/context/AuthContext"


export default function Register() {

    const navigate =
        useNavigate()


    const {
        register,
    } = useAuth()


    const [name, setName] =
        useState("")

    const [email, setEmail] =
        useState("")

    const [password, setPassword] =
        useState("")

    const [confirmPassword, setConfirmPassword] =
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


        if (
            password !==
            confirmPassword
        ) {

            setError(
                "Passwords do not match."
            )

            return
        }


        if (password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            )

            return
        }


        setIsSubmitting(true)


        try {

            await register(
                name.trim(),
                email.trim(),
                password
            )


            navigate(
                "/login",
                {
                    replace: true,
                    state: {
                        registered: true,
                    },
                }
            )

        } catch (error: any) {

            const message =
                error?.response?.data?.message ||
                "Unable to create your account."

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

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(124,58,237,0.18),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.10),transparent_35%)]" />


                    <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

                        <div>

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">

                                    <Sparkles
                                        size={19}
                                    />

                                </div>

                                <span className="text-lg font-bold">
                                    FINORA
                                </span>

                            </div>


                            <div className="mt-28 max-w-lg">

                                <p className="text-sm font-medium text-emerald-400">
                                    START YOUR JOURNEY
                                </p>

                                <h1 className="mt-5 text-5xl font-semibold leading-[1.08] tracking-[-0.04em] xl:text-6xl">

                                    Make every
                                    <br />

                                    <span className="text-white/40">
                                        rupee count.
                                    </span>

                                </h1>

                                <p className="mt-7 max-w-md text-base leading-7 text-white/40">

                                    A focused financial workspace
                                    designed to help you understand
                                    where your money goes.

                                </p>


                                <div className="mt-10 space-y-4">

                                    {[
                                        "Track income and expenses",
                                        "Understand your spending",
                                        "Keep your financial data private",
                                    ].map(
                                        (item) => (

                                            <div
                                                key={item}
                                                className="flex items-center gap-3 text-sm text-white/50"
                                            >

                                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">

                                                    <Check
                                                        size={13}
                                                    />

                                                </span>

                                                {item}

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        </div>


                        <p className="text-xs text-white/30">
                            © 2026 Finora
                        </p>

                    </div>

                </div>


                {/* ================================================= */}
                {/* FORM */}
                {/* ================================================= */}

                <div className="flex items-center justify-center p-6 sm:p-10">

                    <div className="w-full max-w-md">


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

                            <p className="text-sm font-medium text-emerald-400">
                                GET STARTED
                            </p>

                            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                                Create your account
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-white/35">
                                Your personal financial workspace
                                starts here.
                            </p>

                        </div>


                        {error && (

                            <div className="mb-5 rounded-xl border border-rose-400/20 bg-rose-400/5 px-4 py-3 text-sm text-rose-300">

                                {error}

                            </div>

                        )}


                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="space-y-4"
                        >


                            {/* NAME */}

                            <div>

                                <label className="mb-2 block text-xs font-medium text-white/55">
                                    Full name
                                </label>

                                <div className="relative">

                                    <UserRound
                                        size={17}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                                    />

                                    <input
                                        value={name}
                                        onChange={(event) =>
                                            setName(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Your name"
                                        required
                                        className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-11 pr-4 text-sm outline-none placeholder:text-white/20 focus:border-violet-400/50"
                                    />

                                </div>

                            </div>


                            {/* EMAIL */}

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
                                        className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-11 pr-4 text-sm outline-none placeholder:text-white/20 focus:border-violet-400/50"
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

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
                                        placeholder="At least 6 characters"
                                        required
                                        className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-11 pr-12 text-sm outline-none placeholder:text-white/20 focus:border-violet-400/50"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/25 hover:text-white"
                                    >

                                        {showPassword
                                            ? <EyeOff size={16} />
                                            : <Eye size={16} />
                                        }

                                    </button>

                                </div>

                            </div>


                            {/* CONFIRM */}

                            <div>

                                <label className="mb-2 block text-xs font-medium text-white/55">
                                    Confirm password
                                </label>

                                <input
                                    type="password"
                                    value={
                                        confirmPassword
                                    }
                                    onChange={(event) =>
                                        setConfirmPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Repeat your password"
                                    required
                                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm outline-none placeholder:text-white/20 focus:border-violet-400/50"
                                />


                            </div>


                            <button
                                type="submit"
                                disabled={
                                    isSubmitting
                                }
                                className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
                            >

                                {isSubmitting
                                    ? "Creating account..."
                                    : "Create account"
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

                            Already have an account?

                            {" "}

                            <Link
                                to="/login"
                                className="font-medium text-white hover:text-violet-300"
                            >
                                Sign in
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    )
}