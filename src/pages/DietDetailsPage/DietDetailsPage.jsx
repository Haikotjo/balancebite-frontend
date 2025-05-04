import { useParams } from "react-router-dom";

import SubMenu from "../../components/submenu/SubMenu.jsx";
import CustomBox from "../../components/layout/CustomBox.jsx";
import CustomTypography from "../../components/layout/CustomTypography.jsx";
import Spinner from "../../components/layout/Spinner.jsx";
import {useEffect} from "react";
import usePublicDietById from "../../hooks/usePublicDietById.js";
import DietCard from "../../components/dietCard/DietCard.jsx";
// import DietCard from "../../components/dietCard/DietCard.jsx"; // komt nog

const DietDetailsPage = () => {
    const { dietId } = useParams();
    const { diet, loading, error } = usePublicDietById(dietId);

    useEffect(() => {
        if (diet) {
            console.log("✅ Diet geladen:", diet);
        }
    }, [diet]);

    if (loading) {
        return (
            <CustomBox className="flex justify-center mt-10">
                <Spinner />
            </CustomBox>
        );
    }

    if (error || !diet) {
        return (
            <>
                <CustomBox className="mb-4 mt-10">
                    <SubMenu isDetailPage />
                </CustomBox>
                <CustomTypography
                    className="text-2xl font-bold text-center mt-10 text-error"
                >
                    Diet not found
                </CustomTypography>
            </>
        );
    }

    return (
        <CustomBox className="max-w-screen-xl mx-auto mt-4 px-4">
            <CustomBox className="my-10">
                <SubMenu isDetailPage />
            </CustomBox>

            <CustomBox className="flex justify-center">
                <DietCard diet={diet} />
            </CustomBox>
        </CustomBox>
    );
};

export default DietDetailsPage;
