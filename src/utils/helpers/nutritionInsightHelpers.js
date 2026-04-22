// ── Shared utility ────────────────────────────────────────────────────────────
export function findNutrient(nutrients, name) {
    return nutrients?.find((n) => n.name === name)?.value ?? null;
}

// ── Activity / goal context phrases ──────────────────────────────────────────
function activityContext(level) {
    switch (level) {
        case "SEDENTARY":   return "given your mostly sedentary day";
        case "LIGHT":       return "with your light activity level";
        case "MODERATE":    return "with your regular training schedule";
        case "ACTIVE":      return "given how intensely you train";
        case "VERY_ACTIVE": return "given your very high daily output";
        default:            return "relative to your activity level";
    }
}

function goalContext(goal) {
    switch (goal) {
        case "WEIGHT_LOSS":                          return "lose weight";
        case "WEIGHT_LOSS_WITH_MUSCLE_MAINTENANCE": return "lose fat while holding on to muscle";
        case "MAINTENANCE":                         return "maintain your current weight";
        case "MAINTENANCE_WITH_MUSCLE_FOCUS":       return "maintain weight with a focus on muscle quality";
        case "WEIGHT_GAIN":                         return "support a steady weight gain phase";
        case "WEIGHT_GAIN_WITH_MUSCLE_FOCUS":       return "maximise muscle growth";
        default:                                    return "reach your goal";
    }
}

// ── Diet label helpers ────────────────────────────────────────────────────────
function proteinLabel(g) {
    if (g < 80) return "low";
    if (g <= 130) return "moderate";
    return "high";
}
function fatLabel(g) {
    if (g < 50) return "low";
    if (g <= 100) return "moderate";
    return "high";
}
function carbLabel(g) {
    if (g < 150) return "low";
    if (g <= 300) return "moderate";
    return "high";
}
function calorieLabel(kcal) {
    if (kcal < 1600) return "low";
    if (kcal <= 2800) return "moderate";
    return "high";
}

// Notability score: high/low = interesting, moderate = least interesting
function notabilityScore(label) {
    if (label === "high") return 3;
    if (label === "low") return 2;
    return 1;
}

// Safely derive border/bg from a color token — handles "text-primary" which has no "400"
function colorToStyle(color) {
    if (color === "text-primary") return { color, border: "border-primary/30", bg: "bg-primary/[0.07]" };
    return {
        color,
        border: color.replace("text-", "border-").replace("400", "400/30"),
        bg:     color.replace("text-", "bg-").replace("400", "400/[0.07]"),
    };
}

// Panel color based on most notable macro
function genericInsightStyle(pLabel, fLabel, cLabel, kcalLabel) {
    if (pLabel === "high") return { color: "text-emerald-400", border: "border-emerald-400/30", bg: "bg-emerald-400/[0.07]" };
    if (cLabel === "low") return { color: "text-primary", border: "border-primary/30", bg: "bg-primary/[0.07]" };
    if (kcalLabel === "low") return { color: "text-rose-400", border: "border-rose-400/30", bg: "bg-rose-400/[0.07]" };
    if (kcalLabel === "high") return { color: "text-orange-400", border: "border-orange-400/30", bg: "bg-orange-400/[0.07]" };
    if (cLabel === "high") return { color: "text-orange-400", border: "border-orange-400/30", bg: "bg-orange-400/[0.07]" };
    if (fLabel === "high") return { color: "text-orange-400", border: "border-orange-400/30", bg: "bg-orange-400/[0.07]" };
    return { color: "text-primary", border: "border-primary/30", bg: "bg-primary/[0.07]" };
}

// ── Diet quality items from three-state flags ────────────────────────────────
// personalized=true uses goal-oriented framing; personalized=false uses generic framing
function buildDietQualityItems(flagHighFiber, flagLowSugar, flagLowUnhealthyFats, personalized) {
    const items = [];
    if (flagHighFiber === true)
        items.push({ key: "fiber", text: personalized
            ? "All meals in this diet are rich in fiber (avg ≥6g/100g, data confirmed) — a consistent strength that supports your goals."
            : "All meals are rich in fiber (avg ≥6g/100g, data confirmed) — consistently supports digestive health and satiety." });
    else if (flagHighFiber === null)
        items.push({ key: "fiber", text: "Fiber data is incomplete for one or more meals — no reliable fiber conclusion can be drawn for this diet." });

    if (flagLowSugar === true)
        items.push({ key: "sugar", text: personalized
            ? "Low in sugars across all meals (avg ≤5g/100g, data confirmed) — supports steady energy and aligns well with most health goals."
            : "Low in sugars across all meals (avg ≤5g/100g, data confirmed) — a consistent positive for blood sugar management." });
    else if (flagLowSugar === null)
        items.push({ key: "sugar", text: "Sugar data is incomplete for one or more meals — the actual sugar content may be higher than what is shown." });

    if (flagLowUnhealthyFats === true)
        items.push({ key: "sat", text: personalized
            ? "Low saturated fat across all meals (avg ≤1.5g/100g, data confirmed) — favourable for cardiovascular health and aligns with a quality-focused diet."
            : "Low saturated fat across all meals (avg ≤1.5g/100g, data confirmed) — a consistent strength for long-term heart health." });
    else if (flagLowUnhealthyFats === null)
        items.push({ key: "sat", text: "Saturated fat data is incomplete for one or more meals — fat quality cannot be reliably assessed for this diet." });

    return items;
}

// ── Diet insights ─────────────────────────────────────────────────────────────

/**
 * Generic diet insight — no profile needed.
 * Items ordered by notability: high > low > moderate.
 * Returns { items: [{ key, text }], color, border, bg } or null.
 */
export function getGenericDietInsight(diet) {
    const { avgCalories, avgProtein, avgCarbs, avgFat } = diet;
    if (!avgCalories || avgProtein == null || avgCarbs == null || avgFat == null) return null;

    const pLabel = proteinLabel(avgProtein);
    const fLabel = fatLabel(avgFat);
    const cLabel = carbLabel(avgCarbs);
    const kcalLabel = calorieLabel(avgCalories);

    const macros = [
        { key: "pro", score: notabilityScore(pLabel) },
        { key: "carb", score: notabilityScore(cLabel) },
        { key: "fat", score: notabilityScore(fLabel) },
        { key: "cal", score: notabilityScore(kcalLabel) },
    ].sort((a, b) => b.score - a.score);

    const items = macros.map(({ key }) => {
        if (key === "pro") {
            const text = pLabel === "high"
                ? `${Math.round(avgProtein)}g per day — relatively high intake, which may point to a focus on muscle maintenance, recovery, or athletic performance.`
                : pLabel === "low"
                    ? `${Math.round(avgProtein)}g per day — on the lower end. This diet appears to treat protein as less of a priority, which can be typical of plant-based or general-health eating styles.`
                    : `${Math.round(avgProtein)}g per day — a moderate amount that tends to support general health and basic muscle maintenance.`;
            return { key, text };
        }
        if (key === "carb") {
            const text = cLabel === "low"
                ? `${Math.round(avgCarbs)}g per day — relatively low, suggesting a carb-restricted approach. Often used to manage energy intake, support fat loss, or improve metabolic flexibility.`
                : cLabel === "high"
                    ? `${Math.round(avgCarbs)}g per day — relatively high, making carbohydrates the dominant energy source. Commonly seen in diets suited for endurance athletes or high-volume training.`
                    : `${Math.round(avgCarbs)}g per day — moderate. Generally considered a balanced energy intake suitable for everyday activity levels.`;
            return { key, text };
        }
        if (key === "fat") {
            const text = fLabel === "high"
                ? `${Math.round(avgFat)}g per day — elevated, which may suggest a fat-forward or ketogenic-style approach where fat tends to serve as the primary fuel source.`
                : fLabel === "low"
                    ? `${Math.round(avgFat)}g per day — relatively lean, which generally reduces overall calorie density and leaves room for protein and carbs.`
                    : `${Math.round(avgFat)}g per day — a balanced level that tends to support normal bodily functions and provides a steady secondary energy source.`;
            return { key, text };
        }
        if (key === "cal") {
            const text = kcalLabel === "high"
                ? `${Math.round(avgCalories)} kcal per day — on the higher end. Often suits bulking phases or lifestyles with very high daily energy expenditure.`
                : kcalLabel === "low"
                    ? `${Math.round(avgCalories)} kcal per day — on the lower end. This appears to be a calorie-restricted approach, often used for weight loss when structured consistently.`
                    : `${Math.round(avgCalories)} kcal per day — a moderate total that generally aligns with daily energy requirements for most people.`;
            return { key, text };
        }
        return null;
    }).filter(Boolean);

    const colorReason = pLabel === "high"    ? "High protein — protein is the standout macro in this diet."
        : cLabel === "low"                   ? "Low-carb diet — carbohydrates are notably restricted."
        : kcalLabel === "low"                ? "Low calorie intake — below the average daily energy level."
        : kcalLabel === "high"               ? "High calorie intake — above the average daily energy level."
        : cLabel === "high"                  ? "High carb intake — carbohydrates dominate the energy."
        : fLabel === "high"                  ? "High fat intake — fat is the primary energy source."
        : "Balanced macros — no standout macro pushes the panel in either direction.";

    // Quality flags — three-state: true = confirmed, false = data complete but not notable (silent), null = incomplete
    const qualityItems = buildDietQualityItems(diet.flagHighFiber, diet.flagLowSugar, diet.flagLowUnhealthyFats, false);
    const mc = dietGenericMacroColors(pLabel, cLabel, fLabel, kcalLabel);
    mc.fiber = diet.flagHighFiber === true ? "text-emerald-400" : diet.flagHighFiber === null ? "text-amber-400/70" : "text-content/40";
    mc.sugar = diet.flagLowSugar  === true ? "text-emerald-400" : diet.flagLowSugar  === null ? "text-amber-400/70" : "text-content/40";
    mc.sat   = diet.flagLowUnhealthyFats === true ? "text-emerald-400" : diet.flagLowUnhealthyFats === null ? "text-amber-400/70" : mc.sat ?? "text-content/40";
    return { items: [...items, ...qualityItems], macroColors: mc, ...genericInsightStyle(pLabel, fLabel, cLabel, kcalLabel), colorReason };
}

/**
 * Personalised diet insight — compares diet averages to user's own targets.
 * Items ordered by deviation from target — biggest outlier leads.
 * Returns { items: [{ key, text }], color, border, bg } or null.
 */
export function getPersonalizedDietInsight(diet, targets) {
    const { avgCalories, avgProtein, avgCarbs, avgFat } = diet;
    if (!avgCalories || avgProtein == null || avgCarbs == null || avgFat == null) return null;

    const { calories, protein, carbs, fat, goal } = targets;
    const gl = goal ? goalContext(goal) : null;

    const calPct = Math.round(avgCalories / calories * 100);
    const proPct = Math.round(avgProtein / protein * 100);
    const carbPct = Math.round(avgCarbs / carbs * 100);
    const fatPct = Math.round(avgFat / fat * 100);

    const needsMuscle = goal === "WEIGHT_LOSS_WITH_MUSCLE_MAINTENANCE" || goal === "MAINTENANCE_WITH_MUSCLE_FOCUS" || goal === "WEIGHT_GAIN_WITH_MUSCLE_FOCUS";
    const isCutting = goal === "WEIGHT_LOSS" || goal === "WEIGHT_LOSS_WITH_MUSCLE_MAINTENANCE";
    const isBulking = goal === "WEIGHT_GAIN" || goal === "WEIGHT_GAIN_WITH_MUSCLE_FOCUS";

    // Goal-priority ordering: most important macro for this goal leads
    const priorityKey =
        (isCutting && !needsMuscle) ? "cal"
            : needsMuscle ? "pro"
                : isBulking ? "cal"
                    : null;

    const ranked = [
        { key: "cal", pct: calPct, value: Math.round(avgCalories) },
        { key: "pro", pct: proPct, value: Math.round(avgProtein) },
        { key: "carb", pct: carbPct, value: Math.round(avgCarbs) },
        { key: "fat", pct: fatPct, value: Math.round(avgFat) },
    ].sort((a, b) => {
        if (a.key === priorityKey) return -1;
        if (b.key === priorityKey) return 1;
        return Math.abs(b.pct - 100) - Math.abs(a.pct - 100);
    });

    const absProtein = Math.round(avgProtein);

    const items = ranked.map(({ key, pct, value }) => {
        if (key === "cal") {
            let text;
            if (isCutting) {
                if (pct < 70)
                    text = `${value} kcal/day — a significant deficit at ${pct}% of your target. Often effective for faster fat loss, though protein tends to become especially important at this level to help preserve muscle mass.`;
                else if (pct < 85)
                    text = `${value} kcal/day — a solid deficit at ${pct}% of your target. Generally considered a well-calibrated range for steady, sustainable fat loss.`;
                else if (pct <= 97)
                    text = `${value} kcal/day — a moderate deficit at ${pct}% of your target. Progress may be slower, but tends to be easier to sustain.`;
                else if (pct <= 115)
                    text = `${value} kcal/day — at or just above maintenance (${pct}% of your target). At this level, meaningful fat loss appears unlikely — reducing intake would help create a more effective deficit.`;
                else if (pct <= 200)
                    text = `${value} kcal/day — well above maintenance at ${pct}% of your target. This diet appears to be less aligned with your goal to ${gl} — weight gain tends to be more likely than fat loss at this intake.`;
                else
                    text = `${value} kcal/day — ${pct}% of your target, which is ${Math.round(pct / 100)}× your daily budget. Fat loss is very unlikely at this intake — the diet would likely need major restructuring to support your goal to ${gl}.`;
            } else if (isBulking) {
                if (pct > 200)
                    text = `${value} kcal/day — ${pct}% of your target. Well above what's typically needed even for an aggressive bulk; excess calories at this level are more likely to contribute to fat gain rather than muscle.`;
                else if (pct > 120)
                    text = `${value} kcal/day — an aggressive surplus at ${pct}% of your target. Often associated with faster mass gain, though some additional fat gain tends to be more likely at this level.`;
                else if (pct >= 105)
                    text = `${value} kcal/day — a clean surplus at ${pct}% of your target. Generally considered well-calibrated for leaner weight gain with a lower chance of unnecessary fat gain.`;
                else if (pct >= 98)
                    text = `${value} kcal/day — only slightly above maintenance (${pct}% of your target). That may be enough for slow progress, though a slightly larger surplus would tend to support your goal to ${gl} more clearly.`;
                else
                    text = `${value} kcal/day — below maintenance at ${pct}% of your target. That makes meaningful weight gain less likely, so a modest calorie increase would tend to better support your goal to ${gl}.`;
            } else {
                if (pct >= 95 && pct <= 105)
                    text = `${value} kcal/day — spot-on at ${pct}% of your target. Generally well-calibrated to support maintaining your current weight.`;
                else if (pct < 85)
                    text = `${value} kcal/day — a notable deficit at ${pct}% of your target. This diet appears to lean more toward fat loss than maintenance.`;
                else if (pct < 95)
                    text = `${value} kcal/day — a mild deficit at ${pct}% of your target. Slow, gradual weight loss may occur over time.`;
                else if (pct <= 115)
                    text = `${value} kcal/day — a mild surplus at ${pct}% of your target. Some gradual weight gain may occur over time; generally fine if muscle building is part of the focus.`;
                else if (pct <= 150)
                    text = `${value} kcal/day — a noticeable surplus at ${pct}% of your target. More than typically needed for maintenance, so some gradual fat gain may occur over time.`;
                else
                    text = `${value} kcal/day — significantly above maintenance at ${pct}% of your target. At this level, consistent weight gain appears quite likely.`;
            }
            return { key, text };
        }

        if (key === "pro") {
            let text;
            if (needsMuscle) {
                if (absProtein >= 160 || proPct >= 110)
                    text = `${absProtein}g/day — ${proPct}% of your target. Strong protein intake for your goal to ${gl}. This level appears well-positioned to support recovery and muscle retention across the day.`;
                else if (absProtein >= 120 || proPct >= 85)
                    text = `${absProtein}g/day — ${proPct}% of your target. Solid protein for your goal to ${gl}. Spreading it across 3–4 meals of roughly 30–40g each may help strengthen the overall muscle-building stimulus.`;
                else if (absProtein >= 80 || proPct >= 60)
                    text = `${absProtein}g/day — ${proPct}% of your target. On the low side for your goal to ${gl}. Raising protein here would likely make the diet more supportive of recovery and muscle maintenance.`;
                else
                    text = `${absProtein}g/day — just ${proPct}% of your target. Quite low for your goal to ${gl} — protein tends to be the most directly relevant lever here, and raising it would likely make a noticeable difference to how well the diet supports you.`;
            } else if (isCutting) {
                if (proPct >= 250)
                    text = `${absProtein}g/day — ${proPct}% of your target. Well above what's typically needed. The body has a practical upper limit for how much protein it can effectively use; beyond that, the extra grams tend to mainly add to the calorie total without additional benefit for muscle retention.`;
                else if (proPct >= 100)
                    text = `${absProtein}g/day — ${proPct}% of your target. Solid protein for a cutting phase — tends to support muscle retention in a deficit and helps with satiety.`;
                else if (proPct >= 75)
                    text = `${absProtein}g/day — ${proPct}% of your target. Adequate for a cut, though reaching your full target would tend to offer better support for muscle retention.`;
                else
                    text = `${absProtein}g/day — just ${proPct}% of your target. Lower protein in a deficit can make muscle retention harder — bringing this up would likely improve the diet meaningfully.`;
            } else {
                if (proPct >= 200)
                    text = `${absProtein}g/day — ${proPct}% of your target. Well above typical needs; the body has a practical upper limit for how much protein it can effectively use, and the rest tends to mainly contribute calories.`;
                else if (proPct >= 110)
                    text = `${absProtein}g/day — ${proPct}% of your target. Above goal, which is generally fine — tends to support muscle maintenance and appetite control.`;
                else if (proPct >= 85)
                    text = `${absProtein}g/day — ${proPct}% of your target. On track for your daily protein goal.`;
                else
                    text = `${absProtein}g/day — ${proPct}% of your target. Below your protein goal — more protein through the day would tend to better support muscle maintenance and satiety.`;
            }
            return { key, text };
        }

        if (key === "carb") {
            let text;
            if (pct < 50)
                text = `${value}g/day — ${pct}% of your carb target. Very low-carb. ${isCutting ? "This can work for fat loss, though energy levels and training performance may still be worth monitoring." : "This may tend to limit energy and performance, especially on more active days."}`;
            else if (pct < 80)
                text = `${value}g/day — ${pct}% of your target. Below your carb goal. ${isCutting ? "That can fit a cut well and tends to leave more room in the calorie budget." : "There may be room to add more energy here, especially on higher-activity days."}`;
            else if (pct <= 120)
                text = `${value}g/day — ${pct}% of your target. Closely matches your personal carbohydrate goal.`;
            else if (pct <= 150)
                text = `${value}g/day — ${pct}% of your target. Running above goal. ${isCutting ? "Worth trimming slightly to help protect the calorie deficit." : "Generally reasonable during higher-activity phases."}`;
            else if (pct <= 250)
                text = `${value}g/day — ${pct}% of your target. Significantly above your carb goal. ${isCutting ? "At this level holding a deficit tends to be more difficult — carbohydrate intake appears to be a major driver of the excess here." : "Worth reviewing portion sizes on the higher-carb meals."}`;
            else
                text = `${value}g/day — ${pct}% of your target. Very high carb intake — this appears to be a major driver of the overall calorie excess in this diet. ${isCutting ? "Substantially reducing carbs here would likely have the biggest single impact on the calorie total." : "This level tends to be well beyond what most activity levels require."}`;
            return { key, text };
        }

        if (key === "fat") {
            let text;
            if (pct > 400)
                text = `${value}g/day — ${pct}% of your fat target. Very high; at 9 kcal/g, fat at this level appears to be a dominant driver of the overall calorie excess. ${isCutting ? "This alone seems well beyond what fits a deficit — major reductions here would likely have the largest impact." : "Well beyond typical needs; significant reductions would likely help."}`;
            else if (pct > 200)
                text = `${value}g/day — ${pct}% of your target. Very high fat intake; at 9 kcal/g it adds up heavily. ${isCutting ? "This appears to be a significant barrier to maintaining a deficit — reducing fat substantially would tend to bring the diet much closer to your goal." : "Worth reviewing which meals are driving this."}`;
            else if (pct > 140)
                text = `${value}g/day — ${pct}% of your target. Above your fat goal; at 9 kcal/g it adds up quickly. ${isCutting ? "Bringing this down would tend to help protect the deficit." : "Generally fine if the overall calorie total is still where you want it."}`;
            else if (pct > 120)
                text = `${value}g/day — ${pct}% of your target. Slightly above your fat goal.`;
            else if (pct < 50)
                text = `${value}g/day — ${pct}% of your target. Very lean fat intake. It may be worth checking that essential fats are still consistently covered.`;
            else if (pct < 80)
                text = `${value}g/day — ${pct}% of your target. Below goal, which can help with calorie management, provided essential fats are still covered.`;
            else
                text = `${value}g/day — ${pct}% of your target. Matches your personal fat goal well.`;
            return { key, text };
        }

        return null;
    }).filter(Boolean);

    // Panel color: does the diet actually support the goal?
    const color = (isCutting && calPct >= 150) ? "text-rose-400"       // way over budget — clearly not a cut
        : (isCutting && calPct >= 100) ? "text-orange-400"              // at/above maintenance — won't cut
            : (isCutting && calPct < 85 && proPct >= 85) ? "text-primary"
                : (needsMuscle && proPct < 60) ? "text-rose-400"
                    : (needsMuscle && proPct >= 100) ? "text-emerald-400"
                        : (isBulking && calPct < 100) ? "text-rose-400"
                            : (isBulking && calPct >= 105 && proPct >= 85) ? "text-emerald-400"
                                : calPct < 85 ? "text-rose-400"
                                    : calPct > 115 ? "text-orange-400"
                                        : proPct >= 110 ? "text-emerald-400"
                                            : "text-primary";
    const { border, bg } = colorToStyle(color);

    const colorReason = (isCutting && calPct >= 150) ? `Calories at ${calPct}% of target while cutting — well above maintenance, fat loss is unlikely.`
        : (isCutting && calPct >= 100) ? `Calories at ${calPct}% of target while cutting — at or above maintenance, no real deficit.`
        : (isCutting && calPct < 85 && proPct >= 85) ? `Deficit at ${calPct}% of calorie target with adequate protein (${proPct}%) — well-positioned to cut.`
        : (needsMuscle && proPct < 60) ? `Protein at only ${proPct}% of target — too low to support the muscle goal.`
        : (needsMuscle && proPct >= 100) ? `Protein at ${proPct}% of target — well-supported for the muscle goal.`
        : (isBulking && calPct < 100) ? `Calories at ${calPct}% of target while bulking — below maintenance, weight gain is unlikely.`
        : (isBulking && calPct >= 105 && proPct >= 85) ? `Solid surplus at ${calPct}% of calorie target with adequate protein (${proPct}%) — good for bulking.`
        : calPct < 85 ? `Calories at ${calPct}% of target — a notable deficit.`
        : calPct > 115 ? `Calories at ${calPct}% of target — notably above budget.`
        : proPct >= 110 ? `Protein at ${proPct}% of target — above goal, supports maintenance and satiety.`
        : `On track — calories at ${calPct}% and protein at ${proPct}% of target.`;

    const qualityItemsP = buildDietQualityItems(diet.flagHighFiber, diet.flagLowSugar, diet.flagLowUnhealthyFats, true);
    const mcP = dietPersonalizedMacroColors(calPct, proPct, carbPct, fatPct);
    mcP.fiber = diet.flagHighFiber === true ? "text-emerald-400" : diet.flagHighFiber === null ? "text-amber-400/70" : "text-content/40";
    mcP.sugar = diet.flagLowSugar  === true ? "text-emerald-400" : diet.flagLowSugar  === null ? "text-amber-400/70" : "text-content/40";
    mcP.sat   = diet.flagLowUnhealthyFats === true ? "text-emerald-400" : diet.flagLowUnhealthyFats === null ? "text-amber-400/70" : mcP.sat ?? "text-content/40";
    return { items: [...items, ...qualityItemsP], macroColors: mcP, color, border, bg, colorReason };
}

// ── Meal label helpers ────────────────────────────────────────────────────────
// Based on % of kcal from each macro (ratio, not absolute grams)
function mealProteinRatioLabel(pct) {
    if (pct > 35) return "high";
    if (pct >= 15) return "moderate";
    return "low";
}
function mealCarbRatioLabel(pct) {
    if (pct > 55) return "high";
    if (pct >= 30) return "moderate";
    return "low";
}
function mealFatRatioLabel(pct) {
    if (pct > 45) return "high";
    if (pct >= 20) return "moderate";
    return "low";
}

// ── Meal context resolution ───────────────────────────────────────────────────
// Priority: MAIN_MEAL (lunch/dinner) > BREAKFAST > SNACK > NEUTRAL
// Tags are used as contextual framing only — nutrition data stays the primary source.
function resolveMealContext(tags) {
    if (!tags?.length) return "NEUTRAL";
    const upper = tags.map(t => t.toUpperCase());
    if (upper.some(t => t === "LUNCH" || t === "DINNER")) return "MAIN_MEAL";
    if (upper.some(t => t === "BREAKFAST")) return "BREAKFAST";
    if (upper.some(t => t === "SNACK")) return "SNACK";
    return "NEUTRAL";
}

// ── Context-aware calorie thresholds ─────────────────────────────────────────
const MEAL_KCAL_THRESHOLDS = {
    SNACK: { low: 200, high: 400 },
    BREAKFAST: { low: 300, high: 550 },
    MAIN_MEAL: { low: 450, high: 800 },
    NEUTRAL: { low: 300, high: 700 },
};

function mealCalorieLabelCtx(kcal, ctx) {
    const { low, high } = MEAL_KCAL_THRESHOLDS[ctx];
    if (kcal < low) return "low";
    if (kcal <= high) return "moderate";
    return "high";
}

// ── Sat-fat / sugar / fiber sub-item helpers ─────────────────────────────────

// Data note: brief single line if any sub-nutrients are absent from this meal/per100g item
function buildDataNote(satFat, sugars, fiber) {
    const missing = [];
    if (satFat == null) missing.push("sat/unsat fat breakdown");
    if (sugars == null) missing.push("sugars");
    if (fiber  == null) missing.push("fiber");
    if (missing.length === 0) return null;
    return `No data available for: ${missing.join(", ")}.`;
}

function satFatData(satFat, unsatFat, totalFat) {
    if (!satFat || !totalFat) return null;   // 0 means "no data available"
    const ratio = Math.round(satFat / totalFat * 100);
    return {
        satG:   Math.round(satFat),
        unsatG: unsatFat != null ? Math.round(unsatFat) : null,
        ratio,
        qual:   ratio > 65 ? "high" : ratio < 30 ? "low" : "moderate",
    };
}
function sugarData(sugars, totalCarbs) {
    if (!sugars) return null;   // 0 means "no data available"
    const g   = Math.round(sugars);
    const pct = totalCarbs > 0 ? Math.round(sugars / totalCarbs * 100) : 0;
    return { g, pct, level: pct > 60 ? "high" : pct < 20 ? "low" : "moderate" };
}
// Build the actual sub-item rows (per-serving / whole-meal amounts)
// If the value is present → show it cleanly. If absent → return null (caller skips it).
// flag === true adds a positive "confirmed" note. false/null = just show the value.
function buildFatSubItem(satFat, unsatFat, totalFat, flagLowUnhealthyFats = null) {
    const d = satFatData(satFat, unsatFat, totalFat);
    if (!d) return null;
    const breakdown = d.unsatG != null ? `${d.satG}g sat / ${d.unsatG}g unsat` : `${d.satG}g saturated`;
    if (flagLowUnhealthyFats === true)
        return { key: "sat", text: `${breakdown} — confirmed low saturated fat (≤1.5g/100g).`, indent: true };
    const qual = d.qual === "high" ? " — high saturated ratio" : d.qual === "low" ? " — mostly unsaturated (healthy fats)" : "";
    return { key: "sat", text: `${breakdown}${qual}.`, indent: true };
}
function buildSugarSubItem(sugars, totalCarbs, flagLowSugar = null) {
    const d = sugarData(sugars, totalCarbs);
    if (!d) return null;
    if (flagLowSugar === true)
        return { key: "sugar", text: `${d.g}g sugars (${d.pct}% of carbs) — confirmed low sugar (≤5g/100g).`, indent: true };
    const qual = d.level === "high" ? " — over half the carbs are sugars" : d.level === "low" ? " — low sugar" : "";
    return { key: "sugar", text: `${d.g}g sugars (${d.pct}% of carbs${qual}).`, indent: true };
}
function buildFiberSubItem(fiber, totalCarbs, flagHighFiber = null) {
    if (!fiber) return null;
    const pct = totalCarbs > 0 ? Math.round(fiber / totalCarbs * 100) : 0;
    if (flagHighFiber === true)
        return { key: "fiber", text: `${Math.round(fiber)}g fiber (${pct}% of carbs) — confirmed high fiber (≥6g/100g).`, indent: true };
    const qual = pct >= 30 ? " — high fiber ratio" : pct >= 10 ? "" : " — low fiber ratio";
    return { key: "fiber", text: `${Math.round(fiber)}g fiber (${pct}% of carbs${qual}).`, indent: true };
}
// Per-100g variants
function buildFatSubItemPer100g(satFat, unsatFat, totalFat, flagLowUnhealthyFats = null) {
    const d = satFatData(satFat, unsatFat, totalFat);
    if (!d) return null;
    const breakdown = d.unsatG != null ? `${d.satG}g sat / ${d.unsatG}g unsat` : `${d.satG}g saturated`;
    if (flagLowUnhealthyFats === true)
        return { key: "sat", text: `${breakdown} per 100g — confirmed low saturated fat (≤1.5g/100g).`, indent: true };
    const qual = d.qual === "high" ? " — high saturated ratio" : d.qual === "low" ? " — mostly unsaturated (healthy fats)" : "";
    return { key: "sat", text: `${breakdown} per 100g (${d.ratio}% of fat${qual}).`, indent: true };
}
function buildSugarSubItemPer100g(sugars, totalCarbs, flagLowSugar = null) {
    const d = sugarData(sugars, totalCarbs);
    if (!d) return null;
    if (flagLowSugar === true)
        return { key: "sugar", text: `${d.g}g sugars per 100g (${d.pct}% of carbs) — confirmed low sugar (≤5g/100g).`, indent: true };
    const qual = d.level === "high" ? " — over half the carbs are sugars" : d.level === "low" ? " — low sugar" : "";
    return { key: "sugar", text: `${d.g}g sugars per 100g (${d.pct}% of carbs${qual}).`, indent: true };
}
// Sodium — only shown when high; silent otherwise
const SODIUM_HIGH_MEAL   = 800;   // mg per meal — 40% of WHO daily limit
const SODIUM_HIGH_PER100 = 400;   // mg per 100g — e.g. processed meats, cured cheese

function buildSodiumItem(sodium, missingSodium = [], totalIngredientCount = 0) {
    if (!sodium) return null;
    const allMissing  = totalIngredientCount > 0 && missingSodium.length === totalIngredientCount;
    if (allMissing) return null;
    if (sodium < SODIUM_HIGH_MEAL) return null;
    const someMissing = missingSodium.length > 0;
    const pctDaily    = Math.round(sodium / 2000 * 100);
    const level       = sodium >= 1500 ? "very high" : "high";
    const note        = someMissing ? ` Sodium data is missing for ${missingSodium.join(", ")}, so the actual value may be higher.` : "";
    return { key: "sodium", text: `${Math.round(sodium)}mg sodium — ${level} for a single meal (${pctDaily}% of the recommended daily limit of 2000mg).${note}` };
}
function buildSodiumItemPer100g(sodium, missingSodium = [], totalIngredientCount = 0) {
    if (!sodium) return null;
    const allMissing  = totalIngredientCount > 0 && missingSodium.length === totalIngredientCount;
    if (allMissing) return null;
    if (sodium < SODIUM_HIGH_PER100) return null;
    const someMissing = missingSodium.length > 0;
    const level       = sodium >= 700 ? "very high" : "high";
    const note        = someMissing ? ` Sodium data is missing for ${missingSodium.join(", ")}, so the actual value may be higher.` : "";
    return { key: "sodium", text: `${Math.round(sodium)}mg sodium per 100g — ${level}. This ingredient contributes meaningfully to daily sodium intake.${note}` };
}
function buildFiberSubItemPer100g(fiber, totalCarbs, flagHighFiber = null) {
    if (!fiber) return null;
    const pct = totalCarbs > 0 ? Math.round(fiber / totalCarbs * 100) : 0;
    if (flagHighFiber === true)
        return { key: "fiber", text: `${Math.round(fiber)}g fiber per 100g (${pct}% of carbs) — confirmed high fiber (≥6g/100g).`, indent: true };
    const qual = pct >= 30 ? " — high fiber ratio" : pct >= 10 ? "" : " — low fiber ratio";
    return { key: "fiber", text: `${Math.round(fiber)}g fiber per 100g (${pct}% of carbs${qual}).`, indent: true };
}

// ── Meal insights ─────────────────────────────────────────────────────────────

/**
 * Generic meal insight — no profile needed.
 * Tags resolve a mealContext that frames the calorie interpretation.
 * Macro ratios (% of kcal) drive the nutritional character.
 * Items ordered by notability: high > low > moderate.
 * Returns { items: [{ key, text }], color, border, bg } or null.
 */
export function getGenericMealInsight(meal) {
    const { totalCalories, totalProtein, totalCarbs, totalFat, mealTypes,
            saturatedFat, unsaturatedFat, sugars, fiber, sodium,
            missingSatFat = [], missingSugar = [], missingFiber = [], missingSodium = [], totalIngredientCount = 0,
            flagHighFiber = null, flagLowSugar = null, flagLowUnhealthyFats = null } = meal;
    if (!totalCalories || totalProtein == null || totalCarbs == null || totalFat == null) return null;
    const sd       = satFatData(saturatedFat, unsaturatedFat, totalFat);
    const hasExtra = sd != null || sugars != null || fiber != null;

    const ctx = resolveMealContext(mealTypes);
    const proRatio = (totalProtein * 4 / totalCalories) * 100;
    const carbRatio = (totalCarbs * 4 / totalCalories) * 100;
    const fatRatio = (totalFat * 9 / totalCalories) * 100;

    const pLabel = mealProteinRatioLabel(proRatio);
    const cLabel = mealCarbRatioLabel(carbRatio);
    const fLabel = mealFatRatioLabel(fatRatio);
    const kcalLabel = mealCalorieLabelCtx(totalCalories, ctx);

    const macros = [
        { key: "pro", score: notabilityScore(pLabel) },
        { key: "carb", score: notabilityScore(cLabel) },
        { key: "fat", score: notabilityScore(fLabel) },
        { key: "cal", score: notabilityScore(kcalLabel) },
    ].sort((a, b) => b.score - a.score);

    const P = Math.round(totalProtein);
    const C = Math.round(totalCarbs);
    const F = Math.round(totalFat);
    const K = Math.round(totalCalories);
    const pPct = Math.round(proRatio);
    const cPct = Math.round(carbRatio);
    const fPct = Math.round(fatRatio);

    // Portion framing — contextual, not absolute
    const calText = {
        SNACK: {
            low: `${K} kcal — relatively light for a snack. Generally easy to fit into the day without much impact on the total.`,
            moderate: `${K} kcal — a moderate snack. Tends to work well as a between-meals bite.`,
            high: `${K} kcal — on the substantial side for a snack; closer to a small meal in caloric terms.`,
        },
        BREAKFAST: {
            low: `${K} kcal — a lighter breakfast. Generally leaves room to build from throughout the day.`,
            moderate: `${K} kcal — a moderate breakfast. Tends to be a reasonable start to the day.`,
            high: `${K} kcal — on the larger side for a breakfast. May suit more active mornings with higher energy demands.`,
        },
        MAIN_MEAL: {
            low: `${K} kcal — relatively light for a main meal. Tends to leave more room in the day.`,
            moderate: `${K} kcal — a moderate main meal. Generally a meaningful contribution to daily intake.`,
            high: `${K} kcal — a substantial main meal. May be worth balancing with the rest of the day.`,
        },
        NEUTRAL: {
            low: `${K} kcal — a light meal. Generally easy on the calorie budget and tends to fit well in most days.`,
            moderate: `${K} kcal — a moderate portion. Tends to be reasonable as a single meal depending on the rest of the day.`,
            high: `${K} kcal — a substantial meal. Takes up a relatively significant part of most daily totals.`,
        },
    };

    const items = macros.flatMap(({ key }) => {
        if (key === "cal") return [{ key, text: calText[ctx][kcalLabel] }];
        if (key === "pro") {
            const text = pLabel === "high"
                ? `${P}g — relatively protein-forward at ${pPct}% of calories. Often associated with recovery or keeping hunger at bay.`
                : pLabel === "low"
                    ? `${P}g — protein makes up just ${pPct}% of calories here. Pairing with a protein-rich side tends to round it out.`
                    : `${P}g — a moderate protein contribution at ${pPct}% of calories.`;
            return [{ key, text }];
        }
        if (key === "carb") {
            const text = cLabel === "high"
                ? `${C}g — carb-led at ${cPct}% of calories. Generally considered efficient fuel for training or higher-activity days.`
                : cLabel === "low"
                    ? `${C}g — relatively low-carb at ${cPct}% of calories. Tends to suit keto or carb-managed eating styles.`
                    : `${C}g — moderate carb content at ${cPct}% of calories. Generally a steady energy source.`;
            return [{ key, text }, buildSugarSubItem(sugars, totalCarbs, flagLowSugar), buildFiberSubItem(fiber, totalCarbs, flagHighFiber)].filter(Boolean);
        }
        if (key === "fat") {
            let text;
            if (fLabel === "high") {
                if (sd?.qual === "low")
                    text = `${F}g — relatively fat-dense at ${fPct}% of calories, though the fat appears predominantly unsaturated — generally considered the more beneficial kind for heart health and satiety.`;
                else if (sd?.qual === "high")
                    text = `${F}g — relatively fat-dense at ${fPct}% of calories, with a notably high saturated fat ratio. May be worth keeping in mind as part of the overall day.`;
                else
                    text = `${F}g — relatively fat-dense at ${fPct}% of this meal's energy. A small portion tends to go a long way calorie-wise.`;
            } else if (fLabel === "low") {
                text = `${F}g — lean fat-wise at ${fPct}% of calories. Generally leaves plenty of room in the fat budget for the day.`;
            } else {
                text = `${F}g — moderate fat content at ${fPct}% of calories.`;
            }
            return [{ key, text }, buildFatSubItem(saturatedFat, unsaturatedFat, totalFat, flagLowUnhealthyFats)].filter(Boolean);
        }
        return [];
    });

    const sodiumItem = buildSodiumItem(sodium, missingSodium, totalIngredientCount);
    if (sodiumItem) items.push(sodiumItem);

    // Only color for genuinely notable situations — low calories is not alarming on its own
    const color = pLabel === "high" ? "text-emerald-400"
        : kcalLabel === "high" ? "text-orange-400"
            : "text-primary";

    const colorReason = pLabel === "high"    ? "Protein-forward meal — protein ratio is high relative to total calories."
        : kcalLabel === "high"               ? `High calorie meal for a ${ctx.toLowerCase().replace("_", " ")} — substantial portion size.`
        : "Balanced — no macro stands out strongly enough to shift the panel tone.";

    const macroColors = mealMacroColors(pLabel, cLabel, fLabel, kcalLabel, sd, sugarData(sugars, totalCarbs));
    macroColors.sodium = sodiumItem ? "text-orange-400" : "text-content/40";
    macroColors.fiber  = flagHighFiber  === true ? "text-emerald-400" : flagHighFiber  === null && missingFiber.length  > 0 ? "text-amber-400/70" : "text-content/40";
    macroColors.sugar  = flagLowSugar   === true ? "text-emerald-400" : flagLowSugar   === null && missingSugar.length  > 0 ? "text-amber-400/70" : "text-content/40";
    macroColors.sat    = flagLowUnhealthyFats === true ? "text-emerald-400" : flagLowUnhealthyFats === null && missingSatFat.length > 0 ? "text-amber-400/70" : macroColors.sat;
    const dataNote = buildDataNote(saturatedFat, sugars, fiber);
    return { items, macroColors, ...colorToStyle(color), colorReason, ...(dataNote && { dataNote }) };
}

/**
 * Personalised meal insight — compares single meal to user's daily targets.
 * mealContext from tags frames the calorie interpretation.
 * Goal drives the tone of the advice.
 * Items ordered by deviation from daily target — biggest outlier leads.
 * Returns { items: [{ key, text }], color, border, bg } or null.
 */
export function getPersonalizedMealInsight(meal, targets) {
    const { totalCalories, totalProtein, totalCarbs, totalFat, mealTypes,
            saturatedFat, unsaturatedFat, sugars, fiber, sodium,
            missingSatFat = [], missingSugar = [], missingFiber = [], missingSodium = [], totalIngredientCount = 0,
            flagHighFiber = null, flagLowSugar = null, flagLowUnhealthyFats = null } = meal;
    if (!totalCalories || totalProtein == null || totalCarbs == null || totalFat == null) return null;
    const hasExtra = satFatData(saturatedFat, unsaturatedFat, totalFat) != null || sugars != null || fiber != null;

    const { calories, protein, carbs, fat, goal } = targets;
    const ctx = resolveMealContext(mealTypes);
    const gl = goal ? goalContext(goal) : null;

    const calPct = Math.round(totalCalories / calories * 100);
    const proPct = Math.round(totalProtein / protein * 100);
    const carbPct = Math.round(totalCarbs / carbs * 100);
    const fatPct = Math.round(totalFat / fat * 100);

    const needsMuscle = goal === "WEIGHT_LOSS_WITH_MUSCLE_MAINTENANCE" || goal === "MAINTENANCE_WITH_MUSCLE_FOCUS" || goal === "WEIGHT_GAIN_WITH_MUSCLE_FOCUS";
    const isCutting = goal === "WEIGHT_LOSS" || goal === "WEIGHT_LOSS_WITH_MUSCLE_MAINTENANCE";
    const isBulking = goal === "WEIGHT_GAIN" || goal === "WEIGHT_GAIN_WITH_MUSCLE_FOCUS";

    // Goal-priority ordering: put the most important macro first for this goal
    const priorityKey =
        (isCutting && !needsMuscle) ? "cal"
            : needsMuscle ? "pro"
                : isBulking ? "cal"
                    : null;

    const ranked = [
        { key: "cal", pct: calPct, value: Math.round(totalCalories) },
        { key: "pro", pct: proPct, value: Math.round(totalProtein) },
        { key: "carb", pct: carbPct, value: Math.round(totalCarbs) },
        { key: "fat", pct: fatPct, value: Math.round(totalFat) },
    ].sort((a, b) => {
        if (a.key === priorityKey) return -1;
        if (b.key === priorityKey) return 1;
        return Math.abs(b.pct - 100) - Math.abs(a.pct - 100);
    });

    // Context-aware framing for calorie text
    const ctxFrame = {
        SNACK: { small: "for a snack, this leaves room for meals later", big: "quite substantial for a snack" },
        BREAKFAST: { small: "as a breakfast, this leaves room for the rest of the day", big: "a larger breakfast" },
        MAIN_MEAL: { small: "light for a main meal", big: "appropriate for a main meal" },
        NEUTRAL: { small: "in the context of your day", big: "a generous portion" },
    };

    const absProtein = Math.round(totalProtein);

    const items = ranked.flatMap(({ key, pct, value }) => {
        if (key === "cal") {
            let text;
            const frame = ctxFrame[ctx];
            if (pct <= 15)
                text = `${value} kcal — ${pct}% of your daily target — ${frame.small}.`;
            else if (pct <= 25)
                text = `${value} kcal — ${pct}% of your daily target. ${isCutting ? "Fits well within a deficit, provided the rest of the day stays balanced." : isBulking ? `Light for a surplus day — ${frame.small}.` : `A smaller meal — ${frame.small}.`}`;
            else if (pct <= 35)
                text = `${value} kcal — ${pct}% of your daily calories. ${isCutting ? "A solid portion for a deficit day if the rest of the day stays consistent." : isBulking ? "A useful contribution toward a surplus." : `${frame.big.charAt(0).toUpperCase() + frame.big.slice(1)} — broadly on track.`}`;
            else if (pct <= 50)
                text = `${value} kcal — ${pct}% of your daily target. ${isCutting ? "That's a meaningful part of your calorie budget, so the rest of the day may need to stay lighter." : isBulking ? "A good chunk of your daily surplus — pairing it with enough protein would round it out well." : "Something to balance with the rest of the day."}`;
            else
                text = `${value} kcal — over half your daily target in one meal (${pct}%). ${isBulking ? `That pushes strongly toward your surplus, which can support your goal to ${gl}.` : isCutting ? `This leaves limited room for the rest of the day, so the remaining meals would likely need to stay lighter to still ${gl}.` : "The rest of the day would probably need to be lighter to stay balanced."}`;
            return [{ key, text }];
        }

        if (key === "pro") {
            let text;
            // For muscle goals: use absolute grams as primary signal, but keep the wording moderate
            if (needsMuscle) {
                if (absProtein >= 40)
                    text = `${absProtein}g — excellent protein for a muscle-focused meal. That's ${pct}% of your daily goal and sits comfortably in a range that typically supports muscle protein synthesis well.`;
                else if (absProtein >= 30)
                    text = `${absProtein}g — a strong protein serving for a muscle-focused meal. This is in a range that generally supports muscle protein synthesis well (${pct}% of your daily goal).`;
                else if (absProtein >= 20)
                    text = `${absProtein}g — a decent amount, but on the light side for a muscle-focused meal. Pushing closer to 30g+ per sitting tends to strengthen the muscle-building signal (${pct}% of your daily goal).`;
                else
                    text = `${absProtein}g — low for a muscle-focused meal (${pct}% of your daily goal). It still contributes to your daily total, though adding a protein source would make this meal more effective toward your goal to ${gl}.`;
            } else if (isCutting) {
                if (absProtein >= 30)
                    text = `${absProtein}g — strong protein for a deficit meal. Higher protein helps with satiety and supports muscle retention while cutting (${pct}% of your daily goal).`;
                else if (pct >= 25)
                    text = `${absProtein}g — a meaningful protein contribution (${pct}% of your daily goal). Adequate for a cut, though slightly more protein would usually improve satiety and support.`;
                else
                    text = `${absProtein}g — low protein for a cutting meal (${pct}% of your daily goal). On a deficit, adding a lean protein source would make this meal more effective for holding on to muscle.`;
            } else {
                if (pct >= 40)
                    text = `${absProtein}g — ${pct}% of your daily protein goal in one meal. Excellent for satiety and muscle support.`;
                else if (pct >= 20)
                    text = `${absProtein}g — ${pct}% of your daily protein goal. A solid contribution.`;
                else
                    text = `${absProtein}g — just ${pct}% of your daily protein goal. More protein elsewhere in the day would help balance things out.`;
            }
            return [{ key, text }];
        }

        if (key === "carb") {
            let text;
            if (pct > 40)
                text = `${value}g — ${pct}% of your daily carb target in one meal. ${isCutting ? "A relatively carb-heavy choice for a deficit day, so the rest of the day may need to stay tighter." : isBulking ? `Good fuel for your goal to ${gl}.` : "A carb-heavy meal, so the rest of the day may need balancing."}`;
            else if (pct >= 20)
                text = `${value}g — ${pct}% of your daily carb target. ${isCutting ? "A balanced carb intake that still leaves room for the rest of the day." : "A balanced contribution to your energy needs."}`;
            else
                text = `${value}g — just ${pct}% of your daily carb target. ${isCutting ? `Light on carbs, which can fit well with your goal to ${gl}.` : "Light on carbs and leaves room for other meals."}`;
            return [{ key, text }, buildSugarSubItem(sugars, totalCarbs, flagLowSugar), buildFiberSubItem(fiber, totalCarbs, flagHighFiber)].filter(Boolean);
        }

        if (key === "fat") {
            const sd = satFatData(saturatedFat, unsaturatedFat, totalFat);
            let text;
            if (pct > 40) {
                if (sd?.qual === "low")
                    text = `${value}g — ${pct}% of your daily fat target in one meal, but the fat here is predominantly unsaturated — the kind that supports heart health and sustained energy. ${isCutting ? "Still calorie-dense, so worth tracking, but the quality is a plus." : "Fat quality matters as much as quantity — this is on the healthy end."}`;
                else if (sd?.qual === "high")
                    text = `${value}g — ${pct}% of your daily fat target in one meal, with a notably high saturated fat ratio. ${isCutting ? "Both the quantity and quality are worth keeping in mind for the rest of the day." : "Worth being mindful of in the context of the full day."}`;
                else
                    text = `${value}g — ${pct}% of your daily fat target in one meal. ${isCutting ? "Fat is calorie-dense, so this is worth keeping in mind for the rest of the day." : "A relatively fat-heavy meal, which can still be fine in the context of the full day."}`;
            } else if (pct >= 20)
                text = `${value}g — ${pct}% of your daily fat target. Moderate — supports satiety without pushing calories too hard.`;
            else
                text = `${value}g — a lean ${pct}% of your daily fat target. Leaves plenty of room${isCutting ? `, which can support your goal to ${gl}` : " for fat from other meals"}.`;
            return [{ key, text }, buildFatSubItem(saturatedFat, unsaturatedFat, totalFat, flagLowUnhealthyFats)].filter(Boolean);
        }

        return [];
    }).filter(Boolean);

    // Panel color: flag meaningful deviations relative to personal targets
    const color = calPct > 150 ? "text-rose-400"                          // extreme calorie overload — clearly wrong for any goal
        : calPct < 5 ? "text-rose-400"                                    // barely anything in this meal — contributes almost nothing
        : (needsMuscle && absProtein < 15) ? "text-rose-400"              // very low protein for muscle goal
            : (needsMuscle && absProtein >= 30) ? "text-emerald-400"      // strong protein for muscle goal
                : calPct > 50 ? "text-orange-400"                         // majority of daily calories in one meal
                    : proPct >= 30 ? "text-emerald-400"                   // solid protein contribution (30%+ of daily goal)
                        : isCutting && carbPct > 40 ? "text-orange-400"   // carb-heavy for deficit goal
                            : "text-primary";
    const colorReason = calPct > 150                      ? `${calPct}% of your daily calories in one meal — extreme overload, not aligned with any goal.`
        : calPct < 5                                      ? `Only ${calPct}% of your daily calories — this meal barely contributes to your targets.`
        : (needsMuscle && absProtein < 15)                ? `Only ${absProtein}g protein — very low for a muscle-focused meal.`
        : (needsMuscle && absProtein >= 30)               ? `${absProtein}g protein — strong serving for a muscle-focused meal.`
        : calPct > 50                                     ? `${calPct}% of your daily calories in one meal — over half the budget.`
        : proPct >= 30                                    ? `${proPct}% of your daily protein goal in one meal — a solid contribution.`
        : (isCutting && carbPct > 40)                     ? `${carbPct}% of your daily carb target in one meal — carb-heavy for a deficit goal.`
        : `No major deviation — calories at ${calPct}% and protein at ${proPct}% of daily goal.`;

    const sodiumItemP = buildSodiumItem(sodium, missingSodium, totalIngredientCount);
    if (sodiumItemP) items.push(sodiumItemP);

    const _sd  = satFatData(saturatedFat, unsaturatedFat, totalFat);
    const _sugD = sugarData(sugars, totalCarbs);
    const macroColorsP = mealPersonalizedMacroColors(calPct, proPct, carbPct, fatPct, isCutting, _sd, _sugD);
    macroColorsP.sodium = sodiumItemP ? "text-orange-400" : "text-content/40";
    macroColorsP.fiber  = flagHighFiber  === true ? "text-emerald-400" : flagHighFiber  === null && missingFiber.length  > 0 ? "text-amber-400/70" : "text-content/40";
    macroColorsP.sugar  = flagLowSugar   === true ? "text-emerald-400" : flagLowSugar   === null && missingSugar.length  > 0 ? "text-amber-400/70" : "text-content/40";
    macroColorsP.sat    = flagLowUnhealthyFats === true ? "text-emerald-400" : flagLowUnhealthyFats === null && missingSatFat.length > 0 ? "text-amber-400/70" : macroColorsP.sat;
    const dataNote2 = buildDataNote(saturatedFat, sugars, fiber);
    return { items, macroColors: macroColorsP, ...colorToStyle(color), colorReason, ...(dataNote2 && { dataNote: dataNote2 }) };
}

// ── Meal per-100g insights ────────────────────────────────────────────────────

function per100gNotabilityScore(label) {
    if (label === "excellent" || label === "very_high") return 4;
    if (label === "high" || label === "none") return 3;
    if (label === "low" || label === "very_low") return 2;
    return 1; // moderate
}

function per100gInsightStyle(pLabel, cLabel, fLabel, kcalLabel) {
    if (pLabel === "excellent" || pLabel === "high") return { color: "text-emerald-400", border: "border-emerald-400/30", bg: "bg-emerald-400/[0.07]" };
    if (cLabel === "very_high") return { color: "text-orange-400", border: "border-orange-400/30", bg: "bg-orange-400/[0.07]" };
    if (fLabel === "very_high" || kcalLabel === "very_high" || kcalLabel === "high") return { color: "text-orange-400", border: "border-orange-400/30", bg: "bg-orange-400/[0.07]" };
    if (cLabel === "high" || fLabel === "high") return { color: "text-orange-400", border: "border-orange-400/30", bg: "bg-orange-400/[0.07]" };
    if (kcalLabel === "very_low") return { color: "text-rose-400", border: "border-rose-400/30", bg: "bg-rose-400/[0.07]" };
    return { color: "text-primary", border: "border-primary/30", bg: "bg-primary/[0.07]" };
}

// ── Macro icon colors ─────────────────────────────────────────────────────────
// Returns { cal, pro, carb, fat } — Tailwind text-color classes.
// InsightPanel uses these to color each macro icon good / neutral / warning.

function per100gMacroColors(pLabel, cLabel, fLabel, kcalLabel) {
    return {
        pro: pLabel === "excellent" || pLabel === "high" ? "text-emerald-400"
            : pLabel === "none" || pLabel === "low" ? "text-rose-400/70"
                : "text-content/40",
        carb: cLabel === "very_high" || cLabel === "high" ? "text-orange-400" : "text-content/40",
        fat: fLabel === "very_high" ? "text-orange-400" : fLabel === "high" ? "text-orange-400" : "text-content/40",
        cal: kcalLabel === "very_high" || kcalLabel === "high" ? "text-orange-400"
            : kcalLabel === "very_low" ? "text-rose-400"
                : "text-content/40",
    };
}

function mealMacroColors(pLabel, cLabel, fLabel, kcalLabel, satD, sugD) {
    return {
        pro:   pLabel === "high" ? "text-emerald-400" : pLabel === "low" ? "text-rose-400/70" : "text-content/40",
        carb:  cLabel === "high" ? "text-orange-400" : "text-content/40",
        fat:   fLabel === "high" ? "text-orange-400" : "text-content/40",
        cal:   kcalLabel === "high" ? "text-orange-400" : "text-content/40",
        sat:   satD?.qual === "high" ? "text-orange-400" : satD?.qual === "low" ? "text-content/40" : "text-content/40",
        sugar: sugD?.level === "high" ? "text-orange-400" : "text-content/40",
    };
}

function mealPersonalizedMacroColors(calPct, proPct, carbPct, fatPct, isCutting, satD, sugD) {
    return {
        cal:   calPct > 50 ? "text-orange-400" : "text-content/40",
        pro:   proPct >= 40 ? "text-emerald-400" : proPct < 15 ? "text-rose-400/70" : "text-content/40",
        carb:  carbPct > 40 && isCutting ? "text-orange-400" : "text-content/40",
        fat:   fatPct > 40 ? "text-orange-400" : "text-content/40",
        sat:   satD?.qual === "high" ? "text-orange-400" : satD?.qual === "low" ? "text-content/40" : "text-content/40",
        sugar: sugD?.level === "high" ? "text-orange-400" : "text-content/40",
    };
}

function dietGenericMacroColors(pLabel, cLabel, fLabel, kcalLabel) {
    return {
        cal: kcalLabel === "high" ? "text-orange-400" : kcalLabel === "low" ? "text-rose-400/70" : "text-content/40",
        pro: pLabel === "high" ? "text-emerald-400" : pLabel === "low" ? "text-rose-400/70" : "text-content/40",
        carb: cLabel === "high" ? "text-orange-400" : cLabel === "low" ? "text-content/40" : "text-content/40",
        fat: fLabel === "high" ? "text-orange-400" : "text-content/40",
    };
}

function dietPersonalizedMacroColors(calPct, proPct, carbPct, fatPct) {
    return {
        cal: calPct < 85 ? "text-rose-400" : calPct > 115 ? "text-orange-400" : "text-content/40",
        pro: proPct >= 115 ? "text-emerald-400" : proPct < 60 ? "text-rose-400/70" : "text-content/40",
        carb: carbPct > 130 ? "text-orange-400" : carbPct < 50 ? "text-rose-400/60" : "text-content/40",
        fat: fatPct > 130 ? "text-orange-400" : "text-content/40",
    };
}

/**
 * Generic per-100g meal insight — no profile needed.
 * Uses ingredient label functions (designed for per-100g values).
 * Items ordered by notability.
 * Returns { items: [{ key, text }], color, border, bg } or null.
 */
export function getGenericMealPer100gInsight(per100g) {
    const { calories, protein, carbs, fat, saturatedFat, unsaturatedFat, sugars, fiber, sodium,
            missingSatFat = [], missingSugar = [], missingFiber = [], missingSodium = [], totalIngredientCount = 0,
            flagHighFiber = null, flagLowSugar = null, flagLowUnhealthyFats = null } = per100g;
    if (!calories || protein == null || carbs == null || fat == null) return null;

    const pLabel    = ingredientProteinLabel(protein);
    const cLabel    = ingredientCarbLabel(carbs);
    const fLabel    = ingredientFatLabel(fat);
    const kcalLabel = ingredientCalorieLabel(calories);
    const sd        = satFatData(saturatedFat, unsaturatedFat, fat);
    const hasExtra  = sd != null || sugars != null;

    const macros = [
        { key: "pro", score: per100gNotabilityScore(pLabel) },
        { key: "carb", score: per100gNotabilityScore(cLabel) },
        { key: "fat", score: per100gNotabilityScore(fLabel) },
        { key: "cal", score: per100gNotabilityScore(kcalLabel) },
    ].sort((a, b) => b.score - a.score);

    const items = macros.flatMap(({ key }) => {
        if (key === "pro")  return [{ key, text: getIngredientProteinInsight(protein) }];
        if (key === "carb") return [{ key, text: getIngredientCarbInsight(carbs) }, buildSugarSubItemPer100g(sugars, carbs, flagLowSugar), buildFiberSubItemPer100g(fiber, carbs, flagHighFiber)].filter(Boolean);
        if (key === "fat")  return [{ key, text: getIngredientFatInsight(fat) }, buildFatSubItemPer100g(saturatedFat, unsaturatedFat, fat, flagLowUnhealthyFats)].filter(Boolean);
        if (key === "cal")  return [{ key, text: getIngredientCalorieInsight(calories) }];
        return [];
    });

    const macroColors = { ...per100gMacroColors(pLabel, cLabel, fLabel, kcalLabel),
        sat:   flagLowUnhealthyFats === true ? "text-emerald-400" : flagLowUnhealthyFats === null && missingSatFat.length > 0 ? "text-amber-400/70" : sd?.qual === "high" ? "text-orange-400" : "text-content/40",
        sugar: flagLowSugar === true ? "text-emerald-400" : flagLowSugar === null && missingSugar.length > 0 ? "text-amber-400/70" : sugarData(sugars, carbs)?.level === "high" ? "text-orange-400" : "text-content/40",
        fiber: flagHighFiber === true ? "text-emerald-400" : flagHighFiber === null && missingFiber.length > 0 ? "text-amber-400/70" : "text-content/40",
    };
    const sodiumItem100g = buildSodiumItemPer100g(sodium, missingSodium, totalIngredientCount);
    if (sodiumItem100g) items.push(sodiumItem100g);

    const colorReason = (pLabel === "excellent" || pLabel === "high") ? "High protein density — this ingredient is a strong protein source."
        : cLabel === "very_high"             ? "Very high carb density — carbs dominate this ingredient."
        : (fLabel === "very_high" || kcalLabel === "very_high" || kcalLabel === "high") ? "High calorie or fat density — a little of this adds up quickly."
        : (cLabel === "high" || fLabel === "high") ? "Notably high in carbs or fat per 100g."
        : kcalLabel === "very_low"           ? "Almost calorie-free — great for adding volume without calories."
        : "Moderate across all macros — no single nutrient stands out.";

    macroColors.sodium = sodiumItem100g ? "text-orange-400" : "text-content/40";
    const dataNote100g = buildDataNote(saturatedFat, sugars, fiber);
    return { items, macroColors, ...per100gInsightStyle(pLabel, cLabel, fLabel, kcalLabel),
             colorReason, ...(dataNote100g && { dataNote: dataNote100g }) };
}

/**
 * Personalised per-100g meal insight — uses goal for context only.
 * Activity level is already baked into the nutrition targets, so we don't repeat it here.
 * Falls back to generic if goal is not available.
 * Returns { items: [{ key, text }], color, border, bg } or null.
 */
export function getPersonalizedMealPer100gInsight(per100g, targets) {
    const { calories, protein, carbs, fat, saturatedFat, unsaturatedFat, sugars, fiber, sodium,
            missingSatFat = [], missingSugar = [], missingFiber = [], missingSodium = [], totalIngredientCount = 0,
            flagHighFiber = null, flagLowSugar = null, flagLowUnhealthyFats = null } = per100g;
    if (!calories || protein == null || carbs == null || fat == null) return null;

    const { goal, calories: tCal, protein: tPro, carbs: tCarb, fat: tFat } = targets;
    if (!goal) return getGenericMealPer100gInsight(per100g);

    const gl = goalContext(goal);

    const pLabel = ingredientProteinLabel(protein);
    const cLabel = ingredientCarbLabel(carbs);
    const fLabel = ingredientFatLabel(fat);
    const kcalLabel = ingredientCalorieLabel(calories);

    const needsMuscle = goal === "WEIGHT_LOSS_WITH_MUSCLE_MAINTENANCE" || goal === "MAINTENANCE_WITH_MUSCLE_FOCUS" || goal === "WEIGHT_GAIN_WITH_MUSCLE_FOCUS";
    const isCutting = goal === "WEIGHT_LOSS" || goal === "WEIGHT_LOSS_WITH_MUSCLE_MAINTENANCE";
    const isBulking = goal === "WEIGHT_GAIN" || goal === "WEIGHT_GAIN_WITH_MUSCLE_FOCUS";

    // % of personal daily target covered by 100g of this ingredient
    const calPct  = tCal  ? Math.round(calories / tCal  * 100) : null;
    const proPct  = tPro  ? Math.round(protein  / tPro  * 100) : null;
    const carbPct = tCarb ? Math.round(carbs    / tCarb * 100) : null;
    const fatPct  = tFat  ? Math.round(fat      / tFat  * 100) : null;

    const macros = [
        { key: "pro", score: per100gNotabilityScore(pLabel) },
        { key: "carb", score: per100gNotabilityScore(cLabel) },
        { key: "fat", score: per100gNotabilityScore(fLabel) },
        { key: "cal", score: per100gNotabilityScore(kcalLabel) },
    ].sort((a, b) => b.score - a.score);

    const sd_p      = satFatData(saturatedFat, unsaturatedFat, fat);
    const hasExtra  = sd_p != null || sugars != null;

    const items = macros.flatMap(({ key }) => {
        if (key === "pro") {
            const pctStr = proPct != null ? ` — that's ${proPct}% of your daily protein target per 100g` : "";
            const text = pLabel === "excellent"
                ? `${protein}g per 100g — excellent protein density${pctStr}. ${needsMuscle ? "A very strong fit for a muscle-focused approach." : "One of the more efficient ways to raise protein intake."}`
                : pLabel === "high"
                    ? `${protein}g per 100g — solid protein content${pctStr}. ${needsMuscle ? "A good fit for your goal to " + gl + "." : "A strong building block for muscle repair and satiety."}`
                    : pLabel === "moderate"
                        ? `${protein}g per 100g — a decent protein contribution${pctStr}. ${needsMuscle ? "Reasonable, though pairing it with another protein source would make it more supportive of your goal to " + gl + "." : "Works well alongside other protein-containing ingredients."}`
                        : pLabel === "low"
                            ? `${protein}g per 100g — light on protein${pctStr}. ${needsMuscle ? "Relatively low for your goal to " + gl + ", so pairing it with a stronger protein source would make more sense." : "Useful alongside other sources, but not a standout protein food."}`
                            : `${protein}g per 100g — barely any protein${pctStr}. ${needsMuscle ? "On its own this is not especially supportive of your goal to " + gl + ", so it would make more sense next to a protein-rich food." : "Fine as a flavour base or side, but not a meaningful protein source."}`;
            return { key, text };
        }
        if (key === "carb") {
            const pctStr = carbPct != null ? ` (${carbPct}% of your daily carb target per 100g)` : "";
            const text = cLabel === "very_high"
                ? `${carbs}g per 100g — very high in carbs${pctStr}. ${isCutting ? "Portion size matters here if you want to stay aligned with your goal to " + gl + "." : isBulking ? "An efficient way to bring in extra energy for your goal to " + gl + "." : "Efficient fuel, though portion size still matters."}`
                : cLabel === "high"
                    ? `${carbs}g per 100g — carb-rich${pctStr}. ${isCutting ? "Worth tracking portions carefully for your goal to " + gl + "." : "Useful fuel, especially on higher-energy days."}`
                    : cLabel === "moderate"
                        ? `${carbs}g per 100g — moderate carb content${pctStr}. A steady energy source${isCutting ? " where portion size remains the main lever" : ""}.`
                        : cLabel === "low"
                            ? `${carbs}g per 100g — low in carbs${pctStr}. ${isCutting ? "That can fit well within a weight-loss approach, depending on portion size." : "Leaves plenty of room in your carb budget."}`
                            : `${carbs}g per 100g — virtually carb-free${pctStr}. ${isCutting ? "That can fit very easily within your goal to " + gl + "." : "Won't contribute much to carb intake."}`;
            return [{ key, text }, buildSugarSubItemPer100g(sugars, carbs, flagLowSugar), buildFiberSubItemPer100g(fiber, carbs, flagHighFiber)].filter(Boolean);
        }
        if (key === "fat") {
            const pctStr = fatPct != null ? ` (${fatPct}% of your daily fat target per 100g)` : "";
            const text = fLabel === "very_high"
                ? `${fat}g per 100g — very fat-dense${pctStr}. ${isCutting ? "Even a modest portion can add up quickly, so this is something to measure more carefully while trying to " + gl + "." : "A little goes a long way here."}`
                : fLabel === "high"
                    ? `${fat}g per 100g — high in fat, so fairly calorie-dense${pctStr}. ${isCutting ? "Worth portioning with some care if you want to stay aligned with your goal to " + gl + "." : "Can still fit well, though portion size matters."}`
                    : fLabel === "moderate"
                        ? `${fat}g per 100g — moderate fat${pctStr}. Contributes to satiety without going overboard${isCutting ? ", which can be useful while working toward " + gl : ""}.`
                        : fLabel === "low"
                            ? `${fat}g per 100g — light on fat${pctStr}. ${isCutting ? "Easy to include while working toward " + gl + "." : "Leaves room for fat from other ingredients."}`
                            : `${fat}g per 100g — essentially fat-free${pctStr}. Keeps calorie density low${isCutting ? ", which can make it easy to fit into your goal to " + gl : ""}.`;
            return [{ key, text }, buildFatSubItemPer100g(saturatedFat, unsaturatedFat, fat, flagLowUnhealthyFats)].filter(Boolean);
        }
        if (key === "cal") {
            const pctStr = calPct != null ? ` (${calPct}% of your daily calorie target per 100g)` : "";
            const text = kcalLabel === "very_high"
                ? `${calories} kcal per 100g — very calorie-dense${pctStr}. ${isCutting ? "Even small portions can have a meaningful calorie impact, so weighing it is usually the safest approach." : isBulking ? "An efficient way to bring calories up for your goal to " + gl + "." : "Small portions can add up quickly here."}`
                : kcalLabel === "high"
                    ? `${calories} kcal per 100g — calorie-dense${pctStr}. ${isCutting ? "Worth weighing rather than eyeballing if you want to stay aligned with your goal to " + gl + "." : "A filling ingredient that makes a noticeable contribution to daily intake."}`
                    : kcalLabel === "moderate"
                        ? `${calories} kcal per 100g — average calorie density${pctStr}. Portion size is still the key lever here${gl ? " for your goal to " + gl : ""}.`
                        : kcalLabel === "low"
                            ? `${calories} kcal per 100g — light${pctStr}. ${isCutting ? "Easy to include quite freely while staying aligned with your goal to " + gl + "." : "Won't put much pressure on your calorie budget."}`
                            : `${calories} kcal per 100g — almost calorie-free${pctStr}. You can be fairly generous with this ingredient${isCutting ? " while working toward " + gl : ""}.`;
            return [{ key, text }];
        }
        return [];
    }).filter(Boolean);

    const macroColors_p = { ...per100gMacroColors(pLabel, cLabel, fLabel, kcalLabel),
        sat:   flagLowUnhealthyFats === true ? "text-emerald-400" : flagLowUnhealthyFats === null && missingSatFat.length > 0 ? "text-amber-400/70" : sd_p?.qual === "high" ? "text-orange-400" : "text-content/40",
        sugar: flagLowSugar === true ? "text-emerald-400" : flagLowSugar === null && missingSugar.length > 0 ? "text-amber-400/70" : sugarData(sugars, carbs)?.level === "high" ? "text-orange-400" : "text-content/40",
        fiber: flagHighFiber === true ? "text-emerald-400" : flagHighFiber === null && missingFiber.length > 0 ? "text-amber-400/70" : "text-content/40",
    };
    const colorReason = (pLabel === "excellent" || pLabel === "high") ? "High protein density — a strong fit for raising daily protein intake."
        : cLabel === "very_high"             ? "Very high carb density — portion control matters here."
        : (fLabel === "very_high" || kcalLabel === "very_high" || kcalLabel === "high") ? "High calorie or fat density — even a small portion has a meaningful impact on your budget."
        : (cLabel === "high" || fLabel === "high") ? "Notably high in carbs or fat per 100g relative to general benchmarks."
        : kcalLabel === "very_low"           ? "Almost calorie-free — easy to use generously without affecting your targets."
        : "Moderate across all macros — no single nutrient drives the panel color.";

    const sodiumItem100gP = buildSodiumItemPer100g(sodium, missingSodium, totalIngredientCount);
    if (sodiumItem100gP) items.push(sodiumItem100gP);
    macroColors_p.sodium = sodiumItem100gP ? "text-orange-400" : "text-content/40";

    const dataNote100gP = buildDataNote(saturatedFat, sugars, fiber);
    return { items, macroColors: macroColors_p, ...per100gInsightStyle(pLabel, cLabel, fLabel, kcalLabel),
             colorReason, ...(dataNote100gP && { dataNote: dataNote100gP }) };
}

// ── Ingredient label helpers (per 100g) ───────────────────────────────────────
export function ingredientProteinLabel(g) {
    if (g < 3) return "none";
    if (g < 8) return "low";
    if (g < 15) return "moderate";
    if (g < 25) return "high";
    return "excellent";
}
export function ingredientCarbLabel(g) {
    if (g < 5) return "none";
    if (g < 15) return "low";
    if (g < 30) return "moderate";
    if (g < 50) return "high";
    return "very_high";
}
export function ingredientFatLabel(g) {
    if (g < 2) return "none";
    if (g < 7) return "low";
    if (g < 15) return "moderate";
    if (g < 30) return "high";
    return "very_high";
}
export function ingredientCalorieLabel(kcal) {
    if (kcal < 50) return "very_low";
    if (kcal < 150) return "low";
    if (kcal < 300) return "moderate";
    if (kcal < 500) return "high";
    return "very_high";
}

// ── Generic ingredient insights (no profile) ─────────────────────────────────
export function getIngredientProteinInsight(g) {
    switch (ingredientProteinLabel(g)) {
        case "none": return `${g}g per 100g — barely any protein. Generally fine as a flavour base or side, but tends not to contribute much to daily intake.`;
        case "low": return `${g}g per 100g — a relatively small protein contribution. Often works better stacked with other sources rather than as a standalone protein food.`;
        case "moderate": return `${g}g per 100g — a moderate protein source. Tends to pair well with other ingredients to build a more protein-complete meal.`;
        case "high": return `${g}g per 100g — relatively solid protein content. Often used as a building block for muscle repair and satiety.`;
        case "excellent": return `${g}g per 100g — relatively high protein density. Generally one of the more efficient ways to raise daily protein intake.`;
    }
}
export function getIngredientCarbInsight(g) {
    switch (ingredientCarbLabel(g)) {
        case "none": return `${g}g per 100g — virtually carb-free. Tends to suit low-carb or keto-style meals well.`;
        case "low": return `${g}g per 100g — relatively low in carbs. Generally leaves plenty of room in the carb budget for the rest of the day.`;
        case "moderate": return `${g}g per 100g — moderate carb content. Tends to work as a steady energy source across most balanced eating styles.`;
        case "high": return `${g}g per 100g — relatively carb-rich. Often a useful fuel source for active days or around training, though portion size may still matter.`;
        case "very_high": return `${g}g per 100g — relatively high in carbs. Often used as efficient energy for endurance or high-intensity training, though a small portion can already cover a lot calorically.`;
    }
}
export function getIngredientFatInsight(g) {
    switch (ingredientFatLabel(g)) {
        case "none": return `${g}g per 100g — essentially fat-free. Generally keeps calorie density low and leaves room for other macros.`;
        case "low": return `${g}g per 100g — relatively light on fat. Tends to fit into most meal plans without adding much calorie pressure.`;
        case "moderate": return `${g}g per 100g — moderate fat content. Generally contributes to satiety and supports normal body functions without going overboard.`;
        case "high": return `${g}g per 100g — relatively high in fat, which tends to mean calorie-dense. Can be nutritionally valuable (think oily fish or avocado), though portion size generally matters here.`;
        case "very_high": return `${g}g per 100g — relatively fat-dense. A small amount tends to go a long way calorie-wise — typical of oils, nuts, and butter.`;
    }
}
export function getIngredientCalorieInsight(kcal) {
    switch (ingredientCalorieLabel(kcal)) {
        case "very_low": return `${kcal} kcal per 100g — almost calorie-free. Generally allows adding volume to a meal without much impact on the daily total.`;
        case "low": return `${kcal} kcal per 100g — relatively light. Tends to be easy to include generously without adding much calorie pressure.`;
        case "moderate": return `${kcal} kcal per 100g — moderate calorie density. Portion size generally remains the key variable here.`;
        case "high": return `${kcal} kcal per 100g — relatively calorie-dense. Often worth weighing rather than eyeballing.`;
        case "very_high": return `${kcal} kcal per 100g — quite calorie-dense. Even a small amount tends to add up quickly.`;
    }
}

// ── Personalised ingredient insights (with profile) ───────────────────────────
export function getPersonalizedIngredientProteinInsight(g, activity, goal) {
    const label = ingredientProteinLabel(g);
    const act = activityContext(activity);
    const gl = goalContext(goal);
    const needsProtein = goal === "WEIGHT_LOSS_WITH_MUSCLE_MAINTENANCE" || goal === "MAINTENANCE_WITH_MUSCLE_FOCUS" || goal === "WEIGHT_GAIN_WITH_MUSCLE_FOCUS";
    const isActive = activity === "ACTIVE" || activity === "VERY_ACTIVE";
    switch (label) {
        case "none": return needsProtein || isActive ? `${g}g per 100g — no real protein here. ${act}, this won't contribute to your goal to ${gl} on its own — it works better alongside a proper protein source.` : `${g}g per 100g — negligible protein, ${act}. Fine as part of a meal, just not a protein source.`;
        case "low": return needsProtein ? `${g}g per 100g — light on protein. For your goal to ${gl}, this works better as a supporting ingredient next to a stronger protein source.` : `${g}g per 100g — a small protein contribution, ${act}. Adds up when stacked with other sources through the day.`;
        case "moderate": return isActive ? `${g}g per 100g — decent protein. ${act}, pairing it with another protein source would make the meal more effective toward your goal to ${gl}.` : `${g}g per 100g — a solid protein source ${act}. A useful contribution toward your goal to ${gl}.`;
        case "high": return `${g}g per 100g — strong protein content. ${act}, this aligns well with your goal to ${gl} and supports satiety and recovery.`;
        case "excellent": return `${g}g per 100g — excellent protein density. ${act}, this is one of the more efficient ingredients you can use to ${gl}.`;
    }
}
export function getPersonalizedIngredientCarbInsight(g, activity, goal) {
    const label = ingredientCarbLabel(g);
    const act = activityContext(activity);
    const gl = goalContext(goal);
    const isLowCarbGoal = goal === "WEIGHT_LOSS" || goal === "WEIGHT_LOSS_WITH_MUSCLE_MAINTENANCE";
    const needsFuel = activity === "ACTIVE" || activity === "VERY_ACTIVE";
    switch (label) {
        case "none": return isLowCarbGoal ? `${g}g per 100g — virtually carb-free. A very easy fit ${act} while working to ${gl}.` : `${g}g per 100g — no carbs here. ${act}, you may want to pair this with an energy source if this is around training.`;
        case "low": return isLowCarbGoal ? `${g}g per 100g — low in carbs, which can fit well with your goal to ${gl}.` : `${g}g per 100g — light carb contribution. Fine ${act}, though you'll likely rely on other foods for more training fuel.`;
        case "moderate": return needsFuel ? `${g}g per 100g — moderate carbs. ${act}, this gives you a useful energy base without going overboard.` : isLowCarbGoal ? `${g}g per 100g — moderate carbs. Portion size is the key variable here relative to your goal to ${gl}.` : `${g}g per 100g — a balanced carb source ${act}. Supports your energy needs reasonably well.`;
        case "high": return needsFuel ? `${g}g per 100g — solid carb content. ${act}, this can work well as fuel, especially if timed around training.` : isLowCarbGoal ? `${g}g per 100g — fairly high in carbs. ${act}, portion size matters here if you want to ${gl}.` : `${g}g per 100g — carb-rich. Useful for energy ${act}, though portion size still matters.`;
        case "very_high": return needsFuel ? `${g}g per 100g — very carb-dense. ${act}, this can be effective workout fuel, though a small portion already covers a lot.` : `${g}g per 100g — very high in carbs. ${act}, a little of this covers a large share of your carb budget, so portion size matters if you want to ${gl}.`;
    }
}
export function getPersonalizedIngredientFatInsight(g, activity, goal) {
    const label = ingredientFatLabel(g);
    const act = activityContext(activity);
    const gl = goalContext(goal);
    const isLeanGoal = goal === "WEIGHT_LOSS" || goal === "WEIGHT_LOSS_WITH_MUSCLE_MAINTENANCE";
    switch (label) {
        case "none": return `${g}g per 100g — essentially fat-free. Keeps the calorie count low, which works well ${act} while trying to ${gl}.`;
        case "low": return isLeanGoal ? `${g}g per 100g — lean ingredient. Fits easily into a plan to ${gl} without adding many extra calories ${act}.` : `${g}g per 100g — light on fat ${act}. Leaves plenty of calorie room for protein and carbs.`;
        case "moderate": return `${g}g per 100g — moderate fat. Contributes to satiety ${act}, which can help you stay consistent with your goal to ${gl}.`;
        case "high": return isLeanGoal ? `${g}g per 100g — high in fat, so fairly calorie-dense. ${act}, keeping portions accurate here helps you stay on track toward your goal to ${gl}.` : `${g}g per 100g — high in fat. ${act}, the calories add up quickly here, so portion size matters for your goal to ${gl}.`;
        case "very_high": return isLeanGoal ? `${g}g per 100g — very fat-dense. ${act}, even a small amount shifts the calorie count noticeably — weighing it is the practical move while working to ${gl}.` : `${g}g per 100g — very high in fat. A little goes a long way ${act}, so precision helps when trying to ${gl}.`;
    }
}
export function getPersonalizedIngredientCalorieInsight(kcal, activity, goal) {
    const label = ingredientCalorieLabel(kcal);
    const act = activityContext(activity);
    const gl = goalContext(goal);
    switch (label) {
        case "very_low": return `${kcal} kcal per 100g — almost calorie-free. ${act}, easy to use generously without affecting your goal to ${gl} much.`;
        case "low": return `${kcal} kcal per 100g — light ingredient. Easy to include generously ${act} while staying aligned with your goal to ${gl}.`;
        case "moderate": return `${kcal} kcal per 100g — average calorie density ${act}. Portion size is still the key lever here for your goal to ${gl}.`;
        case "high": return `${kcal} kcal per 100g — calorie-dense. ${act}, worth weighing accurately if you want to stay aligned with your goal to ${gl}.`;
        case "very_high": return `${kcal} kcal per 100g — very calorie-dense. ${act}, even a small amount adds up fast, so precision matters if you want to ${gl}.`;
    }
}

/**
 * Combined ingredient insight object (generic).
 */
export function getIngredientInsight(kcal, protein, carbs, fat) {
    return {
        protein: { label: ingredientProteinLabel(protein), text: getIngredientProteinInsight(protein) },
        carbs: { label: ingredientCarbLabel(carbs), text: getIngredientCarbInsight(carbs) },
        fat: { label: ingredientFatLabel(fat), text: getIngredientFatInsight(fat) },
        calories: { label: ingredientCalorieLabel(kcal), text: getIngredientCalorieInsight(kcal) },
    };
}

/**
 * Combined ingredient insight object (personalized).
 */
export function getPersonalizedIngredientInsight(kcal, protein, carbs, fat, activity, goal) {
    return {
        protein: { label: ingredientProteinLabel(protein), text: getPersonalizedIngredientProteinInsight(protein, activity, goal) },
        carbs: { label: ingredientCarbLabel(carbs), text: getPersonalizedIngredientCarbInsight(carbs, activity, goal) },
        fat: { label: ingredientFatLabel(fat), text: getPersonalizedIngredientFatInsight(fat, activity, goal) },
        calories: { label: ingredientCalorieLabel(kcal), text: getPersonalizedIngredientCalorieInsight(kcal, activity, goal) },
    };
}