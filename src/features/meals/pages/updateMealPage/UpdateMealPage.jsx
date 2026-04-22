import PageWrapper from "../../../../components/layout/PageWrapper.jsx";
import UpdateMealCard from "../../components/updateMealCard/UpdateMealCard.jsx";

const UpdateMealPage = () => {
    return (
        <PageWrapper>
            <div className="max-w-3xl mx-auto px-4">
                <UpdateMealCard />
            </div>
        </PageWrapper>
    );
};

export default UpdateMealPage;
