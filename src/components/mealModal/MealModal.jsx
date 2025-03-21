import { Modal, Box, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import MealCard from "../mealCard/MealCard.jsx";

const MealModal = ({ meal, open, onClose, onFilter }) => {
    if (!meal) return null;

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="meal-modal">
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "90%",
                    maxWidth: 400,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 2,
                    outline: "none",
                }}
            >
                <IconButton
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
                <MealCard meal={meal} onFilter={onFilter} />
            </Box>
        </Modal>
    );
};

MealModal.propTypes = {
    meal: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onFilter: PropTypes.func.isRequired,
};

export default MealModal;
