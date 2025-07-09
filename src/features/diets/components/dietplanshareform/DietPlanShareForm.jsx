import { useState } from "react";
import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import CustomTextField from "../../../../components/layout/CustomTextField.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import { shareDietPlanApi } from "../../../../services/apiService.js";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";

const DietPlanShareForm = ({ dietPlanId }) => {
    const [showForm, setShowForm] = useState(false);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("error");
    const [dialogMessage, setDialogMessage] = useState("");

    const handleShare = async () => {
        setError("");
        setSuccess("");
        if (!email) {
            setDialogType("error");
            setDialogMessage("Please enter an email address.");
            setDialogOpen(true);
            return;
        }

        try {
            setIsLoading(true);
            await shareDietPlanApi({
                dietPlanId,
                sharedUserIds: [],
                sharedEmails: [email],
            });

            setDialogType("success");
            setDialogMessage(`Diet plan successfully shared with ${email}.`);
            setEmail("");
            setShowForm(false);
        } catch {
            setDialogType("error");
            setDialogMessage("Failed to share. Please check the email address.");
        } finally {
            setDialogOpen(true);
            setIsLoading(false);
        }
    };

    return (
        <CustomBox className="mt-4">
            <ErrorDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                type={dialogType}
                message={dialogMessage}
            />

            {!showForm ? (
                <CustomButton
                    onClick={() => setShowForm(true)}
                    className="bg-primary hover:bg-primary-dark text-white py-2 mt-2 w-full"
                >
                    Share
                </CustomButton>
            ) : (
                <>
                    <CustomTextField
                        label="E-mailadres"
                        name="shareEmail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!error}
                        helperText={error}
                    />
                    <CustomBox className="flex gap-2 mt-2">
                        <CustomButton
                            className="bg-primary hover:bg-primary-dark text-white py-2 mt-2 self-stretch"
                            onClick={handleShare}
                            disabled={isLoading}
                        >
                            {isLoading ? "Share..." : "Send"}
                        </CustomButton>
                        <CustomButton
                            className="bg-error hover:bg-error-dark text-white py-2 mt-2 self-stretch"
                            onClick={() => {
                                setShowForm(false);
                                setEmail("");
                                setError("");
                                setSuccess("");
                            }}
                            variant="secondary"
                        >
                            Cancel
                        </CustomButton>
                    </CustomBox>
                    {success && (
                        <CustomTypography className="text-success text-sm mt-2">
                            {success}
                        </CustomTypography>
                    )}
                </>
            )}
        </CustomBox>
    );
};

DietPlanShareForm.propTypes = {
    dietPlanId: PropTypes.number.isRequired,
};

export default DietPlanShareForm;
