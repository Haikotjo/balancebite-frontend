import { useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography, Button } from "@mui/material";
import Camera from "../../camera/Camera.jsx";
import AddImageUrlComponent from "./addImageUrlComponent/AddImageUrlComponent.jsx";
import UploadImageComponent from "./uploadImageComponent/UploadImageComponent.jsx";

const MealImageUploader = ({ register, errors, onImageChange }) => {

    const [capturedImage, setCapturedImage] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    return (
        <Box display="flex" flexDirection="column" alignItems="left" gap={2}>
            {/* Camera Functionaliteit */}
            <Camera
                disabled={!!capturedImage || !!uploadedImage || !!imageUrl}
                onCapture={(image) => {
                    console.log("Captured Image in MealImageUploader (Base64):", image);
                    setCapturedImage(image);
                    setUploadedImage(null);
                    setImageUrl("");
                    onImageChange(image, "captured");
                    onImageChange("", "");
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
            />

            {/* Preview en Verwijderknop */}
            {(capturedImage || uploadedImage || imageUrl) && (
                <Box sx={{ marginTop: 2, textAlign: "center" }}>
                    <img
                        src={capturedImage || uploadedImage || imageUrl}
                        alt="Preview"
                        style={{ maxWidth: "100%", marginBottom: "10px" }}
                    />

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
