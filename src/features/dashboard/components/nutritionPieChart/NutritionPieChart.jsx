// NutritionPieChart.jsx
import { useState, useMemo, useCallback } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import PropTypes from "prop-types";

import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

import { buildPercentRadialData } from "../../utils/helpers/nutritionPieChartHelpers.js";
import StatCard from "../statCard/StatCard.jsx";
import RenderSector from "../renderSector/RenderSector.jsx";

import { Flame, Dumbbell, ChartColumnIncreasing, Droplet } from "lucide-react";
import useIsSmallScreen from "../../../../hooks/useIsSmallScreen.js";


const NUTRITION_MAP = [
    { id: "Energy kcal", icon: Flame, position: "left-3 top-3" },
    { id: "Protein", icon: Dumbbell, position: "right-3 top-3" },
    { id: "Carbohydrates", icon: ChartColumnIncreasing, position: "left-3 bottom-3" },
    { id: "Total lipid (fat)", icon: Droplet, position: "right-3 bottom-3" },
];

const NutritionPieChart = ({ chartData, baseChartData }) => {
    const isSmall = useIsSmallScreen();
    const dynamicOuterRadius = isSmall ? "80%" : "100%";
    const dynamicInnerRadius = isSmall ? "45%" : "35%";
    const dynamicBarSize = isSmall ? 8 : 12;
    const [activeName, setActiveName] = useState(null);
    const [isClicked, setIsClicked] = useState(false);

    const { radialData, goalsReached } = useMemo(() => {
        return buildPercentRadialData({ chartData, baseChartData });
    }, [chartData, baseChartData]);

    const items = useMemo(() =>
            radialData.filter((d) => d.name !== "__scale__"),
        [radialData]);

    const chartDataSafe = useMemo(() =>
        radialData.map(d => ({
            ...d,
            value: d.value < 0 ? 0 : d.value
        })), [radialData]);

    const byName = useMemo(() =>
            Object.fromEntries(items.map((i) => [i.name, i])),
        [items]);

    const ActiveIcon = useMemo(() => {
        return NUTRITION_MAP.find(n => n.id === activeName)?.icon;
    }, [activeName]);

    const handleToggle = useCallback((name) => {
        setActiveName((prev) => {
            const isSame = prev === name;
            setIsClicked(isSame ? (clicked) => !clicked : true);
            return isSame && isClicked ? null : name;
        });
    }, [isClicked]);

    const handleGlobalReset = useCallback(() => {
        setActiveName(null);
        setIsClicked(false);
    }, []);

    if (items.length === 0) return null;

    return (
        <CustomCard hasBorder={true} className="w-full p-3 min-w-0">
            <CustomBox className="relative w-full min-0" onClick={handleGlobalReset}>

                {NUTRITION_MAP.map(({ id, icon, position }) => (
                    <CustomBox key={id} className={`absolute ${position} z-20 transition-all duration-600`}>
                        <StatCard
                            item={byName[id]}
                            icon={icon}
                            isActive={activeName === id}
                            onMouseEnter={() => { if (!isClicked) setActiveName(id); }}
                            onMouseLeave={() => { if (!isClicked) setActiveName(null); }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggle(id);
                            }}
                        />
                    </CustomBox>
                ))}

                <CustomBox className="w-full h-[400px] sm:h-[320px] md:h-[360px] lg:h-[420px] relative">

                    <CustomBox className="absolute top-[53%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-0 pointer-events-none">

                        {activeName && ActiveIcon && (
                            <CustomBox className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                                <ActiveIcon
                                    size={Math.round(byName[activeName].value) === 0 ? 60 : 40}
                                    style={{
                                        color: byName[activeName].value < 0
                                            ? 'currentColor'
                                            : byName[activeName]?.fill
                                    }}
                                    className={`
            drop-shadow-md mb-1 transition-all duration-300
            ${byName[activeName].value < 0 ? 'text-darkBackground dark:text-lightBackground' : ''}
            ${Math.round(byName[activeName].value) === 0 ? 'scale-110' : 'scale-100'}
        `}
                                />

                                <CustomTypography
                                    variant={Math.round(byName[activeName].value) === 0 ? "h1" : "large"}
                                    bold
                                    className="tabular-nums transition-all duration-300"
                                >
                                    {Math.round(byName[activeName].value)}%
                                </CustomTypography>
                            </CustomBox>
                        )}
                    </CustomBox>

                    <ResponsiveContainer width="100%" height="100%" >
                        <RadialBarChart
                            data={chartDataSafe}
                            cx="50%" cy="53%"
                            innerRadius={dynamicInnerRadius}
                            outerRadius={dynamicOuterRadius}
                            startAngle={90}
                            endAngle={-270}
                            onMouseLeave={() => { if (!isClicked) setActiveName(null); }}
                        >
                            <RadialBar
                                dataKey="value"
                                clockWise
                                barSize={dynamicBarSize}
                                background={{ fill: 'transparent' }}
                                cornerRadius={8}
                                onMouseEnter={(data) => {

                                    if (!isClicked && activeName !== data.name) {
                                        setActiveName(data.name);
                                    }
                                }}
                                onClick={(data, index, e) => {
                                    if (e && e.stopPropagation) e.stopPropagation();
                                    handleToggle(data.name);
                                }}
                                shape={(props) => <RenderSector {...props} activeName={activeName}/>}
                            />
                        </RadialBarChart>
                    </ResponsiveContainer>
                </CustomBox>

                {goalsReached && (
                    <CustomTypography variant="small" className="text-center text-error mt-2">
                        Nutrition Goals reached – be mindful of extra intake.
                    </CustomTypography>
                )}
            </CustomBox>
        </CustomCard>
    );
};

NutritionPieChart.propTypes = {
    chartData: PropTypes.arrayOf(PropTypes.object).isRequired,
    baseChartData: PropTypes.array,
};

export default NutritionPieChart;