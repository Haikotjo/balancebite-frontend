// CreateMealFormCard.jsx
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import { Soup } from "lucide-react";

/**
 * Card-style version of the Create Meal form.
 * Skeleton only: layout scaffolding without fields/logic.
 * All code comments are in English as requested.
 */
const CreateMealFormCard = () => {
    return (
        <CustomBox
            // Card container (Tailwind-only to avoid MUI)
            className="rounded-2xl shadow-md border border-base-300 bg-base-100 p-4 sm:p-6 md:p-8"
        >
            {/* Header: icon + title */}
            <div className="flex items-center gap-3 mb-4">
                <Soup className="w-8 h-8" aria-hidden="true" />
                <CustomTypography as="h2" variant="h2">
                    Create Meal (Card Layout)
                </CustomTypography>
            </div>

            <CustomTypography as="p" variant="body" className="text-muted-foreground">
                This is the new card-based form skeleton. We will replace this placeholder
                with the real fields and interactions to match the final app design.
            </CustomTypography>

            <CustomDivider className="my-6" />

            {/* Body grid scaffold: reserved for future sections */}
            <div
                // Grid scaffold for future form sections (image, basics, tags, ingredients, actions)
                className="grid grid-cols-1 md:grid-cols-12 gap-4"
            >
                {/* Left rail (image / media) */}
                <section className="md:col-span-5 lg:col-span-4">
                    <div className="h-40 rounded-xl border border-base-300 flex items-center justify-center">
                        <span className="text-sm text-muted-foreground">Image / Media slot</span>
                    </div>
                </section>

                {/* Main content (fields) */}
                <section className="md:col-span-7 lg:col-span-8">
                    <div className="rounded-xl border border-dashed border-base-300 p-4">
                        <span className="text-sm text-muted-foreground">
                            Form fields will be placed here (name, description, tags, etc.).
                        </span>
                    </div>
                </section>
            </div>

            {/* Footer actions */}
            <div className="mt-8 flex items-center justify-end gap-3">
                <CustomButton variant="ghost" type="button">
                    Cancel
                </CustomButton>
                <CustomButton type="button" className="bg-primary text-white">
                    Save (disabled for now)
                </CustomButton>
            </div>
        </CustomBox>
    );
};

export default CreateMealFormCard;
