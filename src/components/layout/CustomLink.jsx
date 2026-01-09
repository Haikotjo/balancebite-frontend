import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";

const CustomLink = ({
                        href,
                        to,
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
    const classes = clsx(
        "text-primary hover:text-blue-600 inline-flex items-center gap-1 underline",
        truncate && "truncate min-w-0",
        className
    );

    // 👉 Internal link
    if (to) {
        return (
            <Link
                to={to}
                aria-label={ariaLabel}
                title={title}
                onClick={onClick}
                className={classes}
            >
                {leftIcon}
                {children}
                {rightIcon}
            </Link>
        );
    }

    // 👉 External link
    return (
        <a
            href={href}
            target={target}
            rel={rel}
            aria-label={ariaLabel}
            title={title}
            onClick={onClick}
            className={classes}
        >
            {leftIcon}
            {children}
            {rightIcon}
        </a>
    );
};

CustomLink.propTypes = {
    href: PropTypes.string,
    to: PropTypes.string,
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
