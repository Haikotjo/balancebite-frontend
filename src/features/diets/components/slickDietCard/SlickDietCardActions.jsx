// SlickDietCardActions — action bar for SlickDietCard
// Same functionality as DietCardActionButtons but styled for the image overlay

import PropTypes from "prop-types";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutList } from "lucide-react";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";

import ButtonFavoriteDiet from "../buttonFavoriteDiet/ButtonFavoriteDiet.jsx";
import ButtonUpdateDiet from "../buttonUpdateDiet/ButtonUpdateDiet.jsx";
import ButtonOpenDiet from "../buttonOpenDiet/ButtonOpenDiet.jsx";
import ButtonOpenShoppingCart from "../buttonOpenShoppingCart/ButtonOpenShoppingCart.jsx";
import SocialShareMenu from "../../../../components/socialShareMenu/SocialShareMenu.jsx";

const ICON_SIZE = 32;

export default function SlickDietCardActions({ diet, isPinned = false, viewMode = "list" }) {
    const { user } = useContext(AuthContext);
    const { userDiets } = useContext(UserDietsContext);
    const navigate = useNavigate();

    const isCreator = String(diet?.createdBy?.id) === String(user?.id);
    const isUserDiet = isCreator || userDiets.some((d) => String(d.id) === String(diet.id));

    return (
        <div className="inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-black/30 px-3 py-1.5 backdrop-blur-md">
            {(!diet.isRestricted || isCreator) && (
                <div className="flex items-center justify-center" style={{ width: ICON_SIZE, height: ICON_SIZE }}>
                    <ButtonFavoriteDiet diet={diet} />
                </div>
            )}

            {isUserDiet && (
                <>
                    <div className="flex items-center justify-center" style={{ width: ICON_SIZE, height: ICON_SIZE }}>
                        <ButtonUpdateDiet dietId={diet.id} />
                    </div>
                    <div className="flex items-center justify-center" style={{ width: ICON_SIZE, height: ICON_SIZE }}>
                        <ButtonOpenShoppingCart dietId={diet.id} />
                    </div>
                </>
            )}

            {viewMode === "page" ? (
                // Diet page opens via window.open (new tab) — no history to go back to,
                // so navigate to the diets list instead.
                <div className="flex items-center justify-center" style={{ width: ICON_SIZE, height: ICON_SIZE }}>
                    <button
                        type="button"
                        onClick={() => navigate("/diets")}
                        className="flex items-center justify-center rounded-xl bg-black/50 text-white hover:bg-black/70 transition-colors"
                        style={{ width: ICON_SIZE, height: ICON_SIZE }}
                        aria-label="Go to diets"
                    >
                        <LayoutList className="h-5 w-5" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-center" style={{ width: ICON_SIZE, height: ICON_SIZE }}>
                    <ButtonOpenDiet diet={diet} isPinned={isPinned} />
                </div>
            )}

            <div className="flex items-center justify-center" style={{ width: ICON_SIZE, height: ICON_SIZE }}>
                <SocialShareMenu
                    url={`${window.location.origin}/diet/${diet.id}`}
                    title={`Check out this diet plan: ${diet.name}`}
                />
            </div>
        </div>
    );
}

SlickDietCardActions.propTypes = {
    diet: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string,
        isRestricted: PropTypes.bool,
        createdBy: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        }),
    }).isRequired,
    isPinned: PropTypes.bool,
    viewMode: PropTypes.oneOf(["list", "modal", "page"]),
};
