// src/components/pagination/CustomPagination.jsx

import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CustomBox from "../layout/CustomBox.jsx";
import CustomButton from "../layout/CustomButton.jsx"; // of eigen Button component
import clsx from "clsx";

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
    const renderPageButtons = () => {
        const buttons = [];

        for (let i = 1; i <= totalPages; i++) {
            // Voor nu simpel: toon alle pagina's
            buttons.push(
                <CustomButton
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={clsx(
                        "px-3 py-1 rounded text-sm",
                        i === currentPage
                            ? "bg-black text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                    )}
                >
                    {i}
                </CustomButton>
            );
        }

        return buttons;
    };

    return (
        <CustomBox className="flex items-center gap-2 mt-6 flex-wrap justify-center">
            <CustomButton
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2"
            >
                <ChevronLeft size={20} />
            </CustomButton>

            {renderPageButtons()}

            <CustomButton
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2"
            >
                <ChevronRight size={20} />
            </CustomButton>
        </CustomBox>
    );
};

CustomPagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default CustomPagination;
