import PageWrapper from "../../../../components/layout/PageWrapper.jsx";
import CreateMealForm from "../../components/createMealForm/CreateMealForm.jsx";
import CreateMealFormCard from "../../components/createMealFormCard/CreateMealFormCard.jsx";

const CreateMealPage = () => {
    return (
        // Page shell
        <PageWrapper className="flex flex-col items-center">
            <CreateMealForm />
            <CreateMealFormCard />
        </PageWrapper>
    );
};

export default CreateMealPage;
