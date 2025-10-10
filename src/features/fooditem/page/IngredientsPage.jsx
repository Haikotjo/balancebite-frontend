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

const IngredientsPage = () => {
    const [groupedItems, setGroupedItems] = useState({});
    const [expandedItems, setExpandedItems] = useState({});
    const [viewMode, setViewMode] = useState("list"); // "list" | "grid"
    const sectionRefs = useRef({});

    const formatMoney = (v) =>
        v == null || isNaN(Number(v))
            ? "unknown"
            : new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(Number(v));

    const formatGrams = (v) => (v == null || isNaN(Number(v)) ? null : `${Number(v)} g`);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const items = await getAllFoodItems();
                console.log("Fetched food items:", items);

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

    const toggleExpand = (id) => {
        setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <PageWrapper className="flex flex-col items-center">
            <CustomBox className="flex items-center justify-between mb-8 flex-wrap">
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
            <CustomBox className="flex flex-wrap gap-2 mb-6">
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

        </PageWrapper>
    );
};

export default IngredientsPage;
