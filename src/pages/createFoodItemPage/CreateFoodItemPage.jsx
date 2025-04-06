import PageWrapper from "../../components/pageWrapper/PageWrapper.jsx";
import CreateFoodItemForm from "../../components/createFoodItemForm/CreateFoodItemForm.jsx";

const CreateFoodItemPage = () => {
    return (
        <PageWrapper
            sx={{
                maxWidth: "600px",
                margin: "auto",
                paddingX: 2,
            }}
        >
            <CreateFoodItemForm />
        </PageWrapper>
    );
};

export default CreateFoodItemPage;
