import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { UserMealsContext } from "../context/UserMealsContext"; // Importeer de UserMealsContext
import { useNavigate } from "react-router-dom";

const useLogout = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return async () => {
        await logout();
        navigate("/"); // Navigeer naar de homepagina na logout
    };
};

export default useLogout;
