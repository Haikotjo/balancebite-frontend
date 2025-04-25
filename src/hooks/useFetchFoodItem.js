import { useState, useRef } from "react";
import { useForm } from "react-hook-form"; // Add the useForm hook
import { yupResolver } from "@hookform/resolvers/yup"; // Add the yup resolver
import { fetchFoodItemByFdcIdApi } from "../services/apiService";
import {fdcIdSchema} from "../utils/valadition/validationSchemas.js"; // Your API

const useFetchFoodItem = () => {
    const [fdcId, setFdcId] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const isSubmittingRef = useRef(false);

    // useForm for form validation and submission
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(fdcIdSchema), // Using yup for validation
    });

    // onSubmit is handled by the hook
    const onSubmit = async () => {
        if (loading || isSubmittingRef.current) return;
        isSubmittingRef.current = true;
        setSuccessMessage("");
        setLoading(true);

        try {
            const result = await fetchFoodItemByFdcIdApi(fdcId);
            setSuccessMessage(result.message);
            setFdcId(""); // Clear input field after successful fetch
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.error || "An unknown error occurred.");
            } else {
                setErrorMessage("An error occurred while fetching the food item. Please try again.");
            }
        } finally {
            setLoading(false);
            isSubmittingRef.current = false;
        }
    };

    return {
        fdcId,
        setFdcId,
        errorMessage,
        setErrorMessage,
        successMessage,
        setSuccessMessage,
        loading,
        register,  // Exposing register for form input fields
        handleSubmit: handleSubmit(onSubmit), // Exposing the handleSubmit
        errors, // Exposing the errors to display in the form
    };
};

export default useFetchFoodItem;
