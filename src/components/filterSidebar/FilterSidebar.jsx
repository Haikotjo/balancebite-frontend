import { useState, useEffect } from "react";
import { Box, Drawer, IconButton, Typography, Divider, useMediaQuery, CircularProgress } from "@mui/material";
import { FilterList, Close } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import CustomChip from "../customChip/CustomChip.jsx";
import "./FilterSidebar.css";

/**
 * FilterSidebar component - Displays a floating filter button that expands into a sidebar.
 *
 * Fetches enum values for diet, cuisine, and meal type dynamically.
 */
const FilterSidebar = ({ isOpen, onClose, onFilter, filters }) => {
    const [open, setOpen] = useState(isOpen);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    // State for enums
    const [diets, setDiets] = useState([]);
    const [cuisines, setCuisines] = useState([]);
    const [mealTypes, setMealTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilters, setSelectedFilters] = useState({});

    const formatEnum = (text) => {
        return text
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };


    // Fetch enums when sidebar opens
    useEffect(() => {
        if (open) {
            setLoading(true);
            axios.get("http://localhost:8080/meals/enums")
                .then(response => {
                    setDiets(response.data.diets || []);
                    setCuisines(response.data.cuisines || []);
                    setMealTypes(response.data.mealTypes || []);
                })
                .catch(error => {
                    console.error("Error fetching enums:", error);
                })
                .finally(() => setLoading(false));
        }
    }, [open]);

    useEffect(() => {
        setSelectedFilters(filters);
    }, [filters]);

    useEffect(() => {
        const formattedFilters = Object.fromEntries(
            Object.entries(filters).map(([key, value]) => [key, value.toUpperCase()])
        );
        setSelectedFilters(formattedFilters);
    }, [filters]);



    // Toggle sidebar open/close
    const toggleSidebar = () => {
        setOpen(!open);
    };

    // Toggle filter selection
    const handleFilterClick = (category, value) => {
        setSelectedFilters((prevFilters) => {
            const newFilters = { ...prevFilters };

            if (newFilters[category] === value) {
                delete newFilters[category]; // ❌ Verwijderen als al geselecteerd
            } else {
                newFilters[category] = value; // ✅ Anders toevoegen
            }

            onFilter(newFilters); // 🔄 Stuur de update door naar `MealPage`
            return newFilters;
        });
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


                {/* Header met sluitknop */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 1,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: theme.palette.primary.main }}>
                            Filters
                        </Typography>
                        <IconButton onClick={toggleSidebar} sx={{ color: theme.palette.text.primary }}>
                            <Close />
                        </IconButton>
                    </Box>

                    {/* Loading-indicator */}
                    {loading ? <CircularProgress sx={{ alignSelf: "center", marginY: 2 }} /> : (
                        <>

                            {/* Type Section */}
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginTop: 1 }}>
                                Type
                            </Typography>
                            <Divider sx={{ marginY: 1 }} />
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                                {mealTypes.map(mealType => (
                                    <CustomChip
                                        className="sidebar-chip"
                                        key={mealType}
                                        label={formatEnum(mealType)}
                                        selected={selectedFilters.mealType === mealType}
                                        onClick={() => handleFilterClick("mealType", mealType)}
                                        iconSize={15}
                                    />
                                ))}
                            </Box>

                            {/* Diet Section */}
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                Diet
                            </Typography>
                            <Divider sx={{ marginY: 1 }} />
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                                {diets.map(diet => (
                                    <CustomChip
                                        className="sidebar-chip"
                                        key={diet}
                                        label={formatEnum(diet)}
                                        selected={selectedFilters.diet === diet}
                                        onClick={() => handleFilterClick("diet", diet)}
                                        iconSize={20}
                                    />
                                ))}
                            </Box>

                            {/* Cuisine Section */}
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginTop: 2 }}>
                                Cuisine
                            </Typography>
                            <Divider sx={{ marginY: 1 }} />
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                                {cuisines.map(cuisine => (
                                    <CustomChip
                                        className="sidebar-chip"
                                        key={cuisine}
                                        label={formatEnum(cuisine)}
                                        selected={selectedFilters.cuisine === cuisine}
                                        onClick={() => handleFilterClick("cuisine", cuisine)}
                                        iconSize={20}
                                    />
                                ))}
                            </Box>
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
};

export default FilterSidebar;
