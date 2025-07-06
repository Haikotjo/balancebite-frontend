import { useEffect, useRef, useState } from "react";
import { getAllFoodItems } from "../../../services/apiService";
import BulletText from "../../../components/layout/BulletText";
import { foodCategoryOptions } from "../../../utils/const/foodCategoryOptions.js";
import CustomButton from "../../../components/layout/CustomButton.jsx";
import CustomTypography from "../../../components/layout/CustomTypography.jsx";
import CustomBox from "../../../components/layout/CustomBox.jsx";
import PromotionInfo from "../../../components/promotioninfo/PromotionInfo.jsx";

const IngredientsPage = () => {
    const [groupedItems, setGroupedItems] = useState({});
    const [expandedItems, setExpandedItems] = useState({});
    const sectionRefs = useRef({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const items = await getAllFoodItems();
                console.log("Fetched food items:", items); // <--- log toegevoegd

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
        if (ref) {
            ref.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const toggleExpand = (id) => {
        setExpandedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <CustomBox className="p-4 max-w-3xl mx-auto">
            <CustomTypography as="h1" variant="h1" className="mb-4">
                Ingredients
            </CustomTypography>

            <CustomBox className="flex flex-wrap gap-2 mb-6">
                {foodCategoryOptions.map(({label, value}) => (
                    <CustomButton
                        key={value}
                        onClick={() => handleScroll(value)}
                        className="bg-primary hover:bg-error text-white py-2 px-2 font-bold"
                    >
                        {label}
                    </CustomButton>
                ))}
            </CustomBox>

            {foodCategoryOptions.map(({label, value}) => {
                const items = groupedItems[value];
                if (!items || items.length === 0) return null;

                return (
                    <CustomBox
                        key={value}
                        ref={(el) => (sectionRefs.current[value] = el)}
                        className="mb-8"
                    >
                        <CustomTypography as="h2" variant="h2" className="mb-2">
                            {label}
                        </CustomTypography>
                        <CustomBox className="flex flex-col gap-1">
                            {items.map((item) => (
                                <CustomBox key={item.id}>
                                    <CustomBox
                                        onClick={() => toggleExpand(item.id)}
                                        className="cursor-pointer"
                                    >
                                        <BulletText font="body">{item.name}</BulletText>
                                    </CustomBox>

                                    {expandedItems[item.id] && (
                                        <CustomBox className="ml-6 mt-1 flex flex-col gap-1">
                                            {[...item.nutrients]
                                                .sort((a, b) => {
                                                    const order = [
                                                        "Energy",
                                                        "Carbohydrates",
                                                        "Protein",
                                                        "Total lipid (fat)"
                                                    ];
                                                    const aIndex = order.indexOf(a.nutrientName);
                                                    const bIndex = order.indexOf(b.nutrientName);
                                                    if (aIndex === -1 && bIndex === -1) return 0;
                                                    if (aIndex === -1) return 1;
                                                    if (bIndex === -1) return -1;
                                                    return aIndex - bIndex;
                                                })
                                                .map((n, index) => {
                                                    // Vetten
                                                    if (n.nutrientName === "Total lipid (fat)") {
                                                        const subFats = item.nutrients.filter((sub) =>
                                                            sub.nutrientName === "Unsaturated Fat" || sub.nutrientName === "Saturated Fat"
                                                        );

                                                        return (
                                                            <CustomBox key={`${item.id}-${n.nutrientId || index}`}>
                                                                <BulletText font="body" italic>
                                                                    {n.nutrientName}: {n.value} {n.unitName}
                                                                </BulletText>
                                                                <CustomBox className="ml-4 mt-1 flex flex-col gap-1">
                                                                    {subFats.map((sub, i) => (
                                                                        <BulletText
                                                                            font="body" italic
                                                                            key={`${item.id}-${sub.nutrientName}-${i}`}>
                                                                            {sub.nutrientName}: {sub.value} {sub.unitName}
                                                                        </BulletText>
                                                                    ))}
                                                                </CustomBox>
                                                            </CustomBox>
                                                        );
                                                    }

                                                    if (n.nutrientName === "Carbohydrates") {
                                                        const sugars = item.nutrients.filter((sub) =>
                                                            sub.nutrientName === "Total Sugars"
                                                        );

                                                        return (
                                                            <CustomBox key={`${item.id}-${n.nutrientId || index}`}>
                                                                <BulletText font="body" italic>
                                                                    {n.nutrientName}: {n.value} {n.unitName}
                                                                </BulletText>
                                                                <CustomBox className="ml-4 mt-1 flex flex-col gap-1">
                                                                    {sugars.map((sub, i) => (
                                                                        <BulletText font="body" italic
                                                                            key={`${item.id}-${sub.nutrientName}-${i}`}>
                                                                            {sub.nutrientName}: {sub.value} {sub.unitName}
                                                                        </BulletText>
                                                                    ))}
                                                                </CustomBox>
                                                            </CustomBox>
                                                        );
                                                    }

                                                    // Subvetten en suikers overslaan
                                                    if (
                                                        n.nutrientName === "Unsaturated Fat" ||
                                                        n.nutrientName === "Saturated Fat" ||
                                                        n.nutrientName === "Total Sugars"
                                                    ) {
                                                        return null;
                                                    }

                                                    // Andere nutrients
                                                    return (
                                                        <BulletText font="body" italic key={`${item.id}-${n.nutrientId || index}`}>
                                                            {n.nutrientName}: {n.value} {n.unitName}
                                                        </BulletText>
                                                    );
                                                })}
                                        </CustomBox>
                                    )}
                                    {item.promoted && (
                                        <PromotionInfo
                                            start={item.promotionStartDate}
                                            end={item.promotionEndDate}
                                            source={item.source}
                                            className="ml-6 mt-1"
                                        />
                                    )}

                                </CustomBox>
                            ))}
                        </CustomBox>
                    </CustomBox>
                );
            })}
        </CustomBox>
    );

};

export default IngredientsPage;
