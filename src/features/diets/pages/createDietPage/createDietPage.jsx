import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CreateDietForm from "../../components/createDietForm/CreateDietForm.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import PageWrapper from "../../../../components/layout/PageWrapper.jsx";

const CreateDietPage = () => {
    return (
        <PageWrapper className="flex flex-col items-center">
            <CustomBox className="flex flex-col items-center w-full max-w-[720px] mx-auto px-2">
                <CustomTypography variant="h1" bold className="mb-6">
                    Create New Diet Plan
                </CustomTypography>

                <CreateDietForm />
            </CustomBox>
        </PageWrapper>
    );
};

export default CreateDietPage;