// Keep code comments in English
import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import BulletText from "../../../../components/layout/BulletText.jsx";
import PromotionInfo from "../../../../components/promotioninfo/PromotionInfo.jsx";

/**
 * FoodItemListItem
 * - Renders a single list row with expandable details.
 * - Parent controls expanded state via props.
 */
const FoodItemListItem = ({
                              item,
                              expanded = false,
                              onToggle,
                              formatMoney,
                              formatGrams,
                          }) => {
    if (!item) return null;

    const {
        id,
        name,
        price,
        pricePer100g,
        promoPrice,
        salePercentage,
        gramWeight,
        grams,
        nutrients = [],
        promoted,
        promotionStartDate,
        promotionEndDate,
        source,
    } = item;

    // Grouping logic preserved from original page
    const orderedNutrients = [...nutrients].sort((a, b) => {
        const order = ["Energy", "Carbohydrates", "Protein", "Total lipid (fat)"];
        const aIndex = order.indexOf(a.nutrientName);
        const bIndex = order.indexOf(b.nutrientName);
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
    });

    return (
        <CustomBox>
            {/* Clickable row title */}
            <CustomBox onClick={() => onToggle?.(id)} className="cursor-pointer">
                <BulletText font="body">{name}</BulletText>
            </CustomBox>

            {/* Expanded details */}
            {expanded && (
                <CustomBox className="ml-6 mt-1 flex flex-col gap-1">
                    {/* Pricing & packaging details */}
                    <BulletText font="body" italic>
                        Price: {formatMoney(price)}
                    </BulletText>

                    {pricePer100g != null && (
                        <BulletText font="body" italic>
                            Price per 100 g: {formatMoney(pricePer100g)}
                        </BulletText>
                    )}

                    {promoPrice != null && (
                        <BulletText font="body" italic>
                            Promo price: {formatMoney(promoPrice)}
                        </BulletText>
                    )}

                    {salePercentage != null && !isNaN(Number(salePercentage)) && (
                        <BulletText font="body" italic>
                            Sale: {Number(salePercentage)}% off
                        </BulletText>
                    )}

                    {gramWeight != null && !isNaN(Number(gramWeight)) && (
                        <BulletText font="body" italic>
                            Portion size: {formatGrams(gramWeight)}
                        </BulletText>
                    )}

                    {grams != null && !isNaN(Number(grams)) && (
                        <BulletText font="body" italic>
                            Product size: {formatGrams(grams)}
                        </BulletText>
                    )}

                    {/* Nutrients with grouping (same behavior as before) */}
                    {orderedNutrients.map((n, index) => {
                        if (n.nutrientName === "Total lipid (fat)") {
                            const subFats = nutrients.filter(
                                (sub) =>
                                    sub.nutrientName === "Unsaturated Fat" ||
                                    sub.nutrientName === "Saturated Fat"
                            );

                            return (
                                <CustomBox key={`${id}-${n.nutrientId || index}`}>
                                    <BulletText font="body" italic>
                                        {n.nutrientName}: {n.value} {n.unitName}
                                    </BulletText>
                                    <CustomBox className="ml-4 mt-1 flex flex-col gap-1">
                                        {subFats.map((sub, i) => (
                                            <BulletText
                                                font="body"
                                                italic
                                                key={`${id}-${sub.nutrientName}-${i}`}
                                            >
                                                {sub.nutrientName}: {sub.value} {sub.unitName}
                                            </BulletText>
                                        ))}
                                    </CustomBox>
                                </CustomBox>
                            );
                        }

                        if (n.nutrientName === "Carbohydrates") {
                            const sugars = nutrients.filter(
                                (sub) => sub.nutrientName === "Total Sugars"
                            );

                            return (
                                <CustomBox key={`${id}-${n.nutrientId || index}`}>
                                    <BulletText font="body" italic>
                                        {n.nutrientName}: {n.value} {n.unitName}
                                    </BulletText>
                                    <CustomBox className="ml-4 mt-1 flex flex-col gap-1">
                                        {sugars.map((sub, i) => (
                                            <BulletText
                                                font="body"
                                                italic
                                                key={`${id}-${sub.nutrientName}-${i}`}
                                            >
                                                {sub.nutrientName}: {sub.value} {sub.unitName}
                                            </BulletText>
                                        ))}
                                    </CustomBox>
                                </CustomBox>
                            );
                        }

                        if (
                            n.nutrientName === "Unsaturated Fat" ||
                            n.nutrientName === "Saturated Fat" ||
                            n.nutrientName === "Total Sugars"
                        ) {
                            return null;
                        }

                        return (
                            <BulletText
                                font="body"
                                italic
                                key={`${id}-${n.nutrientId || index}`}
                            >
                                {n.nutrientName}: {n.value} {n.unitName}
                            </BulletText>
                        );
                    })}
                </CustomBox>
            )}

            {/* Promotion info */}
            {promoted && (
                <PromotionInfo
                    start={promotionStartDate}
                    end={promotionEndDate}
                    source={source}
                    className="ml-6 mt-1"
                />
            )}
        </CustomBox>
    );
};

FoodItemListItem.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        name: PropTypes.string.isRequired,
        price: PropTypes.number,
        pricePer100g: PropTypes.number,
        promoPrice: PropTypes.number,
        salePercentage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        gramWeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        grams: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        nutrients: PropTypes.arrayOf(
            PropTypes.shape({
                nutrientId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                nutrientName: PropTypes.string,
                unitName: PropTypes.string,
                value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            })
        ),
        promoted: PropTypes.bool,
        promotionStartDate: PropTypes.string,
        promotionEndDate: PropTypes.string,
        source: PropTypes.string,
    }),
    expanded: PropTypes.bool,
    onToggle: PropTypes.func,
    formatMoney: PropTypes.func.isRequired,
    formatGrams: PropTypes.func.isRequired,
};

export default FoodItemListItem;
