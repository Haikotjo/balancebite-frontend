import CreateMealForm from "../../components/createMealForm/CreateMealForm.jsx";
import PageWrapper from "../../components/pageWrapper/PageWrapper.jsx";

const CreateMealPage = () => {
    return (
        <PageWrapper
            sx={{
                maxWidth: "600px", // 🔹 Beperkt breedte specifiek voor deze pagina
                margin: "auto", // 🔹 Zorgt dat het gecentreerd blijft
                paddingX: 2, // 🔹 Houdt een beetje padding
            }}
        >
            <CreateMealForm />
        </PageWrapper>
    );
};

export default CreateMealPage;
