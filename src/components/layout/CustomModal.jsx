import { useEffect } from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import CustomBox from './CustomBox.jsx';

/**
 * Custom modal component that displays content in a centered modal.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Determines if the modal is visible.
 * @param {Function} props.onClose - Function to call when the modal is closed.
 * @param {ReactNode} props.children - The content to display inside the modal.
 *
 * @returns {ReactNode|null} The modal JSX, or null if `isOpen` is false.
 */
const CustomModal = ({ isOpen, onClose, children, zIndex = "z-50" }) => {
    // Always apply the effect, even if the modal is not open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        } else {
            document.body.style.overflow = 'auto'; // Allow scrolling when modal is closed
        }

        // Cleanup when modal is closed
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]); // Dependency on `isOpen` so it runs whenever `isOpen` changes

    if (!isOpen) return null; // If modal is not open, return nothing

    // Handle clicks on the overlay (background) to close the modal
    const handleOverlayClick = (e) => {
        // Only close the modal if the click was on the overlay itself
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return ReactDOM.createPortal(
        <CustomBox
            className={`fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center ${zIndex}`}
            onClick={handleOverlayClick}
        >
            <CustomBox
                // Wrapper should not control visual styling, only layout constraints.
                className="w-[90%] max-w-sm"
                onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside the content
            >
                {children} {/* Render modal content directly */}
            </CustomBox>
        </CustomBox>,
        document.body // Render the modal outside the normal DOM flow
    );
};

// Prop types to enforce type checking
CustomModal.propTypes = {
    isOpen: PropTypes.bool.isRequired, // Boolean value to control modal visibility
    onClose: PropTypes.func.isRequired, // Callback function to handle modal close
    children: PropTypes.node, // Content to display inside the modal
    zIndex: PropTypes.string,
};

export default CustomModal;
