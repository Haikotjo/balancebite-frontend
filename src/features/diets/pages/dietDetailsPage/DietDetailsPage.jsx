import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import DietCard from "../../components/dietCard/DietCard.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import Spinner from "../../../../components/layout/Spinner.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";
import DietSubMenu from "../../components/subMenu/DietsSubMenu.jsx";
import PageWrapper from "../../../../components/layout/PageWrapper.jsx";

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
            <PageWrapper>
                <CustomBox className="mb-4">
                    <DietSubMenu isDetailPage />
                </CustomBox>
                <CustomBox className="flex justify-center mt-10">
                    <Spinner />
                </CustomBox>
            </PageWrapper>
        );
    }

    if (error || !diet) {
        return (
            <PageWrapper>
                <CustomBox className="mb-4">
                    <DietSubMenu
                        isDetailPage
                    />
                    <CustomTypography className="text-2xl font-bold text-center mt-10 text-error">
                        Diet not found or access denied
                    </CustomTypography>
                </CustomBox>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <CustomBox className="max-w-screen-xl mx-auto">
                <DietSubMenu isDetailPage />
                <CustomBox className="flex justify-center mt-6">
                    <DietCard diet={diet} viewMode="page" />
                </CustomBox>
            </CustomBox>
        </PageWrapper>
    );
};

export default DietDetailsPage;
