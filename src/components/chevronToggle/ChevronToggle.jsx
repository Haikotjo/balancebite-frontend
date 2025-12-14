// ChevronToggle.jsx
import { ChevronDown, ChevronUp } from "lucide-react";
import PropTypes from "prop-types";

const ChevronToggle = ({
                           open,
                           mobileSize = 12,
                           desktopSize = 20,
                           mobileClassName = "text-white mr-1 md:hidden",
                           desktopClassName = "text-white mr-1 hidden md:block",
                       }) => (
    <>
        {open ? (
            <>
                <ChevronDown
                    className={mobileClassName}
                    style={{ width: mobileSize, height: mobileSize }}
                />
                <ChevronUp
                    className={desktopClassName}
                    style={{ width: desktopSize, height: desktopSize }}
                />
            </>
        ) : (
            <>
                <ChevronUp
                    className={mobileClassName}
                    style={{ width: mobileSize, height: mobileSize }}
                />
                <ChevronDown
                    className={desktopClassName}
                    style={{ width: desktopSize, height: desktopSize }}
                />
            </>
        )}
    </>
);

ChevronToggle.propTypes = {
    open: PropTypes.bool.isRequired,
    mobileSize: PropTypes.number,
    desktopSize: PropTypes.number,
    mobileClassName: PropTypes.string,
    desktopClassName: PropTypes.string,
};

export default ChevronToggle;
