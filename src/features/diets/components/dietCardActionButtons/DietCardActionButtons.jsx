import PropTypes from "prop-types";
import { useContext } from "react";
import ButtonOpenDiet from "../buttonOpenDiet/ButtonOpenDiet.jsx";
import ButtonUpdateDiet from "../buttonUpdateDiet/ButtonUpdateDiet.jsx";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import ButtonFavoriteDiet from "../buttonFavoriteDiet/ButtonFavoriteDiet.jsx";
import ButtonOpenShoppingCart from "../buttonOpenShoppingCart/ButtonOpenShoppingCart.jsx";
import PrivacyToggles from "../../../../components/privacytoggles/PrivacyToggles.jsx";
import {AuthContext} from "../../../../context/AuthContext.jsx";
import ViewDietButton from "../viewdietbutton/ViewDietButton.jsx";

/**
 * Displays a horizontal group of diet-related action buttons.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.diet - The diet object for which actions apply.
 * @param {number} [props.iconSize=35] - Diameter of each button container.
 * @returns {JSX.Element}
 */
const DietCardActionButtons = ({ diet, iconSize = 35, viewMode = "card", isPinned = false }) => {

    const { userDiets } = useContext(UserDietsContext);
    const { user } = useContext(AuthContext);
    const isUserDiet = userDiets.some((userDiet) =>
        String(userDiet.id) === String(diet.id)
    );
    const isCreatedByUser = String(diet.createdBy?.id) === String(user?.id);

    const sharedClasses = `
        flex items-center justify-center text-white
        transition-transform duration-200 ease-in-out hover:scale-[1.2]
    `;

    return (
        <CustomBox className="flex flex-row items-center justify-between w-full">
            <CustomBox className="flex flex-row items-center gap-2">
                <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                    <ButtonFavoriteDiet diet={diet} />
                </CustomBox>

                {viewMode !== "page" && (
                    <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                        <ButtonOpenDiet diet={diet} isPinned={isPinned} />
                    </CustomBox>
                )}

                {isUserDiet && (
                    <>
                        <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                            <ButtonUpdateDiet dietId={diet.id} />
                        </CustomBox>

                        <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                            <ButtonOpenShoppingCart dietId={diet.id} />
                        </CustomBox>
                    </>
                )}

                {viewMode === "modal" && (
                    <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                        <ViewDietButton dietId={diet.id} iconSize={iconSize} />
                    </CustomBox>
                )}
            </CustomBox>

            {viewMode === "page" && isCreatedByUser && (
                <CustomBox className="ml-auto">
                    <PrivacyToggles
                        dietPlanId={diet.id}
                        initialDietPrivate={!!diet.isPrivate}
                    />
                </CustomBox>
            )}
        </CustomBox>
    );

};

DietCardActionButtons.propTypes = {
    diet: PropTypes.object.isRequired,
    iconSize: PropTypes.number,
    viewMode: PropTypes.oneOf(["page", "modal", "card"]),
    isPinned: PropTypes.bool,
};

export default DietCardActionButtons;
