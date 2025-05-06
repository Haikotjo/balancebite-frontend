import { useState } from "react";
import { ChevronDown } from "lucide-react";
import CustomBox from "../layout/CustomBox.jsx";
import CustomButton from "../layout/CustomButton.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import PropTypes from "prop-types";


const AccordionItem = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <CustomBox className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <CustomButton
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between font-medium hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
            >
                <CustomTypography className="flex-1" variant="h5">
                    {title}
                </CustomTypography>
                <ChevronDown
                    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </CustomButton>
            {isOpen && (
                <CustomBox className="p-5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    {children}
                </CustomBox>
            )}
        </CustomBox>
    );
};

AccordionItem.propTypes = {
    title: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    defaultOpen: PropTypes.bool,
};


export default AccordionItem;
