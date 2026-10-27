import {
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react"

import {
    Bell,
    Check,
    ChevronRight,
    CircleHelp,
    CreditCard,
    Eye,
    EyeOff,
    KeyRound,
    Lock,
    LogOut,
    Mail,
    Monitor,
    Moon,
    Palette,
    Save,
    Shield,
    SlidersHorizontal,
    Sparkles,
    Sun,
    Trash2,
    User,
    WalletCards,
    X,
} from "lucide-react"

import {
    useCurrentUser,
    useUpdateCurrentUser,
} from "../hooks/useUser"

import {
    useUserPreferences,
    useUpdateUserPreferences,
} from "../hooks/usePreferences"


type SettingsSection =
    | "profile"
    | "preferences"
    | "notifications"
    | "security"
    | "appearance"


// ================================================================
// TOGGLE
// ================================================================

type ToggleProps = {
    enabled: boolean
    onChange: (value: boolean) => void
    label?: string
}

function Toggle({
    enabled,
    onChange,
    label = "Toggle setting",
}: ToggleProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label={label}
            onClick={() => onChange(!enabled)}
            className={`
relative
flex
h-6
w-11
shrink-0
items-center
rounded-full
border
p-0
transition-all
duration-200
focus:outline-none
focus:ring-2
focus:ring-violet-500/30
${
    enabled
        ? "border-violet-400/50 bg-violet-500"
        : "border-white/10 bg-white/[0.07]"
}
`}
        >
            <span
                className={`
absolute
top-1/2
h-5
w-5
-translate-y-1/2
rounded-full
bg-white
shadow-sm
transition-all
duration-200
${
    enabled
        ? "left-[21px]"
        : "left-0.5"
}
`}
            />
        </button>
    )
}


// ================================================================
// SETTING ROW
// ================================================================

function SettingRow({
    icon: Icon,
    title,
    description,
    children,
}: {
    icon: typeof User
    title: string
    description: string
    children: ReactNode
}) {
    return (
        <div className="flex min-h-[76px] items-center justify-between gap-6 border-b border-white/[0.06] py-5 last:border-b-0">
            <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-white/55">
                    <Icon size={18} />
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-semibold text-white/90">
                        {title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/40">
                        {description}
                    </p>
                </div>
            </div>

            {/* Fixed width prevents toggle misalignment */}
            <div className="flex w-11 shrink-0 items-center justify-center">
                {children}
            </div>
        </div>
    )
}


// ================================================================
// NAVIGATION
// ================================================================

const navigation = [
    {
        id: "profile" as const,
        label: "Profile",
        description: "Personal account details",
        icon: User,
    },
    {
        id: "preferences" as const,
        label: "Preferences",
        description: "Currency and defaults",
        icon: SlidersHorizontal,
    },
    {
        id: "notifications" as const,
        label: "Notifications",
        description: "Alerts and updates",
        icon: Bell,
    },
    {
        id: "security" as const,
        label: "Security",
        description: "Password and sessions",
        icon: Shield,
    },
    {
        id: "appearance" as const,
        label: "Appearance",
        description: "Theme and interface",
        icon: Palette,
    },
]


// ================================================================
// SETTINGS PAGE
// ================================================================

export default function Settings() {
    const [activeSection, setActiveSection] =
        useState<SettingsSection>("profile")


    // =====================================================
    // CURRENT USER
    // =====================================================

    const {
        data: user,
        isLoading: isUserLoading,
        isError: isUserError,
    } = useCurrentUser()

    const updateUserMutation =
        useUpdateCurrentUser()


    // =====================================================
    // USER PREFERENCES
    // =====================================================

    const {
        data: preferences,
        isLoading: isPreferencesLoading,
        isError: isPreferencesError,
    } = useUserPreferences()

    const updatePreferencesMutation =
        useUpdateUserPreferences()


    // =====================================================
    // PROFILE
    // =====================================================

    const [fullName, setFullName] =
        useState("")

    const [email, setEmail] =
        useState("")


    useEffect(() => {
        if (!user) return

        setFullName(user.name)
        setEmail(user.email)
    }, [user])


    // =====================================================
    // PREFERENCES
    // =====================================================

    const [currency, setCurrency] =
        useState("INR")

    const [dateFormat, setDateFormat] =
        useState("DD/MM/YYYY")

    const [defaultTransaction, setDefaultTransaction] =
        useState("EXPENSE")


    // =====================================================
    // NOTIFICATION PREFERENCES
    // =====================================================

    const [budgetAlerts, setBudgetAlerts] =
        useState(true)

    const [savingsAlerts, setSavingsAlerts] =
        useState(true)

    const [insightAlerts, setInsightAlerts] =
        useState(true)

    const [emailNotifications, setEmailNotifications] =
        useState(false)


    // =====================================================
    // LOAD PREFERENCES FROM DATABASE
    // =====================================================

    useEffect(() => {
        if (!preferences) return

        setCurrency(preferences.currency)

        setDateFormat(
            preferences.dateFormat
        )

        setDefaultTransaction(
            preferences.defaultTransactionType
        )

        setBudgetAlerts(
            preferences.budgetAlerts
        )

        setSavingsAlerts(
            preferences.savingsAlerts
        )

        setInsightAlerts(
            preferences.insightAlerts
        )

        setEmailNotifications(
            preferences.emailNotifications
        )
    }, [preferences])


    // =====================================================
    // OTHER SETTINGS
    // =====================================================

    const [showPassword, setShowPassword] =
        useState(false)

    const [twoFactor, setTwoFactor] =
        useState(false)

    const [compactMode, setCompactMode] =
        useState(false)

    const [saved, setSaved] =
        useState(false)

    const [showDeleteModal, setShowDeleteModal] =
        useState(false)


    // =====================================================
    // INITIALS
    // =====================================================

    const initials = useMemo(
        () =>
            fullName
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map(
                    (p) =>
                        p[0]?.toUpperCase()
                )
                .join(""),
        [fullName]
    )


    // =====================================================
    // SAVE PROFILE + PREFERENCES
    // =====================================================

    const handleSave = () => {
        if (
            !fullName.trim() ||
            !email.trim()
        ) {
            return
        }

        updateUserMutation.mutate(
            {
                name: fullName.trim(),
                email: email.trim(),
            },
            {
                onSuccess: () => {
                    updatePreferencesMutation.mutate(
                        {
                            currency,
                            dateFormat,

                            defaultTransactionType:
                                defaultTransaction as
                                    | "INCOME"
                                    | "EXPENSE",

                            budgetAlerts,
                            savingsAlerts,
                            insightAlerts,
                            emailNotifications,
                        },
                        {
                            onSuccess: () => {
                                setSaved(true)

                                window.setTimeout(
                                    () => {
                                        setSaved(false)
                                    },
                                    2200
                                )
                            },
                        }
                    )
                },
            }
        )
    }


    // =====================================================
    // SAVE STATE
    // =====================================================

    const isSaving =
        updateUserMutation.isPending ||
        updatePreferencesMutation.isPending


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        window.location.href = "/login"
    }


    // =====================================================
    // LOADING
    // =====================================================

    if (
        isUserLoading ||
        isPreferencesLoading
    ) {
        return (
            <div className="min-h-full bg-[#07080c] px-4 py-10 text-white">
                <div className="mx-auto max-w-[1500px]">

                    <div className="h-10 w-48 animate-pulse rounded-lg bg-white/[0.05]" />

                    <div className="mt-8 h-32 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.025]" />

                    <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">

                        <div className="h-[400px] animate-pulse rounded-2xl bg-white/[0.025]" />

                        <div className="h-[500px] animate-pulse rounded-2xl bg-white/[0.025]" />

                    </div>

                </div>
            </div>
        )
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (
        isUserError ||
        isPreferencesError ||
        !user ||
        !preferences
    ) {
        return (
            <div className="flex min-h-full items-center justify-center bg-[#07080c] px-4 text-white">

                <div className="w-full max-w-md rounded-2xl border border-red-400/10 bg-[#0c0d12] p-6 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
                        !
                    </div>

                    <h2 className="mt-4 text-lg font-bold">
                        Couldn't load your settings
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-white/40">
                        We couldn't retrieve your account
                        information or preferences.
                        Please make sure you're logged in
                        and try again.
                    </p>

                </div>

            </div>
        )
    }


    return (
        <div className="min-h-full bg-[#07080c] text-white">

            <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

                    <div>

                        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-violet-300/70">
                            <SlidersHorizontal size={13} />
                            Account center
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Settings
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
                            Manage your Finora profile, preferences,
                            notifications, security, and interface experience.
                        </p>

                    </div>


                    {/* SAVE BUTTON */}

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/10 px-5 text-sm font-semibold text-violet-200 transition hover:border-violet-400/35 hover:bg-violet-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        {isSaving ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-200/30 border-t-violet-200" />
                                Saving...
                            </>
                        ) : saved ? (
                            <>
                                <Check size={17} />
                                Saved
                            </>
                        ) : (
                            <>
                                <Save size={17} />
                                Save Changes
                            </>
                        )}

                    </button>

                </div>


                {/* =====================================================
                    PROFILE SUMMARY
                ===================================================== */}

                <section className="mb-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0c0d12]">

                    <div className="relative p-5 sm:p-6">

                        <div className="pointer-events-none absolute right-0 top-0 h-48 w-72 bg-violet-500/[0.07] blur-3xl" />

                        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                            <div className="flex items-center gap-4">

                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-lg font-bold shadow-lg shadow-violet-950/30">
                                    {initials || "AS"}
                                </div>

                                <div className="min-w-0">

                                    <div className="flex flex-wrap items-center gap-2">

                                        <h2 className="truncate text-lg font-bold">
                                            {fullName}
                                        </h2>

                                        <span className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                                            Pro
                                        </span>

                                    </div>

                                    <p className="mt-1 truncate text-sm text-white/40">
                                        {email}
                                    </p>

                                </div>

                            </div>


                            <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">

                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                                    <Shield size={16} />
                                </span>

                                <div>

                                    <p className="text-xs font-semibold text-white/80">
                                        Account secure
                                    </p>

                                    <p className="mt-0.5 text-[11px] text-white/35">
                                        Your session is active
                                    </p>

                                </div>

                                <span className="ml-2 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" />

                            </div>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    CONTENT
                ===================================================== */}

                <div className="grid min-w-0 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">


                    {/* SIDEBAR */}

                    <aside className="h-fit rounded-2xl border border-white/[0.07] bg-[#0c0d12] p-2">

                        <div className="px-3 pb-3 pt-2">

                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
                                Settings
                            </p>

                        </div>


                        <div className="space-y-1">

                            {navigation.map((item) => {

                                const Icon = item.icon

                                const active =
                                    activeSection === item.id

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() =>
                                            setActiveSection(item.id)
                                        }
                                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
    active
        ? "border border-violet-400/15 bg-violet-500/[0.10]"
        : "border border-transparent hover:bg-white/[0.035]"
}`}
                                    >

                                        <span
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
    active
        ? "bg-violet-500/15 text-violet-300"
        : "bg-white/[0.035] text-white/35 group-hover:text-white/60"
}`}
                                        >
                                            <Icon size={17} />
                                        </span>


                                        <span className="min-w-0 flex-1">

                                            <span
                                                className={`block text-sm font-semibold ${
    active
        ? "text-white"
        : "text-white/65"
}`}
                                            >
                                                {item.label}
                                            </span>

                                            <span className="mt-0.5 block truncate text-[11px] text-white/30">
                                                {item.description}
                                            </span>

                                        </span>


                                        {active && (
                                            <ChevronRight
                                                size={15}
                                                className="text-violet-300/70"
                                            />
                                        )}

                                    </button>
                                )
                            })}

                        </div>


                        <div className="mt-3 border-t border-white/[0.06] pt-3">

                            <div className="rounded-xl bg-white/[0.025] p-3">

                                <div className="mb-2 flex items-center gap-2 text-white/50">

                                    <CircleHelp size={15} />

                                    <span className="text-xs font-semibold">
                                        Need help?
                                    </span>

                                </div>

                                <p className="text-[11px] leading-5 text-white/30">
                                    Manage your Finora account and preferences
                                    from one place.
                                </p>

                            </div>

                        </div>

                    </aside>


                    {/* MAIN */}

                    <main className="min-w-0">

                        {activeSection === "profile" && (
                            <ProfileSection
                                fullName={fullName}
                                email={email}
                                setFullName={setFullName}
                                setEmail={setEmail}
                                initials={initials}
                            />
                        )}


                        {activeSection === "preferences" && (
                            <PreferencesSection
                                currency={currency}
                                dateFormat={dateFormat}
                                defaultTransaction={defaultTransaction}
                                setCurrency={setCurrency}
                                setDateFormat={setDateFormat}
                                setDefaultTransaction={setDefaultTransaction}
                            />
                        )}


                        {activeSection === "notifications" && (
                            <NotificationsSection
                                budgetAlerts={budgetAlerts}
                                savingsAlerts={savingsAlerts}
                                insightAlerts={insightAlerts}
                                emailNotifications={emailNotifications}
                                setBudgetAlerts={setBudgetAlerts}
                                setSavingsAlerts={setSavingsAlerts}
                                setInsightAlerts={setInsightAlerts}
                                setEmailNotifications={setEmailNotifications}
                            />
                        )}


                        {activeSection === "security" && (
                            <SecuritySection
                                showPassword={showPassword}
                                twoFactor={twoFactor}
                                setShowPassword={setShowPassword}
                                setTwoFactor={setTwoFactor}
                                onLogout={handleLogout}
                                onDelete={() =>
                                    setShowDeleteModal(true)
                                }
                            />
                        )}


                        {activeSection === "appearance" && (
                            <AppearanceSection
                                compactMode={compactMode}
                                setCompactMode={setCompactMode}
                            />
                        )}

                    </main>

                </div>

            </div>


            {showDeleteModal && (
                <DeleteModal
                    onClose={() =>
                        setShowDeleteModal(false)
                    }
                />
            )}

        </div>
    )
}


// ================================================================
// SECTION HEADER
// ================================================================

function SectionHeader({
    icon: Icon,
    eyebrow,
    title,
    description,
}: {
    icon: typeof User
    eyebrow: string
    title: string
    description: string
}) {
    return (
        <div className="mb-6">

            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-300/65">
                <Icon size={14} />
                {eyebrow}
            </div>

            <h2 className="text-xl font-bold tracking-tight">
                {title}
            </h2>

            <p className="mt-1.5 text-sm leading-6 text-white/40">
                {description}
            </p>

        </div>
    )
}


// ================================================================
// CARD
// ================================================================

function Card({
    children,
    className = "",
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <section
            className={`rounded-2xl border border-white/[0.07] bg-[#0c0d12] ${className}`}
        >
            {children}
        </section>
    )
}


// ================================================================
// PROFILE
// ================================================================

function ProfileSection({
    fullName,
    email,
    setFullName,
    setEmail,
    initials,
}: {
    fullName: string
    email: string
    setFullName: (v: string) => void
    setEmail: (v: string) => void
    initials: string
}) {
    return (
        <>
            <SectionHeader
                icon={User}
                eyebrow="Profile"
                title="Profile & account"
                description="Keep your personal account information up to date."
            />

            <Card className="overflow-hidden">

                <div className="border-b border-white/[0.06] p-5 sm:p-6">

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-xl font-bold shadow-xl shadow-violet-950/30">
                            {initials || "AS"}
                        </div>

                        <div>

                            <p className="text-sm font-semibold text-white/85">
                                Profile photo
                            </p>

                            <p className="mt-1 text-xs leading-5 text-white/35">
                                Your initials are currently used as your profile avatar.
                            </p>

                        </div>

                    </div>

                </div>


                <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">

                    <label className="block">

                        <span className="mb-2 block text-xs font-semibold text-white/50">
                            Full name
                        </span>

                        <div className="relative">

                            <User
                                size={16}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                            />

                            <input
                                value={fullName}
                                onChange={(e) =>
                                    setFullName(e.target.value)
                                }
                                className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] pl-10 pr-4 text-sm text-white outline-none focus:border-violet-400/40"
                                placeholder="Your full name"
                            />

                        </div>

                    </label>


                    <label className="block">

                        <span className="mb-2 block text-xs font-semibold text-white/50">
                            Email address
                        </span>

                        <div className="relative">

                            <Mail
                                size={16}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                            />

                            <input
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                type="email"
                                className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] pl-10 pr-4 text-sm text-white outline-none focus:border-violet-400/40"
                                placeholder="you@example.com"
                            />

                        </div>

                    </label>

                </div>


                <div className="border-t border-white/[0.06] bg-white/[0.015] px-5 py-4 sm:px-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                            <Check size={15} />
                        </div>

                        <div>

                            <p className="text-xs font-semibold text-white/70">
                                Account information
                            </p>

                            <p className="text-[11px] text-white/30">
                                Your profile details are displayed across Finora.
                            </p>

                        </div>

                    </div>

                </div>

            </Card>
        </>
    )
}


// ================================================================
// PREFERENCES
// ================================================================

function PreferencesSection({
    currency,
    dateFormat,
    defaultTransaction,
    setCurrency,
    setDateFormat,
    setDefaultTransaction,
}: {
    currency: string
    dateFormat: string
    defaultTransaction: string
    setCurrency: (v: string) => void
    setDateFormat: (v: string) => void
    setDefaultTransaction: (v: string) => void
}) {
    return (
        <>
            <SectionHeader
                icon={SlidersHorizontal}
                eyebrow="Preferences"
                title="Financial preferences"
                description="Configure the way Finora displays and creates financial data."
            />

            <Card className="p-5 sm:p-6">

                <div className="grid gap-5 sm:grid-cols-2">

                    <SelectField
                        label="Currency"
                        value={currency}
                        onChange={setCurrency}
                        options={[
                            {
                                value: "INR",
                                label: "₹ INR — Indian Rupee",
                            },
                            {
                                value: "USD",
                                label: "$ USD — US Dollar",
                            },
                            {
                                value: "EUR",
                                label: "€ EUR — Euro",
                            },
                            {
                                value: "GBP",
                                label: "£ GBP — British Pound",
                            },
                        ]}
                    />


                    <SelectField
                        label="Date format"
                        value={dateFormat}
                        onChange={setDateFormat}
                        options={[
                            {
                                value: "DD/MM/YYYY",
                                label: "DD/MM/YYYY",
                            },
                            {
                                value: "MM/DD/YYYY",
                                label: "MM/DD/YYYY",
                            },
                            {
                                value: "YYYY-MM-DD",
                                label: "YYYY-MM-DD",
                            },
                        ]}
                    />


                    <SelectField
                        label="Default transaction type"
                        value={defaultTransaction}
                        onChange={setDefaultTransaction}
                        options={[
                            {
                                value: "EXPENSE",
                                label: "Expense",
                            },
                            {
                                value: "INCOME",
                                label: "Income",
                            },
                        ]}
                    />

                </div>


                <div className="mt-7 rounded-xl border border-violet-400/10 bg-violet-500/[0.045] p-4">

                    <div className="flex gap-3">

                        <WalletCards
                            className="mt-0.5 shrink-0 text-violet-300"
                            size={18}
                        />

                        <div>

                            <p className="text-sm font-semibold text-white/80">
                                Personal finance defaults
                            </p>

                            <p className="mt-1 text-xs leading-5 text-white/35">
                                These preferences control how financial
                                information is presented throughout your dashboard.
                            </p>

                        </div>

                    </div>

                </div>

            </Card>
        </>
    )
}


// ================================================================
// NOTIFICATIONS
// ================================================================

function NotificationsSection({
    budgetAlerts,
    savingsAlerts,
    insightAlerts,
    emailNotifications,
    setBudgetAlerts,
    setSavingsAlerts,
    setInsightAlerts,
    setEmailNotifications,
}: {
    budgetAlerts: boolean
    savingsAlerts: boolean
    insightAlerts: boolean
    emailNotifications: boolean
    setBudgetAlerts: (v: boolean) => void
    setSavingsAlerts: (v: boolean) => void
    setInsightAlerts: (v: boolean) => void
    setEmailNotifications: (v: boolean) => void
}) {
    return (
        <>
            <SectionHeader
                icon={Bell}
                eyebrow="Notifications"
                title="Notification preferences"
                description="Choose which financial events should get your attention."
            />

            <Card className="px-5 sm:px-6">

                <SettingRow
                    icon={WalletCards}
                    title="Budget alerts"
                    description="Get notified when your spending approaches a budget limit."
                >
                    <Toggle
                        enabled={budgetAlerts}
                        onChange={setBudgetAlerts}
                        label="Budget alerts"
                    />
                </SettingRow>


                <SettingRow
                    icon={CreditCard}
                    title="Savings goal alerts"
                    description="Receive updates about your savings goal progress."
                >
                    <Toggle
                        enabled={savingsAlerts}
                        onChange={setSavingsAlerts}
                        label="Savings goal alerts"
                    />
                </SettingRow>


                <SettingRow
                    icon={Sparkles}
                    title="Financial insights"
                    description="Show smart spending and financial health insights."
                >
                    <Toggle
                        enabled={insightAlerts}
                        onChange={setInsightAlerts}
                        label="Financial insights"
                    />
                </SettingRow>


                <SettingRow
                    icon={Mail}
                    title="Email notifications"
                    description="Receive important Finora updates by email."
                >
                    <Toggle
                        enabled={emailNotifications}
                        onChange={setEmailNotifications}
                        label="Email notifications"
                    />
                </SettingRow>

            </Card>
        </>
    )
}


// ================================================================
// SECURITY
// ================================================================

function SecuritySection({
    showPassword,
    twoFactor,
    setShowPassword,
    setTwoFactor,
    onLogout,
    onDelete,
}: {
    showPassword: boolean
    twoFactor: boolean
    setShowPassword: (v: boolean) => void
    setTwoFactor: (v: boolean) => void
    onLogout: () => void
    onDelete: () => void
}) {
    return (
        <>
            <SectionHeader
                icon={Shield}
                eyebrow="Security"
                title="Security & access"
                description="Protect your Finora account and manage active access."
            />

            <Card className="p-5 sm:p-6">

                <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.045] p-4">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                        <Lock size={17} />
                    </div>

                    <div>

                        <p className="text-sm font-semibold text-white/80">
                            Your account is protected
                        </p>

                        <p className="mt-0.5 text-xs text-white/35">
                            You are currently signed in through a secure session.
                        </p>

                    </div>

                </div>


                <div className="grid gap-5 lg:grid-cols-2">

                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">

                        <div className="mb-4 flex items-center justify-between">

                            <div>

                                <p className="text-sm font-semibold text-white/80">
                                    Password
                                </p>

                                <p className="mt-1 text-xs text-white/30">
                                    Change your account password.
                                </p>

                            </div>

                            <KeyRound
                                size={18}
                                className="text-white/25"
                            />

                        </div>


                        <div className="relative">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value="••••••••••••"
                                readOnly
                                className="h-11 w-full rounded-xl border border-white/[0.07] bg-black/10 px-4 pr-11 text-sm text-white/50 outline-none"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/30 hover:bg-white/[0.05] hover:text-white/70"
                            >
                                {showPassword ? (
                                    <EyeOff size={16} />
                                ) : (
                                    <Eye size={16} />
                                )}
                            </button>

                        </div>


                        <button
                            type="button"
                            className="mt-3 h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] text-xs font-semibold text-white/65 hover:bg-white/[0.06] hover:text-white"
                        >
                            Change Password
                        </button>

                    </div>


                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">

                        <div className="mb-4 flex items-center justify-between">

                            <div>

                                <p className="text-sm font-semibold text-white/80">
                                    Two-factor authentication
                                </p>

                                <p className="mt-1 text-xs text-white/30">
                                    Add another layer of account protection.
                                </p>

                            </div>

                            <Shield
                                size={18}
                                className="text-white/25"
                            />

                        </div>


                        <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/10 p-3">

                            <div>

                                <p className="text-xs font-semibold text-white/70">
                                    2FA protection
                                </p>

                                <p className="mt-1 text-[11px] text-white/30">
                                    {twoFactor
                                        ? "Enabled"
                                        : "Not enabled"}
                                </p>

                            </div>

                            <Toggle
                                enabled={twoFactor}
                                onChange={setTwoFactor}
                                label="Two-factor authentication"
                            />

                        </div>

                    </div>

                </div>


                <div className="mt-6 border-t border-white/[0.06] pt-6">

                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/25">
                        Session
                    </p>


                    <div className="flex flex-col gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                                <Monitor size={17} />
                            </div>

                            <div>

                                <p className="text-sm font-semibold text-white/75">
                                    Current browser session
                                </p>

                                <p className="mt-1 text-xs text-white/30">
                                    Active and secure
                                </p>

                            </div>

                        </div>


                        <button
                            type="button"
                            onClick={onLogout}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-400/15 bg-rose-400/[0.05] px-4 text-xs font-semibold text-rose-300 hover:bg-rose-400/10"
                        >
                            <LogOut size={15} />
                            Log out
                        </button>

                    </div>

                </div>


                <div className="mt-6 border-t border-rose-400/10 pt-6">

                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-rose-300/50">
                        Danger zone
                    </p>


                    <div className="flex flex-col gap-4 rounded-xl border border-rose-400/10 bg-rose-400/[0.025] p-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <p className="text-sm font-semibold text-white/75">
                                Delete account
                            </p>

                            <p className="mt-1 text-xs leading-5 text-white/30">
                                Permanently remove your Finora account and associated data.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={onDelete}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-400/15 px-4 text-xs font-semibold text-rose-300 hover:bg-rose-400/10"
                        >
                            <Trash2 size={15} />
                            Delete Account
                        </button>

                    </div>

                </div>

            </Card>
        </>
    )
}


// ================================================================
// APPEARANCE
// ================================================================

function AppearanceSection({
    compactMode,
    setCompactMode,
}: {
    compactMode: boolean
    setCompactMode: (v: boolean) => void
}) {
    return (
        <>
            <SectionHeader
                icon={Palette}
                eyebrow="Appearance"
                title="Interface appearance"
                description="Customize the look and density of your Finora workspace."
            />

            <Card className="p-5 sm:p-6">

                <div className="mb-6">

                    <p className="text-sm font-semibold text-white/80">
                        Theme
                    </p>

                    <p className="mt-1 text-xs text-white/35">
                        Finora is currently optimized for a dark financial dashboard.
                    </p>

                </div>


                <div className="grid gap-4 sm:grid-cols-3">

                    <ThemeCard
                        icon={Moon}
                        label="Dark"
                        active
                    />

                    <ThemeCard
                        icon={Sun}
                        label="Light"
                    />

                    <ThemeCard
                        icon={Monitor}
                        label="System"
                    />

                </div>


                <div className="mt-7 border-t border-white/[0.06] pt-6">

                    <SettingRow
                        icon={SlidersHorizontal}
                        title="Compact mode"
                        description="Reduce spacing to fit more information on screen."
                    >
                        <Toggle
                            enabled={compactMode}
                            onChange={setCompactMode}
                            label="Compact mode"
                        />
                    </SettingRow>

                </div>

            </Card>
        </>
    )
}


// ================================================================
// THEME CARD
// ================================================================

function ThemeCard({
    icon: Icon,
    label,
    active = false,
}: {
    icon: typeof Moon
    label: string
    active?: boolean
}) {
    return (
        <button
            type="button"
            className={`relative overflow-hidden rounded-2xl border p-5 text-left transition ${
    active
        ? "border-violet-400/30 bg-violet-500/[0.08]"
        : "border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04]"
}`}
        >

            <div className="mb-8 h-14 rounded-lg border border-white/[0.07] bg-[#08090d] p-2">

                <div className="h-1.5 w-1/2 rounded-full bg-white/10" />

                <div className="mt-2 h-5 rounded bg-white/[0.035]" />

            </div>


            <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                    <Icon
                        size={16}
                        className={
                            active
                                ? "text-violet-300"
                                : "text-white/35"
                        }
                    />

                    <span className="text-sm font-semibold text-white/75">
                        {label}
                    </span>

                </div>


                {active && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-white">
                        <Check size={12} />
                    </span>
                )}

            </div>

        </button>
    )
}


// ================================================================
// SELECT FIELD
// ================================================================

function SelectField({
    label,
    value,
    onChange,
    options,
}: {
    label: string
    value: string
    onChange: (v: string) => void
    options: {
        value: string
        label: string
    }[]
}) {
    return (
        <label className="block">

            <span className="mb-2 block text-xs font-semibold text-white/50">
                {label}
            </span>

            <select
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 text-sm text-white outline-none focus:border-violet-400/40"
            >

                {options.map((o) => (
                    <option
                        key={o.value}
                        value={o.value}
                        className="bg-[#0c0d12] text-white"
                    >
                        {o.label}
                    </option>
                ))}

            </select>

        </label>
    )
}


// ================================================================
// DELETE MODAL
// ================================================================

function DeleteModal({
    onClose,
}: {
    onClose: () => void
}) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-2xl border border-rose-400/15 bg-[#101116] p-6 shadow-2xl shadow-black/50">

                <div className="mb-5 flex items-start justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-400/10 text-rose-300">
                        <Trash2 size={20} />
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 hover:bg-white/[0.05] hover:text-white"
                    >
                        <X size={17} />
                    </button>

                </div>


                <h3 className="text-lg font-bold">
                    Delete your account?
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/40">
                    This action is permanent. Your account and associated
                    financial data would be removed.
                </p>


                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                    <button
                        type="button"
                        onClick={onClose}
                        className="h-10 rounded-xl border border-white/[0.08] px-4 text-xs font-semibold text-white/60 hover:bg-white/[0.04] hover:text-white"
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        onClick={onClose}
                        className="h-10 rounded-xl bg-rose-500 px-4 text-xs font-semibold text-white hover:bg-rose-400"
                    >
                        Delete Account
                    </button>

                </div>

            </div>

        </div>
    )
}