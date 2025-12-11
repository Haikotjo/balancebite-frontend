// src/components/sidebar/SidebarHeader.jsx
import PropTypes from "prop-types";
import { X } from "lucide-react";
import CustomTypography from "../../layout/CustomTypography.jsx";
import CustomIconButton from "../../layout/CustomIconButton.jsx";
import CustomBox from "../../layout/CustomBox.jsx";

/**
 * SidebarHeader component – Renders a header for a sidebar with a title on the left
 * and a close icon button on the right.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Function} props.onClose - Callback triggered when the close button is clicked.
 * @param {string} props.title - The title text shown in the sidebar header.
 */
const SidebarHeader = ({ onClose, title }) => (
    <CustomBox className="flex justify-between items-center">
        <CustomTypography
            as="h2"
            variant="h4"
            className="font-bold"
        >
            {title}
        </CustomTypography>

        <CustomIconButton
            onClick={onClose}
            icon={<X size={18} />}
            bgColor="bg-transparent"
        />
    </CustomBox>
);

SidebarHeader.propTypes = {
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};

export default SidebarHeader;
