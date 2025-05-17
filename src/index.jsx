import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Tailwind CSS
import App from "./App";
import { ThemeModeProvider } from "./themes/ThemeProvider.jsx";
import { AuthProvider } from "./context/AuthContext";
import { UserMealsProvider } from "./context/UserMealsContext";
import { RecommendedNutritionProvider } from "./context/RecommendedNutritionContext";
import { UserDietsProvider } from "./context/UserDietContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <UserMealsProvider>
                <UserDietsProvider>
                    <RecommendedNutritionProvider>
                        <ThemeModeProvider>
                            <div className="min-h-screen bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText">
                                <App />
                            </div>
                        </ThemeModeProvider>
                    </RecommendedNutritionProvider>
                </UserDietsProvider>
            </UserMealsProvider>
        </AuthProvider>
    </React.StrictMode>
);
