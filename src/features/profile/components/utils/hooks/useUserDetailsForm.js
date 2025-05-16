import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { defaultProfileValues } from "../../../../../utils/helpers/defaultProfileValues.js";
import { userDetailsSchema } from "../../../../../utils/valadition/userDetailsSchema.js";

/**
 * Custom hook to manage the user details form.
 * Sets up validation, form state, and resets when the user profile changes.
 *
 * @param {object|null} userProfile - The current user profile data.
 * @returns {object} Form methods and state from react-hook-form.
 */
export const useUserDetailsForm = (userProfile) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(userDetailsSchema),
        defaultValues: defaultProfileValues,
        mode: "onBlur",
    });

    // Reset form whenever userProfile changes
    useEffect(() => {
        if (userProfile) {
            reset(userProfile);
        } else {
            reset(defaultProfileValues);
        }
    }, [userProfile, reset]);

    return { register, handleSubmit, reset, watch, setValue, errors };
};
