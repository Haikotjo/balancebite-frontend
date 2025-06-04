import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import UpdateDietForm from "../../components/updateDietForm/UpdateDietForm.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import {useUpdateDiet} from "../../utils/hooks/useUpdateDiet.js";
import Spinner from "../../../../components/layout/Spinner.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

const UpdateDietPage = () => {
    const { dietId } = useParams();
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);
    const [showError, setShowError] = useState(true);

    const { handleUpdate, loading, error } = useUpdateDiet(dietId, () => {
        setShowDialog(true);
        setTimeout(() => {
            navigate(`/diet/${dietId}`);
        }, 2000);
    });

    if (loading) {
        return (
            <CustomBox className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
                <Spinner />
                <CustomTypography
                    as="p"
                    className="mt-2 text-sm text-muted-foreground text-center"
                >
                    Loading...
                </CustomTypography>
            </CustomBox>

        );
    }

    return (
        <CustomBox className="max-w-[600px] mx-auto px-2 sm:px-4 pb-[4rem] sm:pb-[2rem] overflow-y-auto h-[calc(100vh-64px)] md:overflow-visible md:h-auto">
            <UpdateDietForm onSubmit={handleUpdate} />

            {showDialog && (
                <ErrorDialog
                    open={true}
                    onClose={() => setShowDialog(false)}
                    message="Diet plan updated successfully."
                    type="success"
                />
            )}

            {error && (
                <ErrorDialog
                    open={showError}
                    onClose={() => setShowError(false)}
                    message={error}
                    type="error"
                />
            )}
        </CustomBox>
    );
};

export default UpdateDietPage;
