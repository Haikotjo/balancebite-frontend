import PropTypes from "prop-types";

const CustomImage = ({ src, alt, className = "" }) => {
    return (
        <img
            src={src}
            alt={alt}
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
