import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getShoppingCartForDietPlanApi } from "../../services/apiService.js";
import { UserDietsContext } from "../../context/UserDietContext.jsx";
import PageWrapper from "../../components/layout/PageWrapper.jsx";
import CustomBox from "../../components/layout/CustomBox.jsx";
import CustomTypography from "../../components/layout/CustomTypography.jsx";
import BulletText from "../../components/layout/BulletText.jsx";
import CustomCard from "../../components/layout/CustomCard.jsx";
import Spinner from "../../components/layout/Spinner.jsx";
import CustomLink from "../../components/layout/customLink.jsx";
import DietListCard from "../../features/diets/components/dietListCard/DietListCard.jsx";
import DietSubMenu from "../../features/diets/components/subMenu/DietsSubMenu.jsx";
import CustomCheckbox from "../../components/layout/CustomCheckbox.jsx";
import CustomDivider from "../../components/layout/CustomDivider.jsx";

const ShoppingCartPage = () => {
    const { dietPlanId } = useParams();
    const navigate = useNavigate();

    const [shoppingList, setShoppingList] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { userDiets, setActiveOption } = useContext(UserDietsContext);

    /** Format numbers as € with 2 decimals. Accepts number or numeric string. */
    const formatMoney = (v) =>
        v == null || isNaN(Number(v))
            ? null
            : new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(Number(v));

    /** Toggle single checkbox state by list index. */
    const toggleChecked = (index) => {
        setCheckedItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    /**
     * Fetch shopping list for the given diet plan.
     * We log:
     * - raw API response
     * - compact table with common fields (when present)
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getShoppingCartForDietPlanApi(dietPlanId);

                // --- logging (non-functional) ---
                console.log("API → shopping list:", result);
                try {
                    console.table(
                        (Array.isArray(result) ? result : []).map((it) => ({
                            name: it?.name,
                            quantity: it?.quantity, // legacy alt
                            requiredGrams: it?.requiredGrams,
                            packGrams: it?.packGrams,
                            packsNeeded: it?.packsNeeded,
                            unitPrice: it?.unitPrice,
                            totalCost: it?.totalCost,
                            promoted: it?.promoted,
                            saleDescription: it?.saleDescription,
                            source: it?.source,
                        })),
                    );
                } catch (e) {
                    console.warn("console.table failed:", e);
                }
                // -------------------------------

                setShoppingList(result);
            } catch (err) {
                console.error(err);
                setError("Failed to load shopping cart.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [dietPlanId]);

    /** Extra logging when state is set/updated. */
    useEffect(() => {
        if (!shoppingList || shoppingList.length === 0) return;

        console.log("State → shopping list:", shoppingList);
        try {
            console.table(
                shoppingList.map((it) => ({
                    name: it?.name,
                    quantity: it?.quantity,
                    requiredGrams: it?.requiredGrams,
                    packGrams: it?.packGrams,
                    packsNeeded: it?.packsNeeded,
                    unitPrice: it?.unitPrice,
                    totalCost: it?.totalCost,
                    promoted: it?.promoted,
                    saleDescription: it?.saleDescription,
                    source: it?.source,
                })),
            );
        } catch (e) {
            console.warn("console.table failed:", e);
        }
    }, [shoppingList]);

    // ------------------ NEW: totals & missing prices ------------------
    const totalKnownCost = shoppingList.reduce((sum, it) => {
        const val = it?.totalCost != null ? Number(it.totalCost) : 0;
        return isNaN(val) ? sum : sum + val;
    }, 0);

    const missingPriceItems = shoppingList
        .filter((it) => it?.totalCost == null)
        .map((it) => it?.name)
        .filter(Boolean);

    const hasMissingPrices = missingPriceItems.length > 0;
    // ------------------------------------------------------------------

    // --- Conditional states ---
    if (loading) {
        return (
            <PageWrapper className="flex items-center justify-center">
                <Spinner />
            </PageWrapper>
        );
    }

    if (error) {
        return (
            <PageWrapper className="flex items-center justify-center">
                <CustomTypography className="text-red-500 text-center">{error}</CustomTypography>
            </PageWrapper>
        );
    }

    // --- Main render ---
    return (
        <PageWrapper>
            <CustomBox className="max-w-screen-xl mx-auto">
                {/* Submenu (detail mode) */}
                <CustomBox className="mb-4">
                    <DietSubMenu
                        isDetailPage={true}
                        onSelect={(label) => {
                            setActiveOption(label);
                            const optionParam = label.toLowerCase().replace(/\s+/g, "-");
                            navigate(`/diets?option=${optionParam}`);
                        }}
                    />
                </CustomBox>

                {/* Content layout: cart + sidebar */}
                <CustomBox className="flex flex-col lg:flex-row justify-between items-start mt-4">
                    {/* Shopping cart */}
                    <CustomBox className="w-full lg:w-auto lg:max-w-[75%] mx-auto">
                        <CustomCard className="p-4 space-y-6 w-full">
                            <CustomTypography as="h2" variant="h1" className="text-xl font-bold text-center mb-6 mt-2">
                                Shopping Cart
                            </CustomTypography>

                            {shoppingList.map((item, index) => {
                                const isChecked = !!checkedItems[index];
                                const hasPack = item?.packGrams != null && Number(item.packGrams) > 0;
                                const hasPrice = item?.unitPrice != null || item?.totalCost != null;

                                return (
                                    <CustomCard
                                        key={index}
                                        className={`relative p-4 duration-200
                                        bg-cardLight dark:bg-cardDark
                                        ${isChecked
                                            ? "ring-2 ring-primary/50 dark:ring-primary/60 bg-primary/20 dark:bg-primary/10"
                                            : "ring-0"
                                        }`}
                                    >
                                        {/* inhoud zoals je nu hebt */}
                                        <CustomBox className="flex justify-between items-start">
                                            <CustomBox>
                                                <CustomTypography as="h3" variant="h5" className="font-semibold text-lg mb-2">
                                                    {item.name}
                                                </CustomTypography>

                                                {item.promoted && (
                                                    <CustomTypography
                                                        as="p"
                                                        variant="bold"
                                                        italic
                                                        color="text-promote dark:text-promote"
                                                        className="mb-2"
                                                    >
                                                        On sale
                                                    </CustomTypography>
                                                )}

                                                <BulletText variant="paragraph">{item.requiredGrams} (gram)</BulletText>

                                                <CustomBox className="space-y-1 pl-4 mt-1">
                                                    {hasPack && (
                                                        <CustomTypography variant="paragraphCard" italic>
                                                            Pack size: {item.packGrams} g
                                                        </CustomTypography>
                                                    )}

                                                    {hasPrice ? (
                                                        Number(item.packsNeeded) > 1 ? (
                                                            <CustomTypography variant="paragraphCard" italic>
                                                                Required: {item.packsNeeded} × {formatMoney(item.unitPrice)} = {formatMoney(item.totalCost)}
                                                            </CustomTypography>
                                                        ) : (
                                                            <CustomTypography variant="paragraphCard" italic>
                                                                Price: {formatMoney(item.totalCost ?? item.unitPrice)}
                                                            </CustomTypography>
                                                        )
                                                    ) : (
                                                        <CustomTypography variant="paragraphCard" italic>
                                                            Price: unknown
                                                        </CustomTypography>
                                                    )}

                                                    {item.promoted && (
                                                        <CustomTypography variant="paragraphCard" italic>
                                                            Promo{item.saleDescription ? `: ${item.saleDescription}` : ""}
                                                        </CustomTypography>
                                                    )}
                                                </CustomBox>

                                                {item.source && (
                                                    <BulletText>
                                                        <CustomLink href={item.source}>{item.source}</CustomLink>
                                                    </BulletText>
                                                )}
                                            </CustomBox>

                                            <CustomCheckbox
                                                className="ml-4 mt-2 w-5 h-5"
                                                checked={isChecked}
                                                onChange={() => toggleChecked(index)}
                                                id={`checkbox-${index}`}
                                            />
                                        </CustomBox>

                                    </CustomCard>
                                );
                            })}


                            {/* ------------------ NEW: footer with totals ------------------ */}

                            <CustomBox className="flex flex-col items-end gap-1 pr-1">
                                <CustomTypography as="p" className="text-lg font-semibold">
                                    Total{hasMissingPrices ? "*" : ""}: {formatMoney(totalKnownCost)}
                                </CustomTypography>
                                {hasMissingPrices && (
                                    <CustomTypography as="p" className="text-xs text-gray-500">
                                        * price missing from: {missingPriceItems.join(", ")}
                                    </CustomTypography>
                                )}
                            </CustomBox>
                            {/* ------------------------------------------------------------- */}
                        </CustomCard>
                    </CustomBox>

                    {/* Sidebar: other user diets (excluding current) */}
                    <CustomBox className="hidden lg:flex flex-col gap-4 lg:basis-1/4 min-w-0">
                        <CustomTypography variant="h4" className="mb-4 font-semibold">
                            My Diets
                        </CustomTypography>

                        <CustomBox className="flex flex-col gap-2 overflow-y-auto pr-2">
                            {userDiets
                                .filter((diet) => String(diet.id) !== String(dietPlanId))
                                .map((diet) => (
                                    <DietListCard key={diet.id} diet={diet} />
                                ))}
                        </CustomBox>
                    </CustomBox>
                </CustomBox>
            </CustomBox>
        </PageWrapper>
    );
};

export default ShoppingCartPage;
