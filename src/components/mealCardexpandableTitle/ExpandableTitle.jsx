import { useState } from "react";
import PropTypes from "prop-types";
import { Typography, Box } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const ExpandableTitle = ({ title }) => {
    // State to track whether the text is expanded or collapsed
    const [expanded, setExpanded] = useState(false);

    // Check if text is longer than 160 characters
    const isLongText = title.length > 50;

    return (
        <Box sx={{ display: "flex", alignItems: "center", maxWidth: "100%", marginBottom: 1 }}>
            <Typography
                variant="h4"
                sx={{
                    fontSize: { xs: "1.5rem", md: "2rem" },
                    fontWeight: 600,
                    color: "text.primary",
                    overflow: "hidden",
                    display: expanded ? "block" : "-webkit-box",
                    transition: "max-height 0.3s ease-in-out",
                }}
            >
                {expanded || !isLongText ? (
                    <>
                        {title}{" "}
                        {isLongText && (
                            <Typography
                                component="span"
                                onClick={() => setExpanded(false)}
                                sx={{
                                    fontSize: { xs: "0.8rem", md: "1rem" },
                                    fontStyle: "normal", // Prevents the "Read less" link from being italic
                                    color: "primary.main", // Uses primary color from MUI theme
                                    cursor: "pointer", // Makes it clickable
                                }}
                            >
                                Read less
                            </Typography>
                        )}
                    </>
                ) : (
                    <>
                        {/* Displays only the first 160 characters in collapsed state */}
                        {title.substring(0, 50)}{" "}
                        <Typography
                            component="span"
                            onClick={() => setExpanded(true)}
                            sx={{
                                fontSize: { xs: "0.8rem", md: "1rem" },
                                fontStyle: "normal", // Prevents the "Read more" link from being italic
                                color: "primary.main",
                                cursor: "pointer",
                            }}
                        >
                            ...Read more
                        </Typography>
                    </>
                )}
            </Typography>
        </Box>
    );
};

ExpandableTitle.propTypes = {
    title: PropTypes.string.isRequired,
};

export default ExpandableTitle;
