import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {useEffect, useState} from "react";
import CustomBox from "../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../components/layout/CustomTypography.jsx";
import ErrorDialog from "../../../components/layout/ErrorDialog.jsx";
import CustomTextField from "../../../components/layout/CustomTextField.jsx";
import CreateMealMealIngredients from "../../meals/components/createMealMealIngredients/CreateMealMealIngredients.jsx";
import CreateMealDropdowns from "../../meals/components/createMealDropdowns/MealDropdowns.jsx";
import MealImageUploader from "../../meals/components/createMealForm/mealImageUploader/MealImageUploader.jsx";
import CustomButton from "../../../components/layout/CustomButton.jsx";
import {mealSchema} from "../../../utils/valadition/validationSchemas.js";
import {useCreateMealAsDietitian} from "../../../hooks/useCreateMealAsDietitian.js";
import CustomFloatingSelect from "../../../components/layout/CustomFloatingSelect.jsx";
import CustomEmailTagInput from "../../../components/layout/CustomEmailTagInput.jsx";
import {getAccessToken} from "../../../utils/helpers/getAccessToken.js";
import {getAllUsersApi} from "../../../services/apiService.js";
import {handleApiError} from "../../../utils/helpers/handleApiError.js";


const CreateMealAsDietitianForm = () => {
    const [cameraError] = useState(null);

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(mealSchema),
        defaultValues: {
            name: "",
            mealDescription: "",
            mealIngredients: [{ foodItemId: "", quantity: 0 }],
            mealTypes: [],
            cuisines: [],
            diets: [],
            preparationTime: "",
            imageFile: "",
            imageUrl: "",
            email: "",
        },
    });

    const [users, setUsers] = useState([]);
    const mealIngredients = watch("mealIngredients") || [];
    const hasIngredient = mealIngredients.some(
        (ing) => ing.foodItemId && ing.foodItemId.toString().trim() !== ""
    );

    const {
        onSubmit,
        handleImageChange,
        imageUrl,
        renderDialogs
    } = useCreateMealAsDietitian();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = getAccessToken();
                const response = await getAllUsersApi(token);
                setUsers(response.data.map(u => ({ value: u.email, label: u.email })));
            } catch (error) {
                handleApiError(error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <CustomBox
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            className="w-full pb-16 px-2 flex flex-col gap-2 mb-4"
        >
            <CustomTypography as="h2" variant="h1" className="text-left">
                Create Meal (as Dietitian)
            </CustomTypography>

            {cameraError && (
                <ErrorDialog open onClose={() => {}} message={cameraError} type="error" />
            )}

            {renderDialogs()}

            <CustomTextField
                label="Meal Name"
                name="name"
                placeholder="Enter meal name"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
            />

            <Controller
                name="mealIngredients"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <>
                        <CreateMealMealIngredients
                            value={value}
                            onChange={onChange}
                            errors={errors.mealIngredients}
                        />
                        {errors.mealIngredients?.message && (
                            <p className="text-error text-sm mt-1">
                                {errors.mealIngredients.message}
                            </p>
                        )}
                    </>
                )}
            />

            <CustomTextField
                label="Meal Description"
                name="mealDescription"
                placeholder="Enter description or preparation instructions"
                {...register("mealDescription")}
                error={!!errors.mealDescription}
                helperText={errors.mealDescription?.message}
                multiline
                rows={6}
            />

            <CreateMealDropdowns control={control} errors={errors} />

            <MealImageUploader
                imageUrl={imageUrl}
                onImageChange={(image, type) => handleImageChange(image, type, setValue)}
                errors={errors}
                register={register}
            />

            {/* 🔽 Add user sharing dropdown */}
            <CustomTextField
                label="Client Email (optional)"
                name="email"
                placeholder="Enter client email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
            />

            <CustomButton
                type="submit"
                className="bg-primary text-white font-bold px-4 py-2 mt-4 self-stretch"
                disabled={!(isValid && hasIngredient)}
            >
                Create & Share Meal
            </CustomButton>
        </CustomBox>
    );
};

export default CreateMealAsDietitianForm;
