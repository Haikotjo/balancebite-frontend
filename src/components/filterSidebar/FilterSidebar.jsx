import { useState } from "react";
import { Box, Drawer, IconButton, Typography, Divider } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import PropTypes from "prop-types";

/**
 * FilterSidebar component - Displays a floating filter button that expands into a sidebar.
 *
 * @component
 */
const FilterSidebar = ({ isOpen, onClose }) => {
    const [open, setOpen] = useState(isOpen);

    // Toggle sidebar open/close
    const toggleSidebar = () => {
        setOpen(!open);
    };

    return (
        <>
            {/* Floating "Filters" Button */}
            <IconButton
                onClick={toggleSidebar}
                sx={{
                    position: "fixed",
                    top: "40%",
                    right: 0,
                    backgroundColor: "primary.main",
                    color: "white",
                    borderTopLeftRadius: "4px",
                    borderBottomLeftRadius: "4px",
                    padding: "10px",
                    boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
                    "&:hover": {
                        backgroundColor: "primary.dark",
                    },
                }}
            >
                <FilterList sx={{ fontSize: 30 }} />
                <Typography
                    variant="body2"
                    sx={{
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        marginLeft: "5px",
                        display: { xs: "none", sm: "inline" }, // Alleen tonen op grotere schermen
                    }}
                >
                    Filters
                </Typography>
            </IconButton>

            {/* Sidebar Drawer */}
            <Drawer anchor="right" open={open} onClose={toggleSidebar}>
                <Box
                    sx={{
                        width: 250,
                        height: "100vh",
                        padding: 2,
                        backgroundColor: "background.default",
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                        Filters
                    </Typography>

                    {/* Diet Section */}
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                        Diet
                    </Typography>
                    <Divider sx={{ marginY: 1 }} />

                    {/* Cuisine Section */}
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                        Cuisine
                    </Typography>
                    <Divider sx={{ marginY: 1 }} />

                    {/* Type Section */}
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                        Type
                    </Typography>
                    <Divider sx={{ marginY: 1 }} />
                </Box>
            </Drawer>
        </>
    );
};

FilterSidebar.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
};

export default FilterSidebar;
