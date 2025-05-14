// src/pages/dietsPage/DietsPage.jsx
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

const DietsPage = () => {
    return (
        <CustomBox className="mt-10 p-4">
            <CustomTypography variant="h1">All Diet Plans</CustomTypography>
            <CustomTypography variant="body">This page will list all diet templates.</CustomTypography>
        </CustomBox>
    );
};

export default DietsPage;
