import { useState, useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import PageWrapper from "../../../../components/layout/PageWrapper.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import { UserCircle } from "lucide-react";

// Components
import PersonalInfoForm from "../../components/personalInfoForm/PersonalInfoForm.jsx";
import PersonalInfoDisplay from "../../components/personalInfoDisplay/PersonalInfoDisplay.jsx";
import UserDetailsForm from "../../components/userDetailsForm/UserDetailsForm.jsx";
import RecommendedNutritionDisplay from "../../../dashboard/components/recommendedNutritionDisplay/RecommendedNutritionDisplay.jsx";
import UserDetailsDisplay from "../../components/userDetailsDisplay/UserDetailsDisplay.jsx";
import useUserProfile from "../../utils/hooks/useUserProfile.js";
import WeightHistoryChart from "../../components/weightHistoryChart/WeightHistoryChart.jsx";
import {useWeightUpdates} from "../../utils/hooks/useWeightUpdates.js";

const ProfilePage = () => {
    const { token } = useContext(AuthContext);
    const [showPersonalForm, setShowPersonalForm] = useState(false);
    const [showDetailsForm, setShowDetailsForm] = useState(false);
    const [isEditingWeight, setIsEditingWeight] = useState(false);
    const [isEditingTarget, setIsEditingTarget] = useState(false);

    /** @type {{userData: {weightHistory: Array, weight: number, targetWeight: number, userName: string, email: string, gender: string, age: number, height: number, activityLevel: string}, isLoading: boolean, refetch: Function}} */
    const { userData, isLoading, refetch } = useUserProfile(token);

    const { handleWeightUpdate, handleTargetUpdate } = useWeightUpdates(refetch);

    const onWeightSave = async (val) => {
        setIsEditingWeight(false);
        await handleWeightUpdate(val, userData?.weight);
    };

    const onTargetSave = async (val) => {
        setIsEditingTarget(false);
        await handleTargetUpdate(val, userData?.targetWeight);
    };

    const personalData = {
        username: userData?.userName || "",
        email: userData?.email || ""
    };

    const bodyMetrics = {
        gender: userData?.gender || "",
        age: userData?.age || 0,
        height: userData?.height || 0,
        weight: userData?.weight || 0,
        targetWeight: userData?.targetWeight || 0,
        activityLevel: userData?.activityLevel || "",
    };

    return (
        <PageWrapper>
            <CustomBox className="max-w-screen-xl mx-auto flex flex-col gap-5 pb-4">
                <CustomBox className="flex flex-col items-center gap-3 mb-2">
                    <UserCircle className="w-16 h-16 sm:w-24 sm:h-24 text-primary" aria-hidden="true" />
                    <CustomTypography as="h2" variant="h1" className="text-center">
                        Profile
                    </CustomTypography>
                </CustomBox>

                <CustomBox className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    {/* Column 1: Personal Information Management */}
                    {!showPersonalForm ? (
                        <PersonalInfoDisplay
                            username={personalData.username}
                            email={personalData.email}
                            onEdit={() => setShowPersonalForm(true)}
                            isLoading={isLoading}
                        />
                    ) : (
                        <PersonalInfoForm
                            onCancel={() => setShowPersonalForm(false)}
                            onSuccess={() => {
                                setShowPersonalForm(false);
                                void refetch(); // 'void' signals that we intentionally don't await the promise
                            }}
                        />
                    )}

                    {/* Column 2: Physical Metrics Management */}
                    {!showDetailsForm ? (
                        <UserDetailsDisplay
                            data={bodyMetrics}
                            onEdit={() => setShowDetailsForm(true)}
                            isLoading={isLoading}
                            onQuickWeightUpdate={onWeightSave}
                            onQuickTargetUpdate={onTargetSave}
                            isEditingWeight={isEditingWeight}
                            isEditingTarget={isEditingTarget}
                            setIsEditingWeight={setIsEditingWeight}
                            setIsEditingTarget={setIsEditingTarget}
                        />
                    ) : (
                        <UserDetailsForm
                            onCancel={() => setShowDetailsForm(false)}
                            onSuccess={() => {
                                setShowDetailsForm(false);
                                void refetch(); // Acknowledge promise to resolve IDE warning
                            }}
                        />
                    )}
                </CustomBox>

                <CustomBox className="mt-4">
                    <WeightHistoryChart
                        data={userData?.weightHistory || []}
                        targetWeight={userData?.targetWeight}
                        isLoading={isLoading}
                        showControls={false}
                        onQuickWeightUpdate={onWeightSave}
                        onQuickTargetUpdate={onTargetSave}
                        isEditingWeight={isEditingWeight}
                        isEditingTarget={isEditingTarget}
                        setIsEditingWeight={setIsEditingWeight}
                        setIsEditingTarget={setIsEditingTarget}
                    />
                </CustomBox>

                {/* Nutrition Summary Cards */}
                <CustomBox className="flex flex-col flex-1 mt-2">
                    <CustomTypography variant="h3" className="text-center mb-4">
                        Daily Nutrition Overview
                    </CustomTypography>
                    <CustomBox className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <CustomCard hasBorder>
                            <RecommendedNutritionDisplay variant="base"/>
                        </CustomCard>
                        <CustomCard hasBorder>
                            <RecommendedNutritionDisplay useBaseRDI={true} />
                        </CustomCard>
                    </CustomBox>
                </CustomBox>
            </CustomBox>
        </PageWrapper>
    );
};

export default ProfilePage;