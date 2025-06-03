import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getShoppingCartForDietPlanApi } from "../../services/apiService.js";
import { UserDietsContext } from "../../context/UserDietContext.jsx";
import CustomBox from "../../components/layout/CustomBox.jsx";
import CustomTypography from "../../components/layout/CustomTypography.jsx";
import BulletText from "../../components/layout/BulletText.jsx";
import CustomCard from "../../components/layout/CustomCard.jsx";
import Spinner from "../../components/layout/Spinner.jsx";
import CustomLink from "../../components/layout/customLink.jsx";
import DietListCard from "../../features/diets/dietListCard/DietListCard.jsx";
import DietSubMenu from "../../features/diets/components/subMenu/DietsSubMenu.jsx";
import CustomCheckbox from "../../components/layout/CustomCheckbox.jsx";
import CustomDivider from "../../components/layout/CustomDivider.jsx";

const ShoppingCartPage = () => {
    const { dietPlanId } = useParams();
    const [shoppingList, setShoppingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userDiets, setActiveOption } = useContext(UserDietsContext);
    const navigate = useNavigate();
    const [checkedItems, setCheckedItems] = useState({});

    const toggleChecked = (index) => {
        setCheckedItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getShoppingCartForDietPlanApi(dietPlanId);
                setShoppingList(result);
            } catch (err) {
                setError("Failed to load shopping cart.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [dietPlanId]);


    if (loading) {
        return (
            <CustomBox className="flex justify-center items-center h-40">
                <Spinner />
            </CustomBox>
        );
    }
    if (error) {
        return (
            <CustomBox className="flex justify-center items-center h-40">
                <CustomTypography className="text-red-500 text-center">
                    {error}
                </CustomTypography>
            </CustomBox>
        );
    }

    return (
        <CustomBox className="pt-6 sm:pt-10 px-4 pb-20 sm:pb-10">
            {/* 1. Toon submenu, detail‐modus (onSelect = callback) */}
            <DietSubMenu
                isDetailPage={true}
                onSelect={(label) => {
                    setActiveOption(label);
                    const optionParam = label.toLowerCase().replace(" ", "-");
                    navigate(`/diets?option=${optionParam}`);
                }}
            />

            {/* 2. Lading van de cart zelf */}
            <CustomBox className="flex flex-col lg:flex-row gap-6 justify-between items-start mt-4">
                {/* Shopping Cart */}
                <CustomBox className="w-full lg:w-auto lg:max-w-[75%] mx-auto">
                    <CustomCard className="p-4 space-y-6 w-full">
                        <CustomTypography
                            as="h2"
                            variant="h1"
                            className="text-xl font-bold text-center mb-6 mt-2"
                        >
                            Shopping Cart
                        </CustomTypography>
                        {shoppingList.map((item, index) => (
                            <CustomBox key={index}>
                                <CustomBox className="flex justify-between items-start">
                                    <CustomBox>
                                        <CustomTypography
                                            as="h3"
                                            variant="h5"
                                            className="font-semibold text-lg mb-2"
                                        >
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
                                        checked={checkedItems[index] || false}
                                        onChange={() => toggleChecked(index)}
                                        id={`checkbox-${index}`}
                                    />
                                </CustomBox>

                                <CustomDivider className="my-1" />
                            </CustomBox>
                        ))}


                    </CustomCard>
                </CustomBox>

                {/* Sidebar met “My Other Diets” */}
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
    );
};

export default ShoppingCartPage;
