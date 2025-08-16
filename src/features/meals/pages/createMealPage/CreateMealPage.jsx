import PageWrapper from "../../../../components/layout/PageWrapper.jsx";
import CreateMealForm from "../../components/createMealForm/CreateMealForm.jsx";

const CreateMealPage = () => {
    return (
        // Page shell
        <PageWrapper className="flex flex-col items-center">
            <CreateMealForm />
        </PageWrapper>
    );
};

export default CreateMealPage;
