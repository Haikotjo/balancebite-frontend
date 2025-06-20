import PropTypes from "prop-types";
import { useContext } from "react";
import ButtonOpenDiet from "../buttonOpenDiet/ButtonOpenDiet.jsx";
import ButtonUpdateDiet from "../buttonUpdateDiet/ButtonUpdateDiet.jsx";
import {UserDietsContext} from "../../../../context/UserDietContext.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import ButtonFavoriteDiet from "../buttonFavoriteDiet/ButtonFavoriteDiet.jsx";
import ButtonOpenShoppingCart from "../buttonOpenShoppingCart/ButtonOpenShoppingCart.jsx";


/**
 * Displays a horizontal group of diet-related action buttons.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.diet - The diet object for which actions apply.
 * @param {number} [props.iconSize=35] - Diameter of each button container.
 * @param {string} [props.viewMode="page"] - Controls visibility of open button.
 * @returns {JSX.Element}
 */
const DietCardActionButtons = ({ diet, iconSize = 35, viewMode = "page", onClose }) => {
    const { userDiets } = useContext(UserDietsContext);

    const isUserDiet = userDiets.some((userDiet) =>
        String(userDiet.id) === String(diet.id)
    );

    const sharedClasses = `
        flex items-center justify-center text-white
        transition-transform duration-200 ease-in-out hover:scale-[1.2]
    `;

    return (
        <CustomBox className="flex flex-row items-center gap-2">
            <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                <ButtonFavoriteDiet diet={diet} onClose={onClose} />
            </CustomBox>

            {viewMode !== "page" && (
                <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                    <ButtonOpenDiet diet={diet} />
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
        </CustomBox>
    );
};

DietCardActionButtons.propTypes = {
    diet: PropTypes.object.isRequired,
    iconSize: PropTypes.number,
    viewMode: PropTypes.oneOf(["page", "list", "modal"]),
};

export default DietCardActionButtons;
