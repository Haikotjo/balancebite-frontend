import PropTypes from "prop-types";
import { X } from "lucide-react";
import clsx from "clsx";

const variants = {
    danger:  "bg-error/10 border-error/40 text-error",
    amber:   "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-300",
    emerald: "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-300",
    teal:    "bg-primary/10 border-primary/40 text-primary",
    purple:  "bg-purple-500/10 border-purple-500/40 text-purple-600 dark:text-purple-300",
    blue:    "bg-blue-500/10 border-blue-500/40 text-blue-600 dark:text-blue-300",
};

const DietsFilterChip = ({ label, variant = "teal", onRemove }) => (
    <span
        className={clsx(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150 hover:opacity-80",
            variants[variant] ?? variants.teal
        )}
    >
        {label}
        <button
            type="button"
            onClick={onRemove}
            className="flex items-center justify-center rounded-full opacity-60 hover:opacity-100 transition-opacity"
            aria-label={`Remove ${label} filter`}
        >
            <X className="h-3 w-3" />
        </button>
    </span>
);

DietsFilterChip.propTypes = {
    label: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(Object.keys(variants)),
    onRemove: PropTypes.func.isRequired,
};

export default DietsFilterChip;