import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
    updateDietPlanPrivacyApi,
    updateMealPrivacyApi,
    updateMealRestrictionApi,
    updateDietPlanRestrictionApi
} from "../../services/apiService.js";
import CustomCheckbox from "../layout/CustomCheckbox.jsx";
import CustomBox from "../layout/CustomBox.jsx";
import ErrorDialog from "../layout/ErrorDialog.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { UserDietsContext } from "../../context/UserDietContext.jsx";

const PrivacyToggles = ({
                            mealId,
                            dietPlanId,
                            initialMealPrivate,
                            initialDietPrivate,
                            initialMealRestricted,
                            initialDietRestricted
                        }) => {
    const { role } = useContext(AuthContext);
    const { replaceDietInDiets, userDiets } = useContext(UserDietsContext);

    const [mealShared, setMealShared] = useState(!initialMealPrivate);
    const [dietShared, setDietShared] = useState(!initialDietPrivate);
    const [mealRestricted, setMealRestricted] = useState(!!initialMealRestricted);
    const [dietRestricted, setDietRestricted] = useState(!!initialDietRestricted);
    const [loading, setLoading] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const isRestaurantOrDietitian = role?.includes("RESTAURANT") || role?.includes("DIETITIAN");

    const handleMealToggle = async () => {
        try {
            setLoading(true);
            const newShared = !mealShared;
            await updateMealPrivacyApi(mealId, !newShared);
            setMealShared(newShared);
        } catch (err) {
            console.error("❌ Failed to update meal privacy", err);
            const error = err?.response?.data;
            const msg = error?.diets?.length
                ? `${error.error}\nIn diets: ${error.diets.join(", ")}`
                : error?.error || "Failed to update privacy.";
            setErrorMessage(msg);
            setErrorDialogOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDietToggle = async () => {
        try {
            setLoading(true);
            const newShared = !dietShared;
            await updateDietPlanPrivacyApi(dietPlanId, !newShared);
            setDietShared(newShared);

            const existing = userDiets.find(d => d.id === dietPlanId);
            if (existing) {
                replaceDietInDiets(dietPlanId, { ...existing, private: !newShared });
            }
        } catch (err) {
            console.error("❌ Failed to update diet privacy", err);
        } finally {
            setLoading(false);
        }
    };

    const handleMealRestrictedToggle = async () => {
        try {
            setLoading(true);
            const newRestricted = !mealRestricted;
            await updateMealRestrictionApi(mealId, newRestricted);
            setMealRestricted(newRestricted);
        } catch (err) {
            console.error("❌ Failed to update meal restriction", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDietRestrictedToggle = async () => {
        try {
            setLoading(true);
            const newRestricted = !dietRestricted;
            await updateDietPlanRestrictionApi(dietPlanId, newRestricted);
            setDietRestricted(newRestricted);
        } catch (err) {
            console.error("❌ Failed to update diet restriction", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomBox className="space-y-4">
            {mealId && (
                <CustomCheckbox
                    checked={mealShared}
                    onChange={handleMealToggle}
                    label={mealShared ? "Public" : "Private"}
                    id="mealPrivacy"
                    disabled={loading}
                    className={mealShared ? "border-primary" : "border-[#DD1155]"}
                />
            )}

            {dietPlanId && (
                <CustomCheckbox
                    checked={dietShared}
                    onChange={handleDietToggle}
                    label={dietShared ? "Public" : "Private"}
                    id="dietPrivacy"
                    disabled={loading}
                    className={dietShared ? "border-primary" : "border-[#DD1155]"}
                />
            )}

            {isRestaurantOrDietitian && mealId && (
                <CustomCheckbox
                    checked={mealRestricted}
                    onChange={handleMealRestrictedToggle}
                    label={mealRestricted ? "Restricted access" : "Unrestricted access"}
                    id="mealRestricted"
                    disabled={loading}
                    className={mealRestricted ? "border-[#DD1155]" : "border-primary"}
                />
            )}

            {isRestaurantOrDietitian && dietPlanId && (
                <CustomCheckbox
                    checked={dietRestricted}
                    onChange={handleDietRestrictedToggle}
                    label={dietRestricted ? "Restricted access" : "Unrestricted access"}
                    id="dietRestricted"
                    disabled={loading}
                    className={dietRestricted ? "border-[#DD1155]" : "border-primary"}
                />
            )}

            <ErrorDialog
                open={errorDialogOpen}
                onClose={() => setErrorDialogOpen(false)}
                message={errorMessage}
                type="error"
            />
        </CustomBox>
    );
};

PrivacyToggles.propTypes = {
    mealId: PropTypes.number,
    dietPlanId: PropTypes.number,
    initialMealPrivate: PropTypes.bool,
    initialDietPrivate: PropTypes.bool,
    initialMealRestricted: PropTypes.bool,
    initialDietRestricted: PropTypes.bool
};

export default PrivacyToggles;
