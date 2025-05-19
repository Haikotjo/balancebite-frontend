import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DietCard from "../../components/dietCard/DietCard.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import Spinner from "../../../../components/layout/Spinner.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import SubMenu from "../../../meals/components/subMenu/SubMenu.jsx";
import {getPublicDietPlanByIdApi, getUserDietPlanByIdApi} from "../../../../services/apiService.js";

const DietDetailsPage = () => {
    const { dietId } = useParams();
    const [diet, setDiet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!dietId) return;

        const fetchDiet = async () => {
            try {
                const privateDiet = await getUserDietPlanByIdApi(dietId);
                setDiet(privateDiet);
            } catch (err) {
                if (err.response?.status === 403 || err.response?.status === 404) {
                    try {
                        const publicDiet = await getPublicDietPlanByIdApi(dietId);
                        setDiet(publicDiet);
                    } catch {
                        setError(true);
                    }
                } else {
                    setError(true);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDiet();
    }, [dietId]);

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
                    Diet not found or access denied
                </CustomTypography>
            </>
        );
    }

    return (
        <CustomBox className="max-w-screen-xl mx-auto mt-4 px-4">
            <CustomBox className="my-8">
                <SubMenu isDetailPage />
            </CustomBox>

            <CustomBox className="flex justify-center">
                <DietCard diet={diet} />
            </CustomBox>
        </CustomBox>
    );
};

export default DietDetailsPage;
