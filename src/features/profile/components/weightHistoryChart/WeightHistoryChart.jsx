import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
    ReferenceLine
} from "recharts";
import PropTypes from "prop-types";
import { ChartColumn, History, Scale, Target } from "lucide-react";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import Spinner from "../../../../components/layout/Spinner.jsx";
import InfoMetricTile from "../infoMetricTile/InfoMetricTile.jsx";

const WeightHistoryChart = ({
                                data,
                                targetWeight,
                                isLoading,
                                onQuickWeightUpdate,
                                onQuickTargetUpdate,
                                isEditingWeight,
                                setIsEditingWeight,
                                isEditingTarget,
                                setIsEditingTarget,
                                showControls = true
                            }) => {

    const sortedData = data?.length > 0
        ? [...data].sort((a, b) => new Date(a.date) - new Date(b.date))
        : [];

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    };

    if (isLoading) {
        return (
            <CustomCard hasBorder className="p-6 h-[400px] flex justify-center items-center">
                <Spinner />
            </CustomCard>
        );
    }

    const currentWeight = sortedData.length > 0 ? sortedData[sortedData.length - 1].weight : 0;

    return (
        <CustomCard hasBorder className="p-6 shadow-sm">
            <CustomBox className="flex justify-between items-center mb-6 border-b pb-4">
                <CustomTypography variant="h2" className="flex items-center gap-2">
                    <History size={24} className="text-primary" />
                    Weight Progress
                </CustomTypography>

                {sortedData.length > 1 && (
                    <CustomBox className="flex items-center gap-2 px-2 py-1 rounded border border-borderPrimary">
                        <ChartColumn size={16} className="text-primary" />
                        <CustomTypography
                            variant="small"
                            className="font-medium "
                        >
                            Progress Tracked
                        </CustomTypography>
                    </CustomBox>
                )}
            </CustomBox>

            <CustomBox className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sortedData}>
                        <defs>
                            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38adb5" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#71f175" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#9ca3af" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={formatDate}
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            domain={['dataMin - 5', 'dataMax + 5']}
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '8px',
                                border: '1px solid #d8d8d8',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                backgroundColor: '#1f2937',
                                color: '#f3f4f6'
                            }}
                            itemStyle={{ color: '#38adb5' }}
                            labelStyle={{ color: '#F9FAFB', marginBottom: '4px' }}
                            labelFormatter={formatDate}
                            formatter={(value) => [`${value} kg`, "Weight"]}
                        />

                        {targetWeight && (
                            <ReferenceLine
                                y={targetWeight}
                                stroke="#71f175"
                                strokeDasharray="5 5"
                                label={{ position: 'right', value: `Goal: ${targetWeight}kg`, fill: '#71f175', fontSize: 10 }}
                            />
                        )}

                        <Area
                            type="monotone"
                            dataKey="weight"
                            stroke="#38adb5"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorWeight)"
                            dot={{ r: 4, fill: "#38adb5", strokeWidth: 2, stroke: "#fff" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CustomBox>

            {showControls && (
                <CustomBox className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 border-t pt-6 relative z-10">
                    <InfoMetricTile
                        icon={Scale}
                        label="Current Weight"
                        value={currentWeight}
                        isEditable={true}
                        isEditingExternally={isEditingWeight}
                        setIsEditingExternally={setIsEditingWeight}
                        onSave={onQuickWeightUpdate}
                    />

                    <InfoMetricTile
                        icon={Target}
                        label="Target Weight"
                        value={targetWeight}
                        isEditable={true}
                        isEditingExternally={isEditingTarget}
                        setIsEditingExternally={setIsEditingTarget}
                        onSave={onQuickTargetUpdate}
                    />
                </CustomBox>
            )}
        </CustomCard>
    );
};

WeightHistoryChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string,
        weight: PropTypes.number
    })),
    targetWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isLoading: PropTypes.bool,
    onQuickWeightUpdate: PropTypes.func,
    onQuickTargetUpdate: PropTypes.func,
    isEditingWeight: PropTypes.bool,
    isEditingTarget: PropTypes.bool,
    setIsEditingWeight: PropTypes.func,
    setIsEditingTarget: PropTypes.func,
    showControls: PropTypes.bool
};

export default WeightHistoryChart;