import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { fdcIdSchema } from "../utils/valadition/validationSchemas.js";
import { fetchFoodItemByFdcIdApi } from "../services/apiService";

const useFetchFoodItem = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const isSubmittingRef = useRef(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(fdcIdSchema),
    });

    const onSubmit = async (data) => {
        if (loading || isSubmittingRef.current) return;
        isSubmittingRef.current = true;
        setErrorMessage("");
        setSuccessMessage("");
        setLoading(true);

        try {
            const result = await fetchFoodItemByFdcIdApi(data.fdcId);
            setSuccessMessage(result.message);
            reset(); // 🧼 reset formulier
        } catch (error) {
            setErrorMessage(
                error?.response?.data?.error || "Error fetching food item."
            );
        } finally {
            setLoading(false);
            isSubmittingRef.current = false;
        }
    };

    return {
        handleSubmit: handleSubmit(onSubmit),
        register,
        errors,
        loading,
        successMessage,
        errorMessage,
        setSuccessMessage,
        setErrorMessage,
    };
};

export default useFetchFoodItem;
