import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "../components/navigation/NavBar"; // NavBar importeren
import HomePage from "../pages/homePage/HomePage";
import AboutPage from "../pages/aboutPage/AboutPage";
import MealsPage from "../pages/mealsPage/MealsPage";
import LoginPage from "../pages/loginPage/LoginPage";

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
                <Route path="/meals/:userId?" element={<MealsPage />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;
