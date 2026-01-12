/**
 * Calculate the remaining days in the current week (Monday–Sunday),
 * including today.
 *
 * If today is Sunday, it returns 1 (only today left).
 * If today is Monday, it returns 7 (today + 6 days).
 */
export const getRemainingDaysInWeek = () => {
    const today = new Date();
    const weekday = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Convert Sunday (0) to 7, otherwise keep 1-6
    const dayNumber = weekday === 0 ? 7 : weekday;

    // Remaining days including today:
    // Monday: (7 - 1) + 1 = 7
    // Sunday: (7 - 7) + 1 = 1
    return (7 - dayNumber) + 1;
};

/**
 * Calculate the remaining days in the current month,
 * including today.
 */
export const getRemainingDaysInMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    // Get the last day number of the current month (e.g., 30 or 31)
    const lastDay = new Date(year, month + 1, 0).getDate();
    const todayDate = today.getDate();

    // Difference plus today:
    // If it's the 12th of 31 days: (31 - 12) + 1 = 20 days left
    return (lastDay - todayDate) + 1;
};

/**
 * Build a "per-day remaining" RDI object for the current week.
 * Distributes total remaining nutrients over the remaining days of the week.
 * On the last day of the week (Sunday), it returns the total as the average.
 */
export const buildWeeklyAverageRdi = (weeklyRdi) => {
    if (!weeklyRdi || !weeklyRdi.nutrients) return null;

    const remainingDays = getRemainingDaysInWeek();

    // If only one day is left, the average is the total.
    if (remainingDays <= 1) return weeklyRdi;

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
 * Distributes total remaining monthly nutrients over the remaining days.
 * On the last day of the month, it returns the total as the average.
 */
export const buildMonthlyAverageRdi = (monthlyRdi) => {
    if (!monthlyRdi || !monthlyRdi.nutrients) return null;

    const remainingDays = getRemainingDaysInMonth();

    // If only one day is left, the average is the total.
    if (remainingDays <= 1) return monthlyRdi;

    return {
        ...monthlyRdi,
        nutrients: monthlyRdi.nutrients.map((n) => ({
            ...n,
            value: n.value != null ? n.value / remainingDays : null,
        })),
    };
};