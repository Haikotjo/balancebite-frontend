import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { UserMealsContext } from "../context/UserMealsContext"; // Importeer de UserMealsContext
import { useNavigate } from "react-router-dom";

const useLogout = () => {
    const { logout } = useContext(AuthContext);
    const { resetUserMeals } = useContext(UserMealsContext); // Haal resetUserMeals op uit de context
    const navigate = useNavigate();

    return async () => {
        await logout();
        resetUserMeals(); // Reset de userMeals context
        navigate("/"); // Navigeer naar de homepagina na logout
    };
};

export default useLogout;
