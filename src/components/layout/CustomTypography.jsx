// src/components/layout/CustomTypography.jsx
import PropTypes from "prop-types";
import clsx from "clsx";

const VARIANT_STYLES = {
    h1: "text-2xl sm:text-3xl md:text-4xl font-extrabold",
    h2: "text-xl sm:text-2xl md:text-3xl font-bold",
    h3: "text-lg sm:text-xl md:text-2xl font-semibold",
    h4: "text-base sm:text-lg md:text-xl font-semibold",
    h5: "text-sm sm:text-base md:text-lg font-medium",
    paragraph: "text-sm sm:text-base md:text-[1rem]",
    small: "text-xs sm:text-sm md:text-sm text-lightText dark:text-darkText",
    bold: "font-bold",
    italic: "italic",
};

const FONT_MAP = {
    sans: "font-sans",
    display: "font-display",
    body: "font-body",
};

const CustomTypography = ({
                              children,
                              variant = "paragraph",
                              color = "",
                              bold = false,
                              italic = false,
                              font = "sans",
                              className = "",
                              as = "p",
                              ...props
                          }) => {
    const Tag = as;

    const combinedClass = clsx(
        FONT_MAP[font],
        VARIANT_STYLES[variant],
        bold && VARIANT_STYLES.bold,
        italic && VARIANT_STYLES.italic,
        color,
        className
    );

    return (
        <Tag className={combinedClass} {...props}>
            {children}
        </Tag>
    );
};

CustomTypography.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(Object.keys(VARIANT_STYLES)),
    color: PropTypes.string,
    bold: PropTypes.bool,
    italic: PropTypes.bool,
    font: PropTypes.oneOf(Object.keys(FONT_MAP)),
    className: PropTypes.string,
    as: PropTypes.string,
};

export default CustomTypography;
