import CreateMealForm from "../../components/createMealForm/CreateMealForm.jsx";
import PageWrapper from "../../components/pageWrapper/PageWrapper.jsx";

const CreateMealPage = () => {
    return (
        <PageWrapper
            sx={{
                padding: { xs: 1, sm: 2 },
                alignItems: "flex-start",
                width: "100%",
            }}
        >
            <CreateMealForm />
        </PageWrapper>
    );
};

export default CreateMealPage;
