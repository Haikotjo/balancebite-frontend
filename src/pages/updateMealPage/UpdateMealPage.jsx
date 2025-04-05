import PageWrapper from "../../components/pageWrapper/PageWrapper.jsx";
import UpdateMealForm from "../../components/updateMealForm/UpdateMealForm.jsx";

const UpdateMealPage = () => {
    return (
        <PageWrapper
            sx={{
                maxWidth: "600px",
                margin: "auto",
                paddingX: 2,
            }}
        >
            <UpdateMealForm />
        </PageWrapper>
    );
};

export default UpdateMealPage;
