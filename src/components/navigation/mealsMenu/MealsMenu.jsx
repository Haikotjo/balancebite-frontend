import { useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Menu, MenuItem, ListItemText, ListItemIcon, Tooltip } from "@mui/material";
import FoodBankRoundedIcon from "@mui/icons-material/FoodBankRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import { useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const MealsMenu = ({ user, iconColor }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {/* Meals Icon */}
            <IconButton
                onClick={handleMenuOpen}
                sx={{ color: iconColor }}
            >
                <FoodBankRoundedIcon />
                <KeyboardArrowDownIcon sx={{ fontSize: "16px", ml: 0.05 }} />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {/* View All Meals */}
                <MenuItem
                    onClick={() => {
                        navigate("/meals");
                        handleMenuClose();
                    }}
                >
                    <ListItemIcon>
                        <MenuBookRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="All Meals" />
                </MenuItem>

                {/* My Meals (Requires Login) */}
                <Tooltip
                    title={user ? "" : "Please log in to access your meals"}
                    placement="top"
                    arrow
                >
                    <span>
                        <MenuItem
                            onClick={() => {
                                if (user) {
                                    navigate("/my-meals");
                                    handleMenuClose();
                                }
                            }}
                            disabled={!user}
                        >
                            <ListItemIcon>
                                <FoodBankRoundedIcon />
                            </ListItemIcon>
                            <ListItemText primary="My Meals" />
                        </MenuItem>
                    </span>
                </Tooltip>

                {/* Create Meal (Requires Login) */}
                <Tooltip
                    title={user ? "" : "Please log in to create a meal"}
                    placement="top"
                    arrow
                >
                    <span>
                        <MenuItem
                            onClick={() => {
                                if (user) {
                                    navigate("/create-meal");
                                    handleMenuClose();
                                }
                            }}
                            disabled={!user}
                        >
                            <ListItemIcon>
                                <AddCircleOutlineRoundedIcon />
                            </ListItemIcon>
                            <ListItemText primary="Create Meal" />
                        </MenuItem>
                    </span>
                </Tooltip>
            </Menu>
        </>
    );
};

MealsMenu.propTypes = {
    user: PropTypes.object,
    iconColor: PropTypes.string,
};

export default MealsMenu;
