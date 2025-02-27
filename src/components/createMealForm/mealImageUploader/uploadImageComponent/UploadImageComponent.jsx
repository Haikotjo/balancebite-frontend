import PropTypes from "prop-types";
import { Tooltip, IconButton, Box } from "@mui/material";
import DriveFolderUploadRoundedIcon from "@mui/icons-material/DriveFolderUploadRounded";
import { useState } from "react";

const UploadImageComponent = ({ disabled, onUpload, errors }) => {
    const [fileName, setFileName] = useState("");

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();

            // Lees bestand als Base64
            reader.onload = (event) => {
                const base64String = event.target.result;
                onUpload(base64String);
                setFileName(file.name);
            };

            reader.readAsDataURL(file);
        }
    };

    return (
        <Box display="flex" gap={1} alignItems="center">
            <Tooltip title="Upload an Image" arrow>
                <span>
                    <label htmlFor="file-upload">
                        <IconButton
                            color="primary"
                            component="span"
                            disabled={disabled}
                            sx={{ width: 56, height: 56, opacity: disabled ? 0.5 : 1 }}
                        >
                            <DriveFolderUploadRoundedIcon fontSize="large" />
                        </IconButton>
                    </label>
                </span>
            </Tooltip>
            <input
                id="file-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                disabled={disabled}
                onChange={handleFileChange}
            />

            {/* Errors weergeven */}
            {errors.imageFile && (
                <span style={{ color: "red" }}>{errors.imageFile.message}</span>
            )}
        </Box>
    );
};

UploadImageComponent.propTypes = {
    disabled: PropTypes.bool.isRequired,
    onUpload: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
};

export default UploadImageComponent;
