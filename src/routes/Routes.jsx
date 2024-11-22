import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "../components/navigation/Navigation";
import HomePage from "../pages/homePage/HomePage";
import AboutPage from "../pages/aboutPage/AboutPage";
import MealsPage from "../pages/mealsPage/MealsPage";

function AppRoutes() {
    return (
        <Router
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <Navigation />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/meals" element={<MealsPage />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;
