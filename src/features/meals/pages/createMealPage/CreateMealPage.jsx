import CreateMealForm from "../../components/createMealForm/CreateMealForm.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";

const CreateMealPage = () => {
    return (
        <CustomBox className="max-w-screen-md mx-auto pt-10 p-4">
            <CreateMealForm />
        </CustomBox>
    );
};

export default CreateMealPage;
