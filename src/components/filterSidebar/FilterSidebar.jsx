import { useState, useEffect } from "react";
import { Box, Drawer, IconButton, Typography, Divider, useMediaQuery, CircularProgress } from "@mui/material";
import { FilterList, Close } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import CustomChip from "../customChip/CustomChip.jsx";
import "./FilterSidebar.css";
import {fetchMealEnums} from "../../services/apiService.js";
import {formatEnum} from "./helper/formatEnum.js";
import useSidebarState from "./hooks/useSidebarState.js";
import useFetchMealEnums from "./hooks/useFetchMealEnums.js";
import useSyncFilters from "./hooks/useSyncFilters.js";
import FilterSection from "./filterSection/FilterSection.jsx";
import useFilterSelection from "./hooks/useFilterSelection.js";
import SidebarHeader from "./sidebarHeader/SidebarHeader.jsx";

/**
 * FilterSidebar component - Displays a floating filter button that expands into a sidebar.
 *
 * Fetches enum values for diet, cuisine, and meal type dynamically.
 */
const FilterSidebar = ({ isOpen, onFilter, filters }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const { open, toggleSidebar } = useSidebarState(isOpen);
    const { diets, cuisines, mealTypes, loading } = useFetchMealEnums(open);
    const { selectedFilters, handleFilterClick } = useFilterSelection(filters, onFilter);

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
                </IconButton>
            )}

            {/* Sidebar Drawer */}
            <Drawer anchor="right" open={open} onClose={toggleSidebar}>
                <Box
                    sx={{
                        width: { xs: 220, sm: 300, md: 400, lg: 520 },
                        height: "100vh",
                        padding: { xs: 1, sm: 2, md: 3, lg: 4 },
                        backgroundColor: theme.palette.background.default,
                        display: "flex",
                        flexDirection: "column",
                        zIndex: 1500,
                        overflowY: "auto",
                        "WebkitOverflowScrolling": "touch",
                        paddingBottom: "20px",
                    }}
                >

                {/* Header */}
                    <SidebarHeader title="Filters" onClose={toggleSidebar} />

                    {/* Loading-indicator */}
                    {loading ? <CircularProgress sx={{ alignSelf: "center", marginY: 2 }} /> : (
                        <>

                            {/* Filter Sections */}
                            <FilterSection
                                title="Type"
                                items={mealTypes}
                                selectedFilters={selectedFilters}
                                category="mealType"
                                onFilterClick={handleFilterClick}
                            />

                            <FilterSection
                                title="Diet"
                                items={diets}
                                selectedFilters={selectedFilters}
                                category="diet"
                                onFilterClick={handleFilterClick}
                            />

                            <FilterSection
                                title="Cuisine"
                                items={cuisines}
                                selectedFilters={selectedFilters}
                                category="cuisine"
                                onFilterClick={handleFilterClick}
                            />
                        </>
                    )}
                </Box>
            </Drawer>
        </>
    );
};

FilterSidebar.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onFilter: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
};

export default FilterSidebar;
