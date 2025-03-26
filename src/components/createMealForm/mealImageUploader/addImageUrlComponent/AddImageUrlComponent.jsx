import PropTypes from "prop-types";
import { Tooltip, IconButton, Box } from "@mui/material";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import { useEffect, useState } from "react";
import TextFieldCreateMeal from "../../../textFieldCreateMeal/TextFieldCreateMeal.jsx";

const AddImageUrlComponent = ({ disabled, onUrlChange, register, errors, onReset }) => {
    const [showInput, setShowInput] = useState(false);
    const [urlValue, setUrlValue] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        setUrlValue(value);
        onUrlChange(value);
        register("imageUrl").onChange(e);
    };

    const handleReset = () => {
        setUrlValue("");
        setShowInput(false);
    };

    useEffect(() => {
        if (onReset) {
            handleReset();
        }
    }, [onReset]);

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
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
                <TextFieldCreateMeal
                    label="Image URL"
                    value={urlValue}
                    onChange={handleChange}
                    error={errors.imageUrl}
                    helperText={errors.imageUrl?.message}
                    fullWidth
                    sx={{ marginTop: 2 }}
                />
            )}
        </Box>
    );
};

AddImageUrlComponent.propTypes = {
    disabled: PropTypes.bool.isRequired,
    onUrlChange: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    onReset: PropTypes.any,
};

export default AddImageUrlComponent;
