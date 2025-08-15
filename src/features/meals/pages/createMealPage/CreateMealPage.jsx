// CreateMealPage.jsx
import { Soup } from "lucide-react";                    // Icon
import PageWrapper from "../../../../components/layout/PageWrapper.jsx";
import CreateMealForm from "../../components/createMealForm/CreateMealForm.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";

const CreateMealPage = () => {
    return (
        // Page shell: handles sidebar/bottombar offsets + base paddings
        <PageWrapper className="max-w-screen-md mx-auto">
            {/* Center content + large icon above the form */}
            <CustomBox className="flex flex-col items-center w-full max-w-screen-md mx-auto">
                {/* Big page icon */}
                <Soup className="w-16 h-16 sm:w-24 sm:h-24 text-primary mb-4" aria-hidden="true" />

                {/* Form */}
                <CreateMealForm />
            </CustomBox>
        </PageWrapper>
    );
};

export default CreateMealPage;
