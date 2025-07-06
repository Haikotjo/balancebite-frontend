import { useState } from "react";
import { ChevronDown } from "lucide-react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import PropTypes from "prop-types";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import clsx from "clsx";

const AccordionItem = ({ title, children, defaultOpen = false, className }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <CustomBox className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-3 mt-1">
            <CustomButton
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "w-full flex items-center justify-between font-medium text-left transition bg-gray-50 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800",
                    className
                )}
            >
                <CustomTypography variant="small" as="span" className="flex-1" font="body">
                    {typeof title === "function" ? title(isOpen) : title}
                </CustomTypography>

                <ChevronDown
                    className={`w-4 h-4 transition-transform text-gray-800 dark:text-gray-100 ${isOpen ? "rotate-180" : ""}`}
                />
            </CustomButton>
            {isOpen && (
                <CustomBox className="p-2 border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                    {children}
                </CustomBox>
            )}
        </CustomBox>
    );
};

AccordionItem.propTypes = {
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    children: PropTypes.node.isRequired,
    defaultOpen: PropTypes.bool,
    className: PropTypes.string,

};

export default AccordionItem;
