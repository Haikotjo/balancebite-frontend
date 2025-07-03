import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import NavBar from "../features/navigation/components/navBar/NavBar.jsx";

import HomePage from "../pages/homePage/HomePage";
import AboutPage from "../pages/aboutPage/AboutPage";
import LoginPage from "../pages/loginPage/LoginPage";
import RegisterPage from "../pages/registerPage/RegisterPage";
import ProfilePage from "../features/profile/pages/profilePage/ProfilePage.jsx";
import AdminPage from "../features/admin/pages/AdminPage.jsx";
import RequireAdmin from "./RequireAdmin.jsx";

import MealsPage from "../features/meals/pages/mealsPage/MealsPage.jsx";
import MealDetailsPage from "../features/meals/pages/mealDetailsPage/MealDetailsPage.jsx";
import UpdateMealPage from "../features/meals/pages/updateMealPage/UpdateMealPage.jsx";
import CreateMealPage from "../features/meals/pages/createMealPage/CreateMealPage.jsx";

import DietsPage from "../features/diets/pages/dietsPage/DietsPage.jsx";
import DietDetailsPage from "../features/diets/pages/dietDetailsPage/DietDetailsPage.jsx";
import CreateDietPage from "../features/diets/pages/createDietPage/createDietPage.jsx";
import UpdateDietPage from "../features/diets/pages/updateDietPage/UpdateDietPage.jsx";
import ShoppingCartPage from "../pages/shoppingCart/ShoppingCartPage.jsx";
import DashboardPage from "../features/profile/pages/dashboardPage/DashboardPage.jsx";
import IngredientsPage from "../features/fooditem/page/IngredientsPage.jsx";

function AppRoutes() {
    return (
        <>
            <NavBar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/meals/:userId?" element={<MealsPage />} />
                <Route path="/diets/:userId?" element={<DietsPage />} />

                <Route path="/create-meal" element={<ProtectedRoute><CreateMealPage /></ProtectedRoute>} />
                <Route path="/create-diet" element={<ProtectedRoute><CreateDietPage /></ProtectedRoute>} />
                <Route path="/update-diet/:dietId" element={<ProtectedRoute><UpdateDietPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/update-meal/:mealId" element={<ProtectedRoute><UpdateMealPage /></ProtectedRoute>} />
                <Route path="/shopping-cart/:dietPlanId" element={<ProtectedRoute><ShoppingCartPage /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/admin" element={<RequireAdmin><AdminPage /></RequireAdmin>} />
                <Route path="/meal/:mealId" element={<MealDetailsPage />} />
                <Route path="/diet/:dietId" element={<DietDetailsPage />} />
                <Route path="/ingredients" element={<IngredientsPage />} />
            </Routes>
        </>
    );
}

export default AppRoutes;
