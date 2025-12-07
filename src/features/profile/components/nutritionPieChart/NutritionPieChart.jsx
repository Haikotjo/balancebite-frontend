import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

const COLORS = ["#7BE0D1", "#71f175", "#EDB6A3"];
const NEGATIVE_COLOR = "#DD1155";

/**
 * Small hook to track if the viewport is below the Tailwind `sm` breakpoint (640px).
 * Returns true on small screens, false on larger screens.
 */
const useIsSmallScreen = () => {
    const [isSmall, setIsSmall] = useState(false);

    useEffect(() => {
        // Guard for environments without window (SSR safety)
        if (typeof window === "undefined" || !window.matchMedia) return;

        const mediaQuery = window.matchMedia("(max-width: 640px)");

        const handleChange = (event) => {
            setIsSmall(event.matches);
        };

        // Set initial value
        handleChange(mediaQuery);

        // Subscribe to changes
        mediaQuery.addEventListener("change", handleChange);

        // Cleanup on unmount
        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    return isSmall;
};

const NutritionPieChart = ({ chartData, sortedNutrients }) => {
    const isSmallScreen = useIsSmallScreen();
    const outerRadius = isSmallScreen ? 80 : 100;

    const allNegative = chartData?.every((entry) => entry.value < 0);

    const filteredChartData = allNegative
        ? [{ name: "Goals reached", value: 1 }]
        : chartData?.map((entry) => ({
        ...entry,
        value: Math.max(entry.value, 0),
    })) || [];

    const energy =
        sortedNutrients?.find((n) => n.name === "Energy kcal")?.value ?? 0;

    if (!filteredChartData.some((entry) => entry.value > 0)) return null;

    return (
        <CustomCard className="w-full p-2 h-fit">
            <CustomBox className="w-full my-2">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={filteredChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="45%"
                            outerRadius={outerRadius} // 80 on small, 100 otherwise
                            label
                        >
                            {filteredChartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        allNegative
                                            ? NEGATIVE_COLOR
                                            : COLORS[index % COLORS.length]
                                    }
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>

                {allNegative && (
                    <CustomTypography
                        variant="small"
                        className="text-center text-error mt-2"
                    >
                        Nutrition Goals reached – be mindful of extra intake.
                    </CustomTypography>
                )}

                <CustomTypography
                    variant="h5"
                    className="text-center mt-2"
                    color={energy < 0 ? "text-error" : "text-primary"}
                >
                    Energy: {energy} kcal
                </CustomTypography>
            </CustomBox>
        </CustomCard>
    );
};

NutritionPieChart.propTypes = {
    chartData: PropTypes.array.isRequired,
    sortedNutrients: PropTypes.array,
};

export default NutritionPieChart;
