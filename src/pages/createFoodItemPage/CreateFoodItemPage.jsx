import CreateFoodItemForm from "../../components/createFoodItemForm/CreateFoodItemForm.jsx";
import CustomBox from "../../components/layout/CustomBox.jsx";

const CreateFoodItemPage = () => {
    return (
        <CustomBox className="max-w-[600px] mx-auto px-2">
            <CreateFoodItemForm />
        </CustomBox>
    );
};

export default CreateFoodItemPage;
