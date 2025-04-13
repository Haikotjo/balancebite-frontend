import { useState } from "react";
import PropTypes from "prop-types";
import LoginForm from "./loginForm/LoginForm.jsx";
import RegisterForm from "./registerForm/RegisterForm.jsx";
import CustomModal from "../../layout/CustomModal.jsx"; // Zorg ervoor dat CustomModal geïmporteerd wordt

/**
 * Displays a modal with either the login or register form.
 * Allows switching between the two and handles closing.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.onLogin - Called after successful login
 * @param {Function} props.onRegister - Called after successful registration
 * @param {string} [props.errorMessage] - Optional error message to show
 * @param {Function} props.onClose - Function to close the modal
 */
const LoginRegisterForm = ({ onLogin, onRegister, errorMessage, onClose }) => {
    const [isRegistering, setIsRegistering] = useState(false); // Toggle between login/register form

    return (
        <CustomModal isOpen={true} onClose={onClose}>
            <div className="bg-white dark:bg-darkBackground text-black dark:text-white p-6 rounded-lg shadow-lg w-[90%] max-w-[400px]">
                {isRegistering ? (
                    <RegisterForm
                        onClose={onClose}
                        onRegister={onRegister}
                        onSwitchToLogin={() => setIsRegistering(false)} // Switch to login form
                    />
                ) : (
                    <LoginForm
                        onClose={onClose}
                        onSubmit={onLogin}
                        errorMessage={errorMessage}
                        onSwitchToRegister={() => setIsRegistering(true)} // Switch to register form
                    />
                )}
            </div>
        </CustomModal>
    );
};

LoginRegisterForm.propTypes = {
    onLogin: PropTypes.func.isRequired,
    onRegister: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};

export default LoginRegisterForm;
