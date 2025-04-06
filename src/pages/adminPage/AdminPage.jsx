import { useMediaQuery, useTheme, Box, Stack, Tooltip, Typography, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import CustomChip from "../../components/customChip/CustomChip.jsx";
import CreateMealForm from "../../components/createMealForm/CreateMealForm.jsx";
import CreateFoodItemForm from "../../components/createFoodItemForm/CreateFoodItemForm.jsx";
import DeleteFoodItemForm from "../../components/DeleteFoodItemForm/DeleteFoodItemForm.jsx";
import SettingsIcon from "@mui/icons-material/Settings";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import AddBoxIcon from "@mui/icons-material/AddBox";

const AdminPage = () => {
    const [activeOption, setActiveOption] = useState("Create Meal");
    const [foodItemAction, setFoodItemAction] = useState("Create");

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const iconSize = isSmallScreen ? 30 : 50;
    const chipMargin = isSmallScreen ? 15 : 30;
    const chipFontSize = isSmallScreen ? 30 : 40;
    const labelFontSize = isSmallScreen ? "0.6rem" : "0.7rem";

    const options = [
        { label: "Create Meal", icon: <RestaurantIcon sx={{ fontSize: chipFontSize }} /> },
        { label: "Food Item", icon: <AddBoxIcon sx={{ fontSize: chipFontSize }} /> },
        { label: "Settings", icon: <SettingsIcon sx={{ fontSize: chipFontSize }} /> },
    ];

    const renderActiveComponent = () => {
        if (activeOption === "Food Item") {
            return (
                <Box>
                    <Select
                        value={foodItemAction}
                        onChange={(e) => setFoodItemAction(e.target.value)}
                        sx={{ mb: 2, width: "100%" }}
                    >
                        <MenuItem value="Create">Create Food Item</MenuItem>
                        <MenuItem value="Delete">Delete Food Item</MenuItem>
                    </Select>
                    {foodItemAction === "Create" && <CreateFoodItemForm />}
                    {foodItemAction === "Delete" && <DeleteFoodItemForm />}
                </Box>
            );
        }

        switch (activeOption) {
            case "Create Meal":
                return <CreateMealForm />;
            case "Settings":
                return <Typography>Admin settings coming soon...</Typography>;
            default:
                return null;
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" padding={2}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
                Admin Dashboard
            </Typography>

            <Box sx={{ marginBottom: 2, display: "flex", justifyContent: "center" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    {options.map((option) => (
                        <Box key={option.label} display="flex" flexDirection="column" alignItems="center">
                            <Tooltip title={option.label} arrow>
                                <span>
                                    <CustomChip
                                        icon={option.icon}
                                        label={option.label}
                                        selected={option.label === activeOption}
                                        onClick={() => setActiveOption(option.label)}
                                        iconMargin={chipMargin}
                                        iconSize={iconSize}
                                        labelPosition="top"
                                        labelFontSize={labelFontSize}
                                        sx={{
                                            backgroundColor: option.label === activeOption ? "primary.main" : "default",
                                            color: option.label === activeOption ? "white" : "black",
                                        }}
                                    />
                                </span>
                            </Tooltip>
                        </Box>
                    ))}
                </Stack>
            </Box>

            <Box sx={{ width: "100%", maxWidth: "600px" }}>
                {renderActiveComponent()}
            </Box>
        </Box>
    );
};

export default AdminPage;