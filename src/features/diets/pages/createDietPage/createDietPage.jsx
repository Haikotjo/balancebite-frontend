import CreateDietForm from "../../components/createDietForm/CreateDietForm.jsx";
import PageWrapper from "../../../../components/layout/PageWrapper.jsx";

const CreateDietPage = () => {
    return (
        <PageWrapper className="flex flex-col items-center">
            <CreateDietForm />
        </PageWrapper>
    );
};

export default CreateDietPage;