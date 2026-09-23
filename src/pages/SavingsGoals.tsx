import { useMemo, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    CircleDollarSign,
    Edit3,
    Loader2,
    Plus,
    Target,
    Trash2,
    TrendingUp,
    Wallet,
    X,
} from "lucide-react";

import {
    useCreateSavingsGoal,
    useDeleteSavingsGoal,
    useSavingsGoals,
    useUpdateSavingsGoal,
} from "../hooks/useSavingsGoals";

import type {
    SavingsGoal,
    SavingsGoalRequest,
} from "../services/savingsGoalApi";

const emptyForm: SavingsGoalRequest = {
    name: "",
    targetAmount: 0,
    currentAmount: 0,
    targetDate: "",
};

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);

const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
};

const progressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-emerald-400";
    if (percentage >= 75) return "bg-violet-400";
    if (percentage >= 40) return "bg-blue-400";
    return "bg-amber-400";
};

export default function SavingsGoals() {
    const {
        data: goals = [],
        isLoading,
        isError,
        error,
    } = useSavingsGoals();

    const createMutation = useCreateSavingsGoal();
    const updateMutation = useUpdateSavingsGoal();
    const deleteMutation = useDeleteSavingsGoal();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] =
        useState<SavingsGoal | null>(null);

    const [deleteId, setDeleteId] =
        useState<number | null>(null);

    const [form, setForm] =
        useState<SavingsGoalRequest>(emptyForm);

    const summary = useMemo(() => {
        const target = goals.reduce(
            (sum, goal) => sum + Number(goal.targetAmount),
            0
        );

        const saved = goals.reduce(
            (sum, goal) => sum + Number(goal.currentAmount),
            0
        );

        const remaining = Math.max(target - saved, 0);

        const progress =
            target > 0
                ? Math.min((saved / target) * 100, 100)
                : 0;

        return {
            target,
            saved,
            remaining,
            progress,
        };
    }, [goals]);

    const openCreate = () => {
        setEditingGoal(null);
        setForm({
            name: "",
            targetAmount: 0,
            currentAmount: 0,
            targetDate: "",
        });
        setModalOpen(true);
    };

    const openEdit = (goal: SavingsGoal) => {
        setEditingGoal(goal);

        setForm({
            name: goal.name,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            targetDate: goal.targetDate,
        });

        setModalOpen(true);
    };

    const closeModal = () => {
        if (
            createMutation.isPending ||
            updateMutation.isPending
        ) {
            return;
        }

        setModalOpen(false);
        setEditingGoal(null);
        setForm(emptyForm);
    };

    const updateForm = (
        field: keyof SavingsGoalRequest,
        value: string | number
    ) => {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const payload: SavingsGoalRequest = {
            name: form.name.trim(),
            targetAmount: Number(form.targetAmount),
            currentAmount: Number(form.currentAmount ?? 0),
            targetDate: form.targetDate,
        };

        try {
            if (editingGoal) {
                await updateMutation.mutateAsync({
                    id: editingGoal.id,
                    data: payload,
                });
            } else {
                await createMutation.mutateAsync(payload);
            }

            closeModal();
        } catch {
            // mutation error displayed below
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteMutation.mutateAsync(id);
            setDeleteId(null);
        } catch {
            // mutation error displayed below
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading goals...
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5">
                <p className="font-medium text-white">
                    Unable to load savings goals
                </p>

                <p className="mt-1 text-sm text-rose-300">
                    {error instanceof Error
                        ? error.message
                        : "Something went wrong."}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-full w-full overflow-x-hidden bg-[#08090d] px-4 py-6 text-white sm:px-6 lg:px-8 xl:px-10">
            <div  className="mx-auto w-full max-w-[1500px] space-y-6 pb-8">
            {/* =====================================================
          HEADER
      ====================================================== */}

            <section className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0d0f15] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                            <Target className="h-4 w-4 text-violet-400" />
                        </div>

                        <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              Financial Goals
            </span>
                    </div>

                    <h1 className="truncate text-2xl font-bold text-white sm:text-3xl">
                        Savings Goals
                    </h1>

                    <p className="mt-1 text-sm text-zinc-500">
                        Track your progress and stay on target.
                    </p>
                </div>

                <button
                    onClick={openCreate}
                    className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400 sm:w-auto"
                >
                    <Plus className="h-4 w-4" />
                    New Goal
                </button>
            </section>

            {/* =====================================================
          SUMMARY
      ====================================================== */}

            <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                <SummaryCard
                    title="Target"
                    value={formatCurrency(summary.target)}
                    icon={<Target />}
                    className="text-violet-400 bg-violet-500/10"
                />

                <SummaryCard
                    title="Saved"
                    value={formatCurrency(summary.saved)}
                    icon={<Wallet />}
                    className="text-emerald-400 bg-emerald-500/10"
                />

                <SummaryCard
                    title="Remaining"
                    value={formatCurrency(summary.remaining)}
                    icon={<CircleDollarSign />}
                    className="text-amber-400 bg-amber-500/10"
                />

                <SummaryCard
                    title="Progress"
                    value={`${summary.progress.toFixed(0)}%`}
                    icon={<TrendingUp />}
                    className="text-blue-400 bg-blue-500/10"
                />
            </section>

            {/* =====================================================
          OVERALL PROGRESS
      ====================================================== */}

            {goals.length > 0 && (
                <section className="rounded-2xl border border-white/10 bg-[#0d0f15] p-5">
                    <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <h2 className="text-sm font-semibold text-white">
                                Overall progress
                            </h2>

                            <p className="mt-1 text-xs text-zinc-500">
                                {goals.length}{" "}
                                {goals.length === 1 ? "active goal" : "goals"}
                            </p>
                        </div>

                        <span className="shrink-0 text-sm font-bold text-violet-400">
              {summary.progress.toFixed(0)}%
            </span>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-400 transition-all duration-700"
                            style={{
                                width: `${summary.progress}%`,
                            }}
                        />
                    </div>
                </section>
            )}

            {/* =====================================================
          EMPTY STATE
      ====================================================== */}

            {goals.length === 0 && (
                <section className="rounded-2xl border border-dashed border-white/10 bg-[#0d0f15] px-5 py-14 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
                        <Target className="h-7 w-7 text-violet-400" />
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-white">
                        Start your first savings goal
                    </h2>

                    <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">
                        Set a target, track your savings, and watch your
                        progress grow.
                    </p>

                    <button
                        onClick={openCreate}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-400"
                    >
                        <Plus className="h-4 w-4" />
                        Create Goal
                    </button>
                </section>
            )}

            {/* =====================================================
          GOALS
      ====================================================== */}

            {goals.length > 0 && (
                <section>
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Your Goals
                            </h2>

                            <p className="text-xs text-zinc-500">
                                Keep building toward your targets.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {goals.map((goal) => (
                            <GoalCard
                                key={goal.id}
                                goal={goal}
                                onEdit={() => openEdit(goal)}
                                onDelete={() => setDeleteId(goal.id)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* =====================================================
          CREATE / EDIT
      ====================================================== */}

            {modalOpen && (
                <GoalModal
                    editingGoal={editingGoal}
                    form={form}
                    updateForm={updateForm}
                    onSubmit={handleSubmit}
                    onClose={closeModal}
                    isSubmitting={
                        createMutation.isPending ||
                        updateMutation.isPending
                    }
                    error={
                        createMutation.error ||
                        updateMutation.error
                    }
                />
            )}

            {/* =====================================================
          DELETE
      ====================================================== */}

            {deleteId !== null && (
                <DeleteModal
                    isDeleting={deleteMutation.isPending}
                    onCancel={() => setDeleteId(null)}
                    onConfirm={() => handleDelete(deleteId)}
                />
            )}
        </div>
        </div>
      );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
                         title,
                         value,
                         icon,
                         className,
                     }: {
    title: string;
    value: string;
    icon: React.ReactNode;
    className: string;
}) {
    return (
        <div className="min-w-0 rounded-xl border border-white/10 bg-[#0d0f15] p-4">
            <div className="flex items-center justify-between gap-2">
                <p className="truncate text-xs font-medium text-zinc-500">
                    {title}
                </p>

                <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${className}`}
                >
          <span className="h-4 w-4 [&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </span>
                </div>
            </div>

            <p className="mt-3 truncate text-lg font-bold text-white sm:text-xl">
                {value}
            </p>
        </div>
    );
}

/* =========================================================
   GOAL CARD
========================================================= */

function GoalCard({
                      goal,
                      onEdit,
                      onDelete,
                  }: {
    goal: SavingsGoal;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const progress = Math.min(
        Math.max(Number(goal.percentage), 0),
        100
    );

    const statusConfig = {
        COMPLETED: {
            label: "Completed",
            className:
                "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        },

        OVERDUE: {
            label: "Overdue",
            className:
                "bg-rose-500/10 text-rose-400 border-rose-500/20",
        },

        DUE_SOON: {
            label: "Due Soon",
            className:
                "bg-amber-500/10 text-amber-400 border-amber-500/20",
        },

        ON_TRACK: {
            label: "On Track",
            className:
                "bg-violet-500/10 text-violet-400 border-violet-500/20",
        },
    } as const;

    const status =
        statusConfig[goal.status] ?? statusConfig.ON_TRACK;

    const completed =
        goal.status === "COMPLETED" || progress >= 100;

    const overdue =
        goal.status === "OVERDUE";

    const dueSoon =
        goal.status === "DUE_SOON";

    return (
        <article
            className="
        min-w-0
        overflow-hidden
        rounded-2xl
        border border-white/10
        bg-[#0d0f15]
        p-5
        transition-all
        duration-300
        hover:border-violet-500/20
        hover:bg-[#10121a]
      "
        >
            {/* =========================================================
          HEADER
      ========================================================= */}

            <div className="flex min-w-0 items-start gap-3">
                {/* Goal Icon */}

                <div
                    className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${
                        completed
                            ? "bg-emerald-500/10"
                            : overdue
                                ? "bg-rose-500/10"
                                : "bg-violet-500/10"
                    }
          `}
                >
                    {completed ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : overdue ? (
                        <Target className="h-5 w-5 text-rose-400" />
                    ) : (
                        <Target className="h-5 w-5 text-violet-400" />
                    )}
                </div>

                {/* Goal information */}

                <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-2">
                        <h3 className="min-w-0 truncate text-sm font-semibold text-white">
                            {goal.name}
                        </h3>

                        {/* Status */}

                        <span
                            className={`
                hidden
                shrink-0
                rounded-full
                border
                px-2
                py-0.5
                text-[10px]
                font-medium
                sm:inline-flex
                ${status.className}
              `}
                        >
              {status.label}
            </span>
                    </div>

                    {/* Target date */}

                    <div className="mt-1 flex min-w-0 items-center gap-1 text-xs text-zinc-500">
                        <CalendarDays className="h-3 w-3 shrink-0" />

                        <span className="truncate">
              {formatDate(goal.targetDate)}
            </span>
                    </div>
                </div>

                {/* Actions */}

                <div className="flex shrink-0 items-center">
                    <button
                        type="button"
                        onClick={onEdit}
                        className="
              rounded-lg
              p-1.5
              text-zinc-500
              transition
              hover:bg-white/5
              hover:text-white
            "
                        aria-label="Edit goal"
                    >
                        <Edit3 className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={onDelete}
                        className="
              rounded-lg
              p-1.5
              text-zinc-500
              transition
              hover:bg-rose-500/10
              hover:text-rose-400
            "
                        aria-label="Delete goal"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* =========================================================
          MOBILE STATUS
      ========================================================= */}

            <div className="mt-3 sm:hidden">
        <span
            className={`
            inline-flex
            rounded-full
            border
            px-2
            py-1
            text-[10px]
            font-medium
            ${status.className}
          `}
        >
          {status.label}
        </span>
            </div>

            {/* =========================================================
          AMOUNT
      ========================================================= */}

            <div className="mt-5 grid grid-cols-2 gap-4">
                {/* Saved */}

                <div className="min-w-0">
                    <p className="text-[11px] text-zinc-500">
                        Saved
                    </p>

                    <p className="mt-1 truncate text-lg font-bold text-white">
                        {formatCurrency(goal.currentAmount)}
                    </p>
                </div>

                {/* Target */}

                <div className="min-w-0 text-right">
                    <p className="text-[11px] text-zinc-500">
                        Target
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-zinc-300">
                        {formatCurrency(goal.targetAmount)}
                    </p>
                </div>
            </div>

            {/* =========================================================
          PROGRESS
      ========================================================= */}

            <div className="mt-5">
                <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs text-zinc-500">
            Progress
          </span>

                    <span
                        className={`
              text-xs
              font-bold
              ${
                            completed
                                ? "text-emerald-400"
                                : overdue
                                    ? "text-rose-400"
                                    : "text-violet-400"
                        }
            `}
                    >
            {progress.toFixed(0)}%
          </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                        className={`
              h-full
              rounded-full
              transition-all
              duration-700
              ${progressColor(progress)}
            `}
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>
            </div>

            {/* =========================================================
          PROGRESS INFORMATION
      ========================================================= */}

            <div className="mt-4 grid grid-cols-2 gap-3">
                {/* Remaining */}

                <div
                    className="
            min-w-0
            rounded-xl
            border
            border-white/5
            bg-white/[0.03]
            p-3
          "
                >
                    <p className="text-[11px] text-zinc-500">
                        Remaining
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-white">
                        {formatCurrency(goal.remaining)}
                    </p>
                </div>

                {/* Days remaining */}

                <div
                    className="
            min-w-0
            rounded-xl
            border
            border-white/5
            bg-white/[0.03]
            p-3
          "
                >
                    <p className="text-[11px] text-zinc-500">
                        Days left
                    </p>

                    <p
                        className={`
              mt-1 truncate
              text-sm
              font-semibold
              ${
                            completed
                                ? "text-emerald-400"
                                : overdue
                                    ? "text-rose-400"
                                    : dueSoon
                                        ? "text-amber-400"
                                        : "text-white"
                        }
            `}
                    >
                        {completed
                            ? "Completed"
                            : overdue
                                ? "Past due"
                                : `${goal.daysRemaining} days`}
                    </p>
                </div>
            </div>

            {/* =========================================================
          SAVING PLAN
      ========================================================= */}

            {!completed &&
                !overdue &&
                goal.daysRemaining > 0 && (
                    <div
                        className="
              mt-3
              rounded-xl
              border
              border-violet-500/10
              bg-violet-500/5
              p-3
            "
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-zinc-300">
                                    Saving plan
                                </p>

                                <p className="mt-0.5 text-[11px] text-zinc-600">
                                    Amount needed to reach your target
                                </p>
                            </div>

                            <Target className="h-4 w-4 shrink-0 text-violet-400" />
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3">
                            {/* Daily */}

                            <div>
                                <p className="text-[11px] text-zinc-500">
                                    Daily
                                </p>

                                <p className="mt-1 truncate text-sm font-semibold text-violet-400">
                                    {formatCurrency(goal.requiredPerDay)}
                                </p>
                            </div>

                            {/* Monthly */}

                            <div className="text-right">
                                <p className="text-[11px] text-zinc-500">
                                    Monthly
                                </p>

                                <p className="mt-1 truncate text-sm font-semibold text-violet-400">
                                    {formatCurrency(goal.requiredPerMonth)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            {/* =========================================================
          COMPLETED STATE
      ========================================================= */}

            {completed && (
                <div
                    className="
            mt-3
            rounded-xl
            border
            border-emerald-500/20
            bg-emerald-500/5
            p-3
          "
                >
                    <div className="flex items-start gap-2.5">
                        <CheckCircle2
                            className="
                mt-0.5
                h-4
                w-4
                shrink-0
                text-emerald-400
              "
                        />

                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-emerald-400">
                                Goal completed
                            </p>

                            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                                You reached your savings target.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================
          OVERDUE STATE
      ========================================================= */}

            {overdue && !completed && (
                <div
                    className="
            mt-3
            rounded-xl
            border
            border-rose-500/20
            bg-rose-500/5
            p-3
          "
                >
                    <div className="flex items-start gap-2.5">
                        <Target
                            className="
                mt-0.5
                h-4
                w-4
                shrink-0
                text-rose-400
              "
                        />

                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-rose-400">
                                Target date passed
                            </p>

                            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                                Update the target date or increase your savings
                                to continue this goal.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================
          DUE SOON STATE
      ========================================================= */}

            {dueSoon && !completed && (
                <div
                    className="
            mt-3
            rounded-xl
            border
            border-amber-500/20
            bg-amber-500/5
            p-3
          "
                >
                    <div className="flex items-start gap-2.5">
                        <CalendarDays
                            className="
                mt-0.5
                h-4
                w-4
                shrink-0
                text-amber-400
              "
                        />

                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-amber-400">
                                Deadline approaching
                            </p>

                            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                                You have {goal.daysRemaining}{" "}
                                {goal.daysRemaining === 1
                                    ? "day"
                                    : "days"}{" "}
                                remaining to reach your target.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================
          FOOTER
      ========================================================= */}

            <div
                className="
          mt-4
          flex
          min-w-0
          items-center
          justify-between
          gap-3
          border-t
          border-white/5
          pt-4
        "
            >
        <span
            className={`
            min-w-0
            truncate
            text-xs
            ${
                completed
                    ? "text-emerald-400"
                    : overdue
                        ? "text-rose-400"
                        : "text-zinc-500"
            }
          `}
        >
          {completed
              ? "Goal completed"
              : overdue
                  ? `${formatCurrency(goal.remaining)} remaining`
                  : `${formatCurrency(goal.remaining)} remaining`}
        </span>

                <span className="shrink-0 text-[11px] text-zinc-600">
          Updated{" "}
                    {goal.updatedAt
                        ? formatDate(goal.updatedAt.slice(0, 10))
                        : "—"}
        </span>
            </div>
        </article>
    );
}

/* =========================================================
   GOAL MODAL
========================================================= */

function GoalModal({
                       editingGoal,
                       form,
                       updateForm,
                       onSubmit,
                       onClose,
                       isSubmitting,
                       error,
                   }: {
    editingGoal: SavingsGoal | null;
    form: SavingsGoalRequest;
    updateForm: (
        field: keyof SavingsGoalRequest,
        value: string | number
    ) => void;
    onSubmit: (
        event: React.FormEvent<HTMLFormElement>
    ) => void;
    onClose: () => void;
    isSubmitting: boolean;
    error: unknown;
}) {
    const errorMessage =
        error instanceof Error ? error.message : null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
            <div className="my-4 max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-[#101219] shadow-2xl">

                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#101219] px-5 py-4">
                    <div className="min-w-0">
                        <h2 className="truncate text-base font-semibold text-white">
                            {editingGoal
                                ? "Edit Savings Goal"
                                : "Create Savings Goal"}
                        </h2>

                        <p className="mt-0.5 text-xs text-zinc-500">
                            Set your target and start saving.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="shrink-0 rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form
                    onSubmit={onSubmit}
                    className="space-y-4 p-5"
                >
                    {errorMessage && (
                        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
                            {errorMessage}
                        </div>
                    )}

                    <FormField label="Goal name">
                        <input
                            type="text"
                            value={form.name}
                            maxLength={100}
                            required
                            placeholder="Emergency Fund"
                            onChange={(e) =>
                                updateForm("name", e.target.value)
                            }
                            className="input"
                        />
                    </FormField>

                    <FormField label="Target amount">
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            required
                            value={form.targetAmount || ""}
                            placeholder="100000"
                            onChange={(e) =>
                                updateForm(
                                    "targetAmount",
                                    Number(e.target.value)
                                )
                            }
                            className="input"
                        />
                    </FormField>

                    <FormField label="Current amount">
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.currentAmount || ""}
                            placeholder="0"
                            onChange={(e) =>
                                updateForm(
                                    "currentAmount",
                                    Number(e.target.value)
                                )
                            }
                            className="input"
                        />
                    </FormField>

                    <FormField label="Target date">
                        <input
                            type="date"
                            required
                            value={form.targetDate}
                            min={
                                new Date()
                                    .toISOString()
                                    .split("T")[0]
                            }
                            onChange={(e) =>
                                updateForm(
                                    "targetDate",
                                    e.target.value
                                )
                            }
                            className="input"
                        />
                    </FormField>

                    <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-400 disabled:opacity-50"
                        >
                            {isSubmitting && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}

                            {editingGoal
                                ? "Save Changes"
                                : "Create Goal"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
                       label,
                       children,
                   }: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                {label}
            </label>

            {children}
        </div>
    );
}

/* =========================================================
   DELETE MODAL
========================================================= */

function DeleteModal({
                         isDeleting,
                         onCancel,
                         onConfirm,
                     }: {
    isDeleting: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}) {
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#101219] p-5 shadow-2xl">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10">
                    <Trash2 className="h-5 w-5 text-rose-400" />
                </div>

                <h2 className="mt-4 text-base font-semibold text-white">
                    Delete this goal?
                </h2>

                <p className="mt-2 text-sm leading-5 text-zinc-500">
                    This action cannot be undone.
                </p>

                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-400 disabled:opacity-50"
                    >
                        {isDeleting && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}