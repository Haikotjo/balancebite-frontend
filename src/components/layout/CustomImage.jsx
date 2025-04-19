import PropTypes from "prop-types";

/**
 * A barebones image component with only loading optimizations.
 * All styling must be applied via the `className` prop.
 *
 * @component
 * @param {Object} props
 * @param {string} props.src - Image source URL.
 * @param {string} [props.alt] - Alternative text.
 * @param {string} [props.className] - Tailwind or custom classes.
 * @returns {JSX.Element}
 */
const CustomImage = ({ src, alt = "", className = "" }) => {
    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={className}
        />
    );
};

CustomImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    className: PropTypes.string,
};

export default CustomImage;
