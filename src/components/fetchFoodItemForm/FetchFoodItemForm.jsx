import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import CustomTextField from "../layout/CustomTextField.jsx";
import useFetchFoodItem from "../../hooks/useFetchFoodItem.js";
import Spinner from "../layout/Spinner.jsx";
import CustomButton from "../layout/CustomButton.jsx";
import ErrorDialog from "../layout/ErrorDialog.jsx";


const FetchFoodItemForm = () => {
    const {
        fdcId,
        setFdcId,
        errorMessage,
        setErrorMessage,
        successMessage,
        setSuccessMessage,
        loading,
        handleSubmit,
        register,
        errors
    } = useFetchFoodItem();


    return (
        <CustomBox
            as="form"
            onSubmit={handleSubmit}
            className="flex flex-col w-full"
        >
        <CustomTypography variant="h5"  className="mt-12" >
                Fetch Food Item by FDC ID
            </CustomTypography>

            <CustomTextField
                label="FDC ID"
                name="fdcId"
                value={fdcId}
                onChange={(e) => setFdcId(e.target.value)}
                className="w-full "  register={register}  // Pass register for validation
                error={errors.fdcId}  // Pass errors for validation display
                helperText={errors.fdcId?.message}
                placeholder="Enter the FDC ID"
                inputPaddingTop="pt-4"
            />
            {/* Spinner outside the button */}
            {loading && (
                <CustomBox className="flex justify-center mt-4">
                    <Spinner className="text-white" />
                </CustomBox>
            )}
            <CustomButton
                type="submit"
                disabled={loading}
                className="text-sm px-4 py-2 text-white bg-primary rounded-md mb-5 mt-8 hover:bg-primary/90"
            >
                 Fetch and Save
            </CustomButton>
            <ErrorDialog
                open={!!successMessage || !!errorMessage}  // Open dialog if there's a success or error message
                onClose={() => {
                    setSuccessMessage("");
                    setErrorMessage("");
                }}  // Close dialog and reset messages
                message={successMessage || errorMessage}  // Show the message (either success or error)
                type={successMessage ? "success" : "error"}  // Dynamically set the type
            />
        </CustomBox>
    );
};

export default FetchFoodItemForm;
