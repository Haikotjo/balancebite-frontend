import { Box, Stack, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext.jsx";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import FoodBankRoundedIcon from "@mui/icons-material/FoodBankRounded";
import PropTypes from "prop-types";
import CustomChip from "../../customChip/CustomChip.jsx";

function SubMenu({ activeOption, setActiveOption }) {
    const { user } = useContext(AuthContext);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Klein scherm? (<600px)

    const iconSize = isSmallScreen ? 30 : 50;
    const chipMargin = isSmallScreen ? 15 : 30;
    const chipFontSize = isSmallScreen ? 30 : 40;
    const labelFontSize = isSmallScreen ? "0.6rem" : "0.7rem"; // 🔹 Zeer kleine letters

    const options = user
        ? [
            { label: "All Meals", icon: <MenuBookRoundedIcon sx={{ fontSize: chipFontSize }} />, iconSize },
            { label: "My Meals", icon: <FoodBankRoundedIcon sx={{ fontSize: chipFontSize }} />, iconSize },
            { label: "Created Meals", icon: <AccountBoxRoundedIcon sx={{ fontSize: chipFontSize }} />, iconSize },
        ]
        : [{ label: "All Meals", icon: <MenuBookRoundedIcon sx={{ fontSize: chipFontSize }} />, iconSize }];

    const handleChipClick = (option) => {
        console.log("📌 SubMenu selected:", option);
        setActiveOption(option);
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
                                  label={option.label} // 🔥 Label komt nu in de chip
                                  selected={option.label === activeOption}
                                  onClick={() => handleChipClick(option.label)}
                                  iconMargin={chipMargin}
                                  iconSize={option.iconSize}
                                  labelPosition="top"
                                  labelFontSize={labelFontSize}
                              />

                            </span>
                        </Tooltip>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}

SubMenu.propTypes = {
    activeOption: PropTypes.string.isRequired,
    setActiveOption: PropTypes.func.isRequired,
};

export default SubMenu;
