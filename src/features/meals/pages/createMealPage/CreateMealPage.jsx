import PageWrapper from "../../../../components/layout/PageWrapper.jsx";
import CreateMealCard from "../../components/createMealCard/CreateMealCard.jsx";

const CreateMealPage = () => {
    return (
        <PageWrapper className="flex flex-col items-center">
            <CreateMealCard />
        </PageWrapper>
    );
};

export default CreateMealPage;
