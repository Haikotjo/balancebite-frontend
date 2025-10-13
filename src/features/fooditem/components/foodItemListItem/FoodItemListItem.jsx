// Keep code comments in English
import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import BulletText from "../../../../components/layout/BulletText.jsx";
import PromotionInfo from "../../../../components/promotioninfo/PromotionInfo.jsx";
import { Camera, ExternalLink, Pencil  } from "lucide-react";
import CustomLink from "../../../../components/layout/CustomLink.jsx";
import {useContext} from "react";
import {AuthContext} from "../../../../context/AuthContext.jsx";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";

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
                              onEditPrice = () => {},
                          }) => {

    const { user } = useContext(AuthContext);

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
        imageUrl,
        promoted,
        promotionStartDate,
        promotionEndDate,
        source,
    } = item;

    const isAdmin = !!user && Array.isArray(user.roles) && user.roles.includes("ADMIN");

    const hasLink = (() => {
        try { return typeof source === "string" && source.trim() !== "" && new URL(source); }
        catch { return false; }
    })();

    const prettySource = (raw) => {
        if (!raw || typeof raw !== "string") return null;
        const cleaned = raw.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
        return cleaned.split(" ").map((w) => {
            const isAcr = /^[A-Z0-9]{1,2}$/.test(w);
            if (isAcr) return w.toUpperCase();
            const lower = w.toLowerCase();
            return lower.charAt(0).toUpperCase() + lower.slice(1);
        }).join(" ");
    };

    const labelSource =
        prettySource(item.foodSource) ||
        (() => { try { return new URL(source).hostname.replace(/^www\./, ""); } catch { return null; } })();

    const linkLabel = labelSource ? `Open product page on ${labelSource}` : "Open product page";

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
            {/* Promotion info */}
            {promoted && (
                <PromotionInfo
                    start={promotionStartDate}
                    end={promotionEndDate}
                    source={source}
                    className="ml-6"
                />
            )}

            {/* Expanded details */}
            {expanded && (
                <CustomBox className="ml-6 mt-1 flex flex-col gap-1 mb-2">

                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={name}
                            loading="lazy"
                            className="w-14 h-14 object-cover rounded-md flex-shrink-0 border border-borderLight dark:border-borderDark"
                        />
                    ) : (
                        <CustomBox
                            className="w-14 h-14 rounded-md flex-shrink-0 border border-borderLight dark:border-borderDark bg-muted flex items-center justify-center"
                            aria-label="No image available"
                            role="img"
                        >
                            <Camera className="w-6 h-6 text-muted-foreground" />
                        </CustomBox>
                    )}

                    {/* Pricing & packaging details */}
                    <CustomBox className="flex items-center gap-2">
                        <BulletText font="body" italic>
                            Price: {formatMoney(price)}
                        </BulletText>

                        {isAdmin && (
                            <CustomIconButton
                                icon={<Pencil />}
                                size={22}
                                bgColor="bg-transparent"
                                className="text-primary"
                                onClick={(e) => { e.stopPropagation(); onEditPrice?.(item); }}
                            />
                        )}
                    </CustomBox>


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

                    {grams != null && !isNaN(Number(grams)) && (
                        <BulletText font="body" italic>
                            Product size: {formatGrams(grams)}
                        </BulletText>
                    )}

                    {hasLink && (
                        <CustomBox className="mt-1">
                            <CustomLink
                                href={source}
                                ariaLabel={linkLabel}
                                title={linkLabel}
                                truncate
                                rightIcon={<ExternalLink className="w-3 h-3" aria-hidden="true" />}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <BulletText font="body">
                                    <span className="text-primary">{linkLabel}</span>
                                </BulletText>
                            </CustomLink>
                        </CustomBox>
                    )}
                </CustomBox>
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
        imageUrl: PropTypes.string,
        foodSource: PropTypes.string,
    }),
    expanded: PropTypes.bool,
    onToggle: PropTypes.func,
    formatMoney: PropTypes.func.isRequired,
    formatGrams: PropTypes.func.isRequired,
    onEditPrice: PropTypes.func
};

export default FoodItemListItem;
