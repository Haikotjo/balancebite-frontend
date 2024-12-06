import { useState } from "react";
import PropTypes from "prop-types";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const HamburgerMenu = ({ user, onLogout, onLoginClick }) => {
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
            <IconButton
                edge="end"
                color="inherit"
                onClick={handleMenuOpen}
            >
                <MenuIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => { navigate("/"); handleMenuClose(); }}>Home</MenuItem>
                <MenuItem onClick={() => { navigate("/about"); handleMenuClose(); }}>About</MenuItem>
                <MenuItem onClick={() => { navigate("/meals"); handleMenuClose(); }}>Meals</MenuItem>
                {user ? (
                    <MenuItem onClick={() => { onLogout(); handleMenuClose(); }}>Logout</MenuItem>
                ) : (
                    <MenuItem onClick={() => { onLoginClick(); handleMenuClose(); }}>Login</MenuItem>
                )}
            </Menu>
        </>
    );
};

HamburgerMenu.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        roles: PropTypes.arrayOf(PropTypes.string).isRequired,
        type: PropTypes.string.isRequired,
    }),
    onLogout: PropTypes.func.isRequired, // Correcte naam
    onLoginClick: PropTypes.func.isRequired, // Voeg deze ook toe voor consistentie
};


export default HamburgerMenu;
