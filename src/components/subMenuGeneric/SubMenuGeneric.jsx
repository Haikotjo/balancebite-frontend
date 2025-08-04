import PropTypes from "prop-types";
import CustomBox from "../layout/CustomBox.jsx";
import CustomChip from "../layout/CustomChip.jsx";
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
                navigate(`${basePath}?option=${label.replace(/\s+/g, "-")}`);
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
                    <CustomChip
                        key={label}
                        icon={
                            <Icon
                                className={`${selected ? "text-white" : "text-primary"} w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7`}
                            />
                        }
                        label={label}
                        selected={selected}
                        onClick={() => handleChipClick(label)}
                        labelFontSize="text-[0.65rem] sm:text-[0.7rem] md:text-[0.8rem]"
                        labelPosition="bottom"
                        chipScale={1.2}
                    />
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
