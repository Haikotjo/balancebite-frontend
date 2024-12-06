import PropTypes from "prop-types";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const DesktopMenu = ({ user, onLogout, onLoginClick }) => {
    return (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button color="inherit" component={Link} to="/">
                Home
            </Button>
            <Button color="inherit" component={Link} to="/about">
                About
            </Button>
            <Button color="inherit" component={Link} to="/meals">
                Meals
            </Button>
            {user ? (
                <Button color="inherit" onClick={onLogout}>
                    Logout
                </Button>
            ) : (
                <Button color="inherit" onClick={onLoginClick}>
                    Login
                </Button>
            )}
        </Box>
    );
};

DesktopMenu.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        roles: PropTypes.arrayOf(PropTypes.string).isRequired,
        type: PropTypes.string.isRequired,
    }),
    onLogout: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
};

export default DesktopMenu;
