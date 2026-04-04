import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import LoginForm from "../authLoginForm/LoginForm.jsx";
import RegisterForm from "../authRegisterForm/RegisterForm.jsx";

const LoginRegisterForm = ({ onLogin, onRegister, onClose, startInRegisterMode = false }) => {
    const [isRegistering, setIsRegistering] = useState(startInRegisterMode);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    useEffect(() => {
        const onKeyDown = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[150] px-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
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
        </div>,
        document.body
    );
};

LoginRegisterForm.propTypes = {
    onLogin: PropTypes.func.isRequired,
    onRegister: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    startInRegisterMode: PropTypes.bool,
};

export default LoginRegisterForm;
