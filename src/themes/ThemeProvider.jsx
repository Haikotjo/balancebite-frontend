import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ThemeModeContext } from "./ThemeModeContext";

export const ThemeModeProvider = ({ children }) => {
    const [mode, setMode] = useState("dark");

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    useEffect(() => {
        if (mode === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [mode]);

    return (
        <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
            {children}
        </ThemeModeContext.Provider>
    );
};

ThemeModeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
