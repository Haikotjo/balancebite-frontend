/**
 * Calculate the remaining days in the current week (Monday–Sunday),
 * excluding today. If no days remain, return 1 to avoid division by zero.
 */
export const getRemainingDaysInWeek = () => {
    const today = new Date();
    const weekday = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Days left until Sunday (end of the week).
    // Example: if today is Friday (5), remaining = (7 - 5) % 7 = 2 (Sat + Sun)
    const daysUntilSunday = (7 - weekday) % 7;

    return daysUntilSunday || 1; // ensure at least 1
};

/**
 * Calculate the remaining days in the current month,
 * excluding today. If no days remain, return 1 to avoid division by zero.
 */
export const getRemainingDaysInMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed (0 = January)

    // Get the last day number of the current month (e.g., 30 or 31)
    const lastDay = new Date(year, month + 1, 0).getDate();
    const todayDate = today.getDate();

    const remaining = lastDay - todayDate;

    return remaining > 0 ? remaining : 1; // ensure at least 1
};

/**
 * Build a "per-day remaining" RDI object for the current week.
 * Takes the total remaining weekly nutrients and distributes them
 * across the remaining days of this week.
 */
export const buildWeeklyAverageRdi = (weeklyRdi) => {
    if (!weeklyRdi || !weeklyRdi.nutrients) return null;

    const remainingDays = getRemainingDaysInWeek();

    return {
        ...weeklyRdi,
        nutrients: weeklyRdi.nutrients.map((n) => ({
            ...n,
            value: n.value != null ? n.value / remainingDays : null,
        })),
    };
};

/**
 * Build a "per-day remaining" RDI object for the rest of the month.
 * Takes the total remaining monthly nutrients and distributes them
 * across the remaining days of this month.
 */
export const buildMonthlyAverageRdi = (monthlyRdi) => {
    if (!monthlyRdi || !monthlyRdi.nutrients) return null;

    const remainingDays = getRemainingDaysInMonth();

    return {
        ...monthlyRdi,
        nutrients: monthlyRdi.nutrients.map((n) => ({
            ...n,
            value: n.value != null ? n.value / remainingDays : null,
        })),
    };
};
