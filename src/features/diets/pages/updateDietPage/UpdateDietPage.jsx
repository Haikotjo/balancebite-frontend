import CustomBox from "../../../../components/layout/CustomBox.jsx";
import UpdateDietForm from "../../components/upfateDietForm/UpdateDietForm.jsx";

const UpdateDietPage = () => {
    return (
        <CustomBox className="max-w-[600px] mx-auto px-2 sm:px-4 pb-[4rem] sm:pb-[2rem] overflow-y-auto h-[calc(100vh-64px)] md:overflow-visible md:h-auto">
            <UpdateDietForm />
        </CustomBox>
    );
};

export default UpdateDietPage;
