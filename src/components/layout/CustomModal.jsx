import { useEffect } from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import CustomBox from './CustomBox.jsx';
import CustomButton from "./CustomButton.jsx";

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
const CustomModal = ({ isOpen, onClose, children }) => {
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
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleOverlayClick} // Close modal when clicking on overlay
        >
            <CustomBox
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full"
                onClick={(e) => e.stopPropagation()} // Prevent closing the modal when clicking inside the modal content
            >
                <CustomButton
                    onClick={onClose} // Close button to trigger the onClose callback
                    className="absolute top-2 right- text-gray-600 dark:text-gray-300 hover:text-gray-800"
                >
                    ✕
                </CustomButton>
                <CustomBox>{children}</CustomBox> {/* Modal content passed as children */}
            </CustomBox>
        </CustomBox>,
        document.body // Render the modal outside the normal DOM flow
    );
};

// Prop types to enforce type checking
CustomModal.propTypes = {
    isOpen: PropTypes.bool.isRequired, // Boolean value to control modal visibility
    onClose: PropTypes.func.isRequired, // Callback function to handle modal close
    children: PropTypes.node.isRequired, // Content to display inside the modal
};

export default CustomModal;
