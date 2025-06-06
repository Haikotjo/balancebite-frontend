import PropTypes from "prop-types";
import CustomBox from "../layout/CustomBox.jsx";
import CustomCardChip from "../layout/CustomCardChip.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import { useNavigate } from "react-router-dom";

/**
 * Generic SubMenu component for both Meals and Diets.
 */
function SubMenuGeneric({ options, activeOption, setActiveOption, basePath = "", isDetailPage = false, onSelect }) {
    const navigate = useNavigate();

    const handleChipClick = (label) => {
        if (isDetailPage) {
            if (onSelect) {
                onSelect(label);
            } else {
                navigate(`${basePath}?filter=${label}`);
            }
        } else {
            setActiveOption(label);
        }
    };

    return (
        <CustomBox className="flex justify-center items-center gap-4">
            {options.map(({ label, icon: Icon }) => {
                const selected = label === activeOption;

                return (
                    <CustomBox key={label} className="flex flex-col items-center gap-1 mb-2">
                        <CustomCardChip
                            onClick={() => handleChipClick(label)}
                            className={`w-16 h-12 flex items-center justify-center border-2 rounded-full transition-colors ${
                                selected
                                    ? "bg-primary border-primary"
                                    : "bg-white dark:bg-gray-800 border-primary"
                            }`}
                            textClassName="text-xl"
                        >
                            <Icon className={`${selected ? "text-white" : "text-primary"} w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7`} />
                        </CustomCardChip>
                        <CustomTypography
                            as="span"
                            className="text-[0.65rem] sm:text-[0.7rem] md:text-[0.8rem] text-center"
                        >
                            {label}
                        </CustomTypography>
                    </CustomBox>
                );
            })}
        </CustomBox>
    );
}

SubMenuGeneric.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            icon: PropTypes.elementType.isRequired,
        })
    ).isRequired,
    activeOption: PropTypes.string,
    setActiveOption: PropTypes.func.isRequired,
    basePath: PropTypes.string,
    isDetailPage: PropTypes.bool,
    onSelect: PropTypes.func,
};

export default SubMenuGeneric;
