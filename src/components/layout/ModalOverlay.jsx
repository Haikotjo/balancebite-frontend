// src/components/layout/ModalOverlay.jsx

import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";

/**
 * Reusable overlay wrapper for modal-style content.
 * Centers children with a semi-transparent background.
 *
 * @component
 */
const ModalOverlay = ({ children, className = "" }) => {
    return (
        <CustomBox className="fixed inset-0 z-[1400] bg-black/50 flex justify-center items-center">
            <CustomBox className={className}>
                {children}
            </CustomBox>
        </CustomBox>
    );
};

ModalOverlay.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string, // Tailwind classes for inner box
};

export default ModalOverlay;
