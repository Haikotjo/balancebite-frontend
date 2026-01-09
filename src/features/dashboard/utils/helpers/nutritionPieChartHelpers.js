// nutritionPieChartHelpers.js

export const NUTRIENT_ORDER = [
    "Total lipid (fat)",
    "Carbohydrates",
    "Protein",
    "Energy kcal",
];

const clamp = (num, min, max) => Math.max(min, Math.min(max, num));

const findValueByName = (arr, name) => {
    const found = arr?.find((x) => x?.name === name);
    const value = found?.value;
    return typeof value === "number" ? value : 0;
};

const COLOR_BY_NAME = {
    "Energy kcal": "#F43F5E",
    Protein: "#7BE0D1",
    Carbohydrates: "#71f175",
    "Total lipid (fat)": "#EDB6A3",
};

export const buildPercentRadialData = ({ chartData = [], baseChartData = [] }) => {
    const radialData = NUTRIENT_ORDER.map((name) => {
        const base = findValueByName(baseChartData, name);
        const current = findValueByName(chartData, name);

        const rawPercent = base > 0 ? (current / base) * 100 : 0;
        const percent = clamp(rawPercent, 0, 100);

        return {
            name,
            value: percent,
            currentValue: current,
            baseValue: base,
            rawPercent,
            fill: COLOR_BY_NAME[name] ?? "#999999",
        };
    });

    radialData.push({
        name: "__scale__",
        value: 100,
        currentValue: 0,
        baseValue: 100,
        rawPercent: 100,
        fill: "transparent",
        pointerEvents: "none",
    });


    const energyCurrent = findValueByName(chartData, "Energy kcal");
    const energyBase = findValueByName(baseChartData, "Energy kcal");

    const goalsReached = radialData
        .filter((d) => d.name !== "__scale__")
        .every((d) => (d.baseValue > 0 ? d.rawPercent >= 100 : true));

    return { radialData, energyCurrent, energyBase, goalsReached };
};
