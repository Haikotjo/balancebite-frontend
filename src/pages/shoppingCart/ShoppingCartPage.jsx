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

    /** Toggle single checkbox state by list index. */
    const toggleChecked = (index) => {
        setCheckedItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    /** Fetch shopping list for the given diet plan. */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getShoppingCartForDietPlanApi(dietPlanId);
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

    // --- Conditional states wrapped with PageWrapper so layout offsets remain correct ---
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
            {/* Submenu (detail mode): selecting an option routes to Diets page with query param */}
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
            <CustomBox className="flex flex-col lg:flex-row gap-6 justify-between items-start mt-4">
                {/* Shopping cart */}
                <CustomBox className="w-full lg:w-auto lg:max-w-[75%] mx-auto">
                    <CustomCard className="p-4 space-y-6 w-full">
                        <CustomTypography as="h2" variant="h1" className="text-xl font-bold text-center mb-6 mt-2">
                            Shopping Cart
                        </CustomTypography>

                        {shoppingList.map((item, index) => {
                            const isChecked = !!checkedItems[index];
                            return (
                                <CustomBox key={index}>
                                    <CustomBox className="flex justify-between items-start">
                                        <CustomBox>
                                            <CustomTypography as="h3" variant="h5" className="font-semibold text-lg mb-2">
                                                {item.name}
                                            </CustomTypography>

                                            <CustomBox className="space-y-1 pl-4">
                                                <BulletText>{item.quantity} (gram)</BulletText>
                                                {item.source && (
                                                    <BulletText>
                                                        <CustomLink href={item.source}>{item.source}</CustomLink>
                                                    </BulletText>
                                                )}
                                            </CustomBox>
                                        </CustomBox>

                                        <CustomCheckbox
                                            className="ml-4 mt-2 w-5 h-5"
                                            checked={isChecked}
                                            onChange={() => toggleChecked(index)}
                                            id={`checkbox-${index}`}
                                        />
                                    </CustomBox>

                                    <CustomDivider className="my-1" />
                                </CustomBox>
                            );
                        })}
                    </CustomCard>
                </CustomBox>

                {/* Sidebar: other user diets (excluding current) */}
                <CustomBox className="hidden lg:flex flex-col gap-4 lg:basis-1/4 min-w-0">
                    <CustomTypography variant="h4" className="mb-4 font-semibold">
                        My Other Diets
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
