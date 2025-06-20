import { useContext } from "react";
import { ThemeModeContext } from "./ThemeModeContext";

export const useThemeMode = () => {
    return useContext(ThemeModeContext);
};
