import { useState } from "react";
import PropTypes from "prop-types";
import { Typography, Box } from "@mui/material";

/**
 * ExpandableDescription component that truncates text after 160 characters and
 * allows users to expand or collapse the full content.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.description - The text content to display.
 * @returns {JSX.Element} A description with an expandable "Read more" option.
 */
const ExpandableDescription = ({ description }) => {
    // State to track whether the text is expanded or collapsed
    const [expanded, setExpanded] = useState(false);

    // Check if text is longer than 160 characters
    const isLongText = description.length > 100;

    return (
        <Box>
            <Typography
                variant="body1"
                sx={{
                    fontSize: { xs: "0.8rem", md: "1rem" }, // Responsive font size
                    fontStyle: "italic", // Italic text for the description
                    color: "text.secondary", // Uses MUI theme's secondary text color
                    overflow: "hidden",
                    display: expanded ? "block" : "-webkit-box", // Handles text overflow
                    transition: "max-height 0.3s ease-in-out", // Smooth expand/collapse transition
                }}
            >
                {expanded || !isLongText ? (
                    <>
                        {description}{" "}
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
                        {description.substring(0, 100)}{" "}
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

// PropTypes validation for ExpandableDescription
ExpandableDescription.propTypes = {
    description: PropTypes.string.isRequired, // Ensures that "description" is a required string
};

export default ExpandableDescription;
