import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const LoginModalContext = createContext();

export const LoginModalProvider = ({ children }) => {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    return (
        <LoginModalContext.Provider value={{ showLoginForm, setShowLoginForm, isRegistering, setIsRegistering }}>
            {children}
        </LoginModalContext.Provider>
    );
};

export const useLoginModal = () => useContext(LoginModalContext);

LoginModalProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
