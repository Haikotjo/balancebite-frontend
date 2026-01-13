import { Info } from "lucide-react";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import PropTypes from "prop-types";


const SectionHeader = ({ title, subtitle, infoText }) => {
    return (
        <CustomBox className="relative flex items-center justify-center my-4">
            <CustomBox className="absolute inset-0 flex items-center" aria-hidden="true">
                <CustomBox className="w-full border-t border-borderDark/50 dark:border-borderLight/20"></CustomBox>
            </CustomBox>

            <CustomBox className="relative bg-lightBackground dark:bg-darkBackground px-6 text-center flex flex-col items-center">
                <CustomBox className="flex items-center gap-2">
                    <CustomTypography variant="h3" className="font-bold tracking-tight ">
                        {title}
                    </CustomTypography>

                    {infoText && (
                        <CustomBox className="group relative">
                            <Info size={20} className=" cursor-help hover:text-primary transition-colors" />

                            <CustomBox className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-white dark:bg-gray-800 border border-borderDark dark:border-borderLight rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                <CustomTypography variant="xsmallCard" className="text-gray-600 dark:text-gray-300 leading-snug">
                                    {infoText}
                                </CustomTypography>
                                <CustomBox className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white dark:border-t-gray-800" />
                            </CustomBox>
                        </CustomBox>
                    )}
                </CustomBox>

                {subtitle && (
                    <CustomTypography className="text-friendlyGray text-xs uppercase tracking-widest mt-1">
                        {subtitle}
                    </CustomTypography>
                )}
            </CustomBox>
        </CustomBox>
    );
};

SectionHeader.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    infoText: PropTypes.node,
};

export default SectionHeader;