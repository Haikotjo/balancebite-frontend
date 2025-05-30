import { useState } from "react";
import { ChevronDown } from "lucide-react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import PropTypes from "prop-types";

const AccordionItem = ({ title, children, defaultOpen = false, headerClassName }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <CustomBox className="border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden">
            <CustomButton
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between font-medium text-left transition ${
                    headerClassName || "bg-gray-50 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-900"
                }`}

            >
                <CustomBox className="flex-1">
                    {title}
                </CustomBox>
                <ChevronDown
                    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </CustomButton>
            {isOpen && (
                <CustomBox className="p-5 border-t border-gray-300 dark:border-gray-700 dark:bg-gray-900">
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
    headerClassName: PropTypes.string,
};

export default AccordionItem;
