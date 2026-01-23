import PageWrapper from "../../../components/layout/PageWrapper.jsx";
import CreateFoodItemForm from "../../admin/components/createFoodItemForm/CreateFoodItemForm.jsx";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext.jsx";

const useAuth = () => useContext(AuthContext);

const CreateFoodItemPage = () => {
    const { user } = useAuth();

    const isSupermarket = user?.roles?.includes("SUPERMARKET");

    return (
        <PageWrapper className="flex flex-col items-center">
                <CreateFoodItemForm hideFoodSource={isSupermarket} />
        </PageWrapper>
    );
};

export default CreateFoodItemPage;