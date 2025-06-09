import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

const COLORS = ["#7BE0D1", "#41D3BD", "#9CE8DC"];
const NEGATIVE_COLOR = "#DD1155";

const NutritionPieChart = ({ chartData, sortedNutrients }) => {
    const allNegative = chartData?.every(entry => entry.value < 0);

    let filteredChartData = [];

    if (allNegative) {
        const total = Math.abs(chartData.reduce((sum, e) => sum + e.value, 0)) || 1;
        filteredChartData = [{
            name: "Goals reached",
            value: 1,
        }];
    } else {
        filteredChartData = chartData?.map(entry => ({
            ...entry,
            value: Math.max(entry.value, 0),
        })) || [];
    }

    const energy = sortedNutrients?.find(n => n.name === "Energy kcal")?.value ?? 0;

    if (!filteredChartData.some(entry => entry.value > 0)) return null;

    return (
        <CustomCard className="w-full p-4 h-fit">
            <CustomBox className="w-full">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={filteredChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="45%"
                            outerRadius={100}
                            label
                        >
                            {filteredChartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={allNegative ? NEGATIVE_COLOR : COLORS[index % COLORS.length]}
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
