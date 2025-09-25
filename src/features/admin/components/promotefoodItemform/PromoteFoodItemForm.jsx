// PromoteFoodItemForm.jsx
import { useState } from "react";
import useFoodItems from "../../../../hooks/useFoodItems.js";
import { usePromoteFoodItem } from "../../../../hooks/usePromoteFoodItem.js";

import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomFloatingSelect from "../../../../components/layout/CustomFloatingSelect.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import CustomTextField from "../../../../components/layout/CustomTextField.jsx";

const PromoteFoodItemForm = () => {
    const { options } = useFoodItems();
    const { submit, loading } = usePromoteFoodItem();

    const [foodItemId, setFoodItemId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");                 // nieuw (optioneel)
    const [promoPrice, setPromoPrice] = useState("");           // nieuw
    const [salePercentage, setSalePercentage] = useState("");   // nieuw
    const [saleDescription, setSaleDescription] = useState(""); // nieuw

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        try {
            await submit({
                foodItemId,
                startDate,      // YYYY-MM-DD
                endDate,        // YYYY-MM-DD | ""
                promoPrice,     // "" of getal
                salePercentage, // "" of getal (0..100)
                saleDescription // "" of string
            });

            setSuccessMessage("Promotion created successfully.");
            // reset
            setFoodItemId("");
            setStartDate("");
            setEndDate("");
            setPromoPrice("");
            setSalePercentage("");
            setSaleDescription("");
        } catch (err) {
            console.error(err);
            setErrorMessage(err?.message || "Failed to create promotion.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CustomBox className="flex flex-col gap-4">

                <CustomFloatingSelect
                    label="Select Food Item"
                    options={options.map((item) => ({
                        value: item.id,
                        label: `${item.name} (ID: ${item.id})`,
                    }))}
                    value={options.find((opt) => opt.value === foodItemId) || null} // <-- fix
                    onChange={(val) => setFoodItemId(val?.value || "")}
                    placeholder="Choose an item"
                />

                {/* Start / End date */}
                <label className="text-sm font-semibold">
                    Start Date
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
                    />
                </label>

                <label className="text-sm font-semibold">
                    End Date (optional)
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
                    />
                </label>

                {/* Korting: óf vaste prijs óf percentage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <CustomTextField
                        label="Promo price (€)"
                        name="promoPrice"
                        type="number"
                        step="0.01"
                        value={promoPrice}
                        onChange={(e) => {
                            setPromoPrice(e.target.value);
                            if (e.target.value !== "") setSalePercentage(""); // exclusief
                        }}
                        placeholder="Promo price (€) e.g. 1.99"
                        disabled={salePercentage !== ""}
                    />
                    <CustomTextField
                        label="Sale % (0–100)"
                        name="salePercentage"
                        type="number"
                        step="1"
                        value={salePercentage}
                        onChange={(e) => {
                            setSalePercentage(e.target.value);
                            if (e.target.value !== "") setPromoPrice(""); // exclusief
                        }}
                        placeholder="Sale % (0–100)"
                        disabled={promoPrice !== ""}
                    />
                </div>

                <CustomTextField
                    label="Sale label (optional)"
                    name="saleDescription"
                    value={saleDescription}
                    onChange={(e) => setSaleDescription(e.target.value)}
                    placeholder="Sale description (optional) e.g. Weekly deal"
                />

                <CustomButton
                    type="submit"
                    disabled={loading}
                    className="text-sm px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90 mt-2"
                >
                    {loading ? "Creating..." : "Promote Food Item"}
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
            </CustomBox>
        </form>
    );
};

export default PromoteFoodItemForm;
