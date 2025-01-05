import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MealList from "../../components/mealList/MealList.jsx";
import SubMenu from "../../components/mealList/submenu/SubMenu.jsx";
import { AuthContext } from "../../context/AuthContext";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useLocation } from "react-router-dom";

function MealPage() {
    const { userId } = useParams();
    const location = useLocation(); // Lees de state doorgegeven via navigate
    const [userName, setUserName] = useState(null);
    const [currentListEndpoint, setCurrentListEndpoint] = useState(
        location.state?.endpoint || `${import.meta.env.VITE_BASE_URL}/meals` // Gebruik state of fallback naar default
    );
    const [submenuOptions, setSubmenuOptions] = useState([]);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            setSubmenuOptions(["All My Meals", "My Created Meals", "Suggested Meals"]);
        } else {
            setSubmenuOptions([]);
        }
    }, [user]);

    const handleSubMenuClick = (option) => {
        switch (option) {
            case "All My Meals":
                setCurrentListEndpoint(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_USER_MEALS_ENDPOINT}`);
                break;
            case "My Created Meals":
                setCurrentListEndpoint(`${import.meta.env.VITE_BASE_URL}/users/created-meals`);
                break;
            case "Suggested Meals":
                setCurrentListEndpoint(`${import.meta.env.VITE_BASE_URL}/meals/suggestions`);
                break;
            default:
                setCurrentListEndpoint(`${import.meta.env.VITE_BASE_URL}/meals`);
                break;
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: 2 }}>
            <Typography variant="h3" gutterBottom>All Meals</Typography>
            {userId && userName && (
                <>
                    <Typography variant="body1" sx={{ fontStyle: "italic", marginBottom: 2 }}>{userName} created and added</Typography>
                    <MuiLink
                        component="button"
                        underline="hover"
                        onClick={() => navigate("/meals")}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "0.9rem",
                            color: "text.secondary",
                            cursor: "pointer",
                            "&:hover": { color: "text.primary" },
                        }}
                    >
                        <ArrowBackIcon sx={{ fontSize: "1rem", marginRight: 0.5 }} />
                        Back to All Meals
                    </MuiLink>
                </>
            )}
            {submenuOptions.length > 0 && <SubMenu options={submenuOptions} onOptionClick={handleSubMenuClick} />}
            <MealList endpoint={currentListEndpoint} setCreatedByName={setUserName} />
        </Box>
    );
}


export default MealPage;
