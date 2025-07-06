// src/components/common/PromotionInfo.jsx
import PropTypes from "prop-types";
import CustomButton from "../layout/CustomButton.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import { ExternalLink } from "lucide-react";

const PromotionInfo = ({ start, end, source, className = "" }) => {
    const content = (
        <CustomTypography
            variant="xsmallCard"
            font="body"
            italic
            color="text-primary"
            className={`flex items-center gap-1 ${className}`}
        >
            ON SALE from {new Date(start).toLocaleDateString("nl-NL").replaceAll("/", "-")} till{" "}
            {new Date(end).toLocaleDateString("nl-NL").replaceAll("/", "-")}
            {source && <ExternalLink size={16} />}
        </CustomTypography>
    );

    return source ? (
        <CustomButton
            variant="link"
            className="italic ml-4 mt-1 mb-1"
            onClick={() => window.open(source, "_blank", "noopener,noreferrer")}
        >
            {content}
        </CustomButton>
    ) : (
        content
    );
};

PromotionInfo.propTypes = {
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    source: PropTypes.string,
    className: PropTypes.string,
};

export default PromotionInfo;
