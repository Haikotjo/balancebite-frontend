// MealImageSlot.jsx
import PropTypes from "prop-types";
import { ImagePlus } from "lucide-react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import PrimaryStarButton from "../primaryStarButton/PrimaryStarButton.jsx";
import RemoveImageButton from "../removeImageButton/RemoveImageButton.jsx";



/**
 * Single meal image slot.
 * Pure presentational component.
 */
const MealImageSlot = ({
                           index,
                           slot,
                           isPrimary,
                           onOpenChooser,
                           onSetPrimary,
                           onClear,
                       }) => {
    const isFilled = !!slot?.file || !!slot?.previewUrl;

    return (
        <CustomBox
            className={[
                "relative rounded-xl border-2",
                "aspect-square overflow-hidden",
                "flex items-center justify-center",
                "cursor-pointer",
                "transition-all",
                "hover:scale-[1.02]",
            ].join(" ")}
            onClick={onOpenChooser}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onOpenChooser();
            }}
        >
            {!isFilled ? (
                <CustomBox className="flex flex-col items-center justify-center gap-2 opacity-80">
                    <ImagePlus size={34} className="text-primary" />
                    <CustomTypography variant="small" className="text-center">
                        Add image
                    </CustomTypography>
                </CustomBox>
            ) : (
                <>
                    <img
                        src={slot.previewUrl}
                        alt={`Meal image ${index + 1}`}
                        className="w-full h-full object-cover"
                    />

                    <PrimaryStarButton isPrimary={isPrimary} onClick={onSetPrimary} />
                    <RemoveImageButton onClick={onClear} />
                </>
            )}
        </CustomBox>
    );
};

MealImageSlot.propTypes = {
    index: PropTypes.number.isRequired,
    slot: PropTypes.shape({
        file: PropTypes.any,
        previewUrl: PropTypes.string,
    }).isRequired,
    isPrimary: PropTypes.bool.isRequired,
    onOpenChooser: PropTypes.func.isRequired,
    onSetPrimary: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
};

export default MealImageSlot;
