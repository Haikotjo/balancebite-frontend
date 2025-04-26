import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userDetailsSchema } from "../../../utils/valadition/userDetailsSchema.js";

import { AuthContext } from "../../../context/AuthContext.jsx";
import { RecommendedNutritionContext } from "../../../context/RecommendedNutritionContext.jsx";
import { fetchUserProfile, updateUserDetails } from "../../../services/apiService.js";
import { decodeToken } from "./userDetailsHelpers.js";
import { useFetchUserProfileData } from "../../../hooks/useFetchUserProfileData.js";

import CustomBox from "../../layout/CustomBox.jsx";
import CustomTypography from "../../layout/CustomTypography.jsx";
import CustomButton from "../../layout/CustomButton.jsx";
import ErrorDialog from "../../layout/ErrorDialog.jsx";


import UserDetailsFields from "./userDetailsFields/UserDetailsFields.jsx";
import Spinner from "../../layout/Spinner.jsx";

/**
 * Form for viewing and editing user body metrics like height, weight, etc.
 * Completely custom components, ready for React Native migration.
 *
 * @returns {JSX.Element} Rendered user details form.
 */
const UserDetailsForm = () => {
    const { token } = useContext(AuthContext);
    const { fetchRecommendedNutrition } = useContext(RecommendedNutritionContext);

    const [isEditable, setIsEditable] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [initialValues, setInitialValues] = useState(null);

    const defaultProfileValues = {
        gender: "",
        activityLevel: "",
        goal: "",
        height: "",
        weight: "",
        age: "",
    };

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(userDetailsSchema),
        defaultValues: defaultProfileValues,
        mode: "onBlur",
    });

    const userProfile = useFetchUserProfileData(token, decodeToken, fetchUserProfile);

// Nieuw useEffect om te resetten!
    useEffect(() => {
        if (userProfile) {
            reset(userProfile);
            setInitialValues(userProfile);
        } else if (userProfile === null) {
            reset(defaultProfileValues);
            setInitialValues(defaultProfileValues);
        }
    }, [userProfile, reset]);


    const handleEdit = () => setIsEditable(true);

    const handleCancel = () => {
        reset(initialValues);
        setIsEditable(false);
    };

    const onSubmit = async (data) => {
        try {
            console.log("Originele data:", data);

            // Kleine schoonmaak: leeg string ("") naar null
            const cleanedData = {
                ...data,
                gender: data.gender || null,
                activityLevel: data.activityLevel || null,
                goal: data.goal || null,
                height: data.height ? Number(data.height) : null,
                weight: data.weight ? Number(data.weight) : null,
                age: data.age ? Number(data.age) : null,
            };

            console.log("Opgeschoonde data verstuurd naar backend:", cleanedData);

            const response = await updateUserDetails(cleanedData, token);
            if (response) {
                await fetchRecommendedNutrition();
                setSuccessMessage("Profile successfully updated!");
                setIsEditable(false);
                setInitialValues(cleanedData);
            }
        } catch (error) {
            console.error(error);
        }
    };


    if (userProfile === undefined) {
        return (
            <CustomBox className="flex justify-center items-center p-4">
                <Spinner />
            </CustomBox>
        );
    }

    return (
        <CustomBox
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            className="w-full p-2 flex flex-col gap-4 my-4"
        >
            <CustomTypography as="h2" variant="h1" className="text-left">
                Body Metrics
            </CustomTypography>

            {/* Success message */}
            {successMessage && (
                <ErrorDialog
                    open={!!successMessage}
                    onClose={() => setSuccessMessage("")}
                    message={successMessage}
                    type="success"
                />
            )}

            {/* Input fields */}
            <UserDetailsFields
                watchedFields={watch()}
                register={register}
                errors={errors}
                isEditable={isEditable}
            />

            {/* Action buttons */}
            {isEditable ? (
                <CustomBox className="flex gap-2">
                    <CustomButton type="button" onClick={handleCancel} className="bg-gray-400 text-white">
                        Cancel
                    </CustomButton>
                    <CustomButton type="submit" className="bg-primary text-white">
                        Save
                    </CustomButton>
                </CustomBox>
            ) : (
                <CustomButton type="button" onClick={handleEdit} className="bg-primary text-white self-start">
                    Edit
                </CustomButton>
            )}
        </CustomBox>
    );
};

export default UserDetailsForm;
