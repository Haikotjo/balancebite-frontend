import { useMediaQuery, useTheme, Box, Stack, Tooltip } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import FoodBankRoundedIcon from "@mui/icons-material/FoodBankRounded";
import CustomChip from "../customChip/CustomChip.jsx";
import {UserMealsContext} from "../../context/UserMealsContext.jsx";
import {useNavigate} from "react-router-dom";

function SubMenu({ isDetailPage = false }) {
    const { activeOption, setActiveOption } = useContext(UserMealsContext);
    const { user } = useContext(AuthContext);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();

    const iconSize = isSmallScreen ? 30 : 50;
    const chipMargin = isSmallScreen ? 15 : 30;
    const chipFontSize = isSmallScreen ? 30 : 40;
    const labelFontSize = isSmallScreen ? "0.6rem" : "0.7rem";

    const options = user
        ? [
            { label: "All Meals", icon: <MenuBookRoundedIcon sx={{ fontSize: chipFontSize }} /> },
            { label: "My Meals", icon: <FoodBankRoundedIcon sx={{ fontSize: chipFontSize }} /> },
            { label: "Created Meals", icon: <AccountBoxRoundedIcon sx={{ fontSize: chipFontSize }} /> },
        ]
        : [{ label: "All Meals", icon: <MenuBookRoundedIcon sx={{ fontSize: chipFontSize }} /> }];

    const handleChipClick = (option) => {
        if (isDetailPage) {
            navigate(`/meals?filter=${option}`);
        } else {
            if (activeOption !== option) {
                console.log("📌 SubMenu selected:", option);
                setActiveOption(option);
            }
        }
    };

    return (
        <Box sx={{ marginBottom: 0, display: "flex", justifyContent: "center" }}>
            <Stack direction="row" spacing={2} alignItems="center">
                {options.map((option) => (
                    <Box key={option.label} display="flex" flexDirection="column" alignItems="center">
                        <Tooltip title={option.label} arrow>
                            <span>
                                <CustomChip
                                    icon={option.icon}
                                    label={option.label}
                                    selected={option.label === activeOption}
                                    onClick={() => handleChipClick(option.label)}
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
    );
}

export default SubMenu;
