// src/pages/CreateDietPage.jsx

import CustomBox from "../../components/layout/CustomBox.jsx";
import CustomTypography from "../../components/layout/CustomTypography.jsx";
import CreateDietForm from "../../components/createDietForm/CreateDietForm.jsx";

const CreateDietPage = () => {
    return (
        <CustomBox className="max-w-screen-md mx-auto mt-10 p-4">
            <CustomTypography variant="h1" bold className="mb-6">
                Create New Diet Plan
            </CustomTypography>

            <CreateDietForm />
        </CustomBox>
    );
};

export default CreateDietPage;