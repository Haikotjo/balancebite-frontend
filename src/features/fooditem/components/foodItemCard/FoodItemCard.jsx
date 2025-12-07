import PropTypes from "prop-types";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import { Camera, ExternalLink } from "lucide-react";
import {useState} from "react";
import {useContext} from "react";
import {AuthContext} from "../../../../context/AuthContext.jsx";
import {formatNutrient, shouldShowNutrient} from "../../helpers/formatNutrient.js";
import CustomLink from "../../../../components/layout/CustomLink.jsx";
import { Pencil } from "lucide-react";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";
import CustomModal from "../../../../components/layout/CustomModal.jsx";
import UpdateFoodItemForm from "../updateFooditemForm/UpdateFoodItemForm.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";

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

    const { user } = useContext(AuthContext);

    const [isEditOpen, setIsEditOpen] = useState(false);

    const [isTitleExpanded, setIsTitleExpanded] = useState(false);

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

    const isAdmin = !!user && Array.isArray(user.roles) && user.roles.includes("ADMIN");

    const hasLink = (() => {
        try {
            return typeof source === "string" && source.trim() !== "" && new URL(source);
        } catch {
            return false;
        }
    })();

    const formatCurrency = (valueInEuro) => {
        const n = Number(valueInEuro);
        if (valueInEuro == null || Number.isNaN(n)) return "—";
        return new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
        }).format(n);
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

    const formatLabel = (text) => {
        if (!text) return "—";
        const lower = text.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    };

    return (
        <CustomCard
            className={`h-full w-full flex flex-col overflow-hidden p-2 sm:p-3 gap-2 ${className}`}
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
                        <CustomTypography
                            as="h3"
                            variant="h5"
                            title={name}
                            role="button"
                            tabIndex={0}
                            onClick={(e) => { e.stopPropagation(); setIsTitleExpanded(v => !v); }}
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); setIsTitleExpanded(v => !v); } }}
                            className={`${isTitleExpanded ? "line-clamp-2 break-words" : "line-clamp-1"} cursor-pointer select-none`}
                        >
                            {name}
                        </CustomTypography>


                        {promoted && (
                            <CustomTypography
                                as="span"
                                variant="xsmallCard"
                                className="px-1.5 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 mb-1"
                            >
                                On Sale
                            </CustomTypography>
                        )}

                        {storeBrand && (
                            <CustomTypography
                                as="span"
                                variant="xsmallCard"
                                className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 mb-1"
                            >
                                Store brand
                            </CustomTypography>
                        )}
                    </CustomBox>

                    <CustomTypography
                        variant="xsmallCard"
                        className="text-muted-foreground truncate"
                    >
                        {formatLabel(foodCategory)} {foodSource ? `• ${formatLabel(prettySource(foodSource))}` : ""}
                    </CustomTypography>
                </CustomBox>
                {isAdmin && (
                    <CustomIconButton
                        icon={<Pencil />}
                        size={22}
                        bgColor="bg-transparent"
                        onClick={(e) => { e.stopPropagation(); setIsEditOpen(true); }}
                    />
                )}
            </CustomBox>

            {/* Meta */}
            <CustomBox className="grid grid-cols-2 gap-2">
                {/* Price box */}
                <CustomBox className="rounded-lg border border-borderLight dark:border-borderDark p-1.5">
                    <CustomBox className="flex justify-between mb-1">
                        <CustomTypography variant="xsmallCard" className="text-muted-foreground">
                            Price:
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
                    <CustomBox className="flex justify-between mb-1">
                        <CustomTypography variant="xsmallCard" className="text-muted-foreground">
                            Product size:
                        </CustomTypography>
                        <CustomTypography variant="xsmallCard" weight="medium">
                            {grams ? `${grams} g` : "—"}
                        </CustomTypography>
                    </CustomBox>

                    <CustomBox className="mt-1">
                        <CustomBox className="flex flex-wrap items-baseline">
                            <CustomTypography
                                variant="xsmallCard"
                                className="text-muted-foreground whitespace-nowrap mr-1"
                            >
                                Portion:
                            </CustomTypography>

                            <CustomTypography
                                variant="xsmallCard"
                                weight="medium"
                                className="break-words min-w-0"
                            >
                                {portionDescription || (gramWeight ? `${gramWeight} g` : "—")}
                            </CustomTypography>
                        </CustomBox>
                    </CustomBox>

                </CustomBox>
            </CustomBox>

            {/* Sale description below the two boxes */}
            {promoted && item.saleDescription && (
                <CustomBox
                    className="mt-2 rounded-lg border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 p-1.5 min-w-0"
                >
                    <CustomTypography
                        variant="xsmallCard"
                        className="text-yellow-800 dark:text-yellow-300 whitespace-normal break-words"
                    >
                        {item.saleDescription}
                    </CustomTypography>
                </CustomBox>
            )}



            {/* Nutrients preview */}
            {Array.isArray(nutrients) && nutrients.length > 0 && (
                <CustomBox className="flex flex-wrap gap-1">
                    {nutrients.filter(n => shouldShowNutrient(n?.nutrientName)).map((n, i) => {
                        const text = formatNutrient(n);
                        return (
                            <CustomTypography
                                as="span"
                                key={n?.nutrientId ?? i}
                                variant="xsmallCard"
                                className="px-1.5 py-0.5 rounded bg-muted text-foreground/80"
                                title={text}
                            >
                                {text}
                            </CustomTypography>
                        );
                    })}
                </CustomBox>
            )}


            {/* Footer */}
            <CustomBox className="flex items-center justify-between mt-auto">
                {hasLink && (
                    <CustomLink
                        href={source}
                        ariaLabel={linkLabel}
                        title={linkLabel}
                        truncate
                        rightIcon={<ExternalLink className="w-3 h-3" aria-hidden="true" />}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <CustomTypography as="span" variant="xsmallCard" className="text-primary">
                            {linkLabel}
                        </CustomTypography>
                    </CustomLink>
                )}


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

            {/* Modal met Update form */}
            <CustomModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
                <CustomBox className="p-3 sm:p-4 max-h-[80vh] overflow-auto bg-lightBackground dark:bg-darkBackground">
                    <CustomBox className="flex justify-end mb-2">
                        <CustomButton
                            variant="outline"
                            color="error"
                            onClick={() => setIsEditOpen(false)}
                        >
                            Close
                        </CustomButton>
                    </CustomBox>

                    <UpdateFoodItemForm
                        foodItemId={item?.id}
                        title={item?.name ? `Update “${item.name}”` : "Update Food Item"}
                        onClose={() => setIsEditOpen(false)}
                    />
                </CustomBox>
            </CustomModal>
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
        saleDescription: PropTypes.string,
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
