import CustomBox from "../../../../components/layout/CustomBox.jsx";
import UpdateMealForm from "../../components/updateMealForm/UpdateMealForm.jsx";
import PageWrapper from "../../../../components/layout/PageWrapper.jsx";

const UpdateMealPage = () => {
    return (
        <PageWrapper>
            {/* Constrain form width and center */}
            <CustomBox className="max-w-screen-md mx-auto">
                <UpdateMealForm />
            </CustomBox>
        </PageWrapper>
    );
};

export default UpdateMealPage;
