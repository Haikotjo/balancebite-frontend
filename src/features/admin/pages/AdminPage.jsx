import { useState } from "react";
import {
    PlusSquare,
    Utensils,
    Settings,
    CookingPot
} from "lucide-react";

// Form components
import CreateFoodItemForm from "../components/createFoodItemForm/CreateFoodItemForm.jsx";
import DeleteFoodItemForm from "../components/deleteFoodItemForm/DeleteFoodItemForm.jsx";
import FetchFoodItemForm from "../components/fetchFoodItemForm/FetchFoodItemForm.jsx";
import PromoteUserForm from "../components/promoteUserForm/PromoteUserForm.jsx";

import DeleteUserForm from "../components/deleteUserForm/DeleteUserForm.jsx";
import CreateMealForm from "../../meals/components/createMealForm/CreateMealForm.jsx";
import DeleteMealForm from "../../meals/components/deleteMealForm/DeleteMealForm.jsx";

import CreateDietForm from "../../diets/components/createDietForm/CreateDietForm.jsx";

// Layout components
import CustomBox from "../../../components/layout/CustomBox.jsx";
import CustomCardChip from "../../../components/layout/customCardChip.jsx";
import CustomTypography from "../../../components/layout/CustomTypography.jsx";
import clsx from "clsx";
import CustomSelect from "../../../components/layout/CustomSelect.jsx";
import RegisterForm from "../../navigation/components/authRegisterForm/RegisterForm.jsx";
import DeleteDietPlanForm from "../components/deleteDietForm/DeleteMealForm.jsx";
import CreateStickyItemForm from "../components/createStickyItemForm/CreateStickyItemForm.jsx";
import PromoteFoodItemForm from "../components/promotefoodItemform/PromoteFoodItemForm.jsx";
import PageWrapper from "../../../components/layout/PageWrapper.jsx";
import { ShieldUser } from "lucide-react";
import UpdateFoodItemPicker from "../../fooditem/components/updateFoodItemPicker/UpdateFoodItemPicker.jsx";

/**
 * AdminPage – Central admin dashboard to manage food items, meals, users and future settings.
 * Uses only custom layout components for easy migration to React Native.
 */
const AdminPage = () => {
    const [activeOption, setActiveOption] = useState("Food Item");
    const [foodItemAction, setFoodItemAction] = useState("Create");
    const [userAction, setUserAction] = useState("Promote");
    const [mealAction, setMealAction] = useState("Create");
    const [dietAction, setDietAction] = useState("Create");

    // Main top-level options for admin sections
    const options = [
        { label: "Food Item", icon: <PlusSquare className="w-[24px] h-[24px] sm:w-[34px] sm:h-[34px]" /> },
        { label: "Meals", icon: <Utensils className="w-[24px] h-[24px] sm:w-[34px] sm:h-[34px]" /> },
        { label: "Users", icon: <Settings className="w-[24px] h-[24px] sm:w-[34px] sm:h-[34px]" /> },
        { label: "Diets", icon: <CookingPot  className="w-[24px] h-[24px] sm:w-[34px] sm:h-[34px]" /> },
        { label: "Promote", icon: <Settings className="w-[24px] h-[24px] sm:w-[34px] sm:h-[34px]" /> },
    ];

    /**
     * Dynamically render the section content based on the selected top-level option.
     */
    const renderActiveComponent = () => {
        if (activeOption === "Food Item") {
            return (
                <CustomBox>
                    <CustomSelect
                        name="foodItemAction"
                        label="Food Item Action"
                        value={foodItemAction}
                        onChange={(e) => setFoodItemAction(e.target.value)}
                        options={[
                            { value: "Create", label: "Create Food Item" },
                            { value: "Delete", label: "Delete Food Item" },
                            { value: "Fetch",  label: "Fetch Food Item(s)" },
                            { value: "Promote", label: "Promote Food Item" },
                            { value: "Update", label: "Update Food Item" },
                        ]}
                        className="py-2 sm:py-3"
                    />
                    {foodItemAction === "Create" && <CreateFoodItemForm />}
                    {foodItemAction === "Delete" && <DeleteFoodItemForm />}
                    {foodItemAction === "Fetch" && <FetchFoodItemForm />}
                    {foodItemAction === "Promote" && <PromoteFoodItemForm />}
                    {foodItemAction === "Update" && <UpdateFoodItemPicker />}

                </CustomBox>
            );
        }

        if (activeOption === "Meals") {
            return (
                <CustomBox>
                    <CustomSelect
                        name="mealAction"
                        label="Meal Action"
                        value={mealAction}
                        onChange={(e) => setMealAction(e.target.value)}
                        options={[
                            { value: "Create", label: "Create Meal" },
                            { value: "Delete", label: "Delete Meal" },
                        ]}
                        className="py-2 sm:py-3"
                    />

                    {mealAction === "Create" && <CreateMealForm />}
                    {mealAction === "Delete" && <DeleteMealForm />}
                </CustomBox>
            );
        }

        if (activeOption === "Users") {
            return (
                <CustomBox>
                    <CustomSelect
                        name="userAction"
                        label="User Action"
                        value={userAction}
                        onChange={(e) => setUserAction(e.target.value)}
                        options={[
                            { value: "Promote", label: "Promote User" },
                            { value: "Delete",  label: "Delete User" },
                            { value: "Create",  label: "Create User" },
                        ]}
                        className="py-2 sm:py-3"
                    />

                    {userAction === "Promote" && <PromoteUserForm />}
                    {userAction === "Delete" && <DeleteUserForm />}
                    {userAction === "Create" && <RegisterForm showRoles isAdminContext />}
                </CustomBox>
            );
        }

        if (activeOption === "Diets") {
            return (
                <CustomBox>
                    <CustomSelect
                        name="dietAction"
                        label="Diet Action"
                        value={dietAction}
                        onChange={(e) => setDietAction(e.target.value)}
                        options={[
                            { value: "Create", label: "Create Diet" },
                            { value: "Delete", label: "Delete Diet" },
                        ]}
                        className="py-2 sm:py-3"
                    />

                    {dietAction === "Create" && <CreateDietForm />}
                    {dietAction === "Delete" && <DeleteDietPlanForm />}
                </CustomBox>
            );
        }


        if (activeOption === "Promote") {
            return (
                <CustomBox>
                    <CustomTypography
                        variant="h4"
                        className="text-center text-gray-700 dark:text-gray-300 mb-4"
                    >
                        Sticky Items
                    </CustomTypography>
                    <CreateStickyItemForm />
                </CustomBox>

            );
        }

        return null;
    };

    return (
        <PageWrapper className="flex flex-col items-center">
            <CustomBox className="flex flex-col items-center w-full">
                <ShieldUser className="w-16 h-16 sm:w-24 sm:h-24 text-primary mb-2" aria-hidden="true" />

                {/* Dashboard title */}
                <CustomTypography variant="h2" bold className="my-4">
                    Admin Dashboard
                </CustomTypography>

                {/* Option chips */}
                <CustomBox className="mb-5 flex justify-center">
                    <CustomBox className="flex flex-row items-center gap-4">
                        {options.map((option) => (
                            <CustomBox key={option.label} className="flex flex-col items-center">
                                <CustomCardChip
                                    onClick={() => setActiveOption(option.label)}
                                    className={clsx(
                                        "flex flex-col items-center justify-center border-2",
                                        option.label === activeOption
                                            ? "bg-primary border-primary text-white"
                                            : "bg-white dark:bg-gray-800 border-primary text-primary",
                                        "w-[56px] h-[32px] sm:w-[76px] sm:h-[46px]"
                                    )}
                                    textClassName="flex flex-col items-center"
                                >
                                    {option.icon}
                                </CustomCardChip>
                                <CustomTypography
                                    as="span"
                                    className="text-[0.8rem] sm:text-[0.9rem] font-semibold mt-2"
                                >
                                    {option.label}
                                </CustomTypography>
                            </CustomBox>
                        ))}
                    </CustomBox>
                </CustomBox>

                {/* Main content area */}
                <CustomBox className="w-full max-w-[600px] p-2 sm:p-0">
                    {renderActiveComponent()}
                </CustomBox>
            </CustomBox>
        </PageWrapper>
    );
};

export default AdminPage;
