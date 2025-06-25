import {useEffect, useState} from "react";
import { getAccessToken } from "../../../../utils/helpers/getAccessToken.js";
import {
    createStickyItemApi, fetchMeals,
    getAllPublicDietPlans
} from "../../../../services/apiService.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomSelect from "../../../../components/layout/CustomSelect.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomFloatingSelect from "../../../../components/layout/CustomFloatingSelect.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";


const CreateStickyItemForm = () => {
    const token = getAccessToken();

    const [type, setType] = useState("MEAL");
    const [referenceId, setReferenceId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [options, setOptions] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");
        setLoading(true);

        try {
            await createStickyItemApi({ type, referenceId }, token);
            setSuccessMessage("Sticky item created successfully.");
            setReferenceId("");
        } catch (err) {
            console.error("Error creating sticky item:", err);
            setErrorMessage("Failed to create sticky item.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchOptions = async () => {
            if (!token) return;
            try {
                const data =
                    type === "MEAL"
                        ? (await fetchMeals("/meals?page=0&size=9999")).content
                        : (await getAllPublicDietPlans({ isTemplate: true })).content;

                console.log("🔍 Retrieved options:", data);
                setOptions(
                    data.map(item => ({
                        value: item.id,
                        label: `${item.name} (ID: ${item.id}) – ${item.createdBy?.userName || "Unknown"}`
                    }))
                );
            } catch (err) {
                console.error(err);
                setErrorMessage("Failed to load options.");
            }
        };
        fetchOptions();
    }, [type]);


    return (
        <form onSubmit={handleSubmit}>
            <CustomBox className="flex flex-col gap-4">
                <CustomSelect
                    label="Sticky Type"
                    name="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    options={[
                        { value: "MEAL", label: "Meal" },
                        { value: "DIET_PLAN", label: "Diet Plan" },
                    ]}
                />

                <CustomFloatingSelect
                    label="Select Meal or Diet Plan"
                    options={options}
                    value={options.find(opt => opt.value === referenceId) || null}
                    onChange={(val) => setReferenceId(val?.value || "")}
                />


                <CustomButton
                    type="submit"
                    disabled={loading}
                    className="text-sm px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90 mt-2"
                >
                    {loading ? "Saving..." : "Create Sticky Item"}
                </CustomButton>


                <ErrorDialog
                    open={!!successMessage}
                    onClose={() => setSuccessMessage("")}
                    message={successMessage}
                    type="success"
                />

                <ErrorDialog
                    open={!!errorMessage}
                    onClose={() => setErrorMessage("")}
                    message={errorMessage}
                    type="error"
                />

                {error && (
                    <CustomTypography className="text-red-600 dark:text-red-400">
                        {error}
                    </CustomTypography>
                )}
            </CustomBox>
        </form>
    );
};

export default CreateStickyItemForm;
