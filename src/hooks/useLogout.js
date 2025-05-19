import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return async (onSuccess) => {
        await logout();
        if (typeof onSuccess === "function") {
            await onSuccess();
        }
        navigate("/", { replace: true });
    };
};

export default useLogout;
