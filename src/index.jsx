import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeModeProvider } from "./themes/ThemeProvider.jsx";
import { AuthProvider } from "./context/AuthContext";
import { UserMealsProvider } from "./context/UserMealsContext";
import { RecommendedNutritionProvider } from "./context/RecommendedNutritionContext";
import { UserDietsProvider } from "./context/UserDietContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { ModalProvider } from "./context/ModalContext.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <AuthProvider>
            <UserMealsProvider>
                <UserDietsProvider>
                    <RecommendedNutritionProvider>
                        <ThemeModeProvider>
                            <NotificationProvider>
                                <ModalProvider>
                                    <div className="min-h-screen bg-page text-content">
                                        <App />
                                    </div>
                                </ModalProvider>
                            </NotificationProvider>
                        </ThemeModeProvider>
                    </RecommendedNutritionProvider>
                </UserDietsProvider>
            </UserMealsProvider>
        </AuthProvider>
    </BrowserRouter>
);
