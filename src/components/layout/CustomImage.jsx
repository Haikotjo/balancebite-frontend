import PropTypes from "prop-types";

/**
 * A responsive image with consistent styling.
 *
 * @component
 * @param {Object} props
 * @param {string} props.src - Image source URL.
 * @param {string} [props.alt] - Alternative text for accessibility.
 * @param {string} [props.className] - Optional Tailwind classes to override defaults.
 * @returns {JSX.Element}
 */
const CustomImage = ({ src, alt = "", className = "" }) => {
    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover rounded ${className}`}
        />
    );
};

CustomImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    className: PropTypes.string,
};

export default CustomImage;
