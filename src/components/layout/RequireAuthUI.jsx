import ErrorDialog from "../layout/ErrorDialog.jsx";
import LoginRegisterForm from "../navigation/loginRegisterForm/LoginRegisterForm.jsx";
import PropTypes from "prop-types";

const RequireAuthUI = ({
                           dialogOpen,
                           onClose,
                           message,
                           showLoginForm,
                           onLoginClose,
                           onLoginSuccess,
                           onLoginRedirect, // ✅ toevoegen
                       }) => (
    <>
        <ErrorDialog
            open={dialogOpen}
            onClose={onClose}
            message={message}
            actionLabel="Login or Register"
            onAction={onLoginRedirect} // ✅ gebruiken
            type="error"
        />
        {showLoginForm && (
            <LoginRegisterForm
                onClose={onLoginClose}
                onLogin={onLoginSuccess}
                onRegister={() => {}}
                errorMessage={message}
            />
        )}
    </>
);


RequireAuthUI.propTypes = {
    dialogOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    showLoginForm: PropTypes.bool.isRequired,
    onLoginClose: PropTypes.func.isRequired,
    onLoginSuccess: PropTypes.func.isRequired,
    onLoginRedirect: PropTypes.func.isRequired,
};

export default RequireAuthUI;
