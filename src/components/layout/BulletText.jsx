// src/components/layout/BulletText.jsx

import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";
import CustomTypography from "./CustomTypography.jsx";

const BulletText = ({
                        children,
                        as = "div",
                        showBullet = true,
                        variant = "paragraphCard",
                        bold = false,
                        italic = false,
                        font = "sans",
                    }) => {
    return (
        <CustomBox as={as} className="flex items-start gap-2">
            {showBullet && (
                <CustomTypography color="primary" as="span" className="text-primary text-[1rem] leading-tight">•</CustomTypography>
            )}
            <CustomTypography

                as="span"
                variant={variant}
                bold={bold}
                italic={italic}
                font={font}
            >
                {children}
            </CustomTypography>
        </CustomBox>
    );
};

BulletText.propTypes = {
    children: PropTypes.node.isRequired,
    as: PropTypes.elementType,
    showBullet: PropTypes.bool,
    variant: PropTypes.string,
    bold: PropTypes.bool,
    italic: PropTypes.bool,
    font: PropTypes.oneOf(["sans", "display", "body"]),
};

export default BulletText;
