import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "../components/navigation/NavBar"; // NavBar importeren
import HomePage from "../pages/homePage/HomePage";
import AboutPage from "../pages/aboutPage/AboutPage";
import MealsPage from "../pages/mealsPage/MealsPage";
import LoginPage from "../pages/loginPage/LoginPage";
import RegisterPage from "../pages/registerPage/RegisterPage"; // Nieuwe RegisterPage toevoegen
import CreateMealPage from "../pages/createMealPage/CreateMealPage";
import ProfilePage from "../pages/profilePage/ProfilePage.jsx"; // Nieuwe CreateMealPage toevoegen

function AppRoutes() {
    return (
        <Router
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            {/* NavBar komt buiten de Routes, zodat het altijd zichtbaar is */}
            <NavBar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/meals/:userId?" element={<MealsPage />} />
                <Route path="/create-meal" element={<CreateMealPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;
