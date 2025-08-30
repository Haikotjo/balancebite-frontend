import PropTypes from "prop-types";
import clsx from "clsx";

const VARIANT_STYLES = {
    h1: "text-2xl sm:text-3xl md:text-4xl font-extrabold",
    h2: "text-xl sm:text-2xl md:text-3xl font-bold",
    h3: "text-lg sm:text-xl md:text-2xl font-semibold",
    h4: "text-base sm:text-lg md:text-xl font-semibold",
    h5: "text-sm sm:text-base md:text-lg font-medium",
    paragraph: "text-sm sm:text-base md:text-[1rem]",
    small: "text-xs sm:text-sm md:text-sm",
    bold: "font-bold",
    italic: "italic",
    xsmallCard: "text-[0.7rem] leading-tight",
    paragraphCard: "text-sm sm:text-base md:text-sm",
};

// Font family map (Tailwind classes)
const FONT_MAP = {
    sans: "font-sans",
    display: "font-display",
    body: "font-body",
};

// Explicit font-weight map (Tailwind)
// Note: these classes work with any font-family; the actual visual result
// depends on whether the font provides that weight.
const WEIGHT_STYLES = {
    thin: "font-thin",
    extralight: "font-extralight",
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
    black: "font-black",
};

/**
 * CustomTypography
 *
 * - `variant` bepaalt grootte en (soms) een default gewicht.
 * - `bold` (boolean) zet font-bold.
 * - `weight` (nieuw) kan elk gewicht afdwingen en override't `variant`/`bold`.
 *   Gebruik bijv. weight="normal" om bold te neutraliseren.
 */
const CustomTypography = ({
                              children,
                              variant,
                              color,
                              bold = false,
                              italic = false,
                              font = "body",
                              className = "",
                              as = "p",
                              weight, // "thin" | "extralight" | "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold" | "black"
                              ...props
                          }) => {
    const Tag = as;

    const combinedClass = clsx(
        FONT_MAP[font],
        italic && VARIANT_STYLES.italic,
        variant && VARIANT_STYLES[variant],
        // Only apply boolean bold if no explicit weight is provided (to avoid conflicts)
        bold && !weight && VARIANT_STYLES.bold,
        // Explicit weight overrides any weight coming from variant/bold
        weight && WEIGHT_STYLES[weight],
        color ?? "text-lightText dark:text-darkText",
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
    weight: PropTypes.oneOf([
        "thin",
        "extralight",
        "light",
        "normal",
        "medium",
        "semibold",
        "bold",
        "extrabold",
        "black",
    ]),
};

export default CustomTypography;
