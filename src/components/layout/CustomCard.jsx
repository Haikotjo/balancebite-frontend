import PropTypes from "prop-types";

const CustomCard = ({ children, className = "" }) => {
    return (
        <div
            className={`
        flex flex-col w-full rounded-xl overflow-hidden 
     shadow-2xl border border-borderLight dark:border-borderDark
        bg-cardLight dark:bg-cardDark
        ${className}
    `}
        >
            {children}
        </div>
    );
};

CustomCard.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default CustomCard;
