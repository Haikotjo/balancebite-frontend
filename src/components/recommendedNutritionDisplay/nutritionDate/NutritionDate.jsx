import PropTypes from "prop-types";
import { Typography } from "@mui/material";

const NutritionDate = ({ createdAt }) => {
    return (
        <Typography
            variant="caption"
            align="right"
            display="block"
            sx={{
                marginTop: "10px",
                color: "gray",
                fontStyle: "italic",
            }}
        >
            {createdAt || "N/A"}
        </Typography>
    );
};

NutritionDate.propTypes = {
    createdAt: PropTypes.string,
};

export default NutritionDate;
