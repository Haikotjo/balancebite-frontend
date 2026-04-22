import CreateDietCard from "../../components/createDietCard/CreateDietCard.jsx";
import PageWrapper from "../../../../components/layout/PageWrapper.jsx";

const CreateDietPage = () => {
    return (
        <PageWrapper>
            <div className="max-w-3xl mx-auto px-4">
                <CreateDietCard />
            </div>
        </PageWrapper>
    );
};

export default CreateDietPage;