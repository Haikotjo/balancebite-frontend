import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Tailwind CSS
import App from "./App";
import { ThemeModeProvider } from "./themes/ThemeProvider.jsx";
import { AuthProvider } from "./context/AuthContext";
import { UserMealsProvider } from "./context/UserMealsContext";
import { RecommendedNutritionProvider } from "./context/RecommendedNutritionContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <UserMealsProvider>
                <RecommendedNutritionProvider>
                    <ThemeModeProvider>
                        <div className="min-h-screen bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText">
                            <App />
                        </div>
                    </ThemeModeProvider>
                </RecommendedNutritionProvider>
            </UserMealsProvider>
        </AuthProvider>
    </React.StrictMode>
);
