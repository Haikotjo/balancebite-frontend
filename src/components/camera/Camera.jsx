import { useState, useRef } from "react";
import PropTypes from "prop-types";
import Webcam from "react-webcam";
import { Button, Box, Typography } from "@mui/material";

const Camera = ({ onCapture }) => {
    const [showCamera, setShowCamera] = useState(false);
    const [hasCamera, setHasCamera] = useState(true);
    const webcamRef = useRef(null);

    const checkCameraAvailability = () => {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(() => setHasCamera(true))
            .catch(() => setHasCamera(false));
    };

    const handleCapture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (onCapture) {
            onCapture(imageSrc);
        }
        setShowCamera(false);
    };

    return (
        <Box>
            <Button
                variant="contained"
                onClick={() => {
                    setShowCamera(!showCamera);
                    if (!showCamera) checkCameraAvailability();
                }}
                sx={{ marginBottom: 2 }}
            >
                {showCamera ? "Close Camera" : "Take a Photo"}
            </Button>
            {!hasCamera && showCamera && (
                <Typography color="error" sx={{ marginBottom: 2 }}>
                    No camera detected. Please check your device.
                </Typography>
            )}
            {showCamera && hasCamera && (
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
        </Box>
    );
};

Camera.propTypes = {
    onCapture: PropTypes.func.isRequired,
};

export default Camera;
