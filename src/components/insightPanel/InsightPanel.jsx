// InsightPanel — reusable nutrition insight component for diets and meals.
// Pass getGenericInsight and getPersonalizedInsight as props so the text
// logic stays in nutritionInsightHelpers.js and this component stays generic.

import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Lightbulb, ChevronDown, ArrowUpRight, Flame, Dumbbell, Wheat, Droplets, Droplet, Candy, Leaf, Zap } from "lucide-react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { RecommendedNutritionContext } from "../../context/RecommendedNutritionContext.jsx";
import { findNutrient } from "../../utils/helpers/nutritionInsightHelpers.js";

export default function InsightPanel({ item, getGenericInsight, getPersonalizedInsight, labels = {} }) {
    const [open, setOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const { recommendedNutrition, userProfile } = useContext(RecommendedNutritionContext);
    const navigate = useNavigate();

    const nutrients      = recommendedNutrition?.nutrients;
    const calories       = findNutrient(nutrients, "Energy kcal");
    const protein        = findNutrient(nutrients, "Protein");
    const carbs          = findNutrient(nutrients, "Carbohydrates");
    const fat            = findNutrient(nutrients, "Total lipid (fat)");
    const hasTargets     = !!(calories && protein && carbs && fat);
    // Profile is considered complete only when both weight and activityLevel are set
    const profileComplete = !!(userProfile?.weight && userProfile?.activityLevel);

    // ── Determine which state we're in ────────────────────────────────────────
    let insight     = null;
    let disclaimer  = null;
    let extraAction = null;
    let label       = labels.automated    ?? "Automated insight";

    if (!user) {
        insight = getGenericInsight(item);
        disclaimer = null;
        extraAction = (
            <div className="space-y-1.5">
                <p className="text-[10px] leading-relaxed text-content/35 italic">
                    No accurate insight available — these observations are based on general benchmarks only and do not account for your personal goals, body metrics, or activity level.
                </p>
                <p className="text-[10px] text-content/40">
                    <a href="/register" className="underline hover:text-primary transition-colors font-medium">
                        Sign up
                    </a>{" "}
                    and complete your profile to unlock personalised analysis.
                </p>
            </div>
        );
    } else if (!profileComplete || !hasTargets) {
        insight = getGenericInsight(item);
        // Override color to amber so it's clear this is incomplete
        if (insight) insight = { ...insight, color: "text-amber-400", border: "border-amber-400/30", bg: "bg-amber-400/[0.07]" };
        extraAction = (
            <div className="space-y-2">
                <div className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-2.5 py-2 space-y-1.5">
                    <p className="text-[10px] leading-relaxed text-amber-400/90 italic">
                        No accurate insight available — these observations are based on general benchmarks only and do not account for your personal goals, body metrics, or activity level.
                    </p>
                    <p className="text-[11px] font-semibold text-amber-400">
                        You&apos;re logged in but your profile is incomplete. Complete it now to unlock insights that are actually tailored to you — it makes a big difference.
                    </p>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); navigate("/profile"); }}
                        className="flex items-center gap-1 rounded-full bg-amber-400/25 border border-amber-400/50 px-2.5 py-1 text-[10px] font-semibold text-amber-400 hover:bg-amber-400/40 transition-colors"
                    >
                        Complete my profile
                        <ArrowUpRight className="h-3 w-3" />
                    </button>
                </div>
            </div>
        );
    } else {
        insight    = getPersonalizedInsight(item, { calories, protein, carbs, fat, activity: userProfile?.activityLevel, goal: userProfile?.goal });
        disclaimer = "Based on your personal nutrition targets from your profile.";
        label      = labels.personalized ?? "Personalised insight";
    }

    if (!insight) return null;

    const mc = insight.macroColors ?? {};
    const MACRO_ICONS = {
        cal:   <Flame    className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${mc.cal   ?? "text-content/40"}`} />,
        pro:   <Dumbbell className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${mc.pro   ?? "text-content/40"}`} />,
        carb:  <Wheat    className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${mc.carb  ?? "text-content/40"}`} />,
        fat:   <Droplets className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${mc.fat   ?? "text-content/40"}`} />,
        sat:   <Droplet  className={`h-3   w-3   shrink-0 mt-0.5 ${mc.sat   ?? "text-content/35"}`} />,
        sugar: <Candy    className={`h-3   w-3   shrink-0 mt-0.5 ${mc.sugar ?? "text-content/35"}`} />,
        fiber: <Leaf     className={`h-3   w-3   shrink-0 mt-0.5 ${mc.fiber  ?? "text-content/35"}`} />,
        sodium: <Zap     className={`h-3   w-3   shrink-0 mt-0.5 ${mc.sodium ?? "text-content/35"}`} />,
    };
    const MACRO_LABELS = {
        cal:   "Calories",
        pro:   "Protein",
        carb:  "Carbohydrates",
        fat:   "Fat",
        sat:   "Saturated / unsaturated",
        sugar: "Sugars",
        fiber:  "Fiber",
        sodium: "Sodium",
    };

    return (
        <div className={`mt-3 rounded-xl border ${insight.border} ${insight.bg} overflow-hidden`}>
            {/* Header / toggle */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left"
            >
                <div className="flex items-center gap-1.5 min-w-0">
                    <Lightbulb className={`h-3.5 w-3.5 shrink-0 ${insight.color}`} />
                    <span className={`text-[12px] font-bold shrink-0 ${insight.color}`}>{label}</span>
                    <span className="text-[10px] text-content/35 truncate italic">— by BalanceBite.</span>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-content/30 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>

            {/* Color reason — always visible summary */}
            {insight.colorReason && (
                <p className={`px-3 pb-2 text-[10px] italic leading-relaxed ${insight.color} opacity-60`}>
                    {insight.colorReason}
                </p>
            )}

            {/* Expandable body */}
            <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-3 pb-3 space-y-2">
                    {/* For non-logged-in users: disclaimer first, then story */}
                    {!user && extraAction}
                    {insight.items ? (
                        <ul className="space-y-2">
                            {insight.items.map((item) => {
                                const { key, text } = item;
                                return (
                                <li key={key} className={`flex items-start gap-2 ${item.indent ? "ml-4 opacity-90" : ""}`}>
                                    {MACRO_ICONS[key]}
                                    <span className={`leading-relaxed text-content/70 ${item.indent ? "text-[11px]" : "text-[12px]"}`}>
                                        <span className={`font-semibold ${item.indent ? "text-content/60" : "text-content/80"}`}>{MACRO_LABELS[key]}:</span>{" "}{text}
                                    </span>
                                </li>
                                );
                            })}
                        </ul>
                    ) : insight.text ? (
                        <p className={`text-[12px] leading-relaxed ${insight.color}`}>{insight.text}</p>
                    ) : null}
                    {/* For logged-in users without targets: action after text */}
                    {user && extraAction}
                    {disclaimer && (
                        <p className="text-[10px] leading-relaxed text-content/35 italic">{disclaimer}</p>
                    )}
                    {insight.dataNote && (
                        <p className="text-[10px] leading-relaxed text-content/25 italic">{insight.dataNote}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

InsightPanel.propTypes = {
    item: PropTypes.object.isRequired,
    getGenericInsight: PropTypes.func.isRequired,
    getPersonalizedInsight: PropTypes.func.isRequired,
    labels: PropTypes.shape({
        automated:    PropTypes.string,
        personalized: PropTypes.string,
    }),
};
