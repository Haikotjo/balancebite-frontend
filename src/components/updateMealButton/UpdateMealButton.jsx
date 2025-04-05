import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const UpdateMealButton = ({ mealId }) => {
    const navigate = useNavigate();

    const handleUpdateClick = () => {
        navigate(`/update-meal/${mealId}`);
    };

    return (
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.3 }}>
            <IconButton
                onClick={handleUpdateClick}
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
                <CreateRoundedIcon sx={{ fontSize: 20, color: "white" }} />
            </IconButton>
        </motion.div>
    );
};

UpdateMealButton.propTypes = {
    mealId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default UpdateMealButton;
