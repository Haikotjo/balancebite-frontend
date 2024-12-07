import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import IngredientList from "./ingredientList/IngredientList.jsx";

function IngredientsSection({ ingredients }) {
    return (
        <>
            <Typography
                variant="body2"
                sx={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: "0.8rem",
                    marginBottom: "8px",
                }}
            >
                Ingredients:
            </Typography>
            <ErrorBoundary>
                <IngredientList ingredients={ingredients} />
            </ErrorBoundary>
        </>
    );
}

IngredientsSection.propTypes = {
    ingredients: PropTypes.array.isRequired,
};

export default IngredientsSection;
