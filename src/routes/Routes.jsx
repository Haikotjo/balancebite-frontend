import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RequireAdmin from "./RequireAdmin.jsx";
import RequireAdminOrDietitian from "./RequireAdminOrDietitian.jsx";
import RequireAdminOrSupermarket from "./RequireAdminOrSupermarket.jsx";

import NavBar from "../features/navigation/components/navBar/NavBar.jsx";

const HomePage = lazy(() => import("../pages/homePage/HomePage"));
const AboutPage = lazy(() => import("../pages/aboutPage/AboutPage"));
const LoginPage = lazy(() => import("../pages/loginPage/LoginPage"));
const RegisterPage = lazy(() => import("../pages/registerPage/RegisterPage"));
const ProfilePage = lazy(() => import("../features/profile/pages/profilePage/ProfilePage.jsx"));
const AdminPage = lazy(() => import("../features/admin/pages/AdminPage.jsx"));

const MealsPage = lazy(() => import("../features/meals/pages/mealsPage/MealsPage.jsx"));
const MealDetailsPage = lazy(() => import("../features/meals/pages/mealDetailsPage/MealDetailsPage.jsx"));
const UpdateMealPage = lazy(() => import("../features/meals/pages/updateMealPage/UpdateMealPage.jsx"));
const CreateMealPage = lazy(() => import("../features/meals/pages/createMealPage/CreateMealPage.jsx"));

const DietsPage = lazy(() => import("../features/diets/pages/dietsPage/DietsPage.jsx"));
const DietDetailsPage = lazy(() => import("../features/diets/pages/dietDetailsPage/DietDetailsPage.jsx"));
const CreateDietPage = lazy(() => import("../features/diets/pages/createDietPage/createDietPage.jsx"));
const UpdateDietPage = lazy(() => import("../features/diets/pages/updateDietPage/UpdateDietPage.jsx"));
const ShoppingCartPage = lazy(() => import("../pages/shoppingCart/ShoppingCartPage.jsx"));
const DashboardPage = lazy(() => import("../features/dashboard/pages/dashboardPage/DashboardPage.jsx"));
const IngredientsPage = lazy(() => import("../features/fooditem/page/IngredientsPage.jsx"));
const DietitianPage = lazy(() => import("../features/dietitian/pages/DietitianPage.jsx"));
const CreateFoodItemPage = lazy(() => import("../features/fooditem/page/CreateFoodItemPage.jsx"));

function AppRoutes() {
    return (
        <>
            <NavBar />
            <Suspense fallback={<div className="p-6 text-center">Laden...</div>}>
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
                    <Route
                        path="/dietitian"
                        element={
                            <RequireAdminOrDietitian>
                                <DietitianPage />
                            </RequireAdminOrDietitian>
                        }
                    />
                    <Route path="/meal/:mealId" element={<MealDetailsPage />} />
                    <Route path="/diet/:dietId" element={<DietDetailsPage />} />
                    <Route path="/ingredients" element={<IngredientsPage />} />
                    <Route
                        path="/create-ingredient"
                        element={
                            <RequireAdminOrSupermarket>
                                <CreateFoodItemPage />
                            </RequireAdminOrSupermarket>
                        }
                    />
                </Routes>
            </Suspense>
        </>
    );
}

export default AppRoutes;
