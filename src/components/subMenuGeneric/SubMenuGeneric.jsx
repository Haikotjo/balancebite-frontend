// src/components/subMenuGeneric/SubMenuGeneric.jsx
import PropTypes from "prop-types";
import CustomBox from "../layout/CustomBox.jsx";
import CustomCardChip from "../layout/CustomChip.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import { useNavigate } from "react-router-dom";

export default function SubMenuGeneric({
                                           options,
                                           activeOption,
                                           setActiveOption,
                                           basePath = "",
                                           isDetailPage = false,
                                           onSelect
                                       }) {
    const navigate = useNavigate();
    const handle = (label) => {
        if (isDetailPage) {
            onSelect ? onSelect(label) : navigate(`${basePath}?option=${label.replace(/\s+/g, "-")}`);
        } else {
            setActiveOption(label);
        }
    };

    return (
        <CustomBox className="flex justify-center items-center gap-4">
            {options.map(({ label, icon }) => {
                const selected = label === activeOption;
                return (
                    <CustomBox key={label} className="flex flex-col items-center gap-1 mb-2">
                        <CustomCardChip
                            onClick={() => handle(label)}
                            className={`w-16 h-12 flex items-center justify-center border-2 rounded-full transition-colors ${
                                selected ? "bg-primary border-primary" : "bg-white dark:bg-gray-800 border-primary"
                            }`}
                            textClassName="text-xl"
                        >
                            {icon}
                        </CustomCardChip>
                        <CustomTypography as="span" className="text-[0.65rem] text-center">
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
            icon: PropTypes.node.isRequired
        })
    ).isRequired,
    activeOption: PropTypes.string,
    setActiveOption: PropTypes.func.isRequired,
    basePath: PropTypes.string,
    isDetailPage: PropTypes.bool,
    onSelect: PropTypes.func
};
