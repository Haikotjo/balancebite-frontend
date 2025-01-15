import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Link } from "@mui/material";
import { motion } from "framer-motion";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import { consumeMealApi } from "../../../services/apiService";
import RecommendedNutritionDisplay from "../../recommendedNutritionDisplay/RecommendedNutritionDisplay.jsx";
import ErrorDialog from "../../ErrorDialog/ErrorDialog.jsx";

const EatButton = ({ meal, refetchRecommendedNutrition }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleConsumeMeal = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("No token found. User not authenticated.");
                return;
            }

            console.log("Attempting to consume meal:", meal.id);

            const remainingIntakes = await consumeMealApi(meal.id, token);
            console.log("Meal consumed successfully. Remaining intake:", remainingIntakes);

            await refetchRecommendedNutrition();
            setModalOpen(true); // Open de modal
        } catch (error) {
            console.error("Error consuming meal:", error);

            // Specifieke foutmelding voor 404 met "Recommended daily intake not found"
            if (
                error.response?.status === 404 &&
                error.response?.data?.error?.includes("Recommended daily intake not found")
            ) {
                setErrorMessage(
                    "Please update your metrics in your profile to get a Recommended Daily Intake (RDI)."
                );
                setDialogOpen(true);
            } else {
                setErrorMessage("An unexpected error occurred. Please try again later.");
                setDialogOpen(true);
            }
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <>
            {/* Icoon met Framer Motion effecten */}
            <motion.div
                whileTap={{ scale: 1.2 }} // Vergroot tijdelijk bij klikken
                whileHover={{ scale: 1.1 }} // Iets groter bij hover
                onClick={handleConsumeMeal}
                style={{
                    cursor: "pointer",
                    display: "inline-block",
                }}
            >
                <RestaurantRoundedIcon sx={{ fontSize: 24, color: "primary.main" }} />
            </motion.div>

            {/* Error Dialog */}
            <ErrorDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                message={errorMessage}
                actionLink="/profile"
                actionLabel="Go to Profile"
            />

            {/* Modal Weergave */}
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="nutrition-modal-title"
                aria-describedby="nutrition-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 600,
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <RecommendedNutritionDisplay />
                </Box>
            </Modal>
        </>
    );
};

EatButton.propTypes = {
    meal: PropTypes.object.isRequired, // De maaltijdinformatie
    refetchRecommendedNutrition: PropTypes.func.isRequired, // Functie om aanbevolen voeding te vernieuwen
};

export default EatButton;
