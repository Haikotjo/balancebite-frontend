import CustomTooltip from "../../../../components/layout/CustomTooltip.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import clsx from "clsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import PropTypes from "prop-types";

const NavItem = ({ icon, label, active, onClick }) => (
    <CustomTooltip text={label} position="right">
        <CustomButton
            type="button"
            onClick={onClick}
            variant="default"
            className={clsx(
                "w-full cursor-pointer rounded-md px-3 py-2",
                "flex items-center justify-center lg:justify-start gap-3",
                "transition-all hover:bg-white/10",
                active && "bg-white/25"
            )}
        >
            <CustomBox className="flex items-center justify-center">{icon}</CustomBox>

            <CustomTypography
                as="span"
                inheritColor
                className="hidden lg:inline text-sm font-medium"
            >
                {label}
            </CustomTypography>
        </CustomButton>
    </CustomTooltip>
);

NavItem.propTypes = {
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    active: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
};

export default NavItem;