// StatCard.jsx
import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import useIsSmallScreen from "../../../../hooks/useIsSmallScreen.js";

const StatCard = ({ item, style, icon: Icon, isActive, onMouseEnter, onMouseLeave, onClick }) => {
    if (!item) return null;
    const isSmall = useIsSmallScreen();
    const pct = Math.round(item.value);
    const cur = item.currentValue ?? 0;
    const base = item.baseValue ?? 0;

    const activeBorderStyle = isActive
        ? { borderColor: item.fill, borderWidth: '2px' }
        : {};

    const formatName = (name) => {
        if (!isSmall) return name;

        const nameMap = {
            "Total lipid (fat)": "Total Fats",
            "Carbohydrates": "Carbs",
            "Energy kcal": "Energy",
            "Protein": "Protein"
        };
        return nameMap[name] || name;
    };

    return (
        <CustomBox
            style={{ ...style, ...activeBorderStyle }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            className={`
               w-fit
                p-3
                flex flex-col gap-1
                backdrop-blur-md
                rounded-lg
                transition-all duration-500 ease-in-out
                border
                cursor-pointer
                select-none
                ${isActive
                ? "scale-105 sm:scale-110 z-50 shadow-xl bg-lightBackground/60 dark:bg-darkBackground/60"
                : "scale-100 z-10 bg-lightBackground/10 dark:bg-darkBackground/10 border-borderDark dark:border-borderLight"
            }
            `}
        >
            <CustomBox className="flex items-center gap-2 min-w-0">
                {Icon ? (
                    <Icon
                        size={isActive ? 26 : 22}
                        style={{ color: item.fill }}
                        className="transition-all duration-300"
                    />
                ) : null}

                <CustomTypography variant={isActive ? "medium" : "small"} className="truncate" bold>
                    {formatName(item.name)} :
                </CustomTypography>
            </CustomBox>

            <CustomTypography variant="xsmallCard" className="tabular-nums opacity-80" italic>
                {pct}% ({cur} / {base})
            </CustomTypography>
        </CustomBox>
    );
};

StatCard.propTypes = {
    item: PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.number,
        currentValue: PropTypes.number,
        baseValue: PropTypes.number,
        fill: PropTypes.string,
    }),
    style: PropTypes.object,
    icon: PropTypes.elementType,
    isActive: PropTypes.bool,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onClick: PropTypes.func,
};

export default StatCard;