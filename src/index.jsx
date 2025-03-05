import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Tailwind CSS
import App from "./App";
import { ThemeModeProvider } from "./themes/ThemeProvider.jsx";

import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./context/AuthContext";
import { UserMealsProvider } from "./context/UserMealsContext";
import { RecommendedNutritionProvider } from "./context/RecommendedNutritionContext";
import "@fontsource/roboto";
import {SnackbarProvider} from "./context/SnackbarContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <SnackbarProvider>
                <AuthProvider>
                    <UserMealsProvider>
                        <RecommendedNutritionProvider>
                            <ThemeModeProvider>
                                <CssBaseline />
                                <div className="min-h-screen bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText">
                                    <App />
                                </div>
                            </ThemeModeProvider>
                        </RecommendedNutritionProvider>
                    </UserMealsProvider>
                </AuthProvider>
        </SnackbarProvider>
    </React.StrictMode>
);
