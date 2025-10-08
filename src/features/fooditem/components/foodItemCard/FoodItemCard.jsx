import PropTypes from "prop-types";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import { Camera, ExternalLink } from "lucide-react";

/**
 * Compact card to render a single food item.
 * Designed to be very dense so many cards fit on one page.
 */
const FoodItemCard = ({
                          item,
                          className = "",
                          isPinned = false,
                          createdByRole,
                          onClick,
                      }) => {
    if (!item) return null;

    const {
        name,
        imageUrl,
        foodCategory,
        foodSource,
        grams,
        gramWeight,
        portionDescription,
        price,
        pricePer100g,
        promoted,
        storeBrand,
        source,
        nutrients = [],
    } = item;

    const formatCurrency = (valueInCents) => {
        if (valueInCents == null) return "-";
        return new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
        }).format(valueInCents / 100);
    };

    // Pretty-print a generic source string/enum (no per-enum mapping needed)
    const prettySource = (raw) => {
        if (!raw || typeof raw !== "string") return null;
        const cleaned = raw.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
        return cleaned
            .split(" ")
            .map((w) => {
                const isAcronym = /^[A-Z0-9]{1,2}$/.test(w); // keep very short tokens all-caps (e.g., AH)
                if (isAcronym) return w.toUpperCase();
                const lower = w.toLowerCase();
                return lower.charAt(0).toUpperCase() + lower.slice(1);
            })
            .join(" ");
    };

    const labelSource =
        prettySource(foodSource) ||
        (() => {
            try {
                return new URL(source).hostname.replace(/^www\./, "");
            } catch {
                return null;
            }
        })();

    const linkLabel = labelSource
        ? `Open product page on ${labelSource}`
        : "Open product page";

    // Try to surface a few common nutrients if present
    const prioritizedKeys = [
        "Energy",
        "Calories",
        "Protein",
        "Carbohydrate",
        "Fat",
        "Fiber",
        "Sugar",
        "Salt",
        "Sodium",
    ];
    const shortNutrients = (() => {
        if (!Array.isArray(nutrients)) return [];
        const prioritized = nutrients.filter((n) =>
            prioritizedKeys.some((k) =>
                String(n?.name || n?.nutrientName || "")
                    .toLowerCase()
                    .includes(k.toLowerCase())
            )
        );
        const pick = (prioritized.length ? prioritized : nutrients).slice(0, 3);
        return pick.map((n) => {
            const label = n?.name || n?.nutrientName || "Nutrient";
            const amount = n?.amount ?? n?.value ?? null;
            const unit = n?.unitName || n?.unit || "";
            return `${label}: ${amount != null ? amount : "?"}${
                unit ? ` ${unit}` : ""
            }`;
        });
    })();

    return (
        <CustomCard
            className={`p-2 sm:p-3 gap-2 ${className}`}
            isPinned={isPinned}
            createdByRole={createdByRole}
        >
            {/* Header */}
            <CustomBox className="flex items-start gap-2">
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

                <CustomBox className="min-w-0 flex-1">
                    <CustomBox className="flex items-center gap-1.5 flex-wrap">
                        <CustomTypography as="h3" variant="h5" className="truncate" title={name}>
                            {name}
                        </CustomTypography>

                        {promoted && (
                            <CustomTypography
                                as="span"
                                variant="xsmallCard"
                                className="px-1.5 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                            >
                                Promoted
                            </CustomTypography>
                        )}

                        {storeBrand && (
                            <CustomTypography
                                as="span"
                                variant="xsmallCard"
                                className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                            >
                                Store brand
                            </CustomTypography>
                        )}
                    </CustomBox>

                    <CustomTypography
                        variant="xsmallCard"
                        className="text-muted-foreground truncate"
                    >
                        {foodCategory ?? "—"} {foodSource ? `• ${prettySource(foodSource)}` : ""}
                    </CustomTypography>
                </CustomBox>
            </CustomBox>

            {/* Meta */}
            <CustomBox className="grid grid-cols-2 gap-2">
                {/* Price box */}
                <CustomBox className="rounded-lg border border-borderLight dark:border-borderDark p-1.5">
                    <CustomBox className="flex justify-between">
                        <CustomTypography variant="xsmallCard" className="text-muted-foreground">
                            Price
                        </CustomTypography>
                        <CustomTypography variant="xsmallCard" weight="medium">
                            {formatCurrency(price)}
                        </CustomTypography>
                    </CustomBox>

                    <CustomBox className="flex justify-between">
                        <CustomTypography variant="xsmallCard" className="text-muted-foreground">
                            100g
                        </CustomTypography>
                        <CustomTypography variant="xsmallCard" weight="medium">
                            {formatCurrency(pricePer100g)}
                        </CustomTypography>
                    </CustomBox>
                </CustomBox>

                {/* Pack + Portion box */}
                <CustomBox className="rounded-lg border border-borderLight dark:border-borderDark p-1.5">
                    <CustomBox className="flex justify-between">
                        <CustomTypography variant="xsmallCard" className="text-muted-foreground">
                            Pack
                        </CustomTypography>
                        <CustomTypography variant="xsmallCard" weight="medium">
                            {grams ? `${grams} g` : "—"}
                        </CustomTypography>
                    </CustomBox>

                    <CustomBox className="mt-1">
                        <CustomTypography variant="xsmallCard" className="text-muted-foreground">
                            Portion
                        </CustomTypography>
                        <CustomTypography
                            variant="xsmallCard"
                            weight="medium"
                            className="leading-tight truncate"
                        >
                            {portionDescription || (gramWeight ? `${gramWeight} g` : "—")}
                        </CustomTypography>
                    </CustomBox>
                </CustomBox>
            </CustomBox>

            {/* Nutrients preview */}
            {shortNutrients.length > 0 && (
                <CustomBox className="flex flex-wrap gap-1">
                    {shortNutrients.map((t, i) => (
                        <CustomTypography
                            as="span"
                            key={i}
                            variant="xsmallCard"
                            className="px-1.5 py-0.5 rounded bg-muted text-foreground/80"
                            title={t}
                        >
                            {t}
                        </CustomTypography>
                    ))}
                    {Array.isArray(nutrients) && nutrients.length > shortNutrients.length && (
                        <CustomTypography
                            as="span"
                            variant="xsmallCard"
                            className="px-1.5 py-0.5 rounded bg-muted text-foreground/80"
                        >
                            +{nutrients.length - shortNutrients.length} more
                        </CustomTypography>
                    )}
                </CustomBox>
            )}

            {/* Footer */}
            <CustomBox className="flex items-center justify-between">
                <a
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 underline text-muted-foreground truncate"
                    title={linkLabel}
                    aria-label={linkLabel}
                    onClick={(e) => e.stopPropagation()}
                >
                    <CustomTypography as="span" variant="xsmallCard">
                        {linkLabel}
                    </CustomTypography>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>

                {/*{onClick && (*/}
                {/*    <button*/}
                {/*        type="button"*/}
                {/*        onClick={onClick}*/}
                {/*        className="px-2 py-1 rounded-md border border-borderLight dark:border-borderDark hover:bg-muted"*/}
                {/*    >*/}
                {/*        <CustomTypography as="span" variant="xsmallCard">*/}
                {/*            Select*/}
                {/*        </CustomTypography>*/}
                {/*    </button>*/}
                {/*)}*/}
            </CustomBox>
        </CustomCard>
    );
};

FoodItemCard.propTypes = {
    item: PropTypes.shape({
        fdcId: PropTypes.number,
        foodCategory: PropTypes.string,
        foodSource: PropTypes.string,
        gramWeight: PropTypes.number,
        grams: PropTypes.number,
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        imageUrl: PropTypes.string,
        name: PropTypes.string.isRequired,
        nutrients: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
                nutrientName: PropTypes.string,
                amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                unitName: PropTypes.string,
                unit: PropTypes.string,
            })
        ),
        portionDescription: PropTypes.string,
        price: PropTypes.number, // in cents
        pricePer100g: PropTypes.number, // in cents
        promoted: PropTypes.bool,
        source: PropTypes.string,
        storeBrand: PropTypes.bool,
    }),
    className: PropTypes.string,
    isPinned: PropTypes.bool,
    createdByRole: PropTypes.string,
    onClick: PropTypes.func,
};

export default FoodItemCard;
