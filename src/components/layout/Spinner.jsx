import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";
import CustomTypography from "./CustomTypography.jsx";

const Spinner = ({ className = "" }) => {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 500); // aanpasbaar
        return () => clearInterval(interval);
    }, []);

    return (
        <CustomBox className="flex flex-col items-center space-y-4">
            <CustomBox
                className={`mt-10 animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-primary ${className}`}
            />
            <CustomTypography
                as="span"
                variant="h4"
                color="text-muted-foreground"
                bold
            >
                Loading{dots}
            </CustomTypography>

        </CustomBox>
    );
};

Spinner.propTypes = {
    className: PropTypes.string,
};

export default Spinner;
