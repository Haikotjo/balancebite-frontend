import CustomBox from "../../components/layout/CustomBox.jsx";
import UpdateMealForm from "../../components/updateMealForm/UpdateMealForm.jsx";

const UpdateMealPage = () => {
    return (
        <CustomBox className="max-w-[600px] mx-auto px-2 sm:px-4 pb-[4rem] sm:pb-[2rem] overflow-y-auto h-[calc(100vh-64px)] md:overflow-visible md:h-auto">
            <UpdateMealForm />
        </CustomBox>
    );
};

export default UpdateMealPage;
