import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import SubMenuChip from "../submenuchip/SubMenuChip.jsx";

function SubMenuGeneric({ options, activeOption, setActiveOption, basePath = "", isDetailPage = false, onSelect }) {
    const navigate = useNavigate();

    const handleClick = (label) => {
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
        <div className="mb-4 flex justify-center">
            <div className="inline-flex items-stretch rounded-2xl border border-border bg-surface-sunken shadow-inner">
                {options.map(({ label, icon }) => (
                    <SubMenuChip
                        key={label}
                        icon={icon}
                        label={label}
                        selected={label === activeOption}
                        onClick={() => handleClick(label)}
                    />
                ))}
            </div>
        </div>
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
