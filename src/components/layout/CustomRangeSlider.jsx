import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import noUiSlider from "nouislider"; // ✅ correcte import
import "nouislider/dist/nouislider.css"; // ✅ correcte CSS
import CustomBox from "./CustomBox.jsx";
import CustomTypography from "./CustomTypography.jsx";
import clsx from "clsx";



const CustomDualSlider = ({
                              label,
                              minValue = 0,
                              maxValue = 100,
                              value = [minValue, maxValue],
                              onChange,
                              step = 1,
                              className = "",
                          }) => {
    const sliderRef = useRef(null);
    const sliderInstance = useRef(null);

    useEffect(() => {
        if (!sliderRef.current) return;

        sliderInstance.current = noUiSlider.create(sliderRef.current, {
            start: value,
            connect: true,
            range: {
                min: minValue,
                max: maxValue,
            },
            step,
            tooltips: true,
            format: {
                to: value => Math.round(value),
                from: value => Number(value),
            },
        });

        sliderInstance.current.on("change", (values) => {
            const [min, max] = values.map(Number);
            onChange([min, max]);
        });

        return () => {
            if (sliderInstance.current) {
                sliderInstance.current.destroy();
            }
        };
    }, []);

    // Extern bijwerken
    useEffect(() => {
        if (sliderInstance.current) {
            sliderInstance.current.set(value);
        }
    }, [value]);

    return (
        <CustomBox className={clsx("w-full max-w-md", className)}>
            {label && (
                <CustomTypography as="label" className="font-semibold mb-2 block">
                    {label}
                </CustomTypography>
            )}
            <div
                ref={sliderRef}
                className={clsx(
                    "nouislider-target h-2 rounded bg-gray-200 dark:bg-neutral-700",
                    "custom-slider"
                )}
            />
        </CustomBox>
    );
};

CustomDualSlider.propTypes = {
    label: PropTypes.string,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    value: PropTypes.arrayOf(PropTypes.number).isRequired,
    onChange: PropTypes.func.isRequired,
    step: PropTypes.number,
    className: PropTypes.string,
};

export default CustomDualSlider;
