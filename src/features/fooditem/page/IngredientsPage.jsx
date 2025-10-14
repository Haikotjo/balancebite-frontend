// src/pages/ingredients/IngredientsPage.jsx
import { useEffect, useRef, useState } from "react";
import { getAllFoodItems } from "../../../services/apiService";
import { foodCategoryOptions } from "../../../utils/const/foodCategoryOptions.js";
import CustomButton from "../../../components/layout/CustomButton.jsx";
import CustomTypography from "../../../components/layout/CustomTypography.jsx";
import CustomBox from "../../../components/layout/CustomBox.jsx";
import CustomGrid from "../../../components/layout/CustomGrid.jsx";
import FoodItemCard from "../components/foodItemCard/FoodItemCard.jsx";
import PageWrapper from "../../../components/layout/PageWrapper.jsx";
import FoodItemListItem from "../components/foodItemListItem/FoodItemListItem.jsx";

import CustomModal from "../../../components/layout/CustomModal.jsx";
import { patchFoodItemPriceApi } from "../../../services/apiService";

const IngredientsPage = () => {
    const [groupedItems, setGroupedItems] = useState({});
    const [expandedItems, setExpandedItems] = useState({});
    const [viewMode, setViewMode] = useState("grid"); // "list" | "grid"
    const sectionRefs = useRef({});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [newPrice, setNewPrice] = useState(""); // in euro's
    const [saving, setSaving] = useState(false);

    const formatMoney = (v) =>
        v == null || isNaN(Number(v))
            ? "unknown"
            : new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(Number(v));

    const formatGrams = (v) => (v == null || isNaN(Number(v)) ? null : `${Number(v)} g`);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const items = await getAllFoodItems();
                console.log("All food items:", items);
                const grouped = items.reduce((acc, item) => {
                    const category = item.foodCategory || "OTHER";
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(item);
                    return acc;
                }, {});
                setGroupedItems(grouped);
            } catch (error) {
                console.error("Error fetching food items:", error);
            }
        };
        fetchData();
    }, []);


    const handleScroll = (categoryValue) => {
        const ref = sectionRefs.current[categoryValue];
        if (ref) ref.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const openEditPrice = (item) => {
        setSelectedItem(item);
        // prefill met euro’s
        setNewPrice(item?.price != null ? Number(item.price).toFixed(2) : "");
        setIsModalOpen(true);
    };

    const closeEditPrice = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        setNewPrice("");
        setSaving(false);
    };

    const savePrice = async () => {
        if (!selectedItem) return;
        try {
            setSaving(true);
            // Send EURO, bv. 2.49 (or zero to clear)
            const euro = newPrice === "" ? null : parseFloat(String(newPrice).replace(",", "."));
            const updated = await patchFoodItemPriceApi(selectedItem.id, euro);

            setGroupedItems((prev) => {
                const next = { ...prev };
                for (const cat of Object.keys(next)) {
                    next[cat] = next[cat].map((it) =>
                        it.id === updated.id ? { ...it, ...updated } : it
                    );
                }
                return next;
            });

            closeEditPrice();
        } catch (err) {
            console.error("Failed to update price", err);
            setSaving(false);
        }
    };


    return (
        <PageWrapper className="flex flex-col items-center">
            <CustomBox className="flex items-center justify-between mb-8 flex-wrap w-full">
                <CustomTypography as="h1" variant="h1">
                    Ingredients
                </CustomTypography>

                {/* view mode toggles */}
                <CustomBox className="flex gap-2">
                    <CustomButton
                        onClick={() => setViewMode("list")}
                        className={`py-2 px-3 font-bold ${viewMode === "list" ? "bg-primary text-white" : "bg-muted"}`}
                        aria-pressed={viewMode === "list"}
                    >
                        List view
                    </CustomButton>
                    <CustomButton
                        onClick={() => setViewMode("grid")}
                        className={`py-2 px-3 font-bold ${viewMode === "grid" ? "bg-primary text-white" : "bg-muted"}`}
                        aria-pressed={viewMode === "grid"}
                    >
                        Grid view
                    </CustomButton>
                </CustomBox>
            </CustomBox>

            {/* category shortcuts */}
            <CustomBox className="flex flex-wrap gap-2 mb-6 w-full">
                {foodCategoryOptions.map(({ label, value }) => (
                    <CustomButton
                        key={value}
                        onClick={() => handleScroll(value)}
                        className="bg-primary hover:bg-error text-white py-2 px-2 font-bold"
                    >
                        {label}
                    </CustomButton>
                ))}
            </CustomBox>

            {/* content by category */}
            {viewMode === "list" ? (
                // Two-column layout for category sections (when space allows)
                <CustomBox className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {foodCategoryOptions.map(({ label, value }) => {
                        const items = groupedItems[value];
                        if (!items || items.length === 0) return null;

                        return (
                            <CustomBox key={value} ref={(el) => (sectionRefs.current[value] = el)} className="mb-2">
                                <CustomTypography as="h2" variant="h2" className="mb-2">
                                    {label}
                                </CustomTypography>

                                <CustomBox className="flex flex-col gap-1">
                                    {items.map((item) => (
                                        <FoodItemListItem
                                            key={item.id}
                                            item={item}
                                            expanded={!!expandedItems[item.id]}
                                            onToggle={(id) =>
                                                setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }))
                                            }
                                            formatMoney={formatMoney}
                                            formatGrams={formatGrams}
                                            // ⬇️ nieuw: geef handler door
                                            onEditPrice={openEditPrice}
                                        />
                                    ))}
                                </CustomBox>
                            </CustomBox>
                        );
                    })}
                </CustomBox>
            ) : (
                // GRID MODE unchanged (per category)
                foodCategoryOptions.map(({ label, value }) => {
                    const items = groupedItems[value];
                    if (!items || items.length === 0) return null;

                    return (
                        <CustomBox key={value} ref={(el) => (sectionRefs.current[value] = el)} className="mb-8 w-full">
                            <CustomTypography as="h2" variant="h2" className="mb-2">
                                {label}
                            </CustomTypography>

                            <CustomGrid>
                                {items.map((item) => (
                                    <FoodItemCard
                                        key={item.id}
                                        item={item}
                                        className="h-full"
                                        onClick={() => setExpandedItems((p) => ({ ...p, [item.id]: !p[item.id] }))}
                                    />
                                ))}
                            </CustomGrid>
                        </CustomBox>
                    );
                })
            )}

            {/*  Modal for adjusting price*/}
            <CustomModal isOpen={isModalOpen} onClose={closeEditPrice}>
                <CustomBox className="p-4 flex flex-col gap-3">
                    <CustomTypography as="h3" variant="h4" className="mb-1">
                        Edit price
                    </CustomTypography>

                    <CustomTypography variant="small" className="text-muted-foreground">
                        {selectedItem?.name}
                    </CustomTypography>

                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="border border-borderLight dark:border-borderDark rounded-md p-2 w-full"
                        placeholder="Nieuwe prijs in € (bijv. 2.49)"
                    />

                    <CustomBox className="flex justify-end gap-2 mt-2">
                        <CustomButton onClick={closeEditPrice} variant="outline" color="neutral">
                            Cancel
                        </CustomButton>
                        <CustomButton onClick={savePrice} variant="solid" color="primary" disabled={saving}>
                            {saving ? "Saving..." : "Save"}
                        </CustomButton>
                    </CustomBox>
                </CustomBox>
            </CustomModal>
        </PageWrapper>
    );
};

export default IngredientsPage;
