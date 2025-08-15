import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeModeProvider } from "./themes/ThemeProvider.jsx";
import { AuthProvider } from "./context/AuthContext";
import { UserMealsProvider } from "./context/UserMealsContext";
import { RecommendedNutritionProvider } from "./context/RecommendedNutritionContext";
import { UserDietsProvider } from "./context/UserDietContext.jsx";
import { DialogProvider } from "./context/NotificationContext.jsx";
import { ModalProvider } from "./context/ModalContext.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <UserMealsProvider>
                    <UserDietsProvider>
                        <RecommendedNutritionProvider>
                            <ThemeModeProvider>
                                <DialogProvider>
                                    <ModalProvider>
                                        <div className="min-h-screen bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText">
                                            <App />
                                        </div>
                                    </ModalProvider>
                                </DialogProvider>
                            </ThemeModeProvider>
                        </RecommendedNutritionProvider>
                    </UserDietsProvider>
                </UserMealsProvider>
            </AuthProvider>
        </BrowserRouter> {/* ✅ SLUIT AF */}
    </React.StrictMode>
);
