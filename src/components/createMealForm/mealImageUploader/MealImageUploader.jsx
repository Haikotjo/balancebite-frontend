import { useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography, IconButton } from "@mui/material";
import Camera from "../../camera/Camera.jsx";
import AddImageUrlComponent from "./addImageUrlComponent/AddImageUrlComponent.jsx";
import UploadImageComponent from "./uploadImageComponent/UploadImageComponent.jsx";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

const MealImageUploader = ({ register, errors, onImageChange }) => {
    const [capturedImage, setCapturedImage] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [resetTrigger, setResetTrigger] = useState(false);

    const handleReset = () => {
        setCapturedImage(null);
        setUploadedImage(null);
        setImageUrl("");
        setResetTrigger(prev => !prev);
        onImageChange("", "");
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>

            <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", fontWeight: "normal" }}>
                Upload Image
            </Typography>

            <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
                <Camera
                    disabled={!!capturedImage || !!uploadedImage || !!imageUrl}
                    onCapture={(image) => {
                        setCapturedImage(image);
                        setUploadedImage(null);
                        setImageUrl("");
                        onImageChange(image, "captured");
                    }}
                />

                <UploadImageComponent
                    disabled={!!capturedImage || !!uploadedImage || !!imageUrl}
                    onUpload={(file) => {
                        setUploadedImage(file);
                        setCapturedImage(null);
                        setImageUrl("");
                        onImageChange(file, "uploaded");
                    }}
                    register={register}
                    errors={errors}
                />

                <AddImageUrlComponent
                    disabled={!!capturedImage || !!uploadedImage || !!imageUrl}
                    onUrlChange={(newUrl) => {
                        setImageUrl(newUrl);
                        setCapturedImage(null);
                        setUploadedImage(null);
                        onImageChange(newUrl, "url");
                    }}
                    register={register}
                    errors={errors}
                    onReset={resetTrigger}
                />
            </Box>

            {/* Preview afbeelding */}
            {(capturedImage || uploadedImage || imageUrl) && (
                <Box sx={{ marginTop: 2, textAlign: "center" }}>
                    <img
                        src={capturedImage || uploadedImage || imageUrl}
                        alt="Preview"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "200px",
                            borderRadius: "8px",
                            objectFit: "cover",
                        }}
                    />
                    <IconButton color="error" onClick={handleReset}>
                        <DeleteForeverRoundedIcon fontSize="large" />
                    </IconButton>
                </Box>
            )}

            {/* Errors tonen */}
            {errors.image && (
                <Typography color="error">
                    {errors.image.message}
                </Typography>
            )}
        </Box>
    );
};

MealImageUploader.propTypes = {
    register: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    onImageChange: PropTypes.func.isRequired,
};

export default MealImageUploader;
