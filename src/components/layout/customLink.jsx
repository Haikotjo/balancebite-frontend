// src/components/layout/CustomLink.jsx
import PropTypes from "prop-types";

const CustomLink = ({ href, children, className = "" }) => {
    return (
        <a
            href={href}
            className={`text-primary underline hover:text-blue-600 ${className}`}
            target="_blank"
            rel="noopener noreferrer"
        >
            {children}
        </a>
    );
};

CustomLink.propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default CustomLink;
