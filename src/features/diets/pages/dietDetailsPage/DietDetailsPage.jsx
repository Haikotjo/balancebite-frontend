import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import DietCard from "../../components/dietCard/DietCard.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import Spinner from "../../../../components/layout/Spinner.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import SubMenu from "../../components/subMenu/SubMenu.jsx";
import { getPublicDietPlanByIdApi } from "../../../../services/apiService.js";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";

const DietDetailsPage = () => {
    const { dietId } = useParams();
    const { userDiets } = useContext(UserDietsContext);
    const [diet, setDiet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!dietId) return;

        const dietFromUser = userDiets.find(d => String(d.id) === String(dietId));
        if (dietFromUser) {
            setDiet(dietFromUser);
            setLoading(false);
            return;
        }

        const fetchDiet = async () => {
            try {
                const publicDiet = await getPublicDietPlanByIdApi(dietId);
                setDiet(publicDiet);
            } catch (err) {
                console.error("Failed to fetch diet:", err);
                setError(true);
            }finally {
                setLoading(false);
            }
        };

        fetchDiet();
    }, [dietId, userDiets]);

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
