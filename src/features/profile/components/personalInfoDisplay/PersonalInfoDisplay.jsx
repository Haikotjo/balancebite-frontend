import PropTypes from "prop-types";
import { User2, Mail, ShieldCheck, PencilLine } from "lucide-react";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import Spinner from "../../../../components/layout/Spinner.jsx";
import InfoMetricTile from "../infoMetricTile/InfoMetricTile.jsx";

const PersonalInfoDisplay = ({ username, email, onEdit, isLoading }) => {
    return (
        <CustomCard hasBorder className="p-6 flex flex-col gap-6 shadow-sm min-h-[250px]">
            <CustomBox className="flex justify-between items-center border-b pb-4">
                <CustomTypography variant="h2" className="flex items-center gap-2">
                    <ShieldCheck size={24} className="text-primary" />
                    Account Details
                </CustomTypography>
                {!isLoading && (
                    <CustomButton
                        onClick={onEdit}
                        variant="ghost"
                        className="text-primary p-2 rounded-full"
                        aria-label="Edit account details"
                    >
                        <PencilLine size={20} />
                    </CustomButton>
                )}
            </CustomBox>

            {isLoading ? (
                <CustomBox className="flex justify-center items-center py-12">
                    <Spinner />
                </CustomBox>
            ) : (
                <CustomBox className="flex flex-col gap-6">
                    <CustomBox className="grid grid-cols-1 gap-4">
                        <InfoMetricTile icon={User2} label="Username" value={username} />
                        <InfoMetricTile icon={Mail} label="Email Address" value={email} shouldCapitalize={false}/>
                    </CustomBox>
                </CustomBox>
            )}
        </CustomCard>
    );
};

PersonalInfoDisplay.propTypes = {
    username: PropTypes.string,
    email: PropTypes.string,
    onEdit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};

PersonalInfoDisplay.defaultProps = {
    username: "Not provided",
    email: "Not provided",
    isLoading: false,
};

export default PersonalInfoDisplay;