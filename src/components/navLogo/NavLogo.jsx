import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NavLogo = ({ title }) => {
    const navigate = useNavigate();

    return (
        <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/")}
        >
            {title}
        </Typography>
    );
};

NavLogo.propTypes = {
    title: PropTypes.string.isRequired,
};

export default NavLogo;
