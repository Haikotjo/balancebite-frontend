import { useState } from "react";
import { Box, Drawer, IconButton, Typography, Divider, useMediaQuery } from "@mui/material";
import { FilterList, Close } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";

/**
 * FilterSidebar component - Displays a floating filter button that expands into a sidebar.
 *
 * @component
 */
const FilterSidebar = ({ isOpen, onClose }) => {
    const [open, setOpen] = useState(isOpen);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Detects small screens

    // Toggle sidebar open/close
    const toggleSidebar = () => {
        setOpen(!open);
    };

    return (
        <>
            {!open && (
                <IconButton
                    onClick={toggleSidebar}
                    sx={{
                        position: "fixed",
                        top: "30%",
                        right: 0,
                        zIndex: 1500,
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        borderTopRightRadius: "4px",
                        borderBottomRightRadius: "4px",
                        padding: isSmallScreen ? "6px" : "10px",
                        boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
                        "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                        },
                    }}
                >
                    <FilterList sx={{ fontSize: { xs: 25, sm: 30 }, mr: "4px", ml: "2px" }} />
                    {/*<Typography*/}
                    {/*    variant="body2"*/}
                    {/*    sx={{*/}
                    {/*        fontSize: "0.8rem",*/}
                    {/*        fontWeight: "bold",*/}
                    {/*        marginLeft: "5px",*/}
                    {/*        display: { xs: "none", sm: "inline" }, */}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    Filters*/}
                    {/*</Typography>*/}
                </IconButton>
            )}

            {/* Sidebar Drawer */}
            <Drawer anchor="right" open={open} onClose={toggleSidebar}>
                <Box
                    sx={{
                        width: 250,
                        height: "100vh",
                        padding: 2,
                        backgroundColor: theme.palette.background.default,
                        display: "flex",
                        flexDirection: "column",
                        zIndex: 1500,
                    }}
                >
                    {/*  Header */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 2,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Filters
                        </Typography>
                        <IconButton onClick={toggleSidebar} sx={{ color: theme.palette.text.primary }}>
                            <Close />
                        </IconButton>
                    </Box>

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
