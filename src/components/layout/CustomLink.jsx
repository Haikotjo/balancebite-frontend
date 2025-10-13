// src/components/layout/CustomLink.jsx
import PropTypes from "prop-types";
import clsx from "clsx";

/** Reusable external link with optional icons and truncation */
const CustomLink = ({
                        href,
                        children,
                        className = "",
                        leftIcon = null,
                        rightIcon = null,
                        ariaLabel,
                        title,
                        onClick,
                        truncate = false,
                        target = "_blank",
                        rel = "noopener noreferrer",
                    }) => {
    return (
        <a
            href={href}
            target={target}
            rel={rel}
            aria-label={ariaLabel}
            title={title}
            onClick={onClick}
            className={clsx(
                "text-primary hover:text-blue-600 inline-flex items-center gap-1 underline",
                truncate && "truncate min-w-0", // allow text to ellipsize
                className
            )}
        >
            {leftIcon}
            {children}
            {rightIcon}
        </a>
    );
};

CustomLink.propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    ariaLabel: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func,
    truncate: PropTypes.bool,
    target: PropTypes.string,
    rel: PropTypes.string,
};

export default CustomLink;
