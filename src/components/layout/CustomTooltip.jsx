import PropTypes from "prop-types";
import CustomBox from "./CustomBox";
import CustomTypography from "./CustomTypography";

const POS = {
    top:    { pos: "bottom-full", margin: "mb-[4px]" },
    bottom: { pos: "top-full",    margin: "mt-[4px]" },
    left:   { pos: "right-full",  margin: "mr-[4px]" },
    right:  { pos: "left-full",   margin: "ml-[4px]" },
};

const CustomTooltip = ({ text, position = "top" }) => {
    const { pos, margin } = POS[position] || POS.top;

    return (
        <CustomBox
            // Absolute inside a relative parent with class 'group'
            className={[
                "absolute z-50 px-2 py-1 rounded bg-gray-800 dark:bg-gray-700",
                "whitespace-nowrap transition-opacity duration-150",
                "opacity-0 group-hover:opacity-100 pointer-events-none",
                pos, margin,
            ].join(" ")}
        >
            <CustomTypography variant="xsmallCard" className="text-white dark:text-white">
                {text}
            </CustomTypography>
        </CustomBox>
    );
};

CustomTooltip.propTypes = {
    text: PropTypes.string.isRequired,
    position: PropTypes.oneOf(["top", "bottom", "left", "right"]),
};

export default CustomTooltip;
