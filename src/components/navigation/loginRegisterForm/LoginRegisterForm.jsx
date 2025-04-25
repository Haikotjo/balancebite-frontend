import { useState } from "react";
import PropTypes from "prop-types";
import LoginForm from "./loginForm/LoginForm.jsx";
import RegisterForm from "./registerForm/RegisterForm.jsx";
import CustomModal from "../../layout/CustomModal.jsx";

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
            {isRegistering ? (
                <RegisterForm
                    onClose={onClose}
                    onRegister={onRegister}
                    onSwitchToLogin={() => setIsRegistering(false)}
                />
            ) : (
                <LoginForm
                    onClose={onClose}
                    onSubmit={onLogin}
                    errorMessage={errorMessage}
                    onSwitchToRegister={() => setIsRegistering(true)}
                />
            )}
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
