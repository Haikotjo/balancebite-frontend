import CreateMealForm from "../../components/createMealForm/CreateMealForm.jsx";
import PageWrapper from "../../components/pageWrapper/PageWrapper.jsx";

const CreateMealPage = () => {
    return (
        <PageWrapper
            sx={{
                maxWidth: "600px",
                margin: "auto",
                paddingX: 2,
            }}
        >
            <CreateMealForm />
        </PageWrapper>
    );
};

export default CreateMealPage;
