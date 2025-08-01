import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import DietCard from "../../components/dietCard/DietCard.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import Spinner from "../../../../components/layout/Spinner.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";
import DietSubMenu from "../../components/subMenu/DietsSubMenu.jsx";

const DietDetailsPage = () => {
    const { dietId } = useParams();
    const { getDietById } = useContext(UserDietsContext);
    const [diet, setDiet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!dietId) return;
        setLoading(true);
        getDietById(dietId)
            .then(result => {
                console.log("📦 Received diet from getDietById:", result);

                if (!result) {
                    setError(true);
                } else {
                    setDiet(result);
                }
            })
            .catch(() => {
                setError(true);
            })
            .finally(() => setLoading(false));
    }, [dietId, getDietById]);

    if (loading) {
        return (
            <>
                <CustomBox className="pt-6 sm:pt-10 pb-4 sm:pb-4 px-4">
                    <DietSubMenu isDetailPage />
                </CustomBox>
                <CustomBox className="flex justify-center mt-10">
                    <Spinner />
                </CustomBox>
            </>
        );
    }

    if (error || !diet) {
        return (
            <CustomBox className="pt-6 sm:pt-10 pb-20 sm:pb-10 px-4">
                <DietSubMenu
                    isDetailPage
                />
                <CustomTypography className="text-2xl font-bold text-center mt-10 text-error">
                    Diet not found or access denied
                </CustomTypography>
            </CustomBox>
        );
    }

    return (
        <CustomBox className="pt-6 sm:pt-10 pb-20 sm:pb-10 px-4">
            <CustomBox className="max-w-screen-xl mx-auto">
                <DietSubMenu isDetailPage />
                <CustomBox className="flex justify-center">
                    <DietCard diet={diet} viewMode="page" />
                </CustomBox>
            </CustomBox>
        </CustomBox>
    );
};

export default DietDetailsPage;
