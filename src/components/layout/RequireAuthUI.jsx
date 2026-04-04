import ErrorDialog from "../layout/ErrorDialog.jsx";
import PropTypes from "prop-types";
import LoginRegisterForm from "../../features/navigation/components/authLoginRegisterForm/LoginRegisterForm.jsx";

const RequireAuthUI = ({
                           dialogOpen,
                           onClose,
                           message = "",
                           showLoginForm,
                           onLoginClose,
                           onLoginSuccess,
                           onLoginRedirect,
                           startInRegisterMode = false,
                       }) => (
    <>
        <ErrorDialog
            open={dialogOpen}
            onClose={onClose}
            message={message}
            actionLabel="Login or Register"
            onAction={onLoginRedirect}
            type="error"
        />
        {showLoginForm && (
            <LoginRegisterForm
                onClose={onLoginClose}
                onLogin={onLoginSuccess}
                onRegister={onLoginSuccess}
                startInRegisterMode={startInRegisterMode}
            />
        )}
    </>
);


RequireAuthUI.propTypes = {
    dialogOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    message: PropTypes.string,
    showLoginForm: PropTypes.bool.isRequired,
    onLoginClose: PropTypes.func.isRequired,
    onLoginSuccess: PropTypes.func.isRequired,
    onLoginRedirect: PropTypes.func.isRequired,
    startInRegisterMode: PropTypes.bool,
};

export default RequireAuthUI;
