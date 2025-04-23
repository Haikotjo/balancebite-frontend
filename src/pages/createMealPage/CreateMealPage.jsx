import CreateMealForm from "../../components/createMealForm/CreateMealForm.jsx";
import CustomBox from "../../components/layout/CustomBox.jsx";

const CreateMealPage = () => {
    return (
        <CustomBox className="max-w-[600px] mx-auto px-2">
            <CreateMealForm />
        </CustomBox>
    );
};

export default CreateMealPage;
