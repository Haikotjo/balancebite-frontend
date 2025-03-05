import { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Box, Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import { consumeMealApi } from "../../../services/apiService";
import RecommendedNutritionDisplay from "../../recommendedNutritionDisplay/RecommendedNutritionDisplay.jsx";
import ErrorDialog from "../../errorDialog/ErrorDialog.jsx";

const EatButton = ({ meal, refetchRecommendedNutrition }) => {
    const theme = useTheme();
    const [isModalOpen, setModalOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const token = localStorage.getItem("accessToken");

    const handleConsumeMeal = async () => {
        try {
            if (!token) {
                console.error("No token found. User not authenticated.");
                setErrorMessage(
                    <>
                        Use this function or to consume a meal, please{" "}
                        <a href="/register" style={{ color: theme.palette.primary.main, textDecoration: "underline" }}>
                            register
                        </a>{" "}
                        or{" "}
                        <a href="/login" style={{ color: theme.palette.primary.main, textDecoration: "underline" }}>
                            login
                        </a>.
                    </>
                );
                setDialogOpen(true); // ✅ Open foutvenster
                return;
            }

            console.log("Attempting to consume meal:", meal.id);

            const remainingIntakes = await consumeMealApi(meal.id, token);
            console.log("Meal consumed successfully. Remaining intake:", remainingIntakes);

            await refetchRecommendedNutrition();
            setModalOpen(true);
        } catch (error) {
            console.error("Error consuming meal:", error);

            if (
                error.response?.status === 404 &&
                error.response?.data?.error?.includes("Recommended daily intake not found")
            ) {
                setErrorMessage("Please update your metrics in your profile to get a Recommended Daily Intake (RDI).");
            } else {
                setErrorMessage("An unexpected error occurred. Please try again later.");
            }
            setDialogOpen(true);
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
            <motion.div
                whileTap={{ scale: 1.2 }}
                whileHover={{ scale: 1.1 }}
                onClick={handleConsumeMeal}
                style={{
                    cursor: "pointer",
                    display: "inline-block",
                }}
            >
                <RestaurantRoundedIcon
                    sx={{
                        fontSize: 25,
                        color: theme.palette.primary.dark,
                        transition: "color 0.2s ease-in-out",
                        "&:hover": {
                            color: theme.palette.primary.light,
                        },
                    }}
                />
            </motion.div>

            <ErrorDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                message={errorMessage}
                {...(token && {
                    actionLink: "/profile",
                    actionLabel: "Go to Profile",
                })}
            />

            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="nutrition-modal-title"
                aria-describedby="nutrition-modal-description"
            >
                <Box>
                    <RecommendedNutritionDisplay />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCloseModal}
                        sx={{ color: "white" }}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

EatButton.propTypes = {
    meal: PropTypes.object.isRequired,
    refetchRecommendedNutrition: PropTypes.func.isRequired,
};

export default EatButton;
