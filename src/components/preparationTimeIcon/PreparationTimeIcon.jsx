import { IconButton, Typography, Box } from "@mui/material";
import { Timer } from "lucide-react";
import PropTypes from "prop-types";

const PreparationTimeIcon = ({ preparationTime, iconSize = 30 }) => {
    if (!preparationTime) return null;

    const sharedStyle = {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "40%",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.5)",
        width: iconSize + 10,
        height: iconSize + 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
            <IconButton disableRipple sx={{ ...sharedStyle, cursor: "default", padding: "6px"}}>
                <Timer size={iconSize + 2} color="white" />
            </IconButton>

            <Box sx={{
                ...sharedStyle,
                height: "auto", // laat de hoogte afhangen van content
                paddingY: "6px", // gelijke verticale ruimte als de iconbutton (die nu padding 2px heeft)
                paddingX: "6px",
            }}>
                <Typography
                    variant="caption"
                    sx={{
                        fontSize: "0.8rem",
                        fontFamily: "'Quicksand', sans-serif",
                        color: "white",
                        paddingX: 1,
                        textAlign: "center",
                    }}
                >
                    {preparationTime.replace("PT", "").toLowerCase()}
                </Typography>
            </Box>
        </Box>
    );
};

PreparationTimeIcon.propTypes = {
    preparationTime: PropTypes.string,
    iconSize: PropTypes.number,
};

export default PreparationTimeIcon;
