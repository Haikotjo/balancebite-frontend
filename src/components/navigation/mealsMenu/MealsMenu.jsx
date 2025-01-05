import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Menu } from "@mui/material";
import FoodBankRoundedIcon from "@mui/icons-material/FoodBankRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuItemComponent from "./menuItemComponent/MenuItemComponent.jsx";

const MealsMenu = ({ user, iconColor, text, onClose }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const navigate = useNavigate();

    return (
        <>
            <div
                onClick={handleMenuOpen}
                style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    color: iconColor,
                }}
            >
                <FoodBankRoundedIcon />
                <KeyboardArrowDownIcon sx={{ fontSize: "16px", ml: 0.05, mr: 0.5 }} />
                {text && <span style={{ marginLeft: "8px" }}>{text}</span>}
            </div>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItemComponent
                    icon={MenuBookRoundedIcon}
                    label="All Meals"
                    path="/meals"
                    onClose={() => {
                        handleMenuClose();
                        onClose();
                    }}
                    requiresAuth={false}
                />
                <MenuItemComponent
                    icon={FoodBankRoundedIcon}
                    label="My Meals"
                    path="/meals"
                    user={user}
                    onClose={() => {
                        handleMenuClose();
                        onClose();
                        navigate("/meals", {
                            state: { endpoint: `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_USER_MEALS_ENDPOINT}` },
                        });
                    }}
                    requiresAuth={true}
                />
                <MenuItemComponent
                    icon={AddCircleOutlineRoundedIcon}
                    label="Create Meal"
                    path="/create-meal"
                    user={user}
                    onClose={() => {
                        handleMenuClose();
                        onClose();
                    }}
                    requiresAuth={true}
                />
            </Menu>
        </>
    );
};

MealsMenu.propTypes = {
    user: PropTypes.object,
    iconColor: PropTypes.string,
    text: PropTypes.string,
    onClose: PropTypes.func,
};

export default MealsMenu;
