import PropTypes from "prop-types";
import { Calendar, Target, ClipboardList } from "lucide-react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";


const MetricHeader = ({ title, subtitle, variant, icon: CustomIcon }) => {
    const isMeal = variant === "meal";

    const getIcon = () => {
        if (CustomIcon) return <CustomIcon size={20} />;

        switch (variant) {
            case "today":
            case "base":
                return <Target size={20} />;
            case "date":
                return <Calendar size={20} />;
            default:
                return <ClipboardList size={20} />;
        }
    };

    return (
        <CustomBox
            className={`relative mb-4 rounded-xl ${
                isMeal ? "" : "border-b border-borderDark dark:border-borderLight"
            }`}
        >

            <CustomBox
                className={`flex items-center gap-4 p-3 rounded-xl ${
                    isMeal ? "bg-transparent" : "bg-primary/15 dark:bg-darkBackground"
                }`}
            >
                <CustomBox className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary shrink-0">
                    {getIcon()}
                </CustomBox>

                <CustomBox className="flex flex-col min-w-0">
                    <CustomTypography
                        variant="bold"
                        className="text-friendlyGray uppercase tracking-wider text-[10px]"
                    >
                        {subtitle || "Overview"}
                    </CustomTypography>
                    <CustomTypography
                        variant="bold"
                        className="font-bold leading-tight"
                    >
                        {title}
                    </CustomTypography>
                </CustomBox>
            </CustomBox>
        </CustomBox>
    );
};

MetricHeader.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    variant: PropTypes.string,
    icon: PropTypes.elementType,
};

export default MetricHeader;