// src/components/home/FeatureCardWrapper.jsx
import PropTypes from "prop-types";
import CustomBox from "../../layout/CustomBox.jsx";

/**
 * FeatureCardWrapper component — wraps feature cards in a responsive flex item.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children – the content inside
 * @returns {JSX.Element}
 */
function FeatureCardWrapper({ children }) {
    return (
        <CustomBox
            className="
                w-full
                sm:w-1/2
                md:w-1/2
                lg:w-1/2
                xl:w-1/2
                flex
                justify-center
                px-[15px]
                mb-4
            "
        >
            {children}
        </CustomBox>
    );
}

FeatureCardWrapper.propTypes = {
    children: PropTypes.node.isRequired,
};

export default FeatureCardWrapper;
