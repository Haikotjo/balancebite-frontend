import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "../components/navigation/NavBar";
import HomePage from "../pages/homePage/HomePage";
import AboutPage from "../pages/aboutPage/AboutPage";
import MealsPage from "../pages/mealsPage/MealsPage";
import LoginPage from "../pages/loginPage/LoginPage";
import RegisterPage from "../pages/registerPage/RegisterPage";
import CreateMealPage from "../pages/createMealPage/CreateMealPage";
import ProfilePage from "../pages/profilePage/ProfilePage.jsx";
import MealDetailsPage from "../pages/mealDetailsPage/MealDetailsPage.jsx";
import UpdateMealPage from "../pages/updateMealPage/UpdateMealPage.jsx";
import AdminPage from "../pages/adminPage/AdminPage.jsx";
import RequireAdmin from "./RequireAdmin.jsx";

function AppRoutes() {
    return (
        <Router
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <NavBar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/meals/:userId?" element={<MealsPage />} />
                <Route path="/create-meal" element={<CreateMealPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/meal/:mealId" element={<MealDetailsPage />} />
                <Route path="/update-meal/:mealId" element={<UpdateMealPage />} />
                <Route path="/admin" element={<RequireAdmin><AdminPage /></RequireAdmin>} />

            </Routes>
        </Router>
    );
}

export default AppRoutes;
