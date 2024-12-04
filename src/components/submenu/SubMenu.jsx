import React from "react";
import { Box, Button, ButtonGroup } from "@mui/material";

function SubMenu({ options = [] }) {
    return (
        <Box sx={{ marginBottom: 3, display: "flex", justifyContent: "center" }}>
            <ButtonGroup variant="contained" color="primary" aria-label="submenu">
                {options.map((option, index) => (
                    <Button key={index}>{option}</Button>
                ))}
            </ButtonGroup>
        </Box>
    );
}

export default SubMenu;
