import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Webcam from "react-webcam";
import { Camera as CameraIcon, CameraOff } from "lucide-react";
import ResetButton from "../createMealForm/mealImageUploader/resetButton/ResetButton.jsx";
import CustomBox from "../layout/CustomBox.jsx";
import CustomIconButton from "../layout/CustomIconButton.jsx";
import ErrorDialog from "../layout/ErrorDialog.jsx";
import CustomButton from "../layout/CustomButton.jsx";

/**
 * Camera component allows users to capture an image using their webcam.
 * Shows a preview of the captured image and allows resetting it.
 * Displays an error dialog if no camera is detected.
 *
 * @component
 * @param {function} onCapture - Callback with captured image (Base64 format)
 * @param {boolean} disabled - Disables camera toggle if true
 */
const Camera = ({ onCapture, disabled }) => {
    const [showCamera, setShowCamera] = useState(false); // Toggle camera interface
    const [hasCamera, setHasCamera] = useState(true);    // Tracks if a camera is available
    const [capturedImage, setCapturedImage] = useState(null); // Stores the captured image
    const webcamRef = useRef(null); // Ref to access the webcam stream

    // Check for camera availability on component mount
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

    // Captures a photo from the webcam
    const handleCapture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        if (onCapture) onCapture(imageSrc);
        setShowCamera(false);
    };

    // Resets the captured image
    const handleReset = () => {
        setCapturedImage(null);
        if (onCapture) onCapture(null);
    };

    return (
        <CustomBox className="flex flex-col items-center">
            {/* Toggle camera or show error icon */}
            <CustomIconButton
                icon={
                    hasCamera ? (
                        <CameraIcon size={34} className="text-primary" />
                    ) : (
                        <CameraOff size={34} className="text-error" />
                    )
                }
                onClick={() => setShowCamera((prev) => !prev)}
                bgColor="bg-transparent"
                size={56}
                disableScale
                className={disabled || !hasCamera ? "opacity-50 pointer-events-none" : ""}
            />

            {/* Camera live view + capture button */}
            {showCamera && hasCamera && !capturedImage && (
                <CustomBox>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={400}
                        height={300}
                        className="mb-2"
                    />
                    <CustomButton
                        onClick={handleCapture}
                        className="bg-primary text-white font-semibold px-3 py-1 mt-2"
                    >
                        Capture Photo
                    </CustomButton>
                </CustomBox>
            )}

            {/* Show preview of captured image */}
            {capturedImage && (
                <CustomBox className="flex gap-2 items-center mt-2">
                    <img
                        src={capturedImage}
                        alt="Captured"
                        style={{
                            width: "100px",
                            height: "auto",
                            borderRadius: "4px",
                        }}
                    />
                    <ResetButton onReset={handleReset} />
                </CustomBox>
            )}

            {/* Show error dialog if no camera is found */}
            <ErrorDialog
                open={!hasCamera && showCamera}
                onClose={() => setShowCamera(false)}
                message="No camera detected. Please check your device."
                type="error"
            />
        </CustomBox>
    );
};

Camera.propTypes = {
    onCapture: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
};

export default Camera;
