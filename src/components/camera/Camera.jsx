import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Webcam from "react-webcam";
import { Button, Box, IconButton, Tooltip } from "@mui/material";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import SnackbarComponent from "../snackbarComponent/SnackbarComponent.jsx";
import ResetButton from "../createMealForm/mealImageUploader/resetButton/ResetButton.jsx";

const Camera = ({ onCapture, disabled }) => {
    const [showCamera, setShowCamera] = useState(false);
    const [hasCamera, setHasCamera] = useState(true); // Controleer beschikbaarheid camera
    const [capturedImage, setCapturedImage] = useState(null); // Opgeslagen foto
    const webcamRef = useRef(null);

    // Controleer of er een camera beschikbaar is bij laden component
    useEffect(() => {
        const checkCameraAvailability = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true });
                setHasCamera(true);
            } catch {
                setHasCamera(false);
            }
        };
        checkCameraAvailability();
    }, []);

    const handleCapture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        if (onCapture) {
            onCapture(imageSrc);
        }
        setShowCamera(false);
    };

    const handleReset = () => {
        setCapturedImage(null);
        if (onCapture) {
            onCapture(null);
        }
    };

    return (
        <Box>
            {/* Camera-knop */}
            <Tooltip
                title={
                    !hasCamera
                        ? "No camera available"
                        : showCamera
                            ? "Close Camera"
                            : "Take a Photo"
                }
                arrow
            >
                <span>
                    <IconButton
                        color="primary"
                        disabled={disabled || !hasCamera}
                        onClick={() => setShowCamera((prev) => !prev)}
                        sx={{
                            width: 56,
                            height: 56,
                            opacity: disabled || !hasCamera ? 0.5 : 1,
                        }}
                    >
                        <CameraAltRoundedIcon fontSize="large" />
                    </IconButton>
                </span>
            </Tooltip>

            {/* Camera-interface */}
            {showCamera && hasCamera && !capturedImage && (
                <Box>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={400}
                        height={300}
                        style={{ marginBottom: "10px" }}
                    />
                    <Button variant="contained" onClick={handleCapture}>
                        Capture Photo
                    </Button>
                </Box>
            )}

            {/* Preview gemaakte foto */}
            {capturedImage && (
                <Box display="flex" gap={2} alignItems="center" mt={2}>
                    <img
                        src={capturedImage}
                        alt="Captured"
                        style={{ width: "100px", height: "auto", borderRadius: "4px" }}
                    />
                    <ResetButton onReset={handleReset} />
                </Box>
            )}

            <SnackbarComponent
                open={!hasCamera && showCamera}
                onClose={() => setShowCamera(false)}
                message="No camera detected. Please check your device."
                severity="error"
            />
        </Box>
    );
};

Camera.propTypes = {
    onCapture: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
};

export default Camera;
