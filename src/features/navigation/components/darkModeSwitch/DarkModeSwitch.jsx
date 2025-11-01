// DarkModeSwitch.jsx
import { Sun, Moon } from "lucide-react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import { useThemeMode } from "../../../../themes/useThemeMode.js";

const DarkModeSwitch = () => {
    const { mode, toggleTheme } = useThemeMode();
    return (
        <CustomBox className="flex items-center gap-6 w-full" onClick={toggleTheme}>
            {mode === "dark" ? (
                <Sun className="w-4 h-4 text-white md:w-3 md:h-3" />
            ) : (
                <Moon className="w-4 h-4 text-gray-800 md:w-3 md:h-3" fill="currentColor" stroke="none" />
            )}
            <CustomTypography as="span">
                {mode === "dark" ? "Light Mode" : "Dark Mode"}
            </CustomTypography>
        </CustomBox>
    );
};

export default DarkModeSwitch;
