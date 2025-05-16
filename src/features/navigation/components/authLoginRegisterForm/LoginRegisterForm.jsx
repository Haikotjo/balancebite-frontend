import { useState } from "react";
import PropTypes from "prop-types";

import CustomModal from "../../../../components/layout/CustomModal.jsx";
import RegisterForm from "../authRegisterForm/RegisterForm.jsx";
import LoginForm from "../authLoginForm/LoginForm.jsx";

/**
 * Displays a modal with either the login or register form.
 * Allows switching between the two and handles closing.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.onLogin - Called after successful login
 * @param {Function} props.onRegister - Called after successful registration
 * @param {Function} props.onClose - Function to close the modal
 */
const LoginRegisterForm = ({ onLogin, onRegister, onClose }) => {
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
                    onSwitchToRegister={() => setIsRegistering(true)}
                />
            )}
        </CustomModal>
    );
};

LoginRegisterForm.propTypes = {
    onLogin: PropTypes.func.isRequired,
    onRegister: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default LoginRegisterForm;
