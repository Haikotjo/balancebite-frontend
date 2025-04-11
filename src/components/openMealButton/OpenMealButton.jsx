import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OpenMealButton = ({ mealId, onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate(`/meal/${mealId}`);
        }
    };

    return (
        <IconButton
            onClick={handleClick}
            sx={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "40%",
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.5)",
                width: 35,
                height: 35,
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                    transform: "scale(1.2)",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
            }}
        >
            <ExternalLink size={20} color="white" />
        </IconButton>
    );
};

OpenMealButton.propTypes = {
    mealId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onClick: PropTypes.func,
};

export default OpenMealButton;
