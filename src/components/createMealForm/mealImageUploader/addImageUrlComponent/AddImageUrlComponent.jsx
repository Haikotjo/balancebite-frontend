import PropTypes from "prop-types";
import { Tooltip, IconButton, TextField, Box } from "@mui/material";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import ResetButton from "../resetButton/ResetButton.jsx";
import { useState } from "react";

const AddImageUrlComponent = ({ disabled, onUrlChange, register, errors }) => {
    const [showInput, setShowInput] = useState(false);
    const [urlValue, setUrlValue] = useState(""); // Lokale state

    const handleReset = () => {
        setUrlValue(""); // Maak lokale waarde leeg
        onUrlChange(""); // Geef lege waarde door aan de parent
        register("imageUrl").onChange({ target: { value: "" } }); // Reset React Hook Form waarde
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setUrlValue(value); // Update lokale waarde
        onUrlChange(value); // Geef waarde door aan parent
        register("imageUrl").onChange(e); // Sync React Hook Form
    };

    return (
        <Box>
            <Tooltip title="Add Image URL" arrow>
                <span>
                    <IconButton
                        color="primary"
                        disabled={disabled}
                        onClick={() => setShowInput(!showInput)}
                        sx={{ width: 56, height: 56 }}
                    >
                        <LinkRoundedIcon fontSize="large" />
                    </IconButton>
                </span>
            </Tooltip>

            {showInput && (
                <Box display="flex" gap={1} alignItems="center">
                    <TextField
                        label="Image URL"
                        value={urlValue} // Lokale waarde
                        error={!!errors.imageUrl}
                        helperText={errors.imageUrl?.message}
                        fullWidth
                        onChange={handleChange} // Bijwerken bij iedere input
                        sx={{ marginTop: 2 }}
                    />
                    {/* Reset Button */}
                    <ResetButton onReset={handleReset} />
                </Box>
            )}
        </Box>
    );
};

AddImageUrlComponent.propTypes = {
    disabled: PropTypes.bool.isRequired,
    onUrlChange: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
};

export default AddImageUrlComponent;
