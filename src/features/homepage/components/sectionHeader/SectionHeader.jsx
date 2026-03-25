import PropTypes from "prop-types";
import { ArrowRight } from "lucide-react";

// Section header with optional action button
export default function SectionHeader({
                                          eyebrow,
                                          title,
                                          text,
                                          actionLabel,
                                          onAction
                                      }) {
    return (
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
                {eyebrow && (
                    <span className="mb-3 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                        {eyebrow}
                    </span>
                )}

                <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                    {title}
                </h2>

                {text && (
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 md:text-base">
                        {text}
                    </p>
                )}
            </div>

            {actionLabel && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                    {actionLabel}
                    <ArrowRight className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

SectionHeader.propTypes = {
    eyebrow: PropTypes.string,
    title: PropTypes.string.isRequired,
    text: PropTypes.string,
    actionLabel: PropTypes.string,
    onAction: PropTypes.func,
};