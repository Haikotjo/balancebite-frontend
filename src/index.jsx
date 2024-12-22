import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import theme from "./themes/theme";
import "./index.css";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./context/AuthContext";
import { UserMealsProvider } from "./context/UserMealsContext";
import { RecommendedNutritionProvider } from "./context/RecommendedNutritionContext";
import "@fontsource/roboto";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        {/* AuthProvider wraps the entire application to manage authentication state */}
        <AuthProvider>
            {/* UserMealsProvider wraps the application to provide user-specific meal data */}
            <UserMealsProvider>
                {/* RecommendedNutritionProvider wraps the application for nutrition data */}
                <RecommendedNutritionProvider>
                    {/* ThemeProvider applies the global Material-UI theme to the app */}
                    <ThemeProvider theme={theme}>
                        {/* CssBaseline provides consistent styling, including normalization and default Material-UI styles */}
                        <CssBaseline />
                        {/* The main App component containing all routes and pages */}
                        <App />
                    </ThemeProvider>
                </RecommendedNutritionProvider>
            </UserMealsProvider>
        </AuthProvider>
    </React.StrictMode>
);
