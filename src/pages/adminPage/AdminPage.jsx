import { Box, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import CreateMealForm from "../../components/createMealForm/CreateMealForm.jsx";
import CreateFoodItemForm from "../../components/createFoodItemForm/CreateFoodItemForm.jsx";
import DeleteFoodItemForm from "../../components/deleteFoodItemForm/DeleteFoodItemForm.jsx";
import FetchFoodItemForm from "../../components/fetchFoodItemForm/FetchFoodItemForm.jsx";
import { PlusSquare, Utensils, Settings } from "lucide-react";
import PromoteUserForm from "../../components/promoteUserForm/PromoteUserForm.jsx";
import DeleteUserForm from "../../components/deleteUserForm/DeleteUserForm.jsx";
import CreateUserFormForAdmin from "../../components/createUserFormForAdmin/CreateUserFormForAdmin.jsx";
import DeleteMealForm from "../../components/deleteMealForm/DeleteMealForm.jsx";
import CustomBox from "../../components/layout/CustomBox.jsx";
import CustomCardChip from "../../components/layout/customCardChip.jsx";
import clsx from "clsx";
import CustomTypography from "../../components/layout/CustomTypography.jsx";

const AdminPage = () => {
    const [activeOption, setActiveOption] = useState("Food Item");
    const [foodItemAction, setFoodItemAction] = useState("Create");
    const [userAction, setUserAction] = useState("Promote");
    const [mealAction, setMealAction] = useState("Create");

    const labelFontSize = "text-[0.6rem] sm:text-[0.7rem]";


    const options = [
        { label: "Food Item", icon: <PlusSquare className="w-[24px] h-[24px] sm:w-[34px] sm:h-[34px]" /> },
        { label: "Meals", icon: <Utensils className="w-[24px] h-[24px] sm:w-[34px] sm:h-[34px]" /> },
        { label: "Users", icon: <Settings className="w-[24px] h-[24px] sm:w-[34px] sm:h-[34px]" /> },
        { label: "Settings", icon: <Settings className="w-[24px] h-[24px] sm:w-[34px] sm:h-[34px]" /> },
    ];

    const renderActiveComponent = () => {
        if (activeOption === "Food Item") {
            return (
                <CustomBox>
                    <Select
                        value={foodItemAction}
                        onChange={(e) => setFoodItemAction(e.target.value)}
                        sx={{ mb: 2, width: "100%" }}
                    >
                        <MenuItem value="Create">Create Food Item</MenuItem>
                        <MenuItem value="Delete">Delete Food Item</MenuItem>
                        <MenuItem value="Fetch">Fetch Food Item(s)</MenuItem>
                    </Select>
                    {foodItemAction === "Create" && <CreateFoodItemForm />}
                    {foodItemAction === "Delete" && <DeleteFoodItemForm />}
                    {foodItemAction === "Fetch" && <FetchFoodItemForm />}
                </CustomBox>
            );
        }

        if (activeOption === "Meals") {
            return (
                <CustomBox>
                    <Select
                        value={mealAction}
                        onChange={(e) => setMealAction(e.target.value)}
                        sx={{ mb: 2, width: "100%" }}
                    >
                        <MenuItem value="Create">Create Meal</MenuItem>
                        <MenuItem value="Delete">Delete Meal</MenuItem>
                    </Select>
                    {mealAction === "Create" && <CreateMealForm />}
                    {mealAction === "Delete" && <DeleteMealForm />}
                </CustomBox>
            );
        }

        if (activeOption === "Users") {
            return (
                <CustomBox>
                    <Select
                        value={userAction}
                        onChange={(e) => setUserAction(e.target.value)}
                        sx={{ mb: 2, width: "100%" }}
                    >
                        <MenuItem value="Promote">Promote User</MenuItem>
                        <MenuItem value="Delete">Delete User</MenuItem>
                        <MenuItem value="Create">Create User</MenuItem>
                    </Select>
                    {userAction === "Promote" && <PromoteUserForm />}
                    {userAction === "Delete" && <DeleteUserForm />}
                    {userAction === "Create" && <CreateUserFormForAdmin />}
                </CustomBox>
            );
        }

        switch (activeOption) {
            case "Create Meal":
                return <CreateMealForm />;
            case "Settings":
                return (
                    <CustomTypography variant="paragraph" className="text-center text-gray-700 dark:text-gray-300">
                        Admin settings coming soon...
                    </CustomTypography>
                );
            default:
                return null;
        }

    };

    return (
        <CustomBox className="flex flex-col items-center p-2">
            <CustomTypography
                variant="h2"
                bold
                className="my-4"
            >
                Admin Dashboard
            </CustomTypography>

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

            <Box sx={{ width: "100%", maxWidth: "600px" }}>
                {renderActiveComponent()}
            </Box>
        </CustomBox>
    );
};

export default AdminPage;