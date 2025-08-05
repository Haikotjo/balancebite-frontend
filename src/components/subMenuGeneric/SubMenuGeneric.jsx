import PropTypes from "prop-types";
import CustomBox from "../layout/CustomBox.jsx";
import { useNavigate } from "react-router-dom";
import SubMenuChip from "../submenuchip/SubMenuChip.jsx";

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
                    <SubMenuChip
                        key={label}
                        icon={
                            <Icon
                                className={`${selected ? "text-white" : "text-primary"} w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8`}
                            />
                        }
                        label={label}
                        selected={selected}
                        onClick={() => handleChipClick(label)}
                        labelFontSize="text-[0.75rem] sm:text-[0.8rem] md:text-[0.85rem]"
                        labelPosition="bottom"
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
