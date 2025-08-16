import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CreateDietForm from "../../components/createDietForm/CreateDietForm.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import PageWrapper from "../../../../components/layout/PageWrapper.jsx";
import {Apple} from "lucide-react";

const CreateDietPage = () => {
    return (
        <PageWrapper className="flex flex-col items-center">
            <CustomBox className="flex flex-col items-center w-full max-w-[720px] mx-auto px-2">
                <Apple className="w-16 h-16 sm:w-24 sm:h-24 text-primary mb-4" aria-hidden="true" />

                <CreateDietForm />
            </CustomBox>
        </PageWrapper>
    );
};

export default CreateDietPage;