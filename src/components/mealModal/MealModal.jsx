import { Dialog, DialogContent, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import { Minimize2 } from 'lucide-react';
import MealDetailCard from "../mealCardLarge/MealDetailCard.jsx";

const MealDetailModal = ({ open, onClose, meal }) => {

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            scroll="body"
        >
            <IconButton
                onClick={onClose}
                sx={{ position: "absolute", zIndex: 10, top: 5, left: 5 }}
            >
                <Minimize2
                    size={20}
                    style={{
                        filter: "drop-shadow(0 0 3px rgba(0, 0, 0, 0.5))",
                    }}
                />
            </IconButton>

            <DialogContent sx={{ p: 0 }}>
                <MealDetailCard meal={meal} isModal onClose={onClose} />
            </DialogContent>
        </Dialog>
    );
};

MealDetailModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    meal: PropTypes.object.isRequired,
};

export default MealDetailModal;
