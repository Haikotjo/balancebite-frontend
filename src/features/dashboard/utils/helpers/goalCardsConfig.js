// goalCardsConfig.js
export const buildGoalCards = (weeklyAverageRdi, monthlyAverageRdi, weeklyRdi, monthlyRdi) => [
    {
        key: "base",
        variant: "base",
        data: null,
        description:
            "Your baseline daily recommended intake, calculated from your profile settings.",
        accordionTitle: "Base Nutrition",
    },
    {
        key: "today",
        variant: "today",
        data: null,
        description:
            "Remaining recommended nutrients for today, based on your current goals.",
        accordionTitle: "Today's remaining nutrients",
    },
    {
        key: "weekAverage",
        variant: "weekAverage",
        data: weeklyAverageRdi,
        description:
            "Calculated daily average for the rest of the week (may be inaccurate if past data is incomplete).",
        accordionTitle: "This week's daily averages",
    },
    {
        key: "monthAverage",
        variant: "monthAverage",
        data: monthlyAverageRdi,
        description:
            "Calculated daily average for the rest of the month (may be inaccurate if past data is incomplete).",
        accordionTitle: "This month's daily averages",
    },
    {
        key: "week",
        variant: "week",
        data: weeklyRdi,
        description:
            "Total recommended nutrients for the remaining days of this week (may be inaccurate if past data is incomplete).",
        accordionTitle: "This week's remaining nutrients",
    },
    {
        key: "month",
        variant: "month",
        data: monthlyRdi,
        description:
            "Total recommended nutrients for the remaining days of this month (may be inaccurate if past data is incomplete).",
        accordionTitle: "This month's remaining nutrients",
    },
];
